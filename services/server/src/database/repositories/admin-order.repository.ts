import { Injectable } from '@nestjs/common';
import type { WorkOrder as WorkOrderRow } from '@prisma/client';
import type { WorkOrder } from '@hnhall/shared';

import { PrismaService } from '../../prisma/prisma.service';
import { jsonIn } from '../json';
import { defined } from './support';
import { toWorkOrder } from '../mappers';

/**
 * 企业后台的工单仓储。
 *
 * ⚠️ 过渡期取数方式：`list()` 一次取全表再在**控制器里**做查询过滤（保持与原型完全一致的
 * JS 语义——SQLite 的 `LIKE` 对 ASCII 大小写不敏感，而原型用的是大小写敏感的
 * `String.includes`，直接下推 SQL 会静默改变过滤行为）。
 * 真实查询需求确认后再把过滤下推到 SQL，那时要补带查询参数的回归用例。
 *
 * 单县试点规模是 30–50 技师 / 少量工单，全表加载在这个阶段不构成问题。
 */
@Injectable()
export class AdminOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<WorkOrder[]> {
    const rows = await this.prisma.workOrder.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toWorkOrder);
  }

  async findById(id: string): Promise<WorkOrder | null> {
    const row = await this.prisma.workOrder.findUnique({ where: { id } });
    return row ? toWorkOrder(row) : null;
  }

  /** 只返回行，供需要判断存在性的调用方使用。 */
  async exists(id: string): Promise<boolean> {
    return (await this.prisma.workOrder.count({ where: { id } })) > 0;
  }

  async update(id: string, patch: Partial<WorkOrder>): Promise<WorkOrder> {
    const at = patch.assignedTechnician;

    const row: WorkOrderRow = await this.prisma.workOrder.update({
      where: { id },
      data: defined({
        farmerName: patch.farmerName,
        coopName: patch.coopName,
        phone: patch.phone,
        location: patch.location,
        gridCode: patch.gridCode,
        crop: patch.crop,
        acreage: patch.acreage,
        cropStage: patch.cropStage,
        symptom: patch.symptom,
        serviceCategory: patch.serviceCategory,
        serviceCategoryText: patch.serviceCategoryText,
        urgency: patch.urgency,
        urgencyText: patch.urgencyText,
        specialSubsidy: patch.specialSubsidy,
        reportedTime: patch.reportedTime,
        waitingMinutes: patch.waitingMinutes,
        requestedAction: patch.requestedAction,
        status: patch.status,
        statusText: patch.statusText,
        currentStep: patch.currentStep,
        // 派单信息在库里是扁平列，这里展开
        assignedTechnicianId: at?.id,
        assignedTechnicianName: at?.name,
        assignedTechnicianPhone: at?.phone,
        assignedTechnicianTitle: at?.title,
        assignedTechnicianAvatar: at?.avatar,
        assignedTechnicianDistanceKm: at?.distanceKm,
        assignedTechnicianEtaMin: at?.estimatedArrivalMin,
        assignedTechnicianMatchScore: at?.matchScore,
        matchedCandidates:
          patch.matchedCandidates === undefined ? undefined : jsonIn(patch.matchedCandidates),
        prescriptionCode: patch.prescriptionCode,
        prescriptionContent: patch.prescriptionContent,
        watermarkVerified: patch.watermarkVerified,
        watermarkTime: patch.watermarkTime,
        watermarkGps: patch.watermarkGps,
        signedAt: patch.signedAt,
        // 金额：领域模型与库里同为「分」整数，直接透传（R7）
        settlementAmountCents: patch.settlementAmountCents,
      }),
    });

    return toWorkOrder(row);
  }
}
