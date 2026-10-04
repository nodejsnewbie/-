# ADR-0003：后端基于 linyuan-infra 共服体系的 CNB 自动部署

- 状态：已采纳；**数据库部分已被 [ADR-0004](ADR-0004-共享PostgreSQL与废除MySQL-SQLite.md) 取代**（生产 SQLite → 共享 PostgreSQL，2026-10-04）——端口/域名/流水线/部署目录等其余结论仍有效
- 日期：2026-10-04
- 决策人：开发者本人（兼技术负责人 / 运维帽）
- 关联：[DEPLOYMENT.md](../DEPLOYMENT.md)；linyuan-infra `docs/deployment-architecture.md`（§11 新增应用 SOP）；`.cnb.yml` · `server/Dockerfile` · `docker-compose.cloud.yml` · `nginx/hnhall.conf`

## 背景

PROJECT-SPEC 早已预选 CNB 流水线（`.cnb.yml`）作为 CI，但一直未配置。需求：main 分支推送到远程仓库后，统一后端（`server/`，NestJS + Prisma）自动部署。部署必须落在本人的共享基础设施 `linyuan-infra`（宿主机 `1.14.155.197`，五项目共服，宿主机 Nginx 由该仓库独立管理）上，并遵守其「新增应用 SOP」。

## 选项

1. **纳入 linyuan-infra 共服体系**（SOP 标准路径：CNB Registry 镜像 → SSH → `/opt/hnhall` compose 部署）——与既有四项目同构，密钥 / 运维 / 文档体系直接复用。**采纳**。
2. 独立服务器 / 独立部署体系——否决：多一套运维面，与现有 SOP 割裂。
3. serverless / 平台托管——否决：监管对接与数据主权要求（R6）不适配，成本不可控。

## 结论

1. **接入方式**：`main` push 触发 `.cnb.yml`——环境自检 → 门禁（`npm ci` → lint → build，admin/mall/server 范围，technician 红灯期间按 ADR-0002 拆分）→ 构建 `docker.cnb.cool/yahveyeye/hnhall/api:latest` 并推送 → SSH（复用共享 secrets `DEPLOY_SSH_KEY`）同步 `docker-compose.cloud.yml` → `docker compose pull && up -d` → 轮询 `/api/health`。
2. **端口与域名**：后端 `127.0.0.1:38000`（SOP 端口规划：第 5 个应用 `3{序号}000`）；域名 `hnhall.linyuan.maimaioo.top`（通配符证书自动覆盖）。Nginx 片段以 `nginx/hnhall.conf` 为准，**需人工 MR 到 linyuan-infra**——本仓库流水线不管理宿主机 Nginx。
3. **生产数据库 = SQLite（卷挂载 `/data`）**，与当前 schema provider 一致；启动只跑 `prisma migrate deploy`，**不播种**（R4：生产走 Mock 即测试失败）。切换 PostgreSQL 是独立后续变更，必须走宪法路径（改 provider → 重跑迁移 → 重新 generate），有 notebooklm-exam 生产 SQLite 先例。
4. **部署范围 = 仅后端**。admin / mall 前端容器化不在本次范围，接入时按 SOP 追加前端端口与路由。
5. 部署目录 `/opt/hnhall`；编排文件由流水线每次 scp 同步，宿主机**无 .env 需求**（当前后端无密钥）。

## 影响

- 正面：main push 即部署且门禁前置（R1/R2 失败阻断发布）；与四兄弟项目同构，运维心智一致；PROJECT-SPEC 预留的 CI 项落地。
- 代价 / 风险：
  - 流水线未指定 `docker.image`（默认构建环境，假设 node ≥ 20 且有 docker CLI——与 linyuan-infra SOP 模板一致）；若默认环境不满足，「环境自检」阶段显式失败。
  - 镜像仅 `latest` tag，回滚依赖镜像仓库历史 digest。
  - 后端无鉴权即暴露公网（域名就绪后）——接入真实鉴权（R5/R8）前不对外传播域名。
- 首次部署前须完成一次性动作（infra MR、宿主机 `/opt/hnhall` 初始化、DNS 确认），清单见 DEPLOYMENT.md §3。

## 验证方式

- 本地证据：`server/Dockerfile` 本地构建成功 + 容器冒烟（migrate → `/api/health` 200 → 空库空集合）。
- 线上证据：首次 push 后 CNB 流水线全绿 + `curl https://hnhall.linyuan.maimaioo.top/healthz` 与 `/api/health` 正常；此后每次部署以流水线「健康检查」阶段为准。
