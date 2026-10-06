import { Injectable, NotFoundException } from '@nestjs/common';
import type { Technician } from '@hnhall/shared';

import { AdminTechnicianRepository } from '../../database/repositories/admin-technician.repository';
import { AuditRepository } from '../../database/repositories/audit.repository';

/**
 * 资质与合规审核业务逻辑（企业后台）。
 *
 * ⚠️ R5 红线相关：审核是**纯人工**结论，本服务不做任何自动识别。
 * ⚠️ 审批通过会**直接写入技师名册**——这是原实现的行为，迁移期照搬；
 *    接真实审批流后应改为事务 + 领域服务（当前两步写库未包在事务里，属已知遗留）。
 */
@Injectable()
export class QualificationService {
  constructor(
    private readonly audits: AuditRepository,
    private readonly technicians: AdminTechnicianRepository,
  ) {}

  async list() {
    return { audits: await this.audits.list() };
  }

  async approve(id: string) {
    const audit = await this.audits.findById(id);
    if (!audit) {
      throw new NotFoundException({ error: '审核工单不存在' });
    }

    await this.audits.update(id, { status: 'approved' });

    // 已在该手机号下登记的技师 → 直接放开接单；否则新建一条名册记录
    const existing = await this.technicians.findByPhoneDigits(audit.phone.replace(/\D/g, ''));

    if (existing) {
      await this.technicians.update(existing.id, {
        dispatchStatus: 'active',
        dispatchStatusText: '正常展业接单',
        licenseStatus: 'normal',
      });
    } else {
      const newTech: Technician = {
        id: `tech-${Date.now()}`,
        code: 'HN-TEC-8902',
        name: audit.applicantName,
        title: '合规植保机手 (已入库)',
        phone: audit.phone,
        avatar: audit.avatar,
        licenseNumber: audit.licenseNumber,
        licenseThumb: audit.licenseScanUrl,
        licenseAuthority: audit.licenseAuthority,
        licenseExpiry: '2029-09-09',
        licenseStatus: 'normal',
        amoebaTier: 'trainee',
        amoebaTierName: '预备期学员',
        amoebaCoefficient: 1.0,
        teamName: audit.assignedAmoebaTeam,
        commissionRatio: '实训分成基础70%',
        menteeCount: 0,
        independentMentees: 0,
        teamMonthlyOutput: 0,
        mentorshipAllowanceCents: 20000,
        gridName: audit.targetGrid,
        coverageRadius: 15,
        boundEquipment: '大疆 T60',
        completedOrders: 0,
        operationAcreage: 0,
        rating: 5.0,
        reviewCount: 0,
        goodReviewRate: 100,
        dispatchStatus: 'active',
        dispatchStatusText: '正常展业接单',
      };
      await this.technicians.create(newTech);
    }

    // 响应用更新后的审核单（原型里 audit 对象是被就地改过的同一个引用）
    const updated = await this.audits.findById(id);

    return {
      success: true,
      message: '审核通过！已生成农药经营合规电子档案，系统已开通接单派发权限。',
      audit: updated,
    };
  }

  async reject(id: string, action?: string) {
    const audit = await this.audits.findById(id);
    if (!audit) {
      throw new NotFoundException({ error: '审核工单不存在' });
    }

    const updated = await this.audits.update(id, {
      status: action === 'revision' ? 'revision' : 'rejected',
    });

    return {
      success: true,
      message:
        action === 'revision'
          ? '已退回补正材料，已通知申请人重新提交。'
          : '已驳回资质申请，系统已自动向申请人发送短信。',
      audit: updated,
    };
  }
}
