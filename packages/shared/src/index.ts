/**
 * 跨端共享的领域类型真源。
 *
 * 单一真源原则（AGENTS.md R3）：
 * 领域类型只在 `packages/shared` 定义，企业后台、技师端、后端统一从 `@hnhall/shared` 引用，
 * 禁止各端各写一份副本。
 *
 * 用法：这些是**类型定义**，导入时务必使用 `import type`，运行期会被完全擦除，
 * 因此 Vite / Taro / Node 都不需要在运行期解析本包。
 *
 * 口径说明（经第 3 步需求探讨确认，**待客户确认**）：
 * - 服务类型枚举共 5 类；工单状态机为 5 步，其中「已开方」是结算前置，不可跳过。
 * - 派单与距离相关的字段：本期无定位能力，界面上的距离/到达时间为**示意值**，不得作为
 *   派单决策、绩效或结算依据。
 */
export type {
  Technician,
  WorkOrder,
  AuditApplication,
  SupplyProduct,
  AmoebaSettlement,
  FulfillmentEvent,
} from './types/index.ts';

/** 预留能力接口（OCR/人脸、窜货熔断、技师分红/定位等「待接入」字段的统一契约）。 */
export type { ReservedCapability, ReservedReason } from './types/reserved.ts';

export type {
  TechnicianProfile,
  PrescriptionDrug,
  FieldEvidencePhoto,
  ServiceOrder,
  AmoebaStat,
  TeamMemberFeed,
  RevenueTransaction,
} from './types/technician-view.ts';

/** C 端（农资自营商城，自 E:\repo\zymall 并入）视图类型。 */
export type {
  MallProduct,
  CartItem,
  SupplyChainStep,
  TraceVerificationResult,
  TraceLedgerEntry,
  ServiceBooking,
  Agronomist,
  MallOrderSubmission,
  WeatherInfo,
} from './types/mall-view.ts';
