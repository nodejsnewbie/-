import { Injectable, NotFoundException } from '@nestjs/common';

import { AdminTechnicianRepository } from '../../database/repositories/admin-technician.repository';
import { AuditRepository } from '../../database/repositories/audit.repository';
import { TechnicianProfileRepository } from '../../database/repositories/technician-self.repository';

/** 企业后台的技师名册业务逻辑。 */
@Injectable()
export class AdminTechnicianService {
  constructor(
    private readonly technicians: AdminTechnicianRepository,
    private readonly audits: AuditRepository,
  ) {}

  async list(query: Record<string, string | undefined>) {
    const { tier, filter, search } = query;
    let list = await this.technicians.list();

    if (tier && tier !== 'all') {
      list = list.filter((t) => t.amoebaTier === tier);
    }

    if (filter === 'expiring') {
      list = list.filter((t) => t.licenseStatus === 'expiring');
    } else if (filter === 'active') {
      list = list.filter((t) => t.dispatchStatus === 'active');
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.phone.includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.licenseNumber.toLowerCase().includes(q),
      );
    }

    const pendingAudits = await this.audits.list();

    return {
      technicians: list,
      total: list.length,
      activeCount: list.filter((t) => t.dispatchStatus === 'active').length,
      pendingAuditCount: pendingAudits.filter((a) => a.status === 'pending').length,
      expiringCount: list.filter((t) => t.licenseStatus === 'expiring').length,
    };
  }

  async updateStatus(
    id: string,
    body: { dispatchStatus?: string; amoebaCoefficient?: number | string },
  ) {
    const existing = await this.technicians.findById(id);
    if (!existing) {
      throw new NotFoundException({ error: '技师不存在' });
    }

    const tech = await this.technicians.update(id, {
      ...(body.dispatchStatus
        ? { dispatchStatus: body.dispatchStatus as typeof existing.dispatchStatus }
        : {}),
      ...(body.amoebaCoefficient ? { amoebaCoefficient: Number(body.amoebaCoefficient) } : {}),
    });

    return { success: true, technician: tech };
  }
}

/** 技师端本人档案业务逻辑。 */
@Injectable()
export class TechnicianSelfService {
  constructor(private readonly profile: TechnicianProfileRepository) {}

  async get() {
    return { success: true, data: await this.profile.get() };
  }

  async toggleStatus(body: { isOnline?: boolean }) {
    const current = await this.profile.get();

    const isOnline = typeof body.isOnline === 'boolean' ? body.isOnline : !current.isOnline;

    const technician = await this.profile.update({ isOnline });

    return {
      success: true,
      message: technician.isOnline ? '已切换至接单中' : '已切换至休息中',
      data: technician,
    };
  }
}
