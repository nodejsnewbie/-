import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { SettlementRepository } from '../../database/repositories/settlement.repository';
import { TechnicianEarningRepository } from '../../database/repositories/technician-self.repository';

/**
 * 阿米巴分红与结算域业务逻辑。
 *
 * ⚠️ 已知遗留（等客户确认后处理）：
 * - `summary` 里的 grossTotal / taxTotal / netTotal / partnersCount 是**硬编码值**，
 *   并未由 `settlements` 求和得出（原实现算了求和却没用，迁移期照搬硬编码以保持行为不变）。
 * - `POST /api/amoeba/batch-settle` 不真正走银行通道。
 * - 分红口径未确认，本服务**不做任何分红计算**（见 AGENTS.md 前提状态）。
 */
@Injectable()
export class AdminAmoebaService {
  constructor(private readonly settlements: SettlementRepository) {}

  async list() {
    return {
      settlements: await this.settlements.list(),
      summary: {
        grossTotal: 184520.0,
        taxTotal: 5535.6,
        netTotal: 178984.4,
        partnersCount: 42,
        batchAuditCode: 'AMO-202404-0982',
        bankStatus: '中国农业银行财资云 100% 专户直管',
      },
    };
  }

  async batchSettle() {
    const clearedAt = new Date().toISOString();
    const settledCount = await this.settlements.clearAll(clearedAt);

    return {
      success: true,
      message:
        '已通过专网向中国农业银行财资云下发合规批量代发指令！预计 15 分钟内资金流水落地到账。',
      settledCount,
      netPaid: 178984.4,
    };
  }

  async singleSettle(id: string) {
    const existing = await this.settlements.findById(id);
    if (!existing) {
      throw new NotFoundException({ error: '记录不存在' });
    }

    const item = await this.settlements.update(id, {
      status: 'cleared',
      bankClearedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: `已为 ${item.partnerName} 单独生成本月银企直联代发凭单！`,
      item,
    };
  }
}

/** 技师端的收益与提现业务逻辑。 */
@Injectable()
export class TechnicianAmoebaService {
  constructor(private readonly earning: TechnicianEarningRepository) {}

  async stats() {
    return { success: true, data: await this.earning.getStat() };
  }

  async transactions(query: Record<string, string | undefined>) {
    const { type } = query;
    let items = await this.earning.listTransactions();

    if (type && typeof type === 'string' && type !== 'all') {
      items = items.filter(
        (t) =>
          t.type === type ||
          (t.type === 'mixed' && (type === 'service' || type === 'prescription')),
      );
    }

    return { success: true, total: items.length, data: items };
  }

  async feeds() {
    return { success: true, data: await this.earning.listFeeds() };
  }

  async withdraw(body: { amount?: number | string; channel?: string }) {
    const numAmount = Number(body.amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      throw new BadRequestException({ success: false, message: '请输入有效的提现金额' });
    }

    // ⚠️ 余额比较在「分」上做（整数），不在浮点上做——浮点比较会在边界上出错（红线 R7）
    const amountCents = Math.round(numAmount * 100);
    const availableCents = await this.earning.availableBalanceCents();

    if (amountCents > availableCents) {
      throw new BadRequestException({
        success: false,
        message: '提现金额超出当前可提现收益余额',
      });
    }

    const stat = await this.earning.withdraw(amountCents);

    const channelName =
      body.channel === 'wechat'
        ? '微信零钱'
        : body.channel === 'bank_abc'
          ? '中国农业银行 (尾号8819)'
          : '招商银行卡 (尾号4201)';

    await this.earning.insertTransactionFront({
      id: `tx-wd-${Date.now()}`,
      title: `合伙人收益提现至${channelName}`,
      sub: '税后收益 · 资金银行直管专户实时直付',
      amountCents: -amountCents,
      type: 'mixed',
      time: new Date().toISOString(),
    });

    return {
      success: true,
      message: `提现申请已受理，¥${numAmount.toFixed(2)} 已划拨至${channelName}`,
      data: {
        withdrawnCents: amountCents,
        channel: channelName,
        remainingBalanceCents: stat.totalMonthIncomeCents,
      },
    };
  }
}
