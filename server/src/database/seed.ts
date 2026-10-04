import { PrismaClient } from '@prisma/client';

import { jsonIn } from './json';
import { AdminSeed } from './seed-data/admin.seed';
import { AdminOpsSeed } from './seed-data/admin-operations.seed';
import { TechnicianSeed } from './seed-data/technician.seed';

/**
 * 用原型数据播种数据库（幂等：每次先清空再写入）。
 *
 * ⚠️ 这是**让接口响应可验证**的过渡手段，不是真实数据导入。
 *    真实数据接入后，本文件与 `seed-data/` 都会删掉。
 *
 * 约定：
 * - 金额在种子数据里是**元（浮点）**，入库统一转「分」整数（红线 R7）
 * - 列表顺序用 `orderKey` 显式保序（原型有 unshift 前插语义，必须可确定性复现）
 * - `undefined` 的可选字段一律写 `null`，读取时再还原成 `undefined`，
 *   这样「字段不存在」与「字段为空」在响应里能精确区分（字节级回归需要）
 */

const prisma = new PrismaClient();

/** 元 → 分。必填字段用，缺值直接报错而不是静默写 0（静默会把数据问题藏起来）。 */
function cents(value: number | undefined | null, label: string): number {
  if (value === undefined || value === null) {
    throw new Error(`[seed] 必填金额缺失: ${label}`);
  }
  return Math.round(value * 100);
}

/** 元 → 分。可选字段用。 */
function centsOpt(value: number | undefined | null): number | null {
  return value === undefined || value === null ? null : Math.round(value * 100);
}

/**
 * 写 Json 列的显式转换，统一放在 `database/json.ts`（带完整说明）。
 * 这里只是把本地名 `json` 映射过去，保持调用点简洁。
 */
const json = jsonIn;

async function main(): Promise<void> {
  const admin = new AdminSeed();
  const tech = new TechnicianSeed();
  const ops = new AdminOpsSeed();

  // ---- 幂等：清空（有外键的先删子表）----
  await prisma.serviceOrderPrescriptionDrug.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.auditApplication.deleteMany();
  await prisma.supplyProduct.deleteMany();
  await prisma.amoebaSettlement.deleteMany();
  await prisma.fulfillmentEvent.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.pesticideCatalogItem.deleteMany();
  await prisma.amoebaStat.deleteMany();
  await prisma.teamMemberFeed.deleteMany();
  await prisma.revenueTransaction.deleteMany();

  // ════════════════════════ 企业后台 ════════════════════════

  for (const [i, t] of admin.technicians.entries()) {
    await prisma.technician.create({
      data: {
        id: t.id,
        orderKey: i,
        code: t.code,
        name: t.name,
        title: t.title,
        phone: t.phone,
        avatar: t.avatar,
        licenseNumber: t.licenseNumber,
        licenseThumb: t.licenseThumb,
        licenseAuthority: t.licenseAuthority,
        licenseExpiry: t.licenseExpiry,
        licenseStatus: t.licenseStatus,
        licenseExpiryDays: t.licenseExpiryDays ?? null,
        amoebaTier: t.amoebaTier,
        amoebaTierName: t.amoebaTierName,
        amoebaCoefficient: t.amoebaCoefficient,
        teamName: t.teamName,
        commissionRatio: t.commissionRatio,
        menteeCount: t.menteeCount,
        independentMentees: t.independentMentees,
        teamMonthlyOutput: t.teamMonthlyOutput,
        mentorshipAllowanceCents: cents(
          t.mentorshipAllowance,
          `Technician.${t.id}.mentorshipAllowance`,
        ),
        gridName: t.gridName,
        coverageRadius: t.coverageRadius,
        boundEquipment: t.boundEquipment,
        completedOrders: t.completedOrders,
        operationAcreage: t.operationAcreage,
        rating: t.rating,
        reviewCount: t.reviewCount,
        goodReviewRate: t.goodReviewRate,
        dispatchStatus: t.dispatchStatus,
        dispatchStatusText: t.dispatchStatusText,
      },
    });
  }

  for (const [i, a] of admin.pendingAudits.entries()) {
    await prisma.auditApplication.create({
      data: {
        id: a.id,
        orderKey: i,
        code: a.code,
        applicantName: a.applicantName,
        applicantType: a.applicantType,
        idCard: a.idCard,
        phone: a.phone,
        avatar: a.avatar,
        targetGrid: a.targetGrid,
        urgent: a.urgent,
        licenseNumber: a.licenseNumber,
        licenseScanUrl: a.licenseScanUrl,
        licenseAuthority: a.licenseAuthority,
        ocrMatchRate: a.ocrMatchRate,
        nationalRegistryVerified: a.nationalRegistryVerified,
        identityFaceMatched: a.identityFaceMatched,
        permittedScope: a.permittedScope,
        validPeriod: a.validPeriod,
        assignedAmoebaTeam: a.assignedAmoebaTeam,
        amoebaCoefficient: a.amoebaCoefficient,
        auditNotes: a.auditNotes,
        status: a.status,
      },
    });
  }

  for (const [i, o] of ops.workOrders.entries()) {
    const at = o.assignedTechnician;
    await prisma.workOrder.create({
      data: {
        id: o.id,
        orderKey: i,
        farmerName: o.farmerName,
        coopName: o.coopName ?? null,
        phone: o.phone,
        location: o.location,
        gridCode: o.gridCode,
        crop: o.crop,
        acreage: o.acreage,
        cropStage: o.cropStage,
        symptom: o.symptom,
        serviceCategory: o.serviceCategory,
        serviceCategoryText: o.serviceCategoryText,
        urgency: o.urgency,
        urgencyText: o.urgencyText,
        specialSubsidy: o.specialSubsidy ?? null,
        reportedTime: o.reportedTime,
        waitingMinutes: o.waitingMinutes,
        requestedAction: o.requestedAction,
        status: o.status,
        statusText: o.statusText,
        currentStep: o.currentStep,
        assignedTechnicianId: at?.id ?? null,
        assignedTechnicianName: at?.name ?? null,
        assignedTechnicianPhone: at?.phone ?? null,
        assignedTechnicianTitle: at?.title ?? null,
        assignedTechnicianAvatar: at?.avatar ?? null,
        assignedTechnicianDistanceKm: at?.distanceKm ?? null,
        assignedTechnicianEtaMin: at?.estimatedArrivalMin ?? null,
        assignedTechnicianMatchScore: at?.matchScore ?? null,
        matchedCandidates: o.matchedCandidates ? json(o.matchedCandidates) : null,
        prescriptionCode: o.prescriptionCode ?? null,
        prescriptionContent: o.prescriptionContent ?? null,
        watermarkVerified: o.watermarkVerified ?? null,
        watermarkTime: o.watermarkTime ?? null,
        watermarkGps: o.watermarkGps ?? null,
        signedAt: o.signedAt ?? null,
        settlementAmountCents: centsOpt(o.settlementAmount),
      },
    });
  }

  for (const [i, p] of ops.supplyProducts.entries()) {
    await prisma.supplyProduct.create({
      data: {
        id: p.id,
        orderKey: i,
        name: p.name,
        spec: p.spec,
        iconType: p.iconType,
        registrationNumber: p.registrationNumber,
        registrationNotes: p.registrationNotes,
        batchNumber: p.batchNumber,
        manufactureDate: p.manufactureDate,
        totalCoded: p.totalCoded,
        totalCodedUnit: p.totalCodedUnit,
        scanCount: p.scanCount,
        scanCountUnit: p.scanCountUnit,
        scanProgressPct: p.scanProgressPct,
        fleeStatus: p.fleeStatus,
        fleeStatusText: p.fleeStatusText,
        fleeLocation: p.fleeLocation ?? null,
        prescriptionCommissionRate: p.prescriptionCommissionRate,
        monthlySales: p.monthlySales,
        traceabilityNodes: json(p.traceabilityNodes),
      },
    });
  }

  for (const [i, s] of ops.amoebaSettlements.entries()) {
    await prisma.amoebaSettlement.create({
      data: {
        id: s.id,
        orderKey: i,
        partnerCode: s.partnerCode,
        partnerName: s.partnerName,
        partnerAvatarLetter: s.partnerAvatarLetter,
        partnerLevel: s.partnerLevel,
        teamName: s.teamName,
        menteeStatus: s.menteeStatus,
        serviceFeeCents: cents(s.serviceFee, `AmoebaSettlement.${s.id}.serviceFee`),
        prescriptionBonusCents: cents(
          s.prescriptionBonus,
          `AmoebaSettlement.${s.id}.prescriptionBonus`,
        ),
        mentorshipBonusCents: cents(s.mentorshipBonus, `AmoebaSettlement.${s.id}.mentorshipBonus`),
        equityDividendCents: cents(s.equityDividend, `AmoebaSettlement.${s.id}.equityDividend`),
        grossAmountCents: cents(s.grossAmount, `AmoebaSettlement.${s.id}.grossAmount`),
        taxWithheldCents: cents(s.taxWithheld, `AmoebaSettlement.${s.id}.taxWithheld`),
        netPayCents: cents(s.netPay, `AmoebaSettlement.${s.id}.netPay`),
        status: s.status,
        bankClearedAt: s.bankClearedAt ?? null,
      },
    });
  }

  for (const [i, e] of ops.fulfillmentEvents.entries()) {
    await prisma.fulfillmentEvent.create({
      data: {
        id: e.id,
        orderKey: i,
        type: e.type,
        title: e.title,
        timestamp: e.timestamp,
        summary: e.summary,
        technicianName: e.technicianName,
        location: e.location,
        gps: e.gps ?? null,
        droneModel: e.droneModel ?? null,
        photoUrl: e.photoUrl ?? null,
        qrTraceCode: e.qrTraceCode ?? null,
        batchCode: e.batchCode ?? null,
        rating: e.rating ?? null,
        settlementBonusCents: centsOpt(e.settlementBonus),
      },
    });
  }

  // ════════════════════════ 技师端 ════════════════════════

  const p = tech.technician;
  await prisma.technicianProfile.create({
    data: {
      id: 'self',
      name: p.name,
      title: p.title,
      role: p.role,
      partnerCode: p.partnerCode,
      certId: p.certId,
      station: p.station,
      pesticideLicense: p.pesticideLicense,
      rating: p.rating,
      yearsOfService: p.yearsOfService,
      isOnline: p.isOnline,
      onlineHoursToday: p.onlineHoursToday,
      incentiveMultiplier: p.incentiveMultiplier,
      groupRank: p.groupRank,
      groupName: p.groupName,
      avatarUrl: p.avatarUrl,
      headerProfileUrl: p.headerProfileUrl,
      logoUrl: p.logoUrl,
    },
  });

  for (const [i, o] of tech.orders.entries()) {
    await prisma.serviceOrder.create({
      data: {
        id: o.id,
        orderKey: i,
        orderNo: o.orderNo,
        title: o.title,
        serviceType: o.serviceType,
        urgencyTag: o.urgencyTag ?? null,
        urgencyBg: o.urgencyBg ?? null,
        status: o.status,
        dispatchTimeText: o.dispatchTimeText,
        distanceKm: o.distanceKm,
        gpsCoords: o.gpsCoords,
        farmerName: o.farmerName,
        farmerPhone: o.farmerPhone,
        farmerTag: o.farmerTag,
        locationName: o.locationName,
        roadCondition: o.roadCondition,
        scheduledTime: o.scheduledTime,
        cropScale: o.cropScale,
        farmerQuote: o.farmerQuote,
        farmerPhotos: json(o.farmerPhotos),
        estimatedFeeCents: cents(o.estimatedFee, `ServiceOrder.${o.id}.estimatedFee`),
        amoebaBonusCents: cents(o.amoebaBonus, `ServiceOrder.${o.id}.amoebaBonus`),
        bonusPercent: o.bonusPercent,
        laborFeeCents: cents(o.laborFee, `ServiceOrder.${o.id}.laborFee`),
        costBreakdown: json(o.costBreakdown),
        fieldEvidencePhotos: json(o.fieldEvidencePhotos),
        diagnosedTargets: json(o.diagnosedTargets),
        agronomicAdvice: o.agronomicAdvice,
        deliveryNoteId: o.deliveryNoteId,
        farmerSignature: o.farmerSignature ?? null,
        signedAt: o.signedAt ?? null,
      },
    });

    for (const [j, d] of (o.prescriptionDrugs ?? []).entries()) {
      await prisma.serviceOrderPrescriptionDrug.create({
        data: {
          // 行主键是合成的：同一味药可能出现在多张处方里
          id: `${o.id}-pd-${j}`,
          serviceOrderId: o.id,
          orderKey: j,
          // 原始药物 id 单独存，接口要原样返回它
          drugId: d.id,
          name: d.name,
          spec: d.spec,
          priceCents: cents(d.price, `ServiceOrder.${o.id}.drug.${d.id}.price`),
          qty: d.qty,
          code: d.code,
          tag: d.tag,
          img: d.img,
          activeIngredient: d.activeIngredient ?? null,
          dosage: d.dosage ?? null,
        },
      });
    }
  }

  for (const [i, d] of tech.catalog.entries()) {
    await prisma.pesticideCatalogItem.create({
      data: {
        id: d.id,
        orderKey: i,
        name: d.name,
        spec: d.spec,
        priceCents: cents(d.price, `PesticideCatalogItem.${d.id}.price`),
        qty: d.qty,
        code: d.code,
        tag: d.tag,
        img: d.img,
        activeIngredient: d.activeIngredient ?? null,
        dosage: d.dosage ?? null,
      },
    });
  }

  const a = tech.amoeba;
  await prisma.amoebaStat.create({
    data: {
      id: 'self',
      totalMonthIncomeCents: cents(a.totalMonthIncome, 'AmoebaStat.totalMonthIncome'),
      growthPct: a.growthPct,
      serviceCommissionCents: cents(a.serviceCommission, 'AmoebaStat.serviceCommission'),
      serviceTasksCount: a.serviceTasksCount,
      prescriptionDividendCents: cents(a.prescriptionDividend, 'AmoebaStat.prescriptionDividend'),
      teamReferralDividendCents: cents(a.teamReferralDividend, 'AmoebaStat.teamReferralDividend'),
      equityPreDrawCents: cents(a.equityPreDraw, 'AmoebaStat.equityPreDraw'),
      groupTargetRate: a.groupTargetRate,
      groupBaselineCents: cents(a.groupBaseline, 'AmoebaStat.groupBaseline'),
      groupTierBonus: a.groupTierBonus,
    },
  });

  for (const [i, f] of tech.feeds.entries()) {
    await prisma.teamMemberFeed.create({
      data: {
        id: f.id,
        orderKey: i,
        name: f.name,
        avatar: f.avatar,
        action: f.action,
        target: f.target,
        points: f.points,
      },
    });
  }

  for (const [i, t] of tech.transactions.entries()) {
    await prisma.revenueTransaction.create({
      data: {
        id: t.id,
        orderKey: i,
        title: t.title,
        sub: t.sub,
        amountCents: cents(t.amount, `RevenueTransaction.${t.id}.amount`),
        type: t.type,
        time: t.time,
      },
    });
  }

  // ---- 播种结果自述（明细，便于与内存版本对账）----
  const counts = {
    Technician: await prisma.technician.count(),
    WorkOrder: await prisma.workOrder.count(),
    AuditApplication: await prisma.auditApplication.count(),
    SupplyProduct: await prisma.supplyProduct.count(),
    AmoebaSettlement: await prisma.amoebaSettlement.count(),
    FulfillmentEvent: await prisma.fulfillmentEvent.count(),
    TechnicianProfile: await prisma.technicianProfile.count(),
    ServiceOrder: await prisma.serviceOrder.count(),
    ServiceOrderPrescriptionDrug: await prisma.serviceOrderPrescriptionDrug.count(),
    PesticideCatalogItem: await prisma.pesticideCatalogItem.count(),
    AmoebaStat: await prisma.amoebaStat.count(),
    TeamMemberFeed: await prisma.teamMemberFeed.count(),
    RevenueTransaction: await prisma.revenueTransaction.count(),
  };

  console.log('[seed] 播种完成:');
  for (const [name, n] of Object.entries(counts)) {
    console.log(`  ${name.padEnd(30)} ${n}`);
  }
}

main()
  .catch((error) => {
    console.error('[seed] 失败:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
