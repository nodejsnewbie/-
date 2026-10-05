/**
 * 技师端视图模型（从 `E:\repo\technicalend` 的 H5 端后端原样迁入）。
 *
 * ⚠️ 这些类型与 `./index.ts` 里的企业后台领域模型（`WorkOrder` / `Technician` /
 * `AmoebaSettlement`）描述的是**同一批业务实体的两个视角**，目前尚未统一。
 *
 * 统一方式已定（见 AGENTS.md）：**以后台领域模型为真源，技师端模型降级为映射层**。
 * 在那之前这里保持原样，不做任何字段增删——迁移只搬结构，不改口径。
 *
 * 已知待清理字段（等客户确认需求后处理，勿在迁移中顺手删掉）：
 * - `AmoebaStat.prescriptionDividend` / `teamReferralDividend` / `equityPreDraw`：
 *   分红口径已定为「仅来自服务收入」，这三项被否定，已从类型与界面移除
 * - `TechnicianProfile.incentiveMultiplier`：档位系数尚未定稿，已从类型与界面移除
 * - `ServiceOrder.gpsCoords`：无定位能力，已从类型与界面移除；
 *   `distanceKm` 保留（注意事项 2：无定位能力，界面只能以「示意」标注显示，不得作派单决策/绩效/结算依据）
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
}

export interface PrescriptionDrug {
  id: string;
  name: string;
  spec: string;
  price: number;
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
  dispatchTimeText: string;
  distanceKm: number;
  farmerName: string;
  farmerPhone: string;
  farmerTag: string;
  locationName: string;

  roadCondition: string;
  scheduledTime: string;
  cropScale: string;
  farmerQuote: string;
  farmerPhotos: {
    label: string;
    url: string;
  }[];
  estimatedFee: number;
  amoebaBonus: number;
  bonusPercent: number;
  costBreakdown: {
    item: string;
    amount: number;
    note?: string;
  }[];
  fieldEvidencePhotos: FieldEvidencePhoto[];
  diagnosedTargets: string[];
  agronomicAdvice: string;
  prescriptionDrugs: PrescriptionDrug[];
  laborFee: number;
  deliveryNoteId: string;
  farmerSignature?: string;
  signedAt?: string;
}

export interface AmoebaStat {
  totalMonthIncome: number;
  growthPct: number;
  serviceCommission: number;
  serviceTasksCount: number;

  groupTargetRate: number;
  groupBaseline: number;
  groupTierBonus: string;
}

export interface TeamMemberFeed {
  id: string;
  name: string;
  avatar: string;
  action: string;
  target: string;
  points: string;
}

export interface RevenueTransaction {
  id: string;
  title: string;
  sub: string;
  amount: number;
  type: 'mixed' | 'prescription' | 'referral' | 'service';
  time: string;
}
