import type { ReservedCapability } from './reserved.ts';

/**
 * 技师端视图模型（从 `E:\repo\technicalend` 的 H5 端后端原样迁入）。
 *
 * ⚠️ 这些类型与 `./index.ts` 里的企业后台领域模型（`WorkOrder` / `Technician` /
 * `AmoebaSettlement`）描述的是**同一批业务实体的两个视角**，目前尚未统一。
 *
 * 统一方式已定（见 AGENTS.md）：**以后台领域模型为真源，技师端模型降级为映射层**。
 * 在那之前这里保持原样，不做任何字段增删——迁移只搬结构，不改口径。
 *
 * 曾「被否定/待清理」的字段现按用户 2026-10 决策改为**预留接口**（不删字段、也不做假实现）：
 * - `TechnicianProfile.incentiveMultiplier`：档位系数未定稿 → 预留（enabled=false）
 * - `AmoebaStat.prescriptionDividend` / `teamReferralDividend` / `equityPreDraw`：
 *   分红口径当前定为「仅来自服务收入」，这三项暂不产数 → 预留（待接入）
 * - `ServiceOrder.location` / `gpsCoords`：本期无定位能力 → 预留接口（enabled=false），前端显示
 *   「定位 · 待接入」，不再伪造 `distanceKm` 示意值（注意事项 2 / 2026-10-05 口径：无定位能力时
 *   一律「待接入」，且距离不得作派单决策 / 绩效 / 结算依据）
 * 后端对上述字段统一返回 `enabled:false, value:null`，前端渲染「待接入」，**禁止伪造数值**（R4）。
 */

export interface TechnicianProfile {
  name: string;
  title: string;
  role: string;
  partnerCode: string;
  certId: string;
  station: string;
  pesticideLicense: string;
  rating: number;
  yearsOfService: number;
  isOnline: boolean;
  onlineHoursToday: number;

  groupRank: number;
  groupName: string;
  avatarUrl: string;
  headerProfileUrl: string;
  logoUrl: string;
  /** 档位系数（R7 分档口径待定稿）：预留接口，后端返回 enabled=false，前端「待接入」。 */
  incentiveMultiplier?: ReservedCapability<number>;
}

export interface PrescriptionDrug {
  id: string;
  name: string;
  spec: string;
  priceCents: number;
  qty: number;
  code: string;
  tag: string;
  img: string;
  activeIngredient?: string;
  dosage?: string;
}

export interface FieldEvidencePhoto {
  id: string;
  url: string;
  label: string;
  /** ISO 8601（+08:00）；现场取证照片拍摄时刻 */
  time: string;
  location?: string;
}

export interface ServiceOrder {
  id: string;
  orderNo: string;
  title: string;
  serviceType: string;
  urgencyTag?: string;
  urgencyBg?: string;
  status: 'dispatching' | 'accepted' | 'in_progress' | 'prescribed' | 'completed';
  /**
   * 时间红线：原名 dispatchTimeText 存伪相对串（'5分钟前派发'），现改名为 dispatchedAt、
   * 存 ISO 8601（+08:00）真实派发时刻；「N分钟前派发」由前端 formatRelativeTime 计算。
   */
  dispatchedAt: string;
  distanceKm: number;
  /**
   * 定位能力：本期无 GPS/地图服务 → 预留接口。后端返回 enabled=false，
   * 前端显示「定位待接入」；`distanceKm` 仅为示意值，不得作派单/绩效/结算依据。
   */
  location?: ReservedCapability<{ distanceKm: number }>;
  /** GPS 坐标：无定位能力，预留接口（待接入），禁止伪造坐标。 */
  gpsCoords?: ReservedCapability<string>;
  farmerName: string;
  farmerPhone: string;
  farmerTag: string;
  locationName: string;

  roadCondition: string;
  /**
   * ⚠️ 已知遗留：预约**时间窗**展示串（如 '06-20 09:30-11:30' / '今日 15:00-17:00' / '明日 …'），
   * 语义是「区间」非「时刻」，本期不 ISO 化（见 AGENTS「时间字段红线」已知遗留），接真实排班后结构化。
   */
  scheduledTime: string;
  cropScale: string;
  farmerQuote: string;
  farmerPhotos: {
    label: string;
    url: string;
  }[];
  estimatedFeeCents: number;
  amoebaBonusCents: number;
  bonusPercent: number;
  costBreakdown: {
    item: string;
    amountCents: number;
    note?: string;
  }[];
  fieldEvidencePhotos: FieldEvidencePhoto[];
  diagnosedTargets: string[];
  agronomicAdvice: string;
  prescriptionDrugs: PrescriptionDrug[];
  laborFeeCents: number;
  deliveryNoteId: string;
  farmerSignature?: string;
  /** ISO 8601（+08:00）；农户签字验收时刻（技师端存 new Date().toISOString()） */
  signedAt?: string;
}

export interface AmoebaStat {
  totalMonthIncomeCents: number;
  growthPct: number;
  serviceCommissionCents: number;
  serviceTasksCount: number;

  groupTargetRate: number;
  groupBaseline: number;
  groupTierBonus: string;
  /**
   * 收益分项（R7 口径当前仅「服务净值」分成，以下三项暂不产数 → 预留接口，后端 enabled=false）：
   * 需求与财务确认阿米巴制度后再回填真值。客户确认前不得伪造金额。
   */
  prescriptionDividend?: ReservedCapability<number>;
  teamReferralDividend?: ReservedCapability<number>;
  equityPreDraw?: ReservedCapability<number>;
}

export interface TeamMemberFeed {
  id: string;
  name: string;
  avatar: string;
  /** 动作**动词**展示文案（如 '刚刚完成' / '成功推荐'），非时间戳，不参与 ISO 规范化 */
  action: string;
  target: string;
  points: string;
}

export interface RevenueTransaction {
  id: string;
  title: string;
  sub: string;
  amountCents: number;
  type: 'mixed' | 'prescription' | 'referral' | 'service';
  /**
   * 时间红线：原为伪相对串（'昨天 16:30' / '刚刚'）或裸日期（'06-18'），现改存 ISO 8601
   * （+08:00）真实成交时刻；「今天/昨天 HH:mm」由前端 formatRelativeTime 计算。
   */
  time: string;
}
