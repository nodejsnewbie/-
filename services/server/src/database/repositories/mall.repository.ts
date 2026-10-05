import { Injectable } from '@nestjs/common';
import type { CartItem, MallProduct, ServiceBooking, TraceLedgerEntry } from '@hnhall/shared';

import { PrismaService } from '../../prisma/prisma.service';
import { jsonIn } from '../json';
import { keyForFront } from './support';
import { toMallProduct, toServiceBooking, toTraceLedgerEntry } from '../mappers';

/**
 * C 端商城（农资自营商城）仓储。
 *
 * 与原型（E:\repo\zymall 的 Express 内存 Mock）语义保持一致：
 * 列表取全表 + 控制器 JS 过滤（见 DatabaseModule 的过渡期说明）；
 * 台账 / 预约 / 订单的新增是 `unshift` 前插语义，用 `orderKey = min − 1` 复现。
 *
 * ⚠️ id 生成本仓库接管：原型的 `LED-/BK-/DD-` id 都取 `Date.now()` 的尾数，
 * 内存数组允许重复 id，**落库后是主键**——快速连续两次请求会撞主键 500。
 * 故由仓储生成「未被占用的最近刻度」，格式与原型完全一致（台账 id 会出现在
 * `GET /api/trace/history` 响应里，格式是契约的一部分）。
 */

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** 商城在售商品（C 端视图）。 */
@Injectable()
export class MallProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<MallProduct[]> {
    const rows = await this.prisma.mallProduct.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toMallProduct);
  }

  async findById(id: string): Promise<MallProduct | null> {
    const row = await this.prisma.mallProduct.findUnique({ where: { id } });
    return row ? toMallProduct(row) : null;
  }

  async findByTraceCode(traceCode: string): Promise<MallProduct | null> {
    const row = await this.prisma.mallProduct.findFirst({ where: { traceCode } });
    return row ? toMallProduct(row) : null;
  }
}

/** 农户扫码查验台账。 */
@Injectable()
export class TraceLedgerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<TraceLedgerEntry[]> {
    const rows = await this.prisma.traceLedgerEntry.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toTraceLedgerEntry);
  }

  /** 前插一条查验记录（复刻原型 verify 接口里的 `traceLedger.unshift(...)`）。 */
  async insertFront(entry: Omit<TraceLedgerEntry, 'id'>): Promise<void> {
    const id = await this.nextLedgerId();
    const min = await this.prisma.traceLedgerEntry.aggregate({ _min: { orderKey: true } });
    await this.prisma.traceLedgerEntry.create({
      data: {
        id,
        orderKey: keyForFront(min._min.orderKey),
        code: entry.code,
        productName: entry.productName,
        batchNo: entry.batchNo,
        licenseNo: entry.licenseNo,
        queryTime: entry.queryTime,
        status: entry.status,
        station: entry.station,
      },
    });
  }

  /** 原型格式 `LED-${Date.now()后4位}`；刻度已被占用则等下一格。 */
  private async nextLedgerId(): Promise<string> {
    for (;;) {
      const id = `LED-${Date.now().toString().slice(-4)}`;
      const taken = await this.prisma.traceLedgerEntry.findUnique({ where: { id } });
      if (!taken) return id;
      await sleep(15);
    }
  }
}

/** 上门服务预约。 */
@Injectable()
export class ServiceBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<ServiceBooking[]> {
    const rows = await this.prisma.serviceBooking.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toServiceBooking);
  }

  /** 前插一条预约（复刻原型 `bookingsStore.unshift(...)`），id 由本仓储生成。 */
  async insertFront(booking: Omit<ServiceBooking, 'id'>): Promise<ServiceBooking> {
    const id = await this.nextBookingId();
    const min = await this.prisma.serviceBooking.aggregate({ _min: { orderKey: true } });
    const row = await this.prisma.serviceBooking.create({
      data: {
        id,
        orderKey: keyForFront(min._min.orderKey),
        serviceType: booking.serviceType,
        cropType: booking.cropType,
        acreage: booking.acreage,
        preferredDate: booking.preferredDate,
        timeSlot: booking.timeSlot,
        station: booking.station,
        contactName: booking.contactName,
        contactPhone: booking.contactPhone,
        plotAddress: booking.plotAddress,
        associatedProducts: jsonIn(booking.associatedProducts),
        notes: booking.notes ?? null,
        status: booking.status,
        agronomistName: booking.assignedAgronomist?.name ?? null,
        agronomistCertId: booking.assignedAgronomist?.certId ?? null,
        agronomistPhone: booking.assignedAgronomist?.phone ?? null,
        agronomistTitle: booking.assignedAgronomist?.title ?? null,
      },
    });
    return toServiceBooking(row);
  }

  /** 原型格式 `BK-${Date.now()后6位}`；刻度已被占用则等下一格。 */
  private async nextBookingId(): Promise<string> {
    for (;;) {
      const id = `BK-${Date.now().toString().slice(-6)}`;
      const taken = await this.prisma.serviceBooking.findUnique({ where: { id } });
      if (!taken) return id;
      await sleep(15);
    }
  }
}

/** 商城订单（原型只有下单写入，无读取接口；持久化为后续留）。 */
@Injectable()
export class MallOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** 落库并返回生成的订单号（即响应里的 `orderId`）。 */
  async create(order: {
    createdAt: string;
    items: CartItem[];
    totalAmountCents: number;
    eligibleForFreeRecipe: boolean;
    deliveryStation: string;
    deliveryEstimate: string;
    status: string;
  }): Promise<string> {
    const id = await this.nextOrderId();
    await this.prisma.mallOrder.create({
      data: {
        id,
        createdAt: order.createdAt,
        items: jsonIn(order.items),
        totalAmountCents: order.totalAmountCents,
        eligibleForFreeRecipe: order.eligibleForFreeRecipe,
        deliveryStation: order.deliveryStation,
        deliveryEstimate: order.deliveryEstimate,
        status: order.status,
      },
    });
    return id;
  }

  /** 原型格式 `DD-${Date.now()后8位}`；刻度已被占用则等下一格。 */
  private async nextOrderId(): Promise<string> {
    for (;;) {
      const id = `DD-${Date.now().toString().slice(-8)}`;
      const taken = await this.prisma.mallOrder.findUnique({ where: { id } });
      if (!taken) return id;
      await sleep(15);
    }
  }
}
