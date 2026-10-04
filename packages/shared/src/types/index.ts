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
  mentorshipAllowance: number;
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
  watermarkTime?: string;
  watermarkGps?: string;
  signedAt?: string;
  settlementAmount?: number;
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
  ocrMatchRate: number;
  nationalRegistryVerified: boolean;
  identityFaceMatched: boolean;
  permittedScope: string;
  validPeriod: string;
  assignedAmoebaTeam: string;
  amoebaCoefficient: string;
  auditNotes: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision';
}

export interface SupplyProduct {
  id: string;
  name: string;
  spec: string;
  iconType: 'eco' | 'pest_control' | 'warning' | 'fluid_balance' | 'shield';
  registrationNumber: string;
  registrationNotes: string;
  batchNumber: string;
  manufactureDate: string;
  totalCoded: number;
  totalCodedUnit: string;
  scanCount: number;
  scanCountUnit: string;
  scanProgressPct: number;
  fleeStatus: 'normal' | 'alert';
  fleeStatusText: string;
  fleeLocation?: string;
  prescriptionCommissionRate: number;
  monthlySales: number;
  traceabilityNodes: Array<{
    time: string;
    desc: string;
  }>;
}

export interface AmoebaSettlement {
  id: string;
  partnerCode: string;
  partnerName: string;
  partnerAvatarLetter: string;
  partnerLevel: string;
  teamName: string;
  menteeStatus: string;
  serviceFee: number;
  prescriptionBonus: number;
  mentorshipBonus: number;
  equityDividend: number;
  grossAmount: number;
  taxWithheld: number;
  netPay: number;
  status: 'pending' | 'cleared' | 'processing';
  bankClearedAt?: string;
}

export interface FulfillmentEvent {
  id: string;
  type: 'check_in' | 'prescription' | 'sign_off' | 'dispatch';
  title: string;
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
  settlementBonus?: number;
}
