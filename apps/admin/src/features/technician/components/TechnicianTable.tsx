import React from 'react';
import type { Technician } from '@hnhall/shared';

interface TechnicianTableProps {
  filteredTechs: Technician[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenAuditDrawer: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  onOpenDossier: (tech: Technician) => void;
  onOpenMatrix: () => void;
}

/** 技师全景花名册数据表 + 表尾批量操作（自 TechnicianManagement 原样迁入）。 */
export const TechnicianTable: React.FC<TechnicianTableProps> = ({
  filteredTechs,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpenAuditDrawer,
  onShowToast,
  onOpenDossier,
  onOpenMatrix,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col border border-surface-container">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">
                <input
                  className="rounded accent-primary w-4 h-4 cursor-pointer"
                  type="checkbox"
                  checked={selectedIds.length === filteredTechs.length && filteredTechs.length > 0}
                  onChange={onToggleSelectAll}
                />
              </th>
              <th className="py-3 px-3">技师身份与基本信息</th>
              <th className="py-3 px-3">农药经营许可证 (法定核验)</th>
              <th className="py-3 px-3">阿米巴合伙层级 / 激励组</th>
              <th className="py-3 px-3">带徒团队 / 产值贡献</th>
              <th className="py-3 px-3">常驻网格片区</th>
              <th className="py-3 px-3">履约单量 / 评分</th>
              <th className="py-3 px-3">调度状态</th>
              <th className="py-3 px-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-[13px] text-on-surface">
            {filteredTechs.map((tech) => {
              const isExpiring = tech.licenseStatus === 'expiring';
              const isPending = tech.dispatchStatus === 'pending_qualification';

              return (
                <tr
                  key={tech.id}
                  className={`hover:bg-surface-container-low/60 transition-colors ${
                    isExpiring ? 'bg-error-container/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-center">
                    <input
                      className="rounded accent-primary w-4 h-4 cursor-pointer"
                      type="checkbox"
                      checked={selectedIds.includes(tech.id)}
                      onChange={() => onToggleSelect(tech.id)}
                    />
                  </td>

                  {/* Tech Info */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-11 h-11 rounded-full object-cover shadow-xs bg-surface-container shrink-0"
                        alt={tech.name}
                        src={tech.avatar}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-primary text-[14px]">{tech.name}</span>
                          <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                            {tech.title}
                          </span>
                        </div>
                        <span className="text-on-surface-variant text-[11px] font-mono">
                          工号: {tech.code}
                        </span>
                        <span className="text-on-surface-variant text-[11px]">{tech.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* License */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-start gap-2.5">
                      <div
                        className="w-10 h-10 rounded bg-surface-container overflow-hidden shrink-0 cursor-pointer shadow-xs relative group border border-surface-container"
                        onClick={() => {
                          if (isPending) onOpenAuditDrawer();
                          else onOpenDossier(tech);
                        }}
                      >
                        <img
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                          alt="许可证缩略图"
                          src={tech.licenseThumb}
                          referrerPolicy="no-referrer"
                        />
                        <span className="material-symbols-outlined absolute inset-0 m-auto text-on-primary opacity-0 group-hover:opacity-100 transition-opacity text-[18px]">
                          zoom_in
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[12px] font-bold text-on-surface truncate max-w-[130px]">
                            {tech.licenseNumber}
                          </span>
                          {isExpiring ? (
                            <span
                              className="material-symbols-outlined text-error text-[16px]"
                              title="证书即将到期需复审"
                            >
                              warning
                            </span>
                          ) : isPending ? (
                            <span className="px-1 rounded bg-error text-on-error text-[10px] font-bold">
                              待核验
                            </span>
                          ) : (
                            <span
                              className="material-symbols-outlined text-secondary text-[16px]"
                              title="官方接口已验真"
                            >
                              check_circle
                            </span>
                          )}
                        </div>
                        <span className="text-on-surface-variant text-[11px]">
                          {tech.licenseAuthority}
                        </span>
                        <span
                          className={`text-[11px] font-semibold ${
                            isExpiring
                              ? 'text-error font-bold'
                              : isPending
                                ? 'text-on-surface-variant'
                                : 'text-secondary'
                          }`}
                        >
                          {isExpiring
                            ? `剩 ${tech.licenseExpiryDays} 天到期 (${tech.licenseExpiry})`
                            : isPending
                              ? 'OCR匹配通过率 98.4%'
                              : `有效期至 ${tech.licenseExpiry} (正常)`}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Amoeba Tier */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                          {tech.amoebaTierName}
                        </span>
                        <span className="text-tertiary font-bold text-[11px]">
                          {tech.amoebaCoefficient}x 系数
                        </span>
                      </div>
                      <span className="text-on-surface-variant text-[11px] mt-0.5 font-medium">
                        {tech.teamName}
                      </span>
                      <span className="text-on-surface-variant/80 text-[10px]">
                        {tech.commissionRatio}
                      </span>
                    </div>
                  </td>

                  {/* Team Output */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-[12px] font-semibold text-on-surface">
                        <span className="material-symbols-outlined text-[15px] text-primary">
                          diversity_3
                        </span>
                        <span>
                          带徒 <strong>{tech.menteeCount}</strong> 人
                          {tech.independentMentees > 0 && ` (${tech.independentMentees}人已独立)`}
                        </span>
                      </div>
                      <span className="text-secondary font-bold text-[11px] mt-0.5">
                        月团队产值 ¥{(tech.teamMonthlyOutput / 10000).toFixed(2)} 万
                      </span>
                      <span className="text-on-surface-variant text-[10px]">
                        师傅管理津贴: ¥{tech.mentorshipAllowance}/月
                      </span>
                    </div>
                  </td>

                  {/* Grid Station */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-on-surface">{tech.gridName}</span>
                      <span className="text-on-surface-variant text-[11px]">
                        覆盖半径: {tech.coverageRadius}公里
                      </span>
                      <span className="text-on-surface-variant text-[10px]">
                        {tech.boundEquipment}
                      </span>
                    </div>
                  </td>

                  {/* Orders and Rating */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-on-surface font-mono">
                          {tech.completedOrders} 单
                        </span>
                        <span className="text-on-surface-variant text-[11px]">
                          作业 {(tech.operationAcreage / 1000).toFixed(1)}k 亩
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 text-tertiary text-[11px] font-bold mt-0.5">
                        <span
                          className="material-symbols-outlined text-[14px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span>{tech.rating} 星</span>
                        <span className="text-on-surface-variant font-normal text-[10px]">
                          (好评率 {tech.goodReviewRate}%)
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    {tech.dispatchStatus === 'active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        <span>正常展业接单</span>
                      </span>
                    ) : tech.dispatchStatus === 'need_annual_review' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                        <span>急需年审复核</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                        <span>等待资质审核</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {isPending ? (
                        <>
                          <button
                            className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container text-[12px] font-bold hover:bg-secondary hover:text-on-secondary transition-colors"
                            onClick={onOpenAuditDrawer}
                            type="button"
                          >
                            审核入库
                          </button>
                          <button
                            className="px-2 py-1 rounded text-on-surface-variant hover:bg-surface-container text-[12px]"
                            onClick={() => onShowToast('已向申请人发送材料补正短信通知', 'info')}
                            type="button"
                          >
                            驳回申请
                          </button>
                        </>
                      ) : isExpiring ? (
                        <>
                          <button
                            className="px-2.5 py-1 rounded bg-primary-container text-on-primary text-[12px] font-bold shadow-xs hover:bg-primary transition-all"
                            onClick={onOpenAuditDrawer}
                            type="button"
                          >
                            立即年审
                          </button>
                          <button
                            className="px-2 py-1 rounded text-on-surface-variant hover:bg-surface-container text-[12px]"
                            onClick={() =>
                              onShowToast(
                                `已向 ${tech.name} 发送农药经营许可证换证催办通知短信！`,
                                'info',
                              )
                            }
                            type="button"
                          >
                            发催办短信
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-2 py-1 rounded text-primary hover:bg-surface-container text-[12px] font-medium"
                            onClick={() => onOpenDossier(tech)}
                            type="button"
                          >
                            电子档案
                          </button>
                          <button
                            className="px-2 py-1 rounded text-on-surface-variant hover:bg-surface-container text-[12px] font-medium"
                            onClick={onOpenMatrix}
                            type="button"
                          >
                            分红配置
                          </button>
                          <button
                            className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
                            title="冻结/解冻权限"
                            onClick={() =>
                              onShowToast(`技师 ${tech.name} 权限状态已核验安全锁定。`, 'info')
                            }
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[17px]">lock</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-surface-container text-[12px]">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span>
            已选中 <strong className="text-primary font-bold">{selectedIds.length}</strong> /{' '}
            {filteredTechs.length} 位技术人员
          </span>
          <button
            className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-medium"
            type="button"
            onClick={() =>
              onShowToast(
                `已为选中的 ${selectedIds.length || 1} 位技师批量开启网格常驻站调度调整向导`,
                'info',
              )
            }
          >
            批量修改片区
          </button>
          <button
            className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-medium"
            type="button"
            onClick={() =>
              onShowToast('已通过国家农业云接口触发批量电子许可证效期验证指令！', 'success')
            }
          >
            批量资质核验推送信件
          </button>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant">
          <span>第 1 / 39 页</span>
          <div className="flex items-center gap-1 font-mono">
            <button
              className="p-1 rounded bg-surface-container text-on-surface-variant disabled:opacity-40"
              disabled
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button
              className="px-2.5 py-0.5 rounded bg-primary-container text-on-primary font-bold"
              type="button"
            >
              1
            </button>
            <button
              className="px-2.5 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface"
              type="button"
            >
              2
            </button>
            <button
              className="px-2.5 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface"
              type="button"
            >
              3
            </button>
            <span className="px-1 text-on-surface-variant">...</span>
            <button
              className="px-2.5 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface"
              type="button"
            >
              39
            </button>
            <button
              className="p-1 rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
