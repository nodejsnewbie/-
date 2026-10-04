import React from 'react';

// 指标卡当前全部为静态示意值，无 props 依赖；保留组件边界便于后续接真实数据。
/** 四格指标总览（Bento 风格，自 TechnicianManagement 原样迁入）。 */
export const TechnicianMetricsGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Workforce Total */}
      <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
        <div className="flex items-center justify-between z-10">
          <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
            全国一线技术人员总库
          </span>
          <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">groups</span>
          </span>
        </div>
        <div className="mt-3 z-10">
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-extrabold text-primary font-mono tabular-nums">
              386
            </span>
            <span className="text-[13px] text-on-surface-variant">人</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[12px]">
            <span className="text-on-surface-variant">在岗活跃实时调度</span>
            <span className="text-secondary font-bold font-mono">342 人 (88.6%)</span>
          </div>
        </div>
      </div>

      {/* Metric 2: Pending Audits */}
      <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
        <div className="flex items-center justify-between z-10">
          <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
            待审核入库资质
          </span>
          <span className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          </span>
        </div>
        <div className="mt-3 z-10">
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-extrabold text-error font-mono tabular-nums">14</span>
            <span className="text-[13px] text-on-surface-variant">份加急</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[12px]">
            <span className="text-on-surface-variant">平均审核时效目标</span>
            <span className="text-error font-bold font-mono">≤ 2.0 小时 (已超时 2)</span>
          </div>
        </div>
      </div>

      {/* Metric 3: Pesticide Business License Compliance */}
      <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
        <div className="flex items-center justify-between z-10">
          <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
            农药经营许可证持证率
          </span>
          <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </span>
        </div>
        <div className="mt-3 z-10">
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-extrabold text-secondary font-mono tabular-nums">
              95.3%
            </span>
            <span className="text-[13px] text-on-surface-variant">368 / 386 人</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[12px]">
            <span className="text-on-surface-variant">三证齐全验真上云</span>
            <span className="text-secondary font-bold">农业农村厅接口直连</span>
          </div>
        </div>
      </div>

      {/* Metric 4: Amoeba Partners */}
      <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
        <div className="flex items-center justify-between z-10">
          <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
            认证合伙人 / 阿米巴骨干
          </span>
          <span className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined text-[20px]">military_tech</span>
          </span>
        </div>
        <div className="mt-3 z-10">
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] font-extrabold text-tertiary font-mono tabular-nums">
              85
            </span>
            <span className="text-[13px] text-on-surface-variant">人 (带徒裂变中)</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[12px]">
            <span className="text-on-surface-variant">本月裂变师徒战队</span>
            <span className="text-tertiary font-bold">28 个创客小组</span>
          </div>
        </div>
      </div>
    </div>
  );
};
