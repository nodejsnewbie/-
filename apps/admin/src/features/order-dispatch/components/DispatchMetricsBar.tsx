import React from 'react';

/** 派单页顶部四格指标（静态示意值，自 OrderDispatch 原样迁入）。 */
export const DispatchMetricsBar: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
            待调度工单 (紧急待派)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[32px] font-extrabold text-on-surface font-mono tabular-nums">
              14
            </span>
            <span className="text-[12px] text-error font-bold font-mono">4单近超期</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[26px]">pending_actions</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            在线网格技师
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[32px] font-extrabold text-on-surface font-mono tabular-nums">
              38
            </span>
            <span className="text-[12px] text-on-surface-variant">/ 45人已上岗</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[26px]">groups</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            今日飞防与巡检作业面
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[32px] font-extrabold text-on-surface font-mono tabular-nums">
              1,420
            </span>
            <span className="text-[12px] text-on-surface-variant font-mono">亩 · 履约率 98.4%</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
          <span className="material-symbols-outlined text-[26px]">agriculture</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-error"></span>
            气象/病害异常预警
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[32px] font-extrabold text-error font-mono tabular-nums">2</span>
            <span className="text-[12px] text-on-surface-variant">处路口镇强降雨暂缓</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-error">
          <span className="material-symbols-outlined text-[26px]">warning</span>
        </div>
      </div>
    </div>
  );
};
