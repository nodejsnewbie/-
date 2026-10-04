import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { ServiceOrder } from '@hnhall/shared';

import { TechnicianOrderRepository } from '../../database/repositories/technician-order.repository';
import { TechnicianEarningRepository } from '../../database/repositories/technician-self.repository';

/**
 * 技师端工单业务逻辑。
 *
 * ⚠️ 操作的是 `ServiceOrder`（技师端视图模型），与后台的 `WorkOrder` 是
 *    **同一业务实体的两套模型**，尚未统一（见 AGENTS.md 的类型统一任务）。
 *
 * 💡 金额一律在「分」上做整数运算（红线 R7）。与原实现相比，这**修正了浮点误差**：
 *    原 `drugBonus = totalDrugs * 0.12` 会得到 51.839999999999996 这类值，
 *    现在得到精确的 51.84。这是有意的行为修正，不是回归。
 */
@Injectable()
export class TechnicianOrderService {
  constructor(
    private readonly orders: TechnicianOrderRepository,
    private readonly earning: TechnicianEarningRepository,
  ) {}

  private async mustFind(id: string): Promise<ServiceOrder> {
    const order = await this.orders.findById(id);
    if (!order) {
      throw new NotFoundException({ success: false, message: '工单不存在' });
    }
    return order;
  }

  async list(query: Record<string, string | undefined>) {
    const { status, maxDistance } = query;
    let results = await this.orders.list();

    if (status && typeof status === 'string') {
      results = results.filter((o) => o.status === status);
    }

    if (maxDistance && !isNaN(Number(maxDistance))) {
      results = results.filter((o) => o.distanceKm <= Number(maxDistance));
    }

    return { success: true, total: results.length, data: results };
  }

  async detail(id: string) {
    return { success: true, data: await this.mustFind(id) };
  }

  async claim(id: string) {
    await this.mustFind(id);
    const order = await this.orders.update(id, { status: 'in_progress' });

    return {
      success: true,
      message: `工单 ${order.orderNo} 接单成功，已向农户发送通知短信`,
      data: order,
    };
  }

  async decline(id: string) {
    await this.mustFind(id);
    const order = await this.orders.update(id, { status: 'dispatching' });

    return {
      success: true,
      message: `工单 ${order.orderNo} 已退回智能公共池协调转派`,
      data: order,
    };
  }

  async addEvidence(id: string, body: { url?: string; label?: string; location?: string }) {
    const order = await this.mustFind(id);
    const { url, label, location } = body;

    if (!url) {
      throw new BadRequestException({ success: false, message: '照片数据不可为空' });
    }

    const now = new Date();
    const timeStr = `${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
      .getDate()
      .toString()
      .padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const newPhoto = {
      id: `ev-${Date.now()}`,
      url,
      label: label || '现场实拍',
      time: timeStr,
      location: location || order.locationName,
    };

    // ⚠️ 照片里的 location 是「经纬度水印」的文案，本期没有定位能力，值来自农户地址
    const updated = await this.orders.update(id, {
      fieldEvidencePhotos: [...(order.fieldEvidencePhotos || []), newPhoto],
    });

    return {
      success: true,
      message: '取样实拍已附带经纬度水印并存证入卷',
      data: newPhoto,
      order: updated,
    };
  }

  async prescribe(
    id: string,
    body: {
      diagnosedTargets?: string[];
      agronomicAdvice?: string;
      prescriptionDrugs?: ServiceOrder['prescriptionDrugs'];
    },
  ) {
    await this.mustFind(id);

    const updated = await this.orders.update(id, {
      ...(body.diagnosedTargets ? { diagnosedTargets: body.diagnosedTargets } : {}),
      ...(body.agronomicAdvice ? { agronomicAdvice: body.agronomicAdvice } : {}),
      ...(body.prescriptionDrugs ? { prescriptionDrugs: body.prescriptionDrugs } : {}),
      status: 'prescribed',
    });

    return {
      success: true,
      message: '电子处方开立成功，已生成官方电子交割单',
      data: updated,
    };
  }

  async sign(id: string, body: { signature?: string }) {
    const order = await this.mustFind(id);

    const updated = await this.orders.update(id, {
      farmerSignature: body.signature,
      signedAt: new Date().toLocaleString(),
      status: 'completed',
    });

    // —— 结算：全程整数「分」运算（红线 R7）——
    const totalDrugsCents = order.prescriptionDrugs.reduce(
      (acc, d) => acc + Math.round(d.price * 100) * d.qty,
      0,
    );
    // 处方分润 12%：口径待评审（分红已定为「仅来自服务收入」，见 AGENTS.md 已知遗留）
    const drugBonusCents = Math.round((totalDrugsCents * 12) / 100);
    const laborFeeCents = Math.round(order.laborFee * 100);
    const totalIncomeCents = laborFeeCents + drugBonusCents;

    await this.earning.insertTransactionFront({
      id: `tx-${Date.now()}`,
      title: `${order.farmerName}水稻病虫害处方交付`,
      sub: `工单费 ¥${(laborFeeCents / 100).toFixed(2)} + 处方分润 ¥${(drugBonusCents / 100).toFixed(2)}`,
      amount: totalIncomeCents / 100,
      type: 'mixed',
      time: '刚刚',
    });

    const stat = await this.earning.accrueIncome({
      totalIncomeCents,
      serviceCommissionCents: laborFeeCents,
      prescriptionDividendCents: drugBonusCents,
    });

    return {
      success: true,
      message: '交割单已正式核签生效，已下发自营仓库出库通知',
      data: {
        order: updated,
        awardedIncome: totalIncomeCents / 100,
        newTotalIncome: stat.totalMonthIncome,
      },
    };
  }
}
