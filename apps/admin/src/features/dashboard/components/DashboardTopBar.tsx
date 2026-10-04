import React from 'react';

interface DashboardTopBarProps {
  currentRegion: string;
  timeRange: 'today' | '7days' | '30days';
  onSelectTimeRange: (r: 'today' | '7days' | '30days') => void;
  onOpenEmergency: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

/** 总览页顶栏：元信息 + 时间范围切换 + 快捷操作（自 DashboardOverview 原样迁入）。 */
export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  currentRegion,
  timeRange,
  onSelectTimeRange,
  onOpenEmergency,
  onShowToast,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-surface-container">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[24px]">monitoring</span>
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[17px] font-bold text-on-surface">数字农服数字运营总控台</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                实时刷新中 (10s)
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              全国农情调度网格 · 统一阿米巴数字化收益分配中心
            </p>
          </div>
        </div>

        <div className="hidden sm:block h-8 w-px bg-surface-variant"></div>

        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-on-surface-variant">当前网格:</span>
          <div className="px-3 py-1.5 rounded-lg bg-surface-container font-semibold text-primary flex items-center gap-1">
            <span>{currentRegion}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end lg:self-auto">
        <div className="flex items-center bg-surface-container rounded-lg p-0.5 text-[12px]">
          <button
            onClick={() => onSelectTimeRange('today')}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${
              timeRange === 'today'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => onSelectTimeRange('7days')}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${
              timeRange === '7days'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            近7日
          </button>
          <button
            onClick={() => onSelectTimeRange('30days')}
            className={`px-3 py-1 rounded-md transition-all font-semibold ${
              timeRange === '30days'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            近30日
          </button>
        </div>

        <button
          onClick={onOpenEmergency}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-all text-[12px] font-bold shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">emergency_share</span>
          <span>紧急下发调度令</span>
        </button>

        <button
          onClick={() =>
            onShowToast('《华农智服 2024 数字运营总控日结报表.pdf》已生成，正在下载...', 'info')
          }
          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
          title="导出日结运营报表"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
        </button>
      </div>
    </div>
  );
};
