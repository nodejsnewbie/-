# 华农智服 · 企业综合管理平台

## 项目简介

- **name**: 华农智服 · 农资上门服务维保平台
- **description**: 华农灵活用工平台的企业端后台管理系统（平台另含技术服务人员端、C 端农户小程序）
- **version**: 1.0.0
- **repo**: `hnhall`

华农以传统农资批发代理模式经营，已有一支全国最大的一线专业指导服务队伍（300–400 人，核心技术人员 100 余人）与既有品牌影响力，但「30 多个产品的销量都上不来」，渠道转化链是断的。本项目**把线下服务能力线上化、可调度化、可结算化，用服务撬动农资销量**。

三端形态（本仓库承载第 1、3 端，技师端待建）：

| 端               | 使用者                                       | 状态                                                                                                            |
| ---------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 企业端（本仓库） | 企业运营管理员（兼资质审核与结算）、区域督导 | ✅ 界面与交互框架已完成（数据为种子 Mock）                                                                      |
| 技术服务人员端   | 农艺师、植保机手、飞手、农机手、土壤检测人员 | 🎯 规划中                                                                                                       |
| C 端用户端       | 农户、合作社、种植大户                       | ✅ H5 版（农资自营商城，自 `E:\repo\zymall` 并入 `apps/mall`）已完成界面与交互（数据为种子 Mock）；小程序化待定 |

七大业务模块：运营数据总览、订单调度管理、技术人员管理、资质与合规审核、农资供应链与溯源、阿米巴分红与结算、系统设置与权限。

五类服务 + 三项平台能力（经第 3 步确认）：服务 = **上门植保诊断**、**农资上门配送与维保**、**飞防（无人机）作业**、**农机巡检维保**、**土壤检测**；平台能力 = 资质合规准入、一物一码产品溯源、阿米巴合伙人分红。

**本期交付范围**：企业端后台 + 技术服务人员端 + C 端农户小程序。

**本期非目标**：

- **线上商城**（纪要提到「农药店批发商（商城的入口）」，经第 3 步确认本期不交付）
- **窜货预警与批次熔断冻结**（本期不做，二期再评估）
- 基于地图的服务人员定位展示（百度/高德年费约 5 万，暂不开发）
- 产品配合度二次营销；全品类多商家商城

非目标不等于删字段——`location` / `gridCode` / `coverageRadius` 必须保留，为后续接入地图服务留接口。但**派单界面上的距离与到达时间在本期无真实数据来源，只能作为「示意值」显示且必须显式标注**（见注意事项）。

> 详细版规范（可衡量目标、非目标原因、技术栈版本明细、角色权限边界、目录组织原则、流程明细与状态机、待决策项、实现状态对照）见 [`docs/PROJECT-SPEC.md`](docs/PROJECT-SPEC.md)。
> 两者冲突时**以本文件为准**，并须同步修正 PROJECT-SPEC。

## 技术栈

**仓库为 monorepo（npm workspaces）**

| 路径              | 内容                                          | 技术                                              | 状态                                                                |
| ----------------- | --------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `apps/admin`      | 企业端后台管理系统前端                        | Vite 8 + React 19 + Tailwind 4 + **TypeScript 7** | ✅ 框架与界面已完成，**已 feature 化**（`app/ + features/<域>/`，数据全 Mock） |
| `apps/technician` | 技师端（微信小程序）                          | **Taro（React）**                                 | ⬜ **待建**（原 H5 版在 `E:\repo\technicalend`，仅作移植参照）      |
| `apps/mall`       | C 端 · 农资自营商城与防伪溯源（H5）           | Vite 8 + React 19 + Tailwind 4 + **TypeScript 7** | ✅ **已并入**（自 `E:\repo\zymall`，数据为种子 Mock；小程序化待定） |
| `server`          | **统一后端**，同时服务后台、技师端与 C 端商城 | NestJS 11 + Express + **TypeScript 6**            | ✅ **41 条路由已全部迁入模块**，controller → service → 仓储 三层（后台 16 + 技师端 16 + C 端商城 9） |
| `services/ai`     | **AI 智能代理层**（第四个服务，独立进程）     | Python 3.12+ + **FastAPI** + **LangChain 1.x**    | ✅ 标准化 REST `/api/v1`（OpenAPI 契约）+ 智能代理（工具 = 平台 REST 接口），pytest 5 项契约测试 |
| `packages/shared` | 跨端领域类型真源                              | 纯类型（`import type`，运行期完全擦除）           | ✅ 已抽离                                                           |
| `docs`            | 规范、需求、问卷、决策记录                    | —                                                 | ✅                                                                  |

**⚠️ TypeScript 版本是分裂的，这是有意为之**

| 工作区       | TS 版本 | 原因                                                                                                                                                                                                                                        |
| ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/admin` | **7.x** | 前端只需 tsc/vite，TS 7 可用                                                                                                                                                                                                                |
| `server`     | **6.x** | **Nest CLI 依赖编译器 API，而 TS 7.0 只发 `tsc` 可执行文件、去掉了编程 API**（Nest CLI 报错原文如此，并称 7.1 会恢复）。已实测：TS 7 的 `tsc` **能**正确产出 `design:paramtypes` 装饰器元数据（DI 本身没问题），**唯一不通的就是 Nest CLI** |

> 待 TS 7.1 恢复编译器 API 后，可把 server 也升到 7.x 并收敛为一个版本。

**后端形态**

- 目标基线：NestJS + PostgreSQL + Redis + 对象存储 + 消息队列 + OpenAPI 3 契约
- **当前：三套旧 Express Mock（后台 / 技师端 / C 端商城）已全部迁入 NestJS 模块，`server/src/legacy/` 已删除**
  - 按**业务域**分模块——企业后台与技师端是同一业务域的两个视图，因此同模块内用两个 controller 区分端
  - `modules/dashboard · order · technician · qualification · supply-chain · amoeba · system · mall`
  - 数据已落 Prisma（开发期 SQLite）：仓储在 `src/database/repositories/`，种子数据 `src/database/seed-data/`（原型 Mock 逐字迁入），`node dist/database/seed.js` 幂等复位
- **迁移的验收方式（必须有证据）**：迁移前后抓同一批响应**逐字节比对**
  - 夹具：`server/test/api-baseline.json`（后台 + 技师端）、`server/test/api-baseline-mall-*.json`（C 端商城，迁移前/后各一份）
  - 脚本：`scripts/capture-api-baseline.mjs`（`core` 默认 / `mall` profile）→ `scripts/compare-api-baseline.mjs`
  - 写操作与错误形状：`scripts/smoke-mutations.mjs`
  - 后台+技师端迁移结果：GET **15/15 逐字节一致**；写操作 + 404/400 形状 **26 项断言全过**
  - C 端商城并入结果：mall profile **8/8 逐字节一致**；core profile **15/15 无回归**；smoke **34 项断言全过**（详见「仓库合并记录」）
- **⚠️ 业务规则与数据库表结构待客户确认需求后再落**（见下方「前提状态」）
  —— 本次迁移**只搬结构、不改口径**：所有存量缺陷（浮点金额、虚构字段、硬编码汇总值）原样保留，并就地加注说明

**数据层（Prisma）**

| 项       | 取值                                                                                                                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ORM      | Prisma 6（`server/prisma/schema.prisma`）                                                                                                                                                                                              |
| 开发环境 | **SQLite**（`server/prisma/dev.db`，零依赖，clone 即可跑）                                                                                                                                                                             |
| 生产目标 | PostgreSQL —— 切换需改 `provider` → 重跑迁移 → 重新 generate client；仓储层代码不动，**但这不叫「改个环境变量」**                                                                                                                      |
| 当前模型 | **v0 临时版，源自原型数据形状**（后台 / 技师端 / 商城域共 17 张视图模型），待客户确认需求后修订。约定：金额存「分」+ mapper 边界还原、枚举 String 存 + `@hnhall/shared` 字面量约束、列表顺序 `orderKey` 显式维护、数组/视图嵌套走 Json |

**⚠️ Prisma + SQLite 的实测约束（写模型前必读，已实测）**

- **`enum` 可以用，但本项目不用**。实测 `prisma db push` 在 SQLite 上**成功**，落成的 DDL 是普通 `TEXT NOT NULL`——**没有任何取值约束**（`Json` 落成 `JSONB`，同样靠客户端而非数据库校验）。
  不用的真正理由是：**PG 上 Prisma 会建真正的 enum 类型**，两个 provider 的 DDL 因此分叉，将来切库更麻烦。加上项目既有规范就是「枚举用 snake_case 字符串字面量联合类型」，所以统一 String 存、约束留在 `@hnhall/shared`。
- 禁止 `@db.*` 原生类型注解与 PG 专有数组类型（切库会炸）。
- 金额用 Int 存「分」（R7）；主键统一 String（cuid/uuid）。

> **踩坑记录（重要）**：曾把探针 schema 放在 `%TEMP%` 里跑 `prisma db push`，报
> `Schema engine error: SQLite database error / unable to open database file: ./t.db`。
> 我当时据此判定「SQLite 不支持 Prisma enum」并写进了本文件——**这是错的**，真实原因是
> **SQLite 连接器无法在临时目录建库**。移到项目内 `server/prisma/` 后 enum / Json / Int 全部成功。
> **教训：Prisma 探针必须在项目内 `prisma/` 目录做，且报错要连 stderr 一起看（我曾用 Select-String 把真正的错误行过滤掉了）。**

**质量工具**

| 工具 | 用途 | 状态 |
|---|---|---|
| `tsc --noEmit`（`npm run lint`） | 类型正确性门禁（R1） | ✅ |
| **ESLint 10 flat config**（`npm run lint:eslint`） | 代码质量（未用变量、显式 any、hooks 规则）；分工：**格式归 Prettier，类型归 tsc** | ✅ 已接入（`eslint.config.js` + `.prettierrc.json`；`react-hooks/set-state-in-effect` 因保留原型行为降级为 warn，接入测试框架后重构） |
| **Prettier**（`npm run format` / `format:check`） | 格式化（整仓已做一次基线格式化） | ✅ 已接入 |
| **pytest**（`services/ai`） | AI 层 REST 契约测试（不依赖真实 LLM 密钥） | ✅ 5 项通过 |
| Vitest（单元）+ Playwright（E2E）+ MSW（接口 Mock）+ CNB 流水线 | 前端与接口测试 | ❌ 未接入（接口层暂以回归基线 + smoke 脚本把关） |

**Python 工具链（services/ai）**：用 **uv** 管理虚拟环境与依赖（`uv venv` + `uv pip install -e ".[dev]"`）。
⚠️ 实测本机 **pip 在 Python 3.14 上会静默死循环**（零输出烧 CPU 数十分钟），换 uv 秒装——不要再用 pip 装本项目依赖。
⚠️ 根目录 devDependencies 里的 typescript（6.x）是 **ESLint 解析器引擎**（typescript-eslint 依赖编译器 API，TS 7 没有）；各工作区构建用的 TS 版本不受影响（admin 嵌套 7.x）。

**依赖与安装（已实测）**

- 根目录用 npm workspaces 统一安装；**R1/R2 已实测通过**：`npm run lint` 与 `npm run build` 在 admin 与 server 两个工作区均 exit 0
- 历史坑（均已修复，勿重犯）：
  - `esbuild@"^0.25.0"` 曾与 vite 8 的 `peerOptional esbuild@"^0.27.0 || ^0.28.0"` 冲突，导致 **ERESOLVE 安装失败** → 该依赖代码零引用，已移除
  - 已清理零引用依赖：`@google/genai`、`lucide-react`、`motion`、`dotenv`、`autoprefixer`
  - **`incremental` 的 `tsBuildInfoFile` 必须落在 `dist` 内**：否则 `nest build` 删掉 dist 后 tsc 会认为「已是最新」，**一个文件都不产出却报成功**（静默失败，已踩过）
- **TypeScript 7 的已知破坏性变更**（改 tsconfig 时注意）：`moduleResolution: node10` 与 `baseUrl` 被移除；`rootDir` 必须显式声明（TS5011）；跨模块系统的 `import type` 需要 `resolution-mode` 属性
- **`esbuild` 插件链不支持 `emitDecoratorMetadata`**：NestJS 的依赖注入靠它，因此后端**不能用 tsx/esbuild 跑**，只能用 tsc（或 SWC）
- **NestJS 的 `@Post()` 默认返回 201 Created**，而旧 Express 的 `res.json()` 返回 200 → 迁入的 **14 个 POST 全部要显式 `@HttpCode(200)`**，否则客户端观察到的状态码变了（迁移时踩到，由 `smoke-mutations` 抓出）
- **NestJS 的 `HttpException` 传对象时，响应体就是那个对象**（不会自动附加 `statusCode`），所以能精确复刻 legacy 的两种错误形状：后台 `{ error }`、技师端 `{ success, message }`
- **`process.exit()` 在 Windows 上会触发 libuv 断言崩溃**（exit code `0xC0000409`）并吞掉测试结果 → 脚本里改用 `process.exitCode`

## 常用命令

全部在**仓库根目录**执行，workspaces 会分发到各工作区：

```bash
npm run dev:server   # 启动统一后端（NestJS，端口 3000，watch 模式）
npm run dev:admin    # 启动企业后台前端（Vite，端口 5173，/api 代理到 3000）
npm run dev:mall     # 启动 C 端商城前端（Vite，端口 5174，/api 代理到 3000）
npm run dev:technician  # 技师端 Taro watch 编译（产物用微信开发者工具打开 apps/technician/dist）
npm run dev:ai       # 启动 AI 智能代理层（uvicorn，端口 8100；需先配置 services/ai/.env）
npm run dev          # = dev:server
npm run lint         # 所有工作区 tsc --noEmit（类型门禁，R1）← 提交前必跑
npm run lint:eslint  # ESLint 代码质量检查（与 tsc 分工，见「质量工具」）
npm run format       # Prettier 格式化
npm run build        # 所有工作区构建
npm start            # 生产模式启动后端（需先 build）
```

只针对单个工作区：`npm run build -w @hnhall/server`

**开发期前端不直连后端**：`apps/admin`（5173）与 `apps/mall`（5174）都通过 Vite 把 `/api` 代理到 `http://127.0.0.1:3000`（可用 `API_PROXY_TARGET` 覆盖，见各自 `vite.config.ts`）。旧的一体化 `tsx server.ts`（Express + Vite middleware）已废弃并删除。

## 项目角色

### 业务角色

- **企业运营管理员**：全局运营决策、区域与网格配置、系统设置与权限分配（唯一可变更权限与结算规则）
- **区域督导 / 站长**：本区域工单调度、技师排班与产能协调、异常工单处置（仅限本区域数据）
- **资质审核员** → **不单设角色**（第 3 步确认）：该职责由**企业运营管理员兼任**。核验农药经营许可证、身份、经营范围、有效期，决定入库与否（不可改申请人提交的原始材料）
- **技术服务人员**：接单、到场打卡、开具电子处方、完成作业、接受农户签字验收（无证/过期不可接单；**师徒制不存在，相关字段已删除**）
- **农药店批发商**：作为商城入口供货、区域授权分销（**本期不交付商城，该角色随商城一并延后**）
- **C 端农户 / 合作社**：下单、上传病虫害信息、验收签字、评价、扫码验真
- **外部监管系统**：国家农药追溯云、省级农业农村厅许可数据双向校验（**接口权限正在申请中**，本期只预留契约，不承诺可用）

### 研发角色

- **产品经理（PM）**：需求优先级、MVP 范围、验收口径
- **需求 / 业务分析**：把模糊需求转成 PRD（含 Given-When-Then）
- **技术负责人**：技术选型、契约冻结、红线裁定与例外批准（须书面）
- **前端 / 后端开发**：按冻结契约实施
- **测试 / QA**：测试策略与用例、验收执行（**拥有测试失败判定权，可否决合并**）
- **运维 / SRE**：环境、发布、回滚、监控
- **AI 编码代理**：按本规范实施，**无红线豁免权**；失败须如实上报，不得伪造通过证据

## 红线规则（测试失败标准）

以下 R1–R10 中**任意一条触发，即判定该次变更为「测试失败」**，禁止合并、禁止发布、禁止「先上后补」。豁免须经技术负责人书面批准并记录在 PR 描述中。

> ⚠️ **前提状态（必读）**：本文中标注「经第 3 步确认」的**全部结论，实际来源是开发方（需求对接人）的判断，尚未经客户确认**——它们是**待验证假设，不是事实**。
> 涉及红线的关键前提：**R5**（资质审核为纯人工、无 OCR/人脸核身）、**R6**（窜货与熔断本期不做）、**R7**（分红仅来自服务收入、服务费 = 服务净值、税目 = 劳务报酬、分档系数为建议值）。
> **未确认前，不得把上述口径当作事实引用或对外承诺。** 对外提问按 [`docs/requirements/discovery-questions.md`](docs/requirements/discovery-questions.md) **按需求深度逐层推进**（讨论阶段 + 微信沟通；第一层仅 7 题，上一层不确认不问下一层）；完整假设清单与 65 题题库见 [`docs/requirements/client-confirmation-questionnaire.md`](docs/requirements/client-confirmation-questionnaire.md)（**内部备查，暂不发客户**）。客户确认后须逐项复核并修订本段红线。

- ❌ **R1 类型**：`npm run lint`（`tsc --noEmit`）非 0 error；新增未说明的 `@ts-ignore` / `as any` / 隐式 any
- ❌ **R2 构建**：`npm run build` 失败，或 `npm start` 白屏、控制台有未捕获异常
- ❌ **R3 契约**：改接口未同步 `types` + `server` + 全部调用方；已发布字段破坏性变更
- ❌ **R4 数据真实**：Mock/假数据落库；生产走 Mock；真实手机号/身份证/证件原件进入仓库（须脱敏 `138****7819`）
- ❌ **R5 合规（最高；适用范围 = 接口 / 服务端实现）**：
  - 许可证校验未在服务端实现（须覆盖**有效期**、**许可经营范围与作业类型匹配**、发证机关）
  - **未通过资质审核的技师进入可派单池**（`dispatchStatus = active`）
  - 把资质校验降级为「仅前端校验」或「仅提示不拦截」
  - 让「审核通过」这个判定可由前端或模型自行给出（审核结论只能由**持权限的运营管理员**提交——本业务不单设审核员角色，第 3 步已确认）

  **审核手段（经第 3 步确认）**：本业务为**纯人工审核**——审核员肉眼核对证件照片，**无 OCR、无人脸核身**。因此不得把自动化识别当作 R5 的必须项，也不得在界面或报表上展示「OCR 比对率」这类不存在的指标（同时违反 R4）。

  **前端开发阶段等效约束（后端未就绪时适用）**：前端**不得伪造合规通过态**——禁止硬编码「已校验有效」类文案、禁止把资质状态写死为绿、禁止在无接口返回时默认放行；合规态一律来自接口契约桩，且桩数据必须显式标注为 Mock，不得流入生产。

- ❌ **R6 溯源监管**：溯源节点伪造或补造；溯源码可重复核销、可由前端伪造或绕过服务端校验；与监管系统的数据同步失败被静默吞掉

  > 「批次冻结 / 窜货熔断」经第 3 步确认**本期不做、二期再评估**，因此**不作为本期红线判定项**。相关字段（`fleeStatus` / `fleeStatusText` / `fleeLocation`）须从本期 PRD 与界面中移除，**不得以「示意」形式保留**（与 R4 冲突）。

- ❌ **R7 资金**：结算逻辑无单测；金额非「分」整数、浮点累加；`应付 − 预扣税 ≠ 实发` 的分位差异

  **口径（经第 3 步确认）**：分红基数 = Σ(当月**已开方且已验收**工单的**服务净值**) × 档位系数 − 服务质量扣减；税目为**劳务报酬所得**，公司代扣代缴（预扣率、减除标准、速算扣除数**必须可配置**，规则见 [`docs/requirements/amoeba-policy.md`](docs/requirements/amoeba-policy.md) §5）。

  **数据模型要求**：工单必须**分别记录「服务净值」与「农资金额」**——原型单一的 `settlementAmount` 不足以支撑该口径。

- ❌ **R8 权限**：任一越权可复现路径（技师看他人的结算、非审核员审资质、跨区域操作、农户看他人订单）
- ❌ **R9 测试阈值**：核心逻辑行覆盖 < 80% / 分支 < 70%；Given-When-Then 未 100% 通过；关键 E2E 未 100% 通过
- ❌ **R10 变更纪律**：提交 `node_modules`/`dist`/`.env`/密钥；绕过 CI 门禁；新增单文件 > 500 行

> **存量违规登记**：R7 要求金额以「分」为整数，但迁入的原型 Mock 数据全为浮点金额（如 `server/src/database/seed-data/technician.seed.ts` 里 `serviceFee: 4200.0`、`netPay: 8671.8`、`taxWithheld: 268.2`）。存储层已全部转「分」落库（含商城域），**接口响应仍按原型返回「元」浮点**（mapper 边界还原），响应层的浮点金额与三套原型数据按「已登记违规」处理，**新增代码仍须合规**；迁移时点见 PROJECT-SPEC 待决策项。

## 代码规范

### 命名

- **组件 / 视图文件**: `PascalCase.tsx`（`OrderDispatch.tsx`）
- **hooks / 工具 / 服务**: `camelCase.ts`（`api.ts`）
- **类型 / 接口**: `PascalCase`，**不加 `I` 前缀**（`Technician`、`WorkOrder`）
- **常量**: `UPPER_SNAKE_CASE`；**布尔量**: `is` / `has` / `can` 前缀
- **枚举值**: snake_case 字符串字面量联合类型（`'pending_dispatch'`），**与展示文案分离**（文案走 `statusText` 字段）

### 组件与数据

- 一律**函数组件 + Hooks**，禁止 class 组件；Props 用 `interface XxxProps` 并显式导出
- 组件**不直接调用 `fetch`**，数据访问必须经 `src/services/api.ts`
- 列表渲染用**稳定业务 id** 作 `key`，禁止 `Date.now()` 生成
- 跨视图共享状态超过 **3 个视图**时抽出 store

### 样式

- **只用 Tailwind 原子类**；颜色/圆角/字体一律取 `src/index.css` 的 `@theme` token（`bg-primary`、`text-on-surface-variant`）
- **禁止硬编码色值**（`text-[#004425]`）；**不新增独立 `.css` 文件**（`index.css` 是唯一样式入口）

### 导入

- 相对导入**带显式后缀**（`./types/index.ts`）；跨目录优先用别名 `@/*`
- 禁止跨业务模块直接引用其他视图内部组件，复用须上提到 `src/components/` 或 `src/shared/`

### 数据与业务

- **金额以「分」为整数**存储与计算，展示层格式化；禁止浮点累加
- **时间用 ISO 8601** 存储传输，展示层本地化；禁止存「2分钟前」
- 手机号、身份证号、许可证号**在所有输出面脱敏**
- 业务规则必须注释并注明依据（如「依据《农药经营许可管理办法》第 X 条」）

### 错误处理

- `api.ts` 每个请求失败须 `if (!res.ok) throw new Error('中文可读提示')`
- UI 层必须捕获并可见反馈，**禁止空 `catch {}` 静默吞异常**（`App.tsx` 现存多个空 catch 属待整改项）
- 禁止用「乐观 fallback」掩盖接口失败；若采用必须同时显示降级提示

### 提交

- Conventional Commits：`feat:` / `fix:` / `refactor:` / `test:` / `docs:` / `chore:`
- 一个提交只做一件事；**重构与功能变更不得混合**

## 目录结构

**当前结构（monorepo）**

```text
hnhall/
├── package.json                 # workspaces 根：apps/* · packages/* · server
├── AGENTS.md                    # 本文件（项目宪法）
├── eslint.config.js · .prettierrc.json   # ESLint（代码质量）+ Prettier（格式）
├── apps/
│   ├── admin/                   # 企业后台前端
│   │   ├── index.html · vite.config.ts · tsconfig.json · package.json · metadata.json
│   │   └── src/
│   │       ├── app/                      # 应用装配：App.tsx（全局状态/路由）+ layout/{Header,Sidebar,Footer} + components/Feedback
│   │       ├── features/                 # 业务域模块 ← 新增代码一律进这里（每域 index.tsx + components/）
│   │       │   ├── dashboard/ order-dispatch/ technician/ qualification/
│   │       │   └── supply-chain/ amoeba-settlement/ system-settings/
│   │       ├── main.tsx · index.css      # 挂载入口 / 唯一样式入口（@theme token）
│   │       └── services/api.ts           # 唯一数据访问层
│   └── mall/                    # C 端 · 农资自营商城（自 E:\repo\zymall 并入，Vite 8 + React 19）
│       ├── index.html · vite.config.ts（端口 5174）· tsconfig.json · package.json · metadata.json
│       └── src/
│           ├── App.tsx                   # 根组件：底部 Tab（首页/上门/溯源/我的）+ 全局状态
│           ├── main.tsx · index.css      # 挂载入口 / 唯一样式入口
│           ├── components/               # HomeTab / DoorstepTab / ScanModal / CartDrawer / TraceResultModal 等
│           ├── data/mockData.ts          # ⚠️ api.ts 乐观 fallback 的本地兜底（存量缺陷，待整改）
│           ├── utils/traceUtils.ts       # 前端本地验真引擎（fallback 用）
│           └── services/api.ts           # 唯一数据访问层
├── packages/
│   └── shared/                  # 跨端领域类型真源（@hnhall/shared）
│       └── src/{index.ts, types/{index,technician-view,mall-view}.ts}
├── server/                      # 统一后端（NestJS）
│   ├── prisma/                          # Prisma schema（v0 原型形状，17 张模型）+ 迁移 + 本地 dev.db
│   ├── test/                            # 迁移回归夹具（api-baseline.json + mall 两份）
│   ├── tsconfig.json · nest-cli.json · package.json · .env.example
│   └── src/
│       ├── main.ts · app.module.ts · health.controller.ts
│       ├── prisma/                      # PrismaService / PrismaModule
│       ├── database/                    # 数据访问层（service → 仓储 → Prisma）
│       │   ├── repositories/            # 按域拆分：admin-* / technician-* / audit / supply / settlement / mall
│       │   ├── seed-data/               # 原型 Mock 种子（admin / admin-operations / technician / mall，逐字迁入）
│       │   ├── seed.ts · seed-mall.ts   # 幂等播种入口（按 R10 拆分）
│       │   └── mappers.ts · json.ts     # 分↔元换算 / Json 列转换
│       └── modules/                     # 按业务域：controller（HTTP 形状）→ *.service.ts（业务逻辑）→ 仓储
│           ├── dashboard/               # /api/stats
│           ├── order/                   # /api/orders/*        + /api/tech/orders/*
│           ├── technician/              # /api/technicians/*   + /api/tech/technician
│           ├── qualification/           # /api/audits/*
│           ├── supply-chain/            # /api/supply-chain/*  + /api/tech/pesticides/*
│           ├── amoeba/                  # /api/amoeba/*        + /api/tech/amoeba/*
│           ├── system/                  # /api/sync/ministry   + /api/tech/health
│           └── mall/                    # C 端商城：/api/{products,trace,bookings,orders,health,weather}
├── services/
│   └── ai/                      # AI 智能代理层（Python，独立进程，端口 8100）
│       ├── pyproject.toml · README.md · .env.example
│       ├── app/
│       │   ├── main.py                  # FastAPI 工厂（/api/v1 前缀 + OpenAPI 自动文档 /docs）
│       │   ├── core/config.py           # pydantic-settings（LLM_API_KEY 等全部环境变量注入）
│       │   ├── api/routes/              # health.py · agent.py（chat / tools）
│       │   ├── agents/agronomist.py     # LangChain 智能代理（create_agent + 中文系统提示词）
│       │   ├── tools/platform.py        # 平台 REST 工具：商品/溯源/气象/预约（httpx 调统一后端）
│       │   └── schemas/                 # Pydantic 契约：统一响应包 {success,data,error}
│       └── tests/test_api.py            # pytest：OpenAPI 声明 / 工具注册 / 无密钥 503 / 422
├── docs/                        # 规范 / 需求 / 问卷 / 决策记录
└── scripts/                     # 工具脚本（回归基线、烟测、dev-ai 启动器、问卷生成等）
```

**目标（演进方向）**

```text
apps/admin/src/          # 已按上图 feature 化（views/ 已删除）；shared/ 待有共享 hooks/utils 时再建

apps/technician/         # 技师端 Taro 小程序（🔶 构建与接口接线完成，真机验证待做）

server/src/modules/      # NestJS 业务模块（✅ controller → service → 仓储 三层；数据已落 Prisma 仓储）
└── dashboard/ order/ technician/ qualification/ supply-chain/ amoeba/ system/ mall/

services/ai/             # ✅ AI 智能代理层已建成（Python / FastAPI / LangChain；能力边界见上表）

tests/                   # unit / integration / e2e（工作区各自 tests/）
docs/                    # 0_index / 1_common / 2_pc_* / 9_data_dict / ui/demos
```

**目录级红线**：`services/api.ts` 之外出现 `fetch(` 即违规；`packages/shared` 之外出现领域 `interface` 即违规（局部 Props 除外）；单文件 ≤ 500 行。

**迁移规则**：

- 前端新增业务模块一律放 `apps/admin/src/features/<域>/`
- 后端新增接口一律放 `server/src/modules/<域>/`；`legacy/` 已清空删除
- **后端改结构必须留回归证据**：改前 `capture-api-baseline`，改后 `compare-api-baseline` 必须 0 处不一致；写操作跑 `smoke-mutations`
- 迁移**按模块逐个进行，禁止一次性大搬迁**（本仓库已有一次例外：monorepo 结构重组，属一次性结构变更而非业务迁移）

## 开发注意事项

1. **许可证是命门**：农药经营许可证是准入门槛，一切「谁能接单 / 谁能开方 / 谁能卖药」的判断走服务端
2. **地图定位本期不做，字段要留**：`location` / `gridCode` / `coverageRadius` 只加不改；但**派单界面上的距离与到达时间本期没有真实数据来源，只能以「示意」标注显示，且不得作为派单决策、绩效或结算依据**（经第 3 步确认）
3. **一物一码是监管要求**：溯源节点必须真实产生、可追溯来源，禁止为时间线好看而补造
4. **脱敏无例外**：手机号、身份证、许可证号在界面/截图/日志/测试数据中同样适用
5. **后端数据是种子 Mock（Prisma/SQLite）**：数据可持久但全部来自 `src/database/seed-data/` 的原型假数据（`node dist/database/seed.js` 幂等复位）；任何「验证通过」的结论必须注明「Mock 环境」，不得据此宣布需求完成
6. **空 `catch` 会掩盖线上故障**：新代码必须显式提示错误
7. **超大文件已清理**：admin 四个超标视图（TechnicianManagement 1191 行等）已于 2026-10-04 按 Tab/面板拆入 `features/<域>/`（纯结构性搬移，行为不变，双基线回归 0 不一致）。新增文件仍受 R10 约束
8. **不要随意新增依赖**；新增前先确认它真被引用（本项目已清理 5 个零引用依赖）
9. **设计 token 是唯一样式真源**：新增颜色先加 `@theme` token，再用语义类名
10. **金额与权限的最终裁决在服务端**：前端可即时反馈，但不能作为最终判定依据
11. **不要改动 `vite.config.ts` 的 `DISABLE_HMR` 机制**（为避免编辑期间刷新抖动而设计）
12. **文件统一 UTF-8**；Windows 终端中文乱码是控制台码页问题，**不代表文件有问题**，排障以文件字节为准
13. **业务状态机改动需同步文档与测试用例**（见下方状态机）
14. **AI 编码代理无红线豁免权**：无法满足红线时如实上报失败，禁止放宽校验、跳过测试或伪造输出
15. **不要让管道掩盖命令退出码**：脚本最后一条语句的退出码会顶掉前面 npm 命令的失败（本项目曾因此在 `npm install` 实际失败时误报成功）；用 `exit $code` 或显式断言

### 核心状态机（验收依据）

- **工单**：`pending_dispatch → dispatched → checked_in → prescription_issued → completed`（`currentStep` 1→5），异常分支 `exception`

  > 「已开方」是**结算前置**（第 3 步确认电子处方真实存在且不可跳过），因此 5 步顺序成立，**不得省略第 4 步直接验收**。原型此处的顺序恰好正确。

- **资质审核**：`pending → approved | rejected | revision`；`approved` 后技师才 `dispatchStatus = active`
- **结算**：`pending → cleared`（`processing` 为中间态）

绕过审核直接 `active`、跳过打卡直接开方、或**跳过开方直接验收**，一律判定失败。

## 开发流程

本项目遵循 **CC 全流程指南的 7 步开发法**。指南原文面向 Claude Code，其中称本文件为 `CLAUDE.md`、技能目录为 `.claude/skills/`；本项目实际使用 DSH（DeepSeek Harness），故等价采用 `AGENTS.md` 与 `.dsh/skills/`——**仅命名不同，方法不变**。

1. **环境准备**：技术栈选型 + 创建项目 + 安装依赖 + 编写项目宪法（本文件）
2. **Skill准备**：安装 product-manager、requirement-writer、frontend-design、testai 到 `.dsh/skills/`
3. **需求探讨**：由 agent 扮演产品经理，主动追问需求细节，输出产品定义卡片和信息架构
4. **PRD编写**：采用分文档模式，生成 `docs/0_index.md`、`docs/1_common.md`、`docs/2_pc_*.md`、`docs/9_data_dict.md`
5. **UI风格确定**：生成 3 套 HTML demo 方案，团队投票选定一套，封装为 `ui-design-system` Skill
6. **前端开发**：按 P0→P1 优先级，逐页面开发（每页对照对应的 `2_pc_*.md` PRD 文档）
7. **测试驱动验收**：用 `testai` Skill 做页面体检，获取精准修复 Prompt，一次改对

### 本项目对第 4 / 6 / 7 步的扩写

原 7 步的产出物全在前端，而本项目真正的高风险项（R5 合规、R6 溯源监管、R7 资金、R8 权限）**全落在后端 / 接口层，页面体检无法覆盖**。故在不新增步骤编号的前提下扩写：

- **第 4 步** 扩写为「需求 + **接口契约与数据模型**」：同时冻结 OpenAPI 契约、领域模型、状态迁移表
- **第 6 步** 扩写为「**前后端并行开发**」：后端按已冻结契约实现
- **第 7 步** 扩写验收范围：页面体检之外，追加**接口契约校验、合规路径校验、权限越权校验、资金计算校验**

### 当前进度

| 步骤           | 状态                        | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 环境准备     | ✅ 完成                     | 技术栈已定稿；依赖已安装（并修复 ERESOLVE 冲突）；`lint` / `build` 实测通过；本文件已完成                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2 Skill准备    | ✅ 完成                     | 4 个 Skill 就位于 `.dsh/skills/`（含 frontend-design）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 3 需求探讨     | 🔶 产出完成，**待客户确认** | 已产出四份 v0.1：[字段可信度审计](docs/requirements/field-audit.md)、[产品定义卡片](docs/requirements/product-card.md)、[阿米巴分红制度建议](docs/requirements/amoeba-policy.md)、[信息架构](docs/requirements/information-architecture.md)。**但其中的「确认」均来自开发方判断，客户尚未确认**；已整理[分层提问计划](docs/requirements/discovery-questions.md)（**按需求深度分层：第一层「需求本质」7 题，附微信话术；上一层不确认不问下一层**）；65 题[客户确认问卷](docs/requirements/client-confirmation-questionnaire.md) 已降级为内部备查。**第一层答复到位前，第 4 步 PRD 不得定稿。** |
| 4 PRD编写      | ⬜ 未开始                   | 待产出 `docs/0_index.md` 等分文档                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 5 UI风格确定   | ⬜ 未开始                   | 待产出 3 套 HTML demo 并投票                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 6 前端开发     | 🔶 顺序倒置                 | 已有 6 个模块界面 + C 端商城界面（`apps/mall`），且 admin 已完成 feature 化拆分；但**先于第 3–5 步产出**，无可对照的 `2_pc_*.md`                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 7 测试驱动验收 | 🔶 部分到位                 | 已接入：ESLint + Prettier、`services/ai` pytest 契约测试、接口层回归基线 + smoke 脚本；Vitest / Playwright 仍未接入，页面体检未开始                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

### 仓库合并记录（2026-10）

按「技师端并入本项目、后端统一」的决策完成第一阶段：

| 项             | 结果                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 仓库结构       | 单包 → **npm workspaces monorepo**（`apps/admin` + `packages/shared` + `server`）                                                                       |
| 企业后台前端   | 原根目录 `src/` 整体 `git mv` 到 `apps/admin/`，**lint / build 实测通过**                                                                               |
| 类型真源       | 抽出 `packages/shared`（`@hnhall/shared`），admin 的 8 处引用已改，**纯类型、运行期零开销**                                                             |
| 后端统一       | 新建 `server/`（NestJS），**两套旧 Mock 合并进同一个进程**：后台 16 条（来自本仓库原 `server.ts`）+ 技师端 16 条（来自 `E:\repo\technicalend\server\`） |
| 端到端验证     | **32 条路由**：迁移后 GET 15/15 逐字节一致、写操作与错误形状 26 项断言全过、路由表逐条对账无缺失无多余                                                  |
| legacy 清理    | `server/src/legacy/` 已删除；32 条路由全部落进 `server/src/modules/*`                                                                                   |
| 原 `server.ts` | 已删除（内容完整迁入，删前逐端点抽查确认）                                                                                                              |

**技师端前端未并入**：决策为改用 Taro 微信小程序，原 H5 版（17 个组件）留在 `E:\repo\technicalend` 作**移植参照**，不作为代码并入——并入即为死代码。

### C 端商城并入记录（2026-10-04）

按「C 端 H5（农资自营商城与防伪溯源）并入本项目、后端继续统一」完成第二阶段：

| 项         | 结果                                                                                                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 前端       | `E:\repo\zymall` 整体迁入 `apps/mall/`（Vite 8 + React 19 H5，端口 5174，`/api` 代理到统一后端）；`@hnhall/mall` workspace，`npm run dev:mall` 启动                                                                                                               |
| 类型真源   | 原型 `src/types.ts` 上收为 `@hnhall/shared` 的 `types/mall-view.ts`；`Product` 因命名过于泛化更名 `MallProduct`，其余（`TraceVerificationResult` / `ServiceBooking` / `CartItem` 等）原名保留；11 处引用改完                                                      |
| 后端       | 9 条路由迁入 `server/src/modules/mall/`（products · trace · bookings · orders · health · weather），仓储 `mall.repository.ts`，数据落 Prisma（4 张 v0 模型：MallProduct / TraceLedgerEntry / ServiceBooking / MallOrder），种子 `seed-data/mall.seed.ts` 逐字迁入 |
| 数据库     | 新增迁移 `20261004064611_mall_view_models`（SQLite 实测通过）；种子幂等可重放                                                                                                                                                                                     |
| 端到端验证 | mall profile **8/8 逐字节一致**（含 `POST /api/trace/verify` 正品码 / 异常码两条确定性用例）；core profile **15/15 一致**（原 32 条路由无回归）；`smoke-mutations` **34 项断言全过、0 失败**；`npm run lint` / `npm run build` 全工作区 exit 0                    |
| 夹具与脚本 | `server/test/api-baseline-mall-{legacy,nestjs}.json` 入库留证；`capture-api-baseline.mjs` 增加 `mall` profile（GET 逐字节 + 确定性 verify POST），`smoke-mutations.mjs` 增加商城 404/400 形状与写操作段                                                           |
| 依赖清理   | `@google/genai` / `motion` / `dotenv` / `esbuild` / `autoprefixer` 零引用**未迁**；`lucide-react` 因商城 15 处真实引用随迁（仅 `apps/mall`，根目录维持零引用结论）                                                                                                |

**并入时的存量缺陷登记（原样保留、代码头已加注、待整改）**：

- `apps/mall/src/services/api.ts` 所有请求失败时**静默降级到本地 Mock**（乐观 fallback、无降级提示）——与「错误处理」规范冲突，整改需先确认产品交互
- `MallProduct.badgeColor` 存的是 **Tailwind 类名**（展示与数据耦合）；种子与响应的手机号未脱敏（如 `138-7589-9921`）；接口金额为「元」浮点（存储层已按 R7 存「分」，mapper 边界还原——与后台域同一登记口径）
- 台账 `queryTime` / 验真 `firstQueryTime` 为展示字符串（非 ISO 8601）；`GET /api/weather` 为静态示意值
- 原型 id（`LED-` / `BK-` / `DD-` + Date.now 尾数）在内存数组里允许重复，落库成主键后不允许——仓储生成「未被占用的最近刻度」，格式与原型一致（见 `mall.repository.ts` 头注释）

**边界说明**：本商城为**官方自营**（面向农户的 C 端售卖 + 扫码验真 + 上门服务预约），与非目标中「农药店批发商商城」（多商家 B2B 入口）**不是同一事物**，后者仍本期不做；「扫码验真」是 C 端查询能力，不在 R6「节点伪造 / 补造」红线范围内，但验真台账**不作为权威溯源记录**（溯源权威在监管链路，代码已注明）。

### 工程化与 AI 层记录（2026-10-04）

同日完成四项架构改进（每项独立验证）：

| 项 | 内容 | 验证证据 |
|---|---|---|
| **admin feature 化** | `views/` 删除；App.tsx → `src/app/`（含 layout/ + Feedback 反馈组件），7 个视图按 Tab/面板拆入 `features/<域>/`（每域 index.tsx + components/）；四个超标大文件（1191/960/953/692 行）全部拆解 | 纯结构性搬移（JSX 逐字搬、状态留容器、props 下传）；重构后 core 基线 15/15、mall 基线 8/8 逐字节一致；R10 全仓达标 |
| **server service 层** | 12 个 controller 全部瘦身：业务逻辑下沉 `*.service.ts`，形成 **controller（HTTP 形状）→ service（业务逻辑）→ 仓储（数据）** 三层；404/400 形状与提示文案原样随逻辑迁移 | 双基线回归 0 不一致 + smoke 34 项断言 0 失败 |
| **ESLint + Prettier** | ESLint 10 flat config（typescript-eslint + react-hooks，格式规则让位 Prettier）；修复 41 处存量问题（未用导入、显式 any → 领域类型、无用赋值）；整仓 Prettier 基线格式化 | `lint:eslint` 0 error（2 个 set-state-in-effect 为有意 warn，见「质量工具」）；tsc 全过 |
| **AI 智能代理层** | 新建 `services/ai`（Python）：FastAPI 标准化 REST（`/api/v1` + OpenAPI 3 + 统一响应包）+ **LangChain 智能代理**——把平台统一后端的 6 个 REST 接口包装成代理工具（商品检索/详情、溯源验真、施药气象、预约查询/创建）；LLM 走 OpenAI 兼容协议（可指向豆包/智谱/通义），**未配置密钥时 chat 返回 503 并如实提示，不做假回答（R4）**；代理系统提示词约束其不做诊断结论、不代替持证农艺师开方（R5） | pytest 5 项契约测试全过（不依赖密钥）；端到端联调：health 报告平台可达、tools 列出 6 工具、工具实调平台接口返回真实种子数据 |

**AI 层边界**：代理只做「查与约」，**不做诊断结论、不承诺疗效、不参与结算**；所有数据必须来自平台工具，查不到如实说。`services/ai` 不在 npm workspaces 内（独立 Python 工具链，用 uv 管理——pip 在 Python 3.14 会静默死循环，勿用）。

### 技师端 Taro 脚手架记录（2026-10-05）

外部会话完成脚手架：Taro 4.3（React 18）+ weapp-tailwindcss，视图自 `E:epo	echnicalend` 移入 `apps/technician/src`；入口 `src/app.tsx` → `pages/index` → 容器 `TechnicianWorkspace.tsx`（已用 `@tarojs/components` 改写），类型经 `src/types.ts` 转出 `@hnhall/shared`。

本会话打通构建链，修复项（按 R2 验收：`npx taro build --type weapp` 成功产出 `dist/`）：

| 修复 | 说明 |
|---|---|
| tsconfig | `moduleResolution: node10` 与 `baseUrl` 已被 TS6/7 移除（AGENTS.md 登记过的坑）→ `bundler`；paths 钉死本工作区 React 18（根提升的是 19，避免 TS2786 ×1010） |
| babel | 补 `babel.config.js`（`babel-preset-taro` + ts）与 babel 7 全家桶（新版 preset 会带进 @babel/core 8，与 Taro 的 peer ^7 冲突） |
| taro-loader | 显式进 devDependencies 并落到根（与被提升的 webpack5-runner 相邻，否则 loader 解析失败） |
| tailwind 提升位 | **根目录 tailwindcss 锚定为 v3**（admin/mall 的 v4 由 npm 嵌进各自工作区）——否则 weapp 工具链 postinstall/构建解析到 v4 崩溃；admin/mall 构建已复验无回归 |
| 配置收敛 | 删除 weapp-tw init 生成的重复 ESM 配置；`postcss.config.cjs` 用字符串键（老版 postcss-load-config 不认函数键） |
| R10/规范 | `PrescriptionBuilderView` 519 行拆出 `PrescriptionBuilderParts`（415+144）；删除孤儿 H5 入口 `main.tsx`；补 `.d.ts` 资源声明与 CJS 配置的 ESLint 语境 |

⚠️ 安装依赖：根目录 `npm install` 现已可全量执行（提升位锚定后 weapp postinstall 不再撞 v4）。

**第二轮（2026-10-05，接口接线与运行期适配）**：`services/api.ts` 重写为 `Taro.request`（小程序无 fetch）并**修正基址 `/api` → `/api/tech`**（原写法会打到企业后台同前缀路由）；签名板改用 Canvas 2d 节点（SelectorQuery + 触摸坐标 + canvasToTempFilePath）；拍照上传改 `Taro.chooseImage`；剪贴板/语音播报等浏览器 API 换 Taro 等价物或诚实降级；扫码弹窗接入 `/pesticides` 与 `/pesticides/:code` 验真（失败回退本地目录并提示）。验收：tsc / eslint / `taro build --type weapp` 全绿。

### 已知遗留（不阻塞当前步骤）

- **最高优先：需求待与客户确认**——第 3 步的四份文档全部建立在开发方判断之上。按 [`discovery-questions.md`](docs/requirements/discovery-questions.md) 的**第一层 7 题**逐层推进（微信沟通、讨论阶段）；第一层答复到位后才进第二层。**客户确认前，第 4 步 PRD 不得定稿。**
- **`apps/technician`（Taro 小程序）待建**：参照 `E:\repo\technicalend` 的 H5 版移植
- **`apps/mall`（C 端）现为 H5 形态**：是否 Taro 小程序化待定；并入时登记的存量缺陷（乐观 fallback、badgeColor、未脱敏手机号等）见「C 端商城并入记录」
- ~~PostgreSQL 未安装~~ → **方案已定**：开发用 **SQLite + Prisma**（`server/prisma/dev.db`，连通性已实测），生产目标 PostgreSQL，**本地不安装 PG**。切 PG 时要改 `provider` → 重跑迁移 → 重新 generate client
- **技师端 H5 版带着已被否定的虚构字段**，移植时必须清理：`ServiceOrder.distanceKm` / `gpsCoords`（无定位能力）、`AmoebaStat.prescriptionDividend` / `teamReferralDividend` / `equityPreDraw`（分红仅来自服务收入）、`incentiveMultiplier`（档位系数待定）
- **技师端 H5 有 1 个文件超红线**：`PrescriptionBuilderView.tsx` 517 行（R10 上限 500）——移植时按功能拆分
- 第 6 步顺序倒置的处置（追认 or 返工）——见 PROJECT-SPEC 待决策项
- 现有 6 个模块中已确认「本期不做」的字段（`fleeStatus` / `fleeStatusText` / `fleeLocation` / `ocrMatchRate` / `identityFaceMatched`）需在进入第 6 步前从界面与 `@hnhall/shared` 中清除（该结论同样待客户确认）
- 阿米巴分红制度建议已产出（[v0.1 待评审](docs/requirements/amoeba-policy.md)）；**客户与财务确认前 R7 结算不得开工**——待确认项见该文档 §9
