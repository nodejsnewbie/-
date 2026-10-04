import React from 'react';

interface TechnicianHeaderProps {
  onOpenAuditDrawer: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  onFilterExpiring: () => void;
}

/** 顶部命令条 + 快捷操作按钮组（自 TechnicianManagement 原样迁入）。 */
export const TechnicianHeader: React.FC<TechnicianHeaderProps> = ({
  onOpenAuditDrawer,
  onShowToast,
  onFilterExpiring,
}) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold tracking-wide">
            国家农业农村部合规标准联网端
          </span>
          <span className="text-on-surface-variant text-[12px]">
            · 湘农审字[2024]第091号准入规范
          </span>
        </div>
        <h1 className="text-[24px] font-bold text-primary tracking-tight">
          技术人员管理与合规资质审核中心
        </h1>
        <p className="text-[13px] text-on-surface-variant mt-1">
          负责全网300-400名一线植保机手、农药配方师实名建档、法定经营许可证全量核验与阿米巴合伙人层级权益配置。
        </p>
      </div>

      {/* Quick Operations Action Group */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() =>
            onShowToast('正在导出《华农智服 2024 全网技术人员在册合规花名册.xlsx》', 'info')
          }
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors text-[13px] font-semibold shadow-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">cloud_download</span>
          <span>导出在册花名册</span>
        </button>
        <button
          onClick={onFilterExpiring}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors text-[13px] font-semibold shadow-xs"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">fact_check</span>
          <span>批量发证效期预警(6)</span>
        </button>
        <button
          onClick={onOpenAuditDrawer}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all text-[14px] font-bold shadow-sm active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          <span>处理待审核资质 (14)</span>
        </button>
      </div>
    </div>
  );
};
