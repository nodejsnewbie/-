import { Injectable, NotFoundException } from '@nestjs/common';

import { AdminOrderRepository } from '../../database/repositories/admin-order.repository';
import { AdminTechnicianRepository } from '../../database/repositories/admin-technician.repository';
import { FulfillmentEventRepository } from '../../database/repositories/settlement.repository';

/** 企业后台的工单与派单业务逻辑（只换数据源不改口径，404 形状保持 `{ error }`）。 */
@Injectable()
export class AdminOrderService {
  constructor(
    private readonly orders: AdminOrderRepository,
    private readonly technicians: AdminTechnicianRepository,
    private readonly events: FulfillmentEventRepository,
  ) {}

  async list(query: Record<string, string | undefined>) {
    const { status, grid, category, search } = query;
    let filtered = await this.orders.list();

    if (status && status !== 'all') {
      if (status === 'pending') {
        filtered = filtered.filter(
          (o) => o.status === 'pending_dispatch' || o.status === 'exception',
        );
      } else {
        filtered = filtered.filter((o) => o.status === status);
      }
    }

    if (grid && grid !== 'all') {
      filtered = filtered.filter(
        (o) => o.location.includes(grid) || o.gridCode.toLowerCase().includes(grid.toLowerCase()),
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((o) => o.serviceCategory === category);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.farmerName.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.crop.toLowerCase().includes(q),
      );
    }

    return { orders: filtered, total: filtered.length };
  }

  async dispatch(orderId: string, technicianId?: string) {
    const order = await this.orders.findById(orderId);
    if (!order) {
      throw new NotFoundException({ error: '工单不存在' });
    }

    // 原行为：指定的技师找不到就退回名册第一位
    const tech =
      (technicianId ? await this.technicians.findById(technicianId) : null) ??
      (await this.technicians.list())[0];

    const updated = await this.orders.update(orderId, {
      status: 'dispatched',
      statusText: '已派工 · 正在赶赴现场',
      currentStep: 2,
      assignedTechnician: {
        id: tech.id,
        name: tech.name,
        phone: tech.phone,
        title: tech.title,
        avatar: tech.avatar,
        // ⚠️ 示意值：本期无地图服务，距离与预计到达时间没有真实数据来源
        distanceKm: 2.1,
        estimatedArrivalMin: 20,
        matchScore: 98.6,
      },
    });

    await this.events.insertFront({
      id: `event-${Date.now()}`,
      type: 'dispatch',
      title: '工单已下发并派工',
      timestamp: '刚刚',
      summary: `${tech.name} 已认领工单 ${order.id}，预计 20 分钟内抵达`,
      technicianName: tech.name,
      location: order.location,
    });

    return { success: true, message: '指派成功！已下发通知并生成电子工单密令', order: updated };
  }

  async updateStep(orderId: string, step?: number) {
    const order = await this.orders.findById(orderId);
    if (!order) {
      throw new NotFoundException({ error: '工单不存在' });
    }

    // 各步的副作用与原实现逐条对应（状态机见 AGENTS.md「核心状态机」）
    const updated = await this.orders.update(orderId, {
      currentStep: Number(step),
      ...(step === 3
        ? {
            watermarkVerified: true,
            watermarkTime: new Date().toLocaleTimeString(),
            status: 'checked_in' as const,
            statusText: '现场打卡完成',
          }
        : {}),
      ...(step === 4
        ? {
            status: 'prescription_issued' as const,
            statusText: '电子处方已开具',
            prescriptionCode: `RX-HN-${Date.now().toString().slice(-8)}`,
          }
        : {}),
      ...(step === 5
        ? {
            status: 'completed' as const,
            statusText: '已验收结单',
            signedAt: new Date().toLocaleTimeString(),
            settlementAmount: 450.0,
          }
        : {}),
    });

    return { success: true, order: updated };
  }
}
