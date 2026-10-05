import { Injectable } from '@nestjs/common';
import type { Technician as TechnicianRow } from '@prisma/client';
import type { Technician } from '@hnhall/shared';

import { PrismaService } from '../../prisma/prisma.service';
import { defined } from './support';
import { toTechnician } from '../mappers';

/** 企业后台的技师名册仓储。 */
@Injectable()
export class AdminTechnicianRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<Technician[]> {
    const rows = await this.prisma.technician.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toTechnician);
  }

  async findById(id: string): Promise<Technician | null> {
    const row = await this.prisma.technician.findUnique({ where: { id } });
    return row ? toTechnician(row) : null;
  }

  /**
   * 按手机号匹配技师（忽略非数字字符）。
   *
   * ⚠️ 原型的做法是在内存里 `replace(/\D/g, '')` 后比较。SQLite 无法表达这个归一化，
   * 所以这里仍然取全表再在 JS 里比——与原型**语义完全一致**。
   * 接 PG 后可以改成 `regexp_replace` 生成的函数索引列（`phoneDigits`）。
   */
  async findByPhoneDigits(digits: string): Promise<Technician | null> {
    const rows = await this.prisma.technician.findMany();
    const row = rows.find((r) => r.phone.replace(/\D/g, '') === digits);
    return row ? toTechnician(row) : null;
  }

  async update(id: string, patch: Partial<Technician>): Promise<Technician> {
    const row: TechnicianRow = await this.prisma.technician.update({
      where: { id },
      data: defined({
        code: patch.code,
        name: patch.name,
        title: patch.title,
        phone: patch.phone,
        avatar: patch.avatar,
        licenseNumber: patch.licenseNumber,
        licenseThumb: patch.licenseThumb,
        licenseAuthority: patch.licenseAuthority,
        licenseExpiry: patch.licenseExpiry,
        licenseStatus: patch.licenseStatus,
        licenseExpiryDays: patch.licenseExpiryDays,
        amoebaTier: patch.amoebaTier,
        amoebaTierName: patch.amoebaTierName,
        amoebaCoefficient: patch.amoebaCoefficient,
        teamName: patch.teamName,
        commissionRatio: patch.commissionRatio,
        menteeCount: patch.menteeCount,
        independentMentees: patch.independentMentees,
        teamMonthlyOutput: patch.teamMonthlyOutput,
        mentorshipAllowanceCents:
          patch.mentorshipAllowance === undefined
            ? undefined
            : Math.round(patch.mentorshipAllowance * 100),
        gridName: patch.gridName,
        coverageRadius: patch.coverageRadius,
        boundEquipment: patch.boundEquipment,
        completedOrders: patch.completedOrders,
        operationAcreage: patch.operationAcreage,
        rating: patch.rating,
        reviewCount: patch.reviewCount,
        goodReviewRate: patch.goodReviewRate,
        dispatchStatus: patch.dispatchStatus,
        dispatchStatusText: patch.dispatchStatusText,
      }),
    });

    return toTechnician(row);
  }

  /** 新增技师（资质审核通过时入库）。`orderKey` 取当前最大值 +1，排在末尾。 */
  async create(tech: Technician): Promise<Technician> {
    const max = await this.prisma.technician.aggregate({ _max: { orderKey: true } });
    const row = await this.prisma.technician.create({
      data: {
        id: tech.id,
        orderKey: (max._max.orderKey ?? -1) + 1,
        code: tech.code,
        name: tech.name,
        title: tech.title,
        phone: tech.phone,
        avatar: tech.avatar,
        licenseNumber: tech.licenseNumber,
        licenseThumb: tech.licenseThumb,
        licenseAuthority: tech.licenseAuthority,
        licenseExpiry: tech.licenseExpiry,
        licenseStatus: tech.licenseStatus,
        licenseExpiryDays: tech.licenseExpiryDays ?? null,
        amoebaTier: tech.amoebaTier,
        amoebaTierName: tech.amoebaTierName,
        amoebaCoefficient: tech.amoebaCoefficient,
        teamName: tech.teamName,
        commissionRatio: tech.commissionRatio,
        menteeCount: tech.menteeCount,
        independentMentees: tech.independentMentees,
        teamMonthlyOutput: tech.teamMonthlyOutput,
        mentorshipAllowanceCents: Math.round(tech.mentorshipAllowance * 100),
        gridName: tech.gridName,
        coverageRadius: tech.coverageRadius,
        boundEquipment: tech.boundEquipment,
        completedOrders: tech.completedOrders,
        operationAcreage: tech.operationAcreage,
        rating: tech.rating,
        reviewCount: tech.reviewCount,
        goodReviewRate: tech.goodReviewRate,
        dispatchStatus: tech.dispatchStatus,
        dispatchStatusText: tech.dispatchStatusText,
      },
    });

    return toTechnician(row);
  }
}
