import { Injectable } from '@nestjs/common';
import type { AmoebaSettlement, FulfillmentEvent } from '@hnhall/shared';

import { PrismaService } from '../../prisma/prisma.service';
import { defined, keyForFront } from './support';
import { toAmoebaSettlement, toFulfillmentEvent } from '../mappers';

/**
 * 阿米巴结算仓储。
 *
 * ⚠️ **本仓储不做任何分红计算**。分红口径（基数、档位系数、扣减、税）尚未经客户与财务确认
 *    （见 docs/requirements/amoeba-policy.md），算法待定稿后单独实现并配单测（红线 R7）。
 *    这里按「分」存取既有结果——领域模型与库里同为「分」整数，不再做单位换算
 *    （元格式化在各前端展示层的 formatCents）。
 */
@Injectable()
export class SettlementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<AmoebaSettlement[]> {
    const rows = await this.prisma.amoebaSettlement.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toAmoebaSettlement);
  }

  async findById(id: string): Promise<AmoebaSettlement | null> {
    const row = await this.prisma.amoebaSettlement.findUnique({ where: { id } });
    return row ? toAmoebaSettlement(row) : null;
  }

  async update(id: string, patch: Partial<AmoebaSettlement>): Promise<AmoebaSettlement> {
    const row = await this.prisma.amoebaSettlement.update({
      where: { id },
      data: defined({
        partnerCode: patch.partnerCode,
        partnerName: patch.partnerName,
        partnerAvatarLetter: patch.partnerAvatarLetter,
        partnerLevel: patch.partnerLevel,
        teamName: patch.teamName,
        menteeStatus: patch.menteeStatus,
        serviceFeeCents: patch.serviceFeeCents,
        prescriptionBonusCents: patch.prescriptionBonusCents,
        mentorshipBonusCents: patch.mentorshipBonusCents,
        equityDividendCents: patch.equityDividendCents,
        grossAmountCents: patch.grossAmountCents,
        taxWithheldCents: patch.taxWithheldCents,
        netPayCents: patch.netPayCents,
        status: patch.status,
        bankClearedAt: patch.bankClearedAt,
      }),
    });

    return toAmoebaSettlement(row);
  }

  /** 批量置为已结算（对应原型的 `batch-settle`）。返回受影响条数。 */
  async clearAll(clearedAt: string): Promise<number> {
    const result = await this.prisma.amoebaSettlement.updateMany({
      data: { status: 'cleared', bankClearedAt: clearedAt },
    });
    return result.count;
  }

  async count(): Promise<number> {
    return this.prisma.amoebaSettlement.count();
  }
}

/** 履约事件流仓储（总览页时间线，新事件前插）。 */
@Injectable()
export class FulfillmentEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<FulfillmentEvent[]> {
    const rows = await this.prisma.fulfillmentEvent.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toFulfillmentEvent);
  }

  /**
   * 前插一条事件。
   *
   * 原型用 `unshift` 把新事件放到列表最前，`GET /api/stats` 直接返回该数组，
   * 所以顺序是**接口契约的一部分**——用 `orderKey` = 当前最小值 − 1 精确复现。
   */
  async insertFront(event: FulfillmentEvent): Promise<FulfillmentEvent> {
    const min = await this.prisma.fulfillmentEvent.aggregate({ _min: { orderKey: true } });
    const row = await this.prisma.fulfillmentEvent.create({
      data: {
        id: event.id,
        orderKey: keyForFront(min._min.orderKey),
        type: event.type,
        title: event.title,
        timestamp: event.timestamp,
        summary: event.summary,
        technicianName: event.technicianName,
        location: event.location,
        gps: event.gps ?? null,
        droneModel: event.droneModel ?? null,
        photoUrl: event.photoUrl ?? null,
        qrTraceCode: event.qrTraceCode ?? null,
        batchCode: event.batchCode ?? null,
        rating: event.rating ?? null,
        settlementBonusCents: event.settlementBonusCents ?? null,
      },
    });

    return toFulfillmentEvent(row);
  }
}
