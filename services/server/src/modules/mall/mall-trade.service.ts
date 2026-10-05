import { BadRequestException, Injectable } from '@nestjs/common';
import type { CartItem, ServiceBooking } from '@hnhall/shared';

import {
  MallOrderRepository,
  ServiceBookingRepository,
} from '../../database/repositories/mall.repository';

/** C 端商城：预约与下单业务逻辑（缺省值与原型逐字一致）。 */
@Injectable()
export class MallTradeService {
  constructor(
    private readonly bookings: ServiceBookingRepository,
    private readonly orders: MallOrderRepository,
  ) {}

  async listBookings() {
    const data = await this.bookings.list();
    return { success: true, data, total: data.length };
  }

  async createBooking(body: Record<string, unknown> | undefined) {
    const b = body ?? {};
    // 缺省值与原型逐字一致（原型 POST /api/bookings 的兜底逻辑）
    const newBooking: Omit<ServiceBooking, 'id'> = {
      serviceType: (b.serviceType as ServiceBooking['serviceType']) || 'drone_spraying',
      cropType: (b.cropType as string) || '晚稻',
      acreage: Number(b.acreage) || 30,
      preferredDate: (b.preferredDate as string) || '2024-10-02',
      timeSlot: (b.timeSlot as string) || '上午 (07:00-11:00 飞防适期)',
      station: (b.station as string) || '长沙县安沙农资自营直供中心',
      contactName: (b.contactName as string) || '种植户',
      contactPhone: (b.contactPhone as string) || '138-7589-9921',
      plotAddress: (b.plotAddress as string) || '安沙镇示范片区',
      associatedProducts: (b.associatedProducts as string[]) || [],
      notes: (b.notes as string) || undefined,
      status: 'submitted',
      assignedAgronomist: {
        name: '陈伟农',
        certId: '农技职字 2016-HN-0428',
        phone: '139-7312-8800',
        title: '高级农艺师 / 执业植保专家',
      },
    };

    const saved = await this.bookings.insertFront(newBooking);
    return { success: true, data: saved };
  }

  async createOrder(body: { items?: CartItem[]; station?: string } | undefined) {
    const { items, station } = body ?? {};
    if (!items || !items.length) {
      throw new BadRequestException({ success: false, error: '清单商品不能为空' });
    }

    // 金额口径：原型直接以「元」浮点累加（存量缺陷，R7 登记在案）；
    // 落库转「分」，响应仍按原型返回「元」浮点。
    const totalAmount = items.reduce(
      (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
      0,
    );
    const eligibleForFreeRecipe = totalAmount >= 200;
    const createdAt = new Date().toISOString();

    const orderId = await this.orders.create({
      createdAt,
      items,
      totalAmountCents: Math.round(totalAmount * 100),
      eligibleForFreeRecipe,
      deliveryStation: station || '长沙县安沙农资自营直供中心',
      deliveryEstimate: '最快 30 分钟送到田边',
      status: 'dispatched',
    });

    return {
      success: true,
      data: {
        orderId,
        createdAt,
        items,
        totalAmount,
        eligibleForFreeRecipe,
        deliveryStation: station || '长沙县安沙农资自营直供中心',
        deliveryEstimate: '最快 30 分钟送到田边',
        status: 'dispatched',
      },
    };
  }
}
