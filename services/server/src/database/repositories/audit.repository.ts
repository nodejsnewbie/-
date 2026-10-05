import { Injectable } from '@nestjs/common';
import type { AuditApplication } from '@hnhall/shared';

import { PrismaService } from '../../prisma/prisma.service';
import { defined } from './support';
import { toAuditApplication } from '../mappers';

/**
 * 资质审核仓储。
 *
 * ⚠️ R5 红线相关：本仓储**只负责存取**，任何「是否准予通过」的判断都不在这里，
 *    也不允许由自动化手段给出（本业务为纯人工审核）。
 */
@Injectable()
export class AuditRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<AuditApplication[]> {
    const rows = await this.prisma.auditApplication.findMany({ orderBy: { orderKey: 'asc' } });
    return rows.map(toAuditApplication);
  }

  async findById(id: string): Promise<AuditApplication | null> {
    const row = await this.prisma.auditApplication.findUnique({ where: { id } });
    return row ? toAuditApplication(row) : null;
  }

  async update(id: string, patch: Partial<AuditApplication>): Promise<AuditApplication> {
    const row = await this.prisma.auditApplication.update({
      where: { id },
      data: defined({
        code: patch.code,
        applicantName: patch.applicantName,
        applicantType: patch.applicantType,
        idCard: patch.idCard,
        phone: patch.phone,
        avatar: patch.avatar,
        targetGrid: patch.targetGrid,
        urgent: patch.urgent,
        licenseNumber: patch.licenseNumber,
        licenseScanUrl: patch.licenseScanUrl,
        licenseAuthority: patch.licenseAuthority,
        nationalRegistryVerified: patch.nationalRegistryVerified,
        permittedScope: patch.permittedScope,
        validPeriod: patch.validPeriod,
        assignedAmoebaTeam: patch.assignedAmoebaTeam,
        amoebaCoefficient: patch.amoebaCoefficient,
        auditNotes: patch.auditNotes,
        status: patch.status,
      }),
    });

    return toAuditApplication(row);
  }
}
