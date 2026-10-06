import type { ReservedCapability } from './reserved.ts';

export interface Technician {
  id: string;
  code: string;
  name: string;
  title: string;
  phone: string;
  avatar: string;
  licenseNumber: string;
  licenseThumb: string;
  licenseAuthority: string;
  licenseExpiry: string;
  licenseStatus: 'normal' | 'expiring' | 'pending_review' | 'expired';
  licenseExpiryDays?: number;
  amoebaTier: 'diamond' | 'gold' | 'silver' | 'trainee';
  amoebaTierName: string;
  amoebaCoefficient: number;
  teamName: string;
  commissionRatio: string;
  menteeCount: number;
  independentMentees: number;
  teamMonthlyOutput: number;
  mentorshipAllowanceCents: number;
  gridName: string;
  coverageRadius: number;
  boundEquipment: string;
  completedOrders: number;
  operationAcreage: number;
  rating: number;
  reviewCount: number;
  goodReviewRate: number;
  dispatchStatus: 'active' | 'need_annual_review' | 'pending_qualification' | 'busy' | 'locked';
  dispatchStatusText: string;
}

export interface WorkOrder {
  id: string;
  farmerName: string;
  coopName?: string;
  phone: string;
  location: string;
  gridCode: string;
  crop: string;
  acreage: number;
  cropStage: string;
  symptom: string;
  serviceCategory: 'diagnosis' | 'drone' | 'machinery' | 'soil';
  serviceCategoryText: string;
  urgency: 'critical' | 'high' | 'normal';
  urgencyText: string;
  specialSubsidy?: string;
  /** 时间红线：ISO 8601（含 +08:00 偏移），如 '2024-10-28T09:12:40+08:00'；展示层本地化 */
  reportedTime: string;
  waitingMinutes: number;
  requestedAction: string;
  status:
    | 'pending_dispatch'
    | 'dispatched'
    | 'checked_in'
    | 'prescription_issued'
    | 'completed'
    | 'exception';
  statusText: string;
  currentStep: number; // 1 to 5
  assignedTechnician?: {
    id: string;
    name: string;
    phone: string;
    title: string;
    avatar: string;
    distanceKm: number;
    estimatedArrivalMin: number;
    matchScore: number;
  };
  matchedCandidates?: Array<{
    id: string;
    name: string;
    phone: string;
    title: string;
    avatar: string;
    distanceKm: number;
    estimatedArrivalMin: number;
    matchScore: number;
    dailyLoad: number;
    maxDailyLoad: number;
    rating: number;
    jobCount: number;
    expertiseTag: string;
    statusText: string;
    isPrimary?: boolean;
    licenseVerified: string;
  }>;
  prescriptionCode?: string;
  prescriptionContent?: string;
  watermarkVerified?: boolean;
  /** ISO 8601（+08:00）；水印照片拍摄时刻 */
  watermarkTime?: string;
  watermarkGps?: string;
  /** ISO 8601（+08:00）；农户签字验收时刻 */
  signedAt?: string;
  settlementAmountCents?: number;
}

export interface AuditApplication {
  id: string;
  code: string;
  applicantName: string;
  applicantType: string;
  idCard: string;
  phone: string;
  avatar: string;
  targetGrid: string;
  urgent: boolean;
  licenseNumber: string;
  licenseScanUrl: string;
  licenseAuthority: string;
  nationalRegistryVerified: boolean;
  permittedScope: string;
  validPeriod: string;
  assignedAmoebaTeam: string;
  amoebaCoefficient: string;
  auditNotes: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  /**
   * R5：本业务为**纯人工审核**（审核员肉眼核对证件），OCR 比对**未实现、预留接口**。
   * 后端返回 `enabled: false`，前端显示「待接入」，禁止伪造比对率。
   */
  ocrVerification?: ReservedCapability;
  /** 人脸核身：同样未实现、预留接口（待接入）。 */
  faceVerification?: ReservedCapability;
}

export interface SupplyProduct {
  id: string;
  name: string;
  spec: string;
  iconType: 'eco' | 'pest_control' | 'warning' | 'fluid_balance' | 'shield';
  registrationNumber: string;
  registrationNotes: string;
  batchNumber: string;
  /**
   * ⚠️ 已知遗留：带装饰后缀的原型展示串（如 '2024-03-15 出厂'），非纯 ISO 日期。
   * 本期不规范化（见 AGENTS「时间字段红线」已知遗留），接真实溯源数据时替换。
   */
  manufactureDate: string;
  totalCoded: number;
  totalCodedUnit: string;
  scanCount: number;
  scanCountUnit: string;
  scanProgressPct: number;

  prescriptionCommissionRate: number;
  monthlySales: number;
  traceabilityNodes: Array<{
    /** ISO 8601（+08:00）；溯源节点发生时刻 */
    time: string;
    desc: string;
  }>;
  /**
   * R6：「窜货预警」本期不做、二期评估——**做 UI、预留接口**，后端返回 `enabled: false`，
   * 前端显示「待接入」，禁止伪造窜货状态/拦截次数（原被移除的 fleeStatus/fleeLocation 以占位形式回归）。
   */
  fleeMonitoring?: ReservedCapability<{ statusText: string }>;
  /** 「批次熔断 / 冻结」：本期不做，预留接口（待接入）。 */
  batchFreeze?: ReservedCapability<{ statusText: string }>;
}

export interface AmoebaSettlement {
  id: string;
  partnerCode: string;
  partnerName: string;
  partnerAvatarLetter: string;
  partnerLevel: string;
  teamName: string;
  menteeStatus: string;
  // 金额一律「分」整数（R7）；展示层用 formatCents 还原为「元」。
  serviceFeeCents: number;
  prescriptionBonusCents: number;
  mentorshipBonusCents: number;
  equityDividendCents: number;
  grossAmountCents: number;
  taxWithheldCents: number;
  netPayCents: number;
  status: 'pending' | 'cleared' | 'processing';
  /** ISO 8601（+08:00）；银行出账到账时刻 */
  bankClearedAt?: string;
}

export interface FulfillmentEvent {
  id: string;
  type: 'check_in' | 'prescription' | 'sign_off' | 'dispatch';
  title: string;
  /**
   * 时间红线：原为伪相对串（'2分钟前' / '刚刚'），现改存 ISO 8601（+08:00）真实时刻；
   * 「N分钟前」由前端展示层 formatRelativeTime 依据当前时间计算，禁止入库/出参存相对串。
   */
  timestamp: string;
  summary: string;
  technicianName: string;
  location: string;
  gps?: string;
  droneModel?: string;
  photoUrl?: string;
  qrTraceCode?: string;
  batchCode?: string;
  rating?: number;
  settlementBonusCents?: number;
}
