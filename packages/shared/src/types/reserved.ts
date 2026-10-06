/**
 * 预留能力接口（Reserved Capability）。
 *
 * 背景：本项目有多项「设计上确定要做、但需求尚未与客户确认或对应服务尚未接入」的能力——
 * OCR 证件比对 / 人脸核身（R5，本业务实为纯人工审核）、窜货预警 / 批次熔断（R6，本期不做·二期评估）、
 * 技师端的 GPS 定位距离、开方 / 推荐 / 期权预支分红与档位系数（R7 口径与数值待定稿）。
 *
 * 处理方式（经用户确认）：**不做假实现，也不删字段**——统一「预留接口」：
 * - 后端对这些字段返回 `enabled: false`、`value: null`，前端据此渲染「待接入」占位；
 * - 前端**严禁**用假数值（如编造的 OCR 比对率、窜货状态、GPS 坐标）充当真实数据（红线 R4）；
 * - 需求确认 / 服务接入后，把 `enabled` 置真并回填真实 `value`，前端无需改动即可显示真值。
 *
 * 本文件是**纯类型**（运行期完全擦除，符合 packages/shared 约定）。
 * 「待接入」占位对象的构造放在服务端 mapper（见 `services/server/src/database/reserved.ts`），
 * 不在共享包里放运行期函数，以免破坏「类型真源、零运行期开销」。
 */

/** 能力未接入的原因，用于占位文案与 tooltip，避免界面留下歧义。 */
export type ReservedReason =
  | '需求待客户确认'
  | '能力未接入'
  | '本期不做·二期评估';

export interface ReservedCapability<T = null> {
  /** 该能力是否已接入真实数据源 / 服务。需求确认或接入到位前恒为 `false`。 */
  enabled: boolean;
  /** 已接入时的真实取值；未接入为 `null`（前端显示「待接入」，禁止伪造）。 */
  value: T | null;
  /** UI 展示名（如「OCR 证件比对」「窜货预警」）。 */
  label: string;
  /** 未接入原因（`enabled === false` 时用于说明）。 */
  reason?: ReservedReason;
  /** 补充说明文案，直接展示在占位区（可选）。 */
  note?: string;
}
