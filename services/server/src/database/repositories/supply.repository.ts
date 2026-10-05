import { Injectable } from '@nestjs/common';
import type { PrescriptionDrug, SupplyProduct } from '@hnhall/shared';

import { PrismaService } from '../../prisma/prisma.service';
import { jsonIn } from '../json';
import { defined } from './support';
import { toPesticideCatalogItem, toSupplyProduct } from '../mappers';

/** 农资产品与溯源仓储（企业后台）。 */
@Injectable()
export class SupplyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<SupplyProduct[]> {
    const rows = await this.prisma.supplyProduct.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toSupplyProduct);
  }

  /** 按批次号找产品（冻结批次用）。 */
  async findByBatchNumber(batchNumber: string): Promise<SupplyProduct | null> {
    const row = await this.prisma.supplyProduct.findFirst({ where: { batchNumber } });
    return row ? toSupplyProduct(row) : null;
  }

  async update(id: string, patch: Partial<SupplyProduct>): Promise<SupplyProduct> {
    const row = await this.prisma.supplyProduct.update({
      where: { id },
      data: defined({
        name: patch.name,
        spec: patch.spec,
        iconType: patch.iconType,
        registrationNumber: patch.registrationNumber,
        registrationNotes: patch.registrationNotes,
        batchNumber: patch.batchNumber,
        manufactureDate: patch.manufactureDate,
        totalCoded: patch.totalCoded,
        totalCodedUnit: patch.totalCodedUnit,
        scanCount: patch.scanCount,
        scanCountUnit: patch.scanCountUnit,
        scanProgressPct: patch.scanProgressPct,

        prescriptionCommissionRate: patch.prescriptionCommissionRate,
        monthlySales: patch.monthlySales,
        traceabilityNodes:
          patch.traceabilityNodes === undefined ? undefined : jsonIn(patch.traceabilityNodes),
      }),
    });

    return toSupplyProduct(row);
  }
}

/**
 * 农药目录仓储（技师端开方选药 + 扫码验真）。
 *
 * 注：原型的 `GET /pesticides/:code` 用 `code` 或 `id` 二选一匹配，且 **code 忽略大小写**。
 * 这里先在 JS 里做（与原型一致），不下推 SQL，避免 SQLite `LIKE` 的大小写语义差异。
 */
@Injectable()
export class PesticideCatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<PrescriptionDrug[]> {
    const rows = await this.prisma.pesticideCatalogItem.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toPesticideCatalogItem);
  }

  async findByCodeOrId(codeOrId: string): Promise<PrescriptionDrug | null> {
    const rows = await this.prisma.pesticideCatalogItem.findMany();
    const lowered = codeOrId.toLowerCase();
    const row = rows.find((r) => r.code.toLowerCase() === lowered || r.id === codeOrId);
    return row ? toPesticideCatalogItem(row) : null;
  }
}
