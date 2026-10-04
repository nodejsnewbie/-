# ADR-0002：apps/technician 类型债处置

- 状态：**提议中**（待开发者签署）
- 日期：2026-10-04
- 决策人：开发者本人
- 关联：[COLLABORATION.md](../COLLABORATION.md) §4 例外登记；`.baton/2026-10-04-monorepo-takeover.md`

## 背景

2026-10-04 接管时发现：`apps/technician`（Taro 技师端，宪法定位"待建"）随 a42d927 并入仓库，但其依赖从未进入 lockfile、代码从未通过类型检查。环境修复（依赖安装 + TypeScript 6 对位）后，`tsc --noEmit` 报 **48 个真实类型错误**（Taro 组件 props 不匹配为主，含隐式 any 与 CSS 副作用导入），导致 R1 门禁整体红灯。

## 选项

1. **修复 48 个错误**——门禁恢复全绿，technician 获得继续开发的类型地基；代价：涉及十余个组件文件的小修，且应用仍在"待建"阶段，存在边修边被上游改动的可能。
2. 暂时移出 npm workspaces——门禁立即全绿；代价：与仓库结构脱节，technician 依赖彻底失管，与宪法目录约定冲突。
3. 维持红灯、按工作区拆分门禁——零成本过渡；代价：红灯长期化会钝化对 R1 的敏感度。

## 结论

（待签署）建议选项 1，但排在客户第一层需求答复之后——当前最高优先是需求确认（`discovery-questions.md` 第一层 7 题）。签署前按选项 3 的拆分口径过渡（见 COLLABORATION.md §4 例外登记）。

## 影响

- 选项 1：R1 门禁恢复权威；需同步更新 AGENTS.md 对 technician 的状态描述。
- 选项 2 / 3：宪法「`npm run lint` 提交前必跑」长期带例外，须在 AGENTS.md 登记直至解除。

## 验证方式

选项 1 的验收 = `npm run lint` 全工作区 exit 0，且本 ADR 状态改为「已采纳」、COLLABORATION.md §4 例外登记解除。
