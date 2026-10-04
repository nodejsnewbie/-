import React from 'react';

interface KpiCardsProps {
  onNavigateTab: (tab: string) => void;
}

/** 四张 KPI 卡（今日工单 / 技师在网 / 出库额 / 分红池，静态示意值）（原样迁入）。 */
export const KpiCards: React.FC<KpiCardsProps> = ({ onNavigateTab }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI Card 1: 今日服务订单 */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-semibold text-on-surface-variant">
              今日服务订单总揽
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>+18.4%
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-[32px] text-primary font-extrabold tracking-tight font-mono tabular-nums">
              148
            </span>
            <span className="text-[12px] text-on-surface-variant">单</span>
            <span className="text-[12px] text-on-surface-variant ml-auto font-mono">
              同比昨日 +23 单
            </span>
          </div>
        </div>
        <div className="pt-2 bg-surface-container-low/70 rounded-lg p-2.5 border border-surface-container">
          <div className="grid grid-cols-3 text-center gap-1 text-[12px]">
            <div className="flex flex-col">
              <span className="text-on-surface-variant text-[11px]">待调度</span>
              <span className="text-[15px] text-tertiary-container font-extrabold font-mono">
                12
              </span>
            </div>
            <div className="flex flex-col border-x border-surface-variant">
              <span className="text-on-surface-variant text-[11px]">作业中</span>
              <span className="text-[15px] text-secondary font-extrabold font-mono">38</span>
            </div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant text-[11px]">已完工</span>
              <span className="text-[15px] text-primary font-extrabold font-mono">98</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Card 2: 一线技术人员在网 */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-semibold text-on-surface-variant">
              全国一线技师在线网格
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
              持证率 98.2%
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-[32px] text-on-surface font-extrabold tracking-tight font-mono tabular-nums">
              386
            </span>
            <span className="text-[12px] text-on-surface-variant font-mono">/ 420 人</span>
            <span className="text-[13px] text-secondary ml-auto font-bold font-mono">
              91.9% 出勤
            </span>
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
            <div className="bg-primary h-full rounded-full" style={{ width: '91.9%' }}></div>
          </div>
          <div className="flex justify-between text-[11px] text-on-surface-variant">
            <span>飞防机手: 214人</span>
            <span>高工植保师: 172人</span>
          </div>
        </div>
      </div>

      {/* KPI Card 3: 农资溯源销售与配方出库 */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-semibold text-on-surface-variant">
              农资一物一码出库额
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
              处方率 82.5%
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-[16px] text-primary font-bold">¥</span>
            <span className="text-[32px] text-on-surface font-extrabold tracking-tight font-mono tabular-nums">
              128,450
            </span>
            <span className="text-[13px] text-on-surface-variant font-mono">.00</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 text-on-surface-variant text-[12px] border-t border-surface-container">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
            <span>三证合规检出 100%</span>
          </div>
          <span className="text-tertiary-container font-semibold text-[11px]">开方 216 批次</span>
        </div>
      </div>

      {/* KPI Card 4: 阿米巴分红池 */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] font-semibold text-on-surface-variant">
              本月阿米巴创客分红池
            </span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              26组 达标
            </span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-[16px] text-secondary font-bold">¥</span>
            <span className="text-[32px] text-secondary font-extrabold tracking-tight font-mono tabular-nums">
              342,800
            </span>
            <span className="text-[13px] text-on-surface-variant font-mono">.00</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 text-on-surface-variant text-[12px] border-t border-surface-container">
          <span className="text-[11px]">结余池预留: 18.0%</span>
          <button
            onClick={() => onNavigateTab('amoeba-bonus-and-commission-settlement')}
            className="text-primary text-[12px] font-bold hover:underline flex items-center cursor-pointer"
          >
            查看明细<span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
