# 华农智服 · 农资上门服务维保平台

把线下农技服务能力线上化、可调度化、可结算化，用服务撬动农资销量的企业平台。
本仓库为 monorepo（npm workspaces），承载**三端 + 两服务 + 一个共享类型包**。

## 架构总览

```
用户 ──► 三端（界面）────────────────────────► 统一后端 server/ ──► SQLite(开发) / PostgreSQL(目标)
              │                                    ▲
              │ Vite 代理 /api（开发期）             │
              └────────────────────────────────────┘
                                                   ▲
                                   services/ai（LangChain 智能代理，工具=平台 REST 接口）
```

| 端 / 服务 | 目录 | 面向用户 | 技术 | 端口 | 状态 |
|---|---|---|---|---|---|
| 企业端后台 | `apps/admin` | 运营管理员、区域督导 | Vite 8 + React 19 + TS 7 | 5173 | ✅ 界面完成，已 feature 化 |
| 技师端 | `apps/technician` | 农艺师、飞手、机手 | **Taro 4.3**（微信小程序）+ React 18 | 小程序 | 🔶 脚手架已通构建；组件层 H5→Taro 适配进行中 |
| C 端用户端 | `apps/mall` | 农户、合作社 | Vite 8 + React 19 H5 | 5174 | ✅ 界面完成（小程序化待定） |
| **统一后端** | `server` | 三端共用 | NestJS 11 + Prisma（SQLite） | 3000 | ✅ 41 条路由（后台 16 + 技师端 16 + 商城 9） |
| **AI 智能代理层** | `services/ai` | 给端提供智能对话 | Python + FastAPI + LangChain | 8100 | ✅ REST 契约就绪（LLM 密钥未配则诚实降级） |
| 共享类型 | `packages/shared` | — | 纯类型（`import type`） | — | ✅ 三端与后端的类型真源 |

> 判断标准：**用户直接打开用的是「端」，用户打不开的是「服务」**。
> `apps/technician` 目前只有 `pages/index` 一个入口页（容器 `src/TechnicianWorkspace.tsx`），
> 17 个业务视图仍为 H5 组件原样嵌入——运行期适配是当前主要待办（见 AGENTS.md「已知遗留」）。

## 快速开始

```bash
npm install                       # 根目录一次装齐（workspaces 分发）
npm run dev:server                # 统一后端 :3000（watch）
npm run dev:admin                 # 企业端 :5173
npm run dev:mall                  # C 端商城 :5174
npm run dev:technician            # 技师端小程序（Taro watch 编译，产物用微信开发者工具打开 apps/technician/dist）
npm run dev:ai                    # AI 代理层 :8100（需先配置 services/ai/.env）
```

- 数据库：开发期 SQLite（`server/prisma/dev.db`），`node server/dist/database/seed.js` 幂等重播种子
- AI 层密钥：`services/ai/.env`（OpenAI 兼容协议，可指向豆包/智谱/通义）

## 质量门禁（提交前必跑）

```bash
npm run lint          # tsc --noEmit（类型，R1）
npm run lint:eslint   # ESLint（代码质量）
npm run build         # 全工作区构建（admin/mall=Vite，technician=Taro weapp，server=nest）
npm run format        # Prettier
```

后端接口行为回归：`node scripts/capture-api-baseline.mjs <out> [core|mall]` → `scripts/compare-api-baseline.mjs`（必须 0 不一致）+ `scripts/smoke-mutations.mjs`。

## 更多

- **[AGENTS.md](AGENTS.md)**：项目宪法（红线规则 R1–R10、状态机、迁移纪律、当前进度）——**改动前必读**
- [docs/PROJECT-SPEC.md](docs/PROJECT-SPEC.md)：详细规范（目标、非目标、角色权限、待决策项）
- [services/ai/README.md](services/ai/README.md)：AI 层使用与测试
