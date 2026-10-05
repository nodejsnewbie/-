import type { PrismaClient } from '@prisma/client';

import { jsonIn as json } from './json';
import type { MallSeed } from './seed-data/mall.seed';

/**
 * C 端商城播种：清空 + 写入 MallProduct / TraceLedgerEntry / ServiceBooking / MallOrder。
 * 自 seed.ts 按 R10（单文件 ≤ 500 行）拆出，行为不变。
 * 金额换算与 seed.ts 同口径：入库存「分」（R7）。
 */
export async function seedMall(prisma: PrismaClient, mall: MallSeed): Promise<void> {
  await prisma.mallProduct.deleteMany();
  await prisma.traceLedgerEntry.deleteMany();
  await prisma.serviceBooking.deleteMany();
  await prisma.mallOrder.deleteMany();

  for (const [i, p] of mall.products.entries()) {
    await prisma.mallProduct.create({
      data: {
        id: p.id,
        orderKey: i,
        name: p.name,
        spec: p.spec,
        category: p.category,
        badge: p.badge ?? null,
        tags: json(p.tags),
        licenseNo: p.licenseNo,
        batchNo: p.batchNo,
        priceCents: cents(p.price, `MallProduct.${p.id}.price`),
        originalPriceCents: centsOpt(p.originalPrice),
        soldCount: p.soldCount,
        image: p.image,
        traceCode: p.traceCode,
        activeIngredient: p.activeIngredient,
        toxicity: p.toxicity,
        formulation: p.formulation,
        targetDisease: p.targetDisease,
        dosagePerMu: p.dosagePerMu,
        waterPerMu: p.waterPerMu,
        safeInterval: p.safeInterval,
        manufacturer: p.manufacturer,
        highlightText: p.highlightText ?? null,
        isOfficialDirect: p.isOfficialDirect,
        canBookService: p.canBookService,
      },
    });
  }

  for (const [i, l] of mall.traceLedger.entries()) {
    await prisma.traceLedgerEntry.create({
      data: {
        id: l.id,
        orderKey: i,
        code: l.code,
        productName: l.productName,
        batchNo: l.batchNo,
        licenseNo: l.licenseNo,
        queryTime: l.queryTime,
        status: l.status,
        station: l.station,
      },
    });
  }

  for (const [i, b] of mall.bookings.entries()) {
    await prisma.serviceBooking.create({
      data: {
        id: b.id,
        orderKey: i,
        serviceType: b.serviceType,
        cropType: b.cropType,
        acreage: b.acreage,
        preferredDate: b.preferredDate,
        timeSlot: b.timeSlot,
        station: b.station,
        contactName: b.contactName,
        contactPhone: b.contactPhone,
        plotAddress: b.plotAddress,
        associatedProducts: json(b.associatedProducts),
        notes: b.notes ?? null,
        status: b.status,
        agronomistName: b.assignedAgronomist?.name ?? null,
        agronomistCertId: b.assignedAgronomist?.certId ?? null,
        agronomistPhone: b.assignedAgronomist?.phone ?? null,
        agronomistTitle: b.assignedAgronomist?.title ?? null,
      },
    });
  }
}

/** 元 → 分（与 seed.ts 同口径）。必填金额缺值直接报错，不静默写 0。 */
function cents(value: number | undefined | null, label: string): number {
  if (value === undefined || value === null) {
    throw new Error(`[seed] 必填金额缺失: ${label}`);
  }
  return Math.round(value * 100);
}

/** 元 → 分，可选字段。 */
function centsOpt(value: number | undefined | null): number | null {
  return value === undefined || value === null ? null : Math.round(value * 100);
}
