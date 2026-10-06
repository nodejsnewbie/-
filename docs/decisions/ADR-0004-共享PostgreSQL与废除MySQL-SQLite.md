# ADR-0004：共享 PostgreSQL——废除全宿主机 MySQL/SQLite，linyuan-infra 扩为共享服务管理者

- 状态：已采纳
- 日期：2026-10-04
- 决策人：开发者本人（兼技术负责人 / 运维帽）
- 关联：[ADR-0003](ADR-0003-后端CNB自动部署.md)（部署体系，数据库部分由本 ADR 取代）；linyuan-infra `docs/SHARED-INFRA.md`（共享服务规范与迁移计划）；`server/prisma/schema.prisma`；`docker-compose.cloud.yml` / `docker-compose.dev.yml`

## 背景

共服宿主机（1.14.155.197）上 5 个应用各自内嵌数据库实例：MySQL 8.0 ×2（huali-edu、smartkindergarten）、MongoDB ×1（Teacher-Assist）、SQLite ×2（notebooklm-exam、hnhall）。小服 RAM 被多个空转实例占据，备份/升级运维面分散。本人决策：**废除所有 MySQL 与 SQLite，统一收敛 PostgreSQL**，并把 linyuan-infra 从"Nginx 管理者"扩展为"宿主机共享服务管理者"。

> 论点澄清：共享实例提升的是**资源利用率与运维收敛**，不是查询性能；代价是隔离性下降，以"一库一账号 + 专用网络 + 资源限额 + 统一备份"补偿。

## 选项

1. **共享 PostgreSQL 实例（一库一账号）**，由 linyuan-infra 管理编排——采纳。
2. 各应用继续独立实例、仅换引擎为 PG——否决：没有解决 RAM 与运维面问题。
3. 托管数据库服务——否决：监管数据主权（R6）与成本不适配，且共服体量不需要。

## 结论

1. **linyuan-infra 扩 scope**：新增 `shared-infra/`（postgres:16-alpine，容器 `shared_postgres`，Docker 网络 `shared-infra-net`，**不绑宿主机端口**；init 脚本一库一账号幂等建权；`backup.sh` 逐库 pg_dump 保留 14 天）；其 `.cnb.yml` 增加共享服务同步与拉起阶段。规范落 `linyuan-infra/docs/SHARED-INFRA.md`。
2. **hnhall 切 PostgreSQL（宪法路径）**：`schema.prisma` provider `sqlite → postgresql`；**全新迁移基线**（旧 SQLite 迁移删除——原型 Mock 数据可弃，无搬运价值）；新增 `docker-compose.dev.yml`（本地开发 PG）；云端 compose 经 `shared-infra-net` 接共享 PG，库 `hnhall` / 账号 `hnhall` / 口令存宿主机 `/opt/hnhall/.env`。
3. **其余应用分批迁移**（各仓库自查自迁，SHARED-INFRA.md §6 登记）：批次 2 notebooklm-exam（SQLite→PG，改 SQLAlchemy 连接串）→ 批次 3 smartkindergarten（MySQL+Redis→PG，Redis 是否并入共享另行决策）→ 批次 4 huali-edu（MySQL→PG，完成后回收其 3306）→ 批次 5 全表终审。**MongoDB（Teacher-Assist）不在"废除 MySQL/SQLite"范围，保留**。
4. **数据口径**：R4 不变——生产库不播种；R8 不变——跨库访问禁止，账号只 OWNER 自己的库。

**补充（2026-10-05，随 linyuan-infra 演化同步）**：

1. **共享 Redis 并入** `shared-infra`（`shared-redis:6379`，统一 `REDIS_PASSWORD` 鉴权、一应用一 db 编号隔离）——hnhall 服务端**当前未使用 Redis，不接入**；启用时按 SHARED-INFRA §3/§6 领取 db 编号并把 `REDIS_URL` 注入 compose。
2. **部署纪律升级：一切部署动作流水线化**——目录、.env（从 CNB secrets 幂等生成）、共享服务拉起、init 重放、备份 crontab 安装全部由 push 触发的流水线完成；人工仅剩 secrets 维护与 DNS。
3. **Nginx 改为每文件直部署**（`nginx/NN-<项目>.conf` → `/etc/nginx/conf.d/`，assemble 拼接废除，HTTP 重定向通配化）——hnhall 路由权威文件 = linyuan-infra `nginx/40-hnhall.conf`，本仓库 `nginx/hnhall.conf` 降级为留档副本。

## 影响

- 正面：RAM 收敛、备份/升级单点化、hnhall 提前落到宪法目标数据库（原"生产目标 PostgreSQL"达成）；engine/openssl 构建问题已在 ADR-0003 时期解决，镜像构建不受影响。
- 代价 / 风险：单 PG 实例可用性绑定全部已迁应用；批次 2–4 需要逐仓库改连接层与数据搬运（MySQL→PG 有类型映射工作量），完成前新旧并存、RAM 暂不下降。
- 文档连带：AGENTS.md 数据层表、PROJECT-SPEC 数据库行、DEPLOYMENT.md、ADR-0003 状态行均已同步。

## 验证方式

- 本地证据（2026-10-04）：`prisma migrate dev --name init` 全新基线成功 + client 重新生成；seed 后 PG 内直查 `WorkOrder` 7 行；服务器冒烟 `/api/health` healthy、`/api/stats`、`/api/products` 返回种子数据；`npm run build` exit 0、lint 除 technician 存量（ADR-0002）外 0 error。
- 线上证据：linyuan-infra 推送后共享 PG 就绪 + hnhall 首次部署健康检查全绿；备份 cron 落地后 `backups/` 有产物。
