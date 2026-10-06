# 华农智服 · 部署指南（后端）

> **部署纪律：所有部署均通过流水线完成**——目录创建、.env 生成、共享服务拉起、账号初始化、备份 cron、Nginx 路由全部由 push 触发的流水线幂等完成；人工仅维护 CNB secrets 与 DNS（见 §3）。禁止手工 SSH 部署。
> 部署体系隶属 [linyuan-infra](https://cnb.cool/yahveyeye/linyuan-infra) 的共服架构（宿主机 `1.14.155.197`，Nginx + 共享服务独立管理，五项目共服）。
> 设计决策见 [ADR-0003](decisions/ADR-0003-后端CNB自动部署.md)（部署体系）与 [ADR-0004](decisions/ADR-0004-共享PostgreSQL与废除MySQL-SQLite.md)（共享 PostgreSQL）；跨项目拓扑见 linyuan-infra 的 `docs/deployment-architecture.md`。

## 1. 拓扑

```
Internet
  │
  ▼
宿主机 Nginx (443, linyuan-infra 管理, *.linyuan.maimaioo.top 通配符证书)
  │  hnhall.linyuan.maimaioo.top
  ├─ /           → /opt/hnhall/frontend（管理端前端静态文件，SPA fallback index.html）
  ├─ /api/*      → 127.0.0.1:38000 → hnhall_api 容器 (NestJS, 容器内 :3000)
  │                    └─ Docker 网络 shared-infra-net
  │                         └─ shared_postgres:5432 / 库 hnhall（一库一账号，linyuan-infra 管理）
  └─ /healthz    → "OK"（SOP 必选）
```

## 2. 交付物与职责边界

| 文件 | 作用 | 在哪生效 |
| --- | --- | --- |
| `.cnb.yml` | main push 自动流水线：门禁 → 镜像 → 部署 → 健康检查 | CNB 平台 |
| `services/server/Dockerfile` | 后端镜像（nest build + prisma generate，运行时带 migrate deploy） | 流水线内构建 |
| `docker-compose.cloud.yml` | 云端编排（端口、接入共享 PG 的 shared-infra-net、healthcheck） | 宿主机 `/opt/hnhall`（流水线自动 scp 同步） |
| `docker-compose.cloud.yml` | 云端编排（端口、接入共享 PG 的 shared-infra-net、healthcheck） | 宿主机 `/opt/hnhall`（流水线自动 scp 同步） |
| `docker-compose.dev.yml` | 本地开发 PostgreSQL（`127.0.0.1:5432`，库/账号/口令 = hnhall/hnhall_dev） | 本机 |
| `nginx/hnhall.conf` | 宿主机 Nginx 路由配置（`/` = 前端静态 + `/api/` 反代后端），由流水线调 deploy-nginx.sh 自部署 | 宿主机 `/etc/nginx/conf.d/40-hnhall.conf` |

## 3. 一次性前置步骤（部署纪律：一切部署动作流水线化，人工仅剩两项）

**人工只做**：

1. **CNB secrets**：在共享 secrets 仓库 `yahveyeye/secrets` 的 `env.yml` 中确保以下变量存在（已有 `DEPLOY_SSH_KEY`；口令生成 `openssl rand -base64 24`）：
   `POSTGRES_SUPER_PASSWORD`、`HNHALL_DB_PASSWORD`、`HUALI_DB_PASSWORD`、`KINDER_DB_PASSWORD`、`EXAM_DB_PASSWORD`、`REDIS_PASSWORD`——缺任一项，infra 流水线会在"校验口令变量"阶段显式失败并提示。
2. **DNS**：确认 `hnhall.linyuan.maimaioo.top` 解析到 `1.14.155.197`（通配符证书自动覆盖新子域）。

**其余全部由流水线在 push 时自动完成**（禁止手工 SSH 部署）：

| push | 流水线自动完成的动作 |
| --- | --- |
| `linyuan-infra` master | 校验口令 → 幂等生成宿主机 `shared-infra/.env` → 同步编排 → 拉起共享服务（**PostgreSQL + Redis**）→ **幂等重放一库一账号 init**（口令轮换在此生效）→ 双服务健康检查 → 幂等安装备份 crontab（每日 03:30）→ Nginx **每文件直部署** `nginx/*.conf → /etc/nginx/conf.d/` + reload（hnhall 路由 = `40-hnhall.conf`，HTTP 重定向由 `00-redirect.conf` 通配符覆盖，新增项目零登记） |
| `hnhall` main | 门禁（lint/build）→ 构建推送镜像 → 幂等生成 `/opt/hnhall/.env`（mkdir 一并完成）→ 同步 compose → `docker compose pull && up -d` → 健康检查 |

> **顺序**：先推 linyuan-infra（共享 PG 就绪），再推 hnhall（应用接入）。应用启动依赖共享 PG，`restart: unless-stopped` 会自动重试直至就绪。

## 4. 流水线流程（main push 自动执行）

| 阶段 | 内容 | 对应 |
| --- | --- | --- |
| 环境自检 | node ≥ 20 / docker 可用 | — |
| 门禁 | `npm ci` → `lint`（admin/user/server）→ `build`（同范围） | R1 / R2（technician 红灯期间按 ADR-0002 拆分范围） |
| 镜像 | `docker build -f services/server/Dockerfile` → push `docker.cnb.cool/yahveyeye/hnhall/api:latest` | — |
| sync | scp compose → 前端静态包（门禁阶段 vite build 的 `apps/admin/dist`）解压到 `/opt/hnhall/frontend` → 生成 `/opt/hnhall/.env` → 调 deploy-nginx.sh 自部署路由 | — |
| 部署 | `docker compose pull && up -d --remove-orphans` → `image prune` | — |
| 验证 | 轮询 `http://127.0.0.1:38000/api/health`（约 1 分钟超时，失败打印容器日志） | — |

> 假设说明：流水线未指定 `docker.image`（沿用 linyuan-infra SOP 模板的默认构建环境，含 docker CLI 与 node）。若默认环境 node < 20，"环境自检"阶段会显式失败——届时再为流水线指定 `docker: image:` 并补装 docker CLI。

## 5. 生产口径（红线相关）

- **R4**：生产库**不播种**种子数据。容器启动只跑 `prisma migrate deploy`（幂等建表），库内无 Mock 数据；接口返回空集合是真实状态，不是故障。
- **对外表述**：当前部署的是"统一后端的界面框架支撑层"，全部业务能力仍无真实实现（PROJECT-SPEC 附录 A 口径），不得表述为"已上线"。
- **数据库 = 共享 PostgreSQL**（ADR-0004）：库 `hnhall`、账号 `hnhall` 只 OWNER 自己的库；连接串口令来自宿主机 `/opt/hnhall/.env`。备份由 linyuan-infra `shared-infra/backup.sh` 统一负责（建议 crontab 每日 03:30）。

## 6. 本地开发

```bash
docker compose -f docker-compose.dev.yml up -d        # 本地 PG（127.0.0.1:5432）
cd server && npx prisma migrate deploy                 # 建表（.env 已指向本地 PG）
DATABASE_URL="postgres://hnhall:hnhall_dev@127.0.0.1:5432/hnhall" node dist/database/seed.js   # 仅开发环境播种（Mock）
npm run dev:server                                     # NestJS watch（端口 3000）
```

## 7. 踩坑记录（已修复，勿重犯）

- **Prisma 引擎与 OpenSSL 不匹配**：构建阶段（bookworm-slim）没有 `openssl` 二进制时，Prisma 检测 binaryTarget 失败会**静默回退** openssl-1.1.x 引擎；运行时若检测为 3.0.x，client 直接加载失败（报错只列出查找路径）。修复 = 构建阶段 `npm ci` **之前**安装 openssl（Dockerfile 已内置）。
- **容器启动挂起约 90 秒**：`npx prisma` 会触发 npm 更新检查去连 registry，离线/受控网络下长时间等待。启动命令改为直接调 `node_modules/.bin/prisma`（Dockerfile 已内置）。
- **`.dockerignore` 的 `*.db` 不匹配子目录**（Go filepath.Match 语义），本地 `services/server/prisma/dev.db`（Mock 数据）会漏进镜像——必须写 `**/*.db`（R4：生产镜像不得携带 Mock 数据）。

## 8. 运维速查

```bash
ssh ubuntu@1.14.155.197

cd /opt/hnhall
docker compose -f docker-compose.cloud.yml ps           # 容器状态（含 healthcheck）
docker compose -f docker-compose.cloud.yml logs -f api  # 后端日志
curl -s http://127.0.0.1:38000/api/health               # 宿主机直接验证
curl -s https://hnhall.linyuan.maimaioo.top/healthz     # 公网入口验证（Nginx 就绪后）

# 数据库（共享实例，管理权在 linyuan-infra）
docker exec shared_postgres pg_isready -U postgres              # 就绪
docker exec -it shared_postgres psql -U hnhall -d hnhall        # 应用库（应用账号）
bash /opt/linyuan-infra/shared-infra/backup.sh                  # 手动备份（建议 crontab 每日 03:30）
```

**回滚**：镜像仅打 `latest`，回滚 = 在 CNB 镜像仓库找到上一版镜像（按 digest/tag）→ 宿主机 `docker tag <旧镜像> docker.cnb.cool/yahveyeye/hnhall/api:latest && docker compose up -d`。数据库回滚走共享实例的备份（见上）。如需常规回滚能力，后续在流水线追加 git sha 镜像 tag。

## 9. 已知限制 / 后续

| 项 | 说明 |
| --- | --- |
| C 端为小程序、非静态站点 | C 端（`apps/user`）与技师端（`apps/technician`）均为 Taro 微信小程序，经微信开发者工具/小程序发布流程分发，**不作为本 nginx 静态流水线的部署目标**；后端 API 由本流水线部署供两端小程序调用 |
| 镜像仅 latest tag | 回滚依赖镜像仓库历史 digest；建议后续加 `${git sha}` tag |
| 无鉴权 | 后端当前无任何真实鉴权（PROJECT-SPEC 附录 A），公网暴露面 = 只读空库 + 写操作种子级演示；接入真实鉴权（R5/R8）前不建议对外传播域名 |
| 未使用 Redis | hnhall 服务端当前无缓存依赖；启用时按 linyuan-infra SHARED-INFRA 领取 db 编号，compose 加 `shared-infra-net` 并注入 `REDIS_URL`（口令 secrets 已含 `REDIS_PASSWORD`） |
| 依赖共享 PG 可用性 | 应用启动依赖 `shared_postgres` 先就绪（`restart: unless-stopped` 会自动重试）；共享实例的升级/重启窗口需与各应用协调（linyuan-infra 侧职责） |
| 其余应用迁移未完成 | MySQL（huali-edu、smartkindergarten）与 SQLite（notebooklm-exam）仍在各自仓库排队迁移，完成前新旧数据库并存（SHARED-INFRA.md §6 批次表） |
