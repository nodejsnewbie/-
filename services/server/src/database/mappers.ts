import type {
  AmoebaSettlement as AmoebaSettlementRow,
  AmoebaStat as AmoebaStatRow,
  AuditApplication as AuditApplicationRow,
  FulfillmentEvent as FulfillmentEventRow,
  MallProduct as MallProductRow,
  PesticideCatalogItem as PesticideCatalogItemRow,
  RevenueTransaction as RevenueTransactionRow,
  ServiceBooking as ServiceBookingRow,
  ServiceOrder as ServiceOrderRow,
  ServiceOrderPrescriptionDrug as PrescriptionDrugRow,
  SupplyProduct as SupplyProductRow,
  TeamMemberFeed as TeamMemberFeedRow,
  Technician as TechnicianRow,
  TechnicianProfile as TechnicianProfileRow,
  TraceLedgerEntry as TraceLedgerEntryRow,
  WorkOrder as WorkOrderRow,
} from '@prisma/client';
import type {
  AmoebaSettlement,
  AmoebaStat,
  AuditApplication,
  FulfillmentEvent,
  FieldEvidencePhoto,
  MallProduct,
  PrescriptionDrug,
  RevenueTransaction,
  ServiceBooking,
  ServiceOrder,
  SupplyProduct,
  TeamMemberFeed,
  Technician,
  TechnicianProfile,
  TraceLedgerEntry,
  WorkOrder,
} from '@hnhall/shared';

import { jsonOut } from './json';
import { maskPhone, maskIdCard } from './mask';
import { RESERVED } from './reserved';

/**
 * 数据库行 ↔ 领域/视图模型 的映射层。
 *
 * 存在的唯一理由：**金额在库里是「分」整数（红线 R7），接口契约里是「元」浮点**。
 * 转换只在这一层发生，别处不许再碰。
 *
 * 两条铁律：
 * 1. **`null` → `undefined`**：接口响应必须能区分「字段不存在」与「字段为空」。
 *    `JSON.stringify` 会丢掉 `undefined` 键，所以这一步决定了响应字节形状。
 *    可选字段一律用 `?? undefined`（**不要**用 `||`，会把 `false` / `0` 也吞掉）。
 * 2. **不改口径 / 不伪造**：这里只做 null 归一与预留合成，不补默认值。
 *    **金额一律以库里「分」整数原样出参**（字段名 `*Cents`），不在这里换算成元——
 *    分↔元还原下移到各前端展示层的 `formatCents`，接口契约与存储层同为「分」（R7，已消除响应层浮点违规）。
 *    曾属虚构的能力（OCR/人脸、窜货/熔断、示意距离、分红分项、档位系数）现统一以
 *    `RESERVED` 预留接口合成（`enabled:false, value:null`），前端渲染「待接入」——
 *    绝不在这里造假数值（红线 R4）。接入后改用 `RESERVED` 对应的 `ready` 分支即可。
 */

// ════════════════════════════════════════════════════════════════════════════
//  企业后台
// ════════════════════════════════════════════════════════════════════════════

export function toTechnician(row: TechnicianRow): Technician {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    title: row.title,
    phone: maskPhone(row.phone),
    avatar: row.avatar,
    licenseNumber: row.licenseNumber,
    licenseThumb: row.licenseThumb,
    licenseAuthority: row.licenseAuthority,
    licenseExpiry: row.licenseExpiry,
    licenseStatus: row.licenseStatus as Technician['licenseStatus'],
    licenseExpiryDays: row.licenseExpiryDays ?? undefined,
    amoebaTier: row.amoebaTier as Technician['amoebaTier'],
    amoebaTierName: row.amoebaTierName,
    amoebaCoefficient: row.amoebaCoefficient,
    teamName: row.teamName,
    commissionRatio: row.commissionRatio,
    menteeCount: row.menteeCount,
    independentMentees: row.independentMentees,
    teamMonthlyOutput: row.teamMonthlyOutput,
    mentorshipAllowanceCents: row.mentorshipAllowanceCents,
    gridName: row.gridName,
    coverageRadius: row.coverageRadius,
    boundEquipment: row.boundEquipment,
    completedOrders: row.completedOrders,
    operationAcreage: row.operationAcreage,
    rating: row.rating,
    reviewCount: row.reviewCount,
    goodReviewRate: row.goodReviewRate,
    dispatchStatus: row.dispatchStatus as Technician['dispatchStatus'],
    dispatchStatusText: row.dispatchStatusText,
  };
}

export function toWorkOrder(row: WorkOrderRow): WorkOrder {
  return {
    id: row.id,
    farmerName: row.farmerName,
    coopName: row.coopName ?? undefined,
    phone: maskPhone(row.phone),
    location: row.location,
    gridCode: row.gridCode,
    crop: row.crop,
    acreage: row.acreage,
    cropStage: row.cropStage,
    symptom: row.symptom,
    serviceCategory: row.serviceCategory as WorkOrder['serviceCategory'],
    serviceCategoryText: row.serviceCategoryText,
    urgency: row.urgency as WorkOrder['urgency'],
    urgencyText: row.urgencyText,
    specialSubsidy: row.specialSubsidy ?? undefined,
    reportedTime: row.reportedTime,
    waitingMinutes: row.waitingMinutes,
    requestedAction: row.requestedAction,
    status: row.status as WorkOrder['status'],
    statusText: row.statusText,
    currentStep: row.currentStep,
    // 只有派过工的工单才有 assignedTechnician；没派工就整个字段不存在
    assignedTechnician:
      row.assignedTechnicianId === null
        ? undefined
        : {
            id: row.assignedTechnicianId,
            name: row.assignedTechnicianName ?? '',
            phone: maskPhone(row.assignedTechnicianPhone) ?? '',
            title: row.assignedTechnicianTitle ?? '',
            avatar: row.assignedTechnicianAvatar ?? '',
            distanceKm: row.assignedTechnicianDistanceKm ?? 0,
            estimatedArrivalMin: row.assignedTechnicianEtaMin ?? 0,
            matchScore: row.assignedTechnicianMatchScore ?? 0,
          },
    matchedCandidates:
      row.matchedCandidates === null
        ? undefined
        : jsonOut<WorkOrder['matchedCandidates']>(row.matchedCandidates)?.map((c) => ({
            ...c,
            phone: maskPhone(c.phone) ?? c.phone,
          })),
    prescriptionCode: row.prescriptionCode ?? undefined,
    prescriptionContent: row.prescriptionContent ?? undefined,
    watermarkVerified: row.watermarkVerified ?? undefined,
    watermarkTime: row.watermarkTime ?? undefined,
    watermarkGps: row.watermarkGps ?? undefined,
    signedAt: row.signedAt ?? undefined,
    settlementAmountCents: row.settlementAmountCents ?? undefined,
  };
}

export function toAuditApplication(row: AuditApplicationRow): AuditApplication {
  return {
    id: row.id,
    code: row.code,
    applicantName: row.applicantName,
    applicantType: row.applicantType,
    idCard: maskIdCard(row.idCard),
    phone: maskPhone(row.phone),
    avatar: row.avatar,
    targetGrid: row.targetGrid,
    urgent: row.urgent,
    licenseNumber: row.licenseNumber,
    licenseScanUrl: row.licenseScanUrl,
    licenseAuthority: row.licenseAuthority,
    nationalRegistryVerified: row.nationalRegistryVerified,
    permittedScope: row.permittedScope,
    validPeriod: row.validPeriod,
    assignedAmoebaTeam: row.assignedAmoebaTeam,
    amoebaCoefficient: row.amoebaCoefficient,
    auditNotes: row.auditNotes,
    status: row.status as AuditApplication['status'],
    // R5：本业务为纯人工审核，OCR / 人脸核身未实现 → 预留接口（前端「待接入」，不造假）。
    ocrVerification: RESERVED.ocr(),
    faceVerification: RESERVED.face(),
  };
}

export function toSupplyProduct(row: SupplyProductRow): SupplyProduct {
  return {
    id: row.id,
    name: row.name,
    spec: row.spec,
    iconType: row.iconType as SupplyProduct['iconType'],
    registrationNumber: row.registrationNumber,
    registrationNotes: row.registrationNotes,
    batchNumber: row.batchNumber,
    manufactureDate: row.manufactureDate,
    totalCoded: row.totalCoded,
    totalCodedUnit: row.totalCodedUnit,
    scanCount: row.scanCount,
    scanCountUnit: row.scanCountUnit,
    scanProgressPct: row.scanProgressPct,

    prescriptionCommissionRate: row.prescriptionCommissionRate,
    monthlySales: row.monthlySales,
    traceabilityNodes: jsonOut<SupplyProduct['traceabilityNodes']>(row.traceabilityNodes),
    // R6：窜货预警 / 批次熔断本期不做 → 预留接口（前端渲染「待接入」，不伪造窜货状态）。
    fleeMonitoring: RESERVED.flee(),
    batchFreeze: RESERVED.batchFreeze(),
  };
}

export function toAmoebaSettlement(row: AmoebaSettlementRow): AmoebaSettlement {
  return {
    id: row.id,
    partnerCode: row.partnerCode,
    partnerName: row.partnerName,
    partnerAvatarLetter: row.partnerAvatarLetter,
    partnerLevel: row.partnerLevel,
    teamName: row.teamName,
    menteeStatus: row.menteeStatus,
    serviceFeeCents: row.serviceFeeCents,
    prescriptionBonusCents: row.prescriptionBonusCents,
    mentorshipBonusCents: row.mentorshipBonusCents,
    equityDividendCents: row.equityDividendCents,
    grossAmountCents: row.grossAmountCents,
    taxWithheldCents: row.taxWithheldCents,
    netPayCents: row.netPayCents,
    status: row.status as AmoebaSettlement['status'],
    bankClearedAt: row.bankClearedAt ?? undefined,
  };
}

export function toFulfillmentEvent(row: FulfillmentEventRow): FulfillmentEvent {
  return {
    id: row.id,
    type: row.type as FulfillmentEvent['type'],
    title: row.title,
    timestamp: row.timestamp,
    summary: row.summary,
    technicianName: row.technicianName,
    location: row.location,
    gps: row.gps ?? undefined,
    droneModel: row.droneModel ?? undefined,
    photoUrl: row.photoUrl ?? undefined,
    qrTraceCode: row.qrTraceCode ?? undefined,
    batchCode: row.batchCode ?? undefined,
    rating: row.rating ?? undefined,
    settlementBonusCents: row.settlementBonusCents ?? undefined,
  };
}

// ════════════════════════════════════════════════════════════════════════════
//  技师端
// ════════════════════════════════════════════════════════════════════════════

export function toTechnicianProfile(row: TechnicianProfileRow): TechnicianProfile {
  return {
    name: row.name,
    title: row.title,
    role: row.role,
    partnerCode: row.partnerCode,
    certId: row.certId,
    station: row.station,
    pesticideLicense: row.pesticideLicense,
    rating: row.rating,
    yearsOfService: row.yearsOfService,
    isOnline: row.isOnline,
    onlineHoursToday: row.onlineHoursToday,

    groupRank: row.groupRank,
    groupName: row.groupName,
    avatarUrl: row.avatarUrl,
    headerProfileUrl: row.headerProfileUrl,
    logoUrl: row.logoUrl,
    // R7：档位系数未定稿 → 预留接口（前端「待接入」）。
    incentiveMultiplier: RESERVED.incentiveMultiplier(),
  };
}

export function toPrescriptionDrug(row: PrescriptionDrugRow): PrescriptionDrug {
  return {
    id: row.drugId,
    name: row.name,
    spec: row.spec,
    priceCents: row.priceCents,
    qty: row.qty,
    code: row.code,
    tag: row.tag,
    img: row.img,
    activeIngredient: row.activeIngredient ?? undefined,
    dosage: row.dosage ?? undefined,
  };
}

export function toServiceOrder(
  row: ServiceOrderRow & { prescriptionDrugs?: PrescriptionDrugRow[] },
): ServiceOrder {
  return {
    id: row.id,
    orderNo: row.orderNo,
    title: row.title,
    serviceType: row.serviceType,
    urgencyTag: row.urgencyTag ?? undefined,
    urgencyBg: row.urgencyBg ?? undefined,
    status: row.status as ServiceOrder['status'],
    dispatchedAt: row.dispatchedAt,
    distanceKm: row.distanceKm,
    // 本期无定位能力 → 预留接口（前端「待接入」）；distanceKm 不得作派单/绩效/结算依据。
    location: RESERVED.location(),
    gpsCoords: RESERVED.gpsCoords(),
    farmerName: row.farmerName,
    farmerPhone: maskPhone(row.farmerPhone),
    farmerTag: row.farmerTag,
    locationName: row.locationName,

    roadCondition: row.roadCondition,
    scheduledTime: row.scheduledTime,
    cropScale: row.cropScale,
    farmerQuote: row.farmerQuote,
    farmerPhotos: jsonOut<ServiceOrder['farmerPhotos']>(row.farmerPhotos),
    estimatedFeeCents: row.estimatedFeeCents,
    amoebaBonusCents: row.amoebaBonusCents,
    bonusPercent: row.bonusPercent,
    // 成本明细 Json 直接存「分」（amountCents），与领域类型同形，无需换算（R7）。
    costBreakdown: jsonOut<ServiceOrder['costBreakdown']>(row.costBreakdown),
    fieldEvidencePhotos: jsonOut<FieldEvidencePhoto[]>(row.fieldEvidencePhotos),
    diagnosedTargets: jsonOut<string[]>(row.diagnosedTargets),
    agronomicAdvice: row.agronomicAdvice,
    prescriptionDrugs: (row.prescriptionDrugs ?? []).map(toPrescriptionDrug),
    laborFeeCents: row.laborFeeCents,
    deliveryNoteId: row.deliveryNoteId,
    farmerSignature: row.farmerSignature ?? undefined,
    signedAt: row.signedAt ?? undefined,
  };
}

export function toPesticideCatalogItem(row: PesticideCatalogItemRow): PrescriptionDrug {
  return {
    id: row.id,
    name: row.name,
    spec: row.spec,
    priceCents: row.priceCents,
    qty: row.qty,
    code: row.code,
    tag: row.tag,
    img: row.img,
    activeIngredient: row.activeIngredient ?? undefined,
    dosage: row.dosage ?? undefined,
  };
}

export function toAmoebaStat(row: AmoebaStatRow): AmoebaStat {
  return {
    totalMonthIncomeCents: row.totalMonthIncomeCents,
    growthPct: row.growthPct,
    serviceCommissionCents: row.serviceCommissionCents,
    serviceTasksCount: row.serviceTasksCount,

    groupTargetRate: row.groupTargetRate,
    groupBaseline: row.groupBaseline,
    groupTierBonus: row.groupTierBonus,
    // R7：当前口径仅「服务净值」分成，以下三项预留/待接入（前端「待接入」，不造假金额）。
    prescriptionDividend: RESERVED.prescriptionDividend(),
    teamReferralDividend: RESERVED.teamReferralDividend(),
    equityPreDraw: RESERVED.equityPreDraw(),
  };
}

export function toTeamMemberFeed(row: TeamMemberFeedRow): TeamMemberFeed {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    action: row.action,
    target: row.target,
    points: row.points,
  };
}

export function toRevenueTransaction(row: RevenueTransactionRow): RevenueTransaction {
  return {
    id: row.id,
    title: row.title,
    sub: row.sub,
    amountCents: row.amountCents,
    type: row.type as RevenueTransaction['type'],
    time: row.time,
  };
}

// ════════════════════════════════════════════════════════════════════════════
//  C 端 · 农资自营商城（自 E:\repo\zymall 并入）
// ════════════════════════════════════════════════════════════════════════════

/**
 * 商城域映射。⚠️ 字段顺序不是风格问题：Express 原型直接序列化对象字面量，
 * 响应字节形状 = 字面量的键序。mapper 按**原型字面量的键序**重建对象，
 * 可选字段为 null 时必须缺席（`?? undefined`），否则字节级回归比对会挂。
 */

export function toMallProduct(row: MallProductRow): MallProduct {
  return {
    id: row.id,
    name: row.name,
    spec: row.spec,
    category: row.category,
    badge: row.badge ?? undefined,
    tags: jsonOut<string[]>(row.tags),
    // ⚠️ highlightText 的键序不是随意的：原型对象字面量里它紧跟 tags（与类型声明顺序不同），
    // 响应字节形状 = 字面量键序，位置放错会被逐字节比对抓出来（已踩过）。
    highlightText: row.highlightText ?? undefined,
    licenseNo: row.licenseNo,
    batchNo: row.batchNo,
    priceCents: row.priceCents,
    originalPriceCents: row.originalPriceCents ?? undefined,
    soldCount: row.soldCount,
    image: row.image,
    traceCode: row.traceCode,
    activeIngredient: row.activeIngredient,
    toxicity: row.toxicity,
    formulation: row.formulation,
    targetDisease: row.targetDisease,
    dosagePerMu: row.dosagePerMu,
    waterPerMu: row.waterPerMu,
    safeInterval: row.safeInterval,
    manufacturer: row.manufacturer,
    isOfficialDirect: row.isOfficialDirect,
    canBookService: row.canBookService,
  };
}

export function toTraceLedgerEntry(row: TraceLedgerEntryRow): TraceLedgerEntry {
  return {
    id: row.id,
    code: row.code,
    productName: row.productName,
    batchNo: row.batchNo,
    licenseNo: row.licenseNo,
    queryTime: row.queryTime,
    status: row.status as TraceLedgerEntry['status'],
    station: row.station,
  };
}

export function toServiceBooking(row: ServiceBookingRow): ServiceBooking {
  return {
    id: row.id,
    serviceType: row.serviceType as ServiceBooking['serviceType'],
    cropType: row.cropType,
    acreage: row.acreage,
    preferredDate: row.preferredDate,
    timeSlot: row.timeSlot,
    station: row.station,
    contactName: row.contactName,
    contactPhone: maskPhone(row.contactPhone),
    plotAddress: row.plotAddress,
    associatedProducts: jsonOut<string[]>(row.associatedProducts),
    notes: row.notes ?? undefined,
    status: row.status as ServiceBooking['status'],
    assignedAgronomist: row.agronomistName
      ? {
          name: row.agronomistName,
          certId: row.agronomistCertId ?? '',
          phone: maskPhone(row.agronomistPhone) ?? '',
          title: row.agronomistTitle ?? '',
        }
      : undefined,
  };
}
