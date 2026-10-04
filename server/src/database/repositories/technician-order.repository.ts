import { Injectable } from '@nestjs/common';
import type { ServiceOrderPrescriptionDrug } from '@prisma/client';
import type { ServiceOrder } from '@hnhall/shared';

import { PrismaService } from '../../prisma/prisma.service';
import { jsonIn } from '../json';
import { defined } from './support';
import { toServiceOrder } from '../mappers';

/**
 * 技师端工单仓储。
 *
 * ⚠️ 这里操作的是 `ServiceOrder`（技师端视图模型），与后台的 `WorkOrder` 是
 *    **同一业务实体的两套模型**，尚未统一（见 AGENTS.md 的类型统一任务）。
 *
 * 处方行项目存在独立子表：因为它**参与结算运算**（`Σ price × qty` 算处方分润），
 * 金额必须在 Json 之外以「分」存储（红线 R7）。
 */
@Injectable()
export class TechnicianOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<ServiceOrder[]> {
    const rows = await this.prisma.serviceOrder.findMany({
      orderBy: { orderKey: 'asc' },
      include: { prescriptionDrugs: { orderBy: { orderKey: 'asc' } } },
    });
    return rows.map(toServiceOrder);
  }

  async findById(id: string): Promise<ServiceOrder | null> {
    // 原型的查找条件：id 或 orderNo 命中其一
    const row = await this.prisma.serviceOrder.findFirst({
      where: { OR: [{ id }, { orderNo: id }] },
      include: { prescriptionDrugs: { orderBy: { orderKey: 'asc' } } },
    });
    return row ? toServiceOrder(row) : null;
  }

  async update(id: string, patch: Partial<ServiceOrder>): Promise<ServiceOrder> {
    await this.prisma.serviceOrder.update({
      where: { id },
      data: defined({
        orderNo: patch.orderNo,
        title: patch.title,
        serviceType: patch.serviceType,
        urgencyTag: patch.urgencyTag,
        urgencyBg: patch.urgencyBg,
        status: patch.status,
        dispatchTimeText: patch.dispatchTimeText,
        distanceKm: patch.distanceKm,
        gpsCoords: patch.gpsCoords,
        farmerName: patch.farmerName,
        farmerPhone: patch.farmerPhone,
        farmerTag: patch.farmerTag,
        locationName: patch.locationName,
        roadCondition: patch.roadCondition,
        scheduledTime: patch.scheduledTime,
        cropScale: patch.cropScale,
        farmerQuote: patch.farmerQuote,
        farmerPhotos: patch.farmerPhotos === undefined ? undefined : jsonIn(patch.farmerPhotos),
        estimatedFeeCents: centsOrUndef(patch.estimatedFee),
        amoebaBonusCents: centsOrUndef(patch.amoebaBonus),
        bonusPercent: patch.bonusPercent,
        laborFeeCents: centsOrUndef(patch.laborFee),
        costBreakdown: patch.costBreakdown === undefined ? undefined : jsonIn(patch.costBreakdown),
        fieldEvidencePhotos:
          patch.fieldEvidencePhotos === undefined ? undefined : jsonIn(patch.fieldEvidencePhotos),
        diagnosedTargets:
          patch.diagnosedTargets === undefined ? undefined : jsonIn(patch.diagnosedTargets),
        agronomicAdvice: patch.agronomicAdvice,
        deliveryNoteId: patch.deliveryNoteId,
        farmerSignature: patch.farmerSignature,
        signedAt: patch.signedAt,
      }),
    });

    // 处方是「整体替换」语义（原型直接 `order.prescriptionDrugs = drugs`），
    // 所以先清子表再重建，而不是逐行 diff。
    if (patch.prescriptionDrugs !== undefined) {
      await this.replacePrescriptionDrugs(id, patch.prescriptionDrugs);
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`[TechnicianOrderRepository] 更新后读不到工单: ${id}`);
    }
    return updated;
  }

  private async replacePrescriptionDrugs(
    serviceOrderId: string,
    drugs: ServiceOrder['prescriptionDrugs'],
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.serviceOrderPrescriptionDrug.deleteMany({ where: { serviceOrderId } }),
      this.prisma.serviceOrderPrescriptionDrug.createMany({
        data: drugs.map((d, index) => drugRow(serviceOrderId, d, index)),
      }),
    ]);
  }
}

function centsOrUndef(value: number | undefined): number | undefined {
  return value === undefined ? undefined : Math.round(value * 100);
}

function drugRow(
  serviceOrderId: string,
  d: ServiceOrder['prescriptionDrugs'][number],
  index: number,
): ServiceOrderPrescriptionDrug {
  return {
    // 行主键是合成的：同一味药可能出现在多张处方里
    id: `${serviceOrderId}-pd-${index}`,
    serviceOrderId,
    orderKey: index,
    drugId: d.id,
    name: d.name,
    spec: d.spec,
    priceCents: Math.round(d.price * 100),
    qty: d.qty,
    code: d.code,
    tag: d.tag,
    img: d.img,
    activeIngredient: d.activeIngredient ?? null,
    dosage: d.dosage ?? null,
  };
}
