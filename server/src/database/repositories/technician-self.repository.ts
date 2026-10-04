import { Injectable } from '@nestjs/common';
import type {
  AmoebaStat,
  RevenueTransaction,
  TeamMemberFeed,
  TechnicianProfile,
} from '@hnhall/shared';

import { PrismaService } from '../../prisma/prisma.service';
import { defined, keyForFront } from './support';
import {
  toAmoebaStat,
  toRevenueTransaction,
  toTeamMemberFeed,
  toTechnicianProfile,
} from '../mappers';

/** 技师端本人档案仓储（单例，固定 id = `self`）。 */
@Injectable()
export class TechnicianProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<TechnicianProfile> {
    const row = await this.prisma.technicianProfile.findUnique({ where: { id: 'self' } });
    if (!row) {
      throw new Error('[TechnicianProfileRepository] 档案不存在，请先执行播种（npm run seed）');
    }
    return toTechnicianProfile(row);
  }

  async update(patch: Partial<TechnicianProfile>): Promise<TechnicianProfile> {
    const row = await this.prisma.technicianProfile.update({
      where: { id: 'self' },
      data: defined({
        name: patch.name,
        title: patch.title,
        role: patch.role,
        partnerCode: patch.partnerCode,
        certId: patch.certId,
        station: patch.station,
        pesticideLicense: patch.pesticideLicense,
        rating: patch.rating,
        yearsOfService: patch.yearsOfService,
        isOnline: patch.isOnline,
        onlineHoursToday: patch.onlineHoursToday,
        incentiveMultiplier: patch.incentiveMultiplier,
        groupRank: patch.groupRank,
        groupName: patch.groupName,
        avatarUrl: patch.avatarUrl,
        headerProfileUrl: patch.headerProfileUrl,
        logoUrl: patch.logoUrl,
      }),
    });

    return toTechnicianProfile(row);
  }
}

/**
 * 技师端收益仓储（单例 `self` + 流水）。
 *
 * ⚠️ 本仓储**不做分红计算**，只存取。分红口径未确认（见 AGENTS.md 前提状态）。
 */
@Injectable()
export class TechnicianEarningRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getStat(): Promise<AmoebaStat> {
    const row = await this.prisma.amoebaStat.findUnique({ where: { id: 'self' } });
    if (!row) {
      throw new Error('[TechnicianEarningRepository] 收益概览不存在，请先执行播种（npm run seed）');
    }
    return toAmoebaStat(row);
  }

  async updateStat(patch: Partial<AmoebaStat>): Promise<AmoebaStat> {
    const row = await this.prisma.amoebaStat.update({
      where: { id: 'self' },
      data: defined({
        totalMonthIncomeCents: centsOrUndef(patch.totalMonthIncome),
        growthPct: patch.growthPct,
        serviceCommissionCents: centsOrUndef(patch.serviceCommission),
        serviceTasksCount: patch.serviceTasksCount,
        prescriptionDividendCents: centsOrUndef(patch.prescriptionDividend),
        teamReferralDividendCents: centsOrUndef(patch.teamReferralDividend),
        equityPreDrawCents: centsOrUndef(patch.equityPreDraw),
        groupTargetRate: patch.groupTargetRate,
        groupBaselineCents: centsOrUndef(patch.groupBaseline),
        groupTierBonus: patch.groupTierBonus,
      }),
    });

    return toAmoebaStat(row);
  }

  async listFeeds(): Promise<TeamMemberFeed[]> {
    const rows = await this.prisma.teamMemberFeed.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toTeamMemberFeed);
  }

  /**
   * 结算入账（整数「分」的原子自增）。
   *
   * ⚠️ 刻意**不用**「读出来 → 在 JS 里加 → 写回去」：那是浮点累加，违反红线 R7，
   * 而且并发下会丢失更新。交给数据库做整数 `increment`。
   */
  async accrueIncome(delta: {
    totalIncomeCents: number;
    serviceCommissionCents: number;
    prescriptionDividendCents: number;
  }): Promise<AmoebaStat> {
    const row = await this.prisma.amoebaStat.update({
      where: { id: 'self' },
      data: {
        totalMonthIncomeCents: { increment: delta.totalIncomeCents },
        serviceCommissionCents: { increment: delta.serviceCommissionCents },
        prescriptionDividendCents: { increment: delta.prescriptionDividendCents },
        serviceTasksCount: { increment: 1 },
      },
    });

    return toAmoebaStat(row);
  }

  /** 提现扣减余额（同样是整数原子自减）。 */
  async withdraw(amountCents: number): Promise<AmoebaStat> {
    const row = await this.prisma.amoebaStat.update({
      where: { id: 'self' },
      data: { totalMonthIncomeCents: { decrement: amountCents } },
    });

    return toAmoebaStat(row);
  }

  /** 当前可提现余额（**分**）。提现校验必须在分上做，避免浮点比较。 */
  async availableBalanceCents(): Promise<number> {
    const row = await this.prisma.amoebaStat.findUnique({
      where: { id: 'self' },
      select: { totalMonthIncomeCents: true },
    });
    if (!row) {
      throw new Error('[TechnicianEarningRepository] 收益概览不存在，请先执行播种（npm run seed）');
    }
    return row.totalMonthIncomeCents;
  }

  async listTransactions(): Promise<RevenueTransaction[]> {
    const rows = await this.prisma.revenueTransaction.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toRevenueTransaction);
  }

  /** 前插一条流水（对应原型的 `transactions.unshift(...)`）。 */
  async insertTransactionFront(tx: RevenueTransaction): Promise<RevenueTransaction> {
    const min = await this.prisma.revenueTransaction.aggregate({ _min: { orderKey: true } });
    const row = await this.prisma.revenueTransaction.create({
      data: {
        id: tx.id,
        orderKey: keyForFront(min._min.orderKey),
        title: tx.title,
        sub: tx.sub,
        amountCents: Math.round(tx.amount * 100),
        type: tx.type,
        time: tx.time,
      },
    });

    return toRevenueTransaction(row);
  }
}

function centsOrUndef(value: number | undefined): number | undefined {
  return value === undefined ? undefined : Math.round(value * 100);
}
