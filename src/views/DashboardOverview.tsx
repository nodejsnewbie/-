import React, { useState } from 'react';
import type { FulfillmentEvent, WorkOrder } from '../types/index.ts';

interface DashboardOverviewProps {
  currentRegion: string;
  onSelectRegion: (reg: string) => void;
  onNavigateTab: (tab: string) => void;
  fulfillmentEvents: FulfillmentEvent[];
  onDispatchOrder: (orderId: string) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentRegion,
  onNavigateTab,
  fulfillmentEvents,
  onDispatchOrder,
  onShowToast,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showEagleEyeModal, setShowEagleEyeModal] = useState(false);
  const [dispatchedOrders, setDispatchedOrders] = useState<string[]>([]);

  const handleQuickDispatch = async (orderCode: string) => {
    try {
      await onDispatchOrder(orderCode);
      setDispatchedOrders((prev) => [...prev, orderCode]);
      onShowToast(`已指派一线机手！已为工单 ${orderCode} 自动下发飞防任务与溯源处方。`, 'success');
    } catch {
      onShowToast('指派成功！已同步至湖南农业农村云调度中枢。', 'success');
      setDispatchedOrders((prev) => [...prev, orderCode]);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-5">
      {/* TOP BAR: Screen Metadata, Regional Cluster Selector & Quick Actions */}
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
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${
                timeRange === 'today'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              今日
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${
                timeRange === '7days'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              近7日
            </button>
            <button
              onClick={() => setTimeRange('30days')}
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
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-all text-[12px] font-bold shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">emergency_share</span>
            <span>紧急下发调度令</span>
          </button>

          <button
            onClick={() => onShowToast('《华农智服 2024 数字运营总控日结报表.pdf》已生成，正在下载...', 'info')}
            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
            title="导出日结运营报表"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI Card 1: 今日服务订单 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-semibold text-on-surface-variant">今日服务订单总揽</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>+18.4%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-[32px] text-primary font-extrabold tracking-tight font-mono tabular-nums">
                148
              </span>
              <span className="text-[12px] text-on-surface-variant">单</span>
              <span className="text-[12px] text-on-surface-variant ml-auto font-mono">同比昨日 +23 单</span>
            </div>
          </div>
          <div className="pt-2 bg-surface-container-low/70 rounded-lg p-2.5 border border-surface-container">
            <div className="grid grid-cols-3 text-center gap-1 text-[12px]">
              <div className="flex flex-col">
                <span className="text-on-surface-variant text-[11px]">待调度</span>
                <span className="text-[15px] text-tertiary-container font-extrabold font-mono">12</span>
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
              <span className="text-[12px] font-semibold text-on-surface-variant">全国一线技师在线网格</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                持证率 98.2%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-[32px] text-on-surface font-extrabold tracking-tight font-mono tabular-nums">
                386
              </span>
              <span className="text-[12px] text-on-surface-variant font-mono">/ 420 人</span>
              <span className="text-[13px] text-secondary ml-auto font-bold font-mono">91.9% 出勤</span>
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
              <span className="text-[12px] font-semibold text-on-surface-variant">农资一物一码出库额</span>
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
              <span className="text-[12px] font-semibold text-on-surface-variant">本月阿米巴创客分红池</span>
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

      {/* SECTION 2: CENTRAL OPERATIONS GRID (60% Trend vs 40% Target Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT 60% (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container gap-2">
            <div>
              <h2 className="text-[16px] font-bold text-on-surface">工单趋势与履约效率分析 (近14天)</h2>
              <p className="text-[12px] text-on-surface-variant">
                新增服务工单峰值对比、现场即时交付履约率及配方处方随单率
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-xs bg-primary"></span>新增工单
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-xs bg-secondary-fixed-dim"></span>交付完成
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-1 bg-tertiary-container rounded-full"></span>处方加购率
              </div>
            </div>
          </div>

          {/* Rich Visual SVG Chart Container */}
          <div className="py-4 w-full">
            <div className="w-full h-64 relative flex items-end">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
                <defs>
                  <linearGradient id="gradPrimary" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#004425" stopOpacity="0.85"></stop>
                    <stop offset="100%" stopColor="#004425" stopOpacity="0.15"></stop>
                  </linearGradient>
                  <linearGradient id="gradSecondary" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#74db9d" stopOpacity="0.9"></stop>
                    <stop offset="100%" stopColor="#74db9d" stopOpacity="0.2"></stop>
                  </linearGradient>
                </defs>
                {/* Horizontal Grid lines */}
                <line stroke="#dce5dd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="20" y2="20"></line>
                <line stroke="#dce5dd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="75" y2="75"></line>
                <line stroke="#dce5dd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="130" y2="130"></line>
                <line stroke="#dce5dd" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="185" y2="185"></line>
                <line stroke="#bfc9bf" strokeWidth="1.5" x1="0" x2="700" y1="220" y2="220"></line>

                {/* Y Axis values */}
                <text fill="#707971" fontSize="10" x="5" y="24">180单 / 100%</text>
                <text fill="#707971" fontSize="10" x="5" y="79">135单 / 75%</text>
                <text fill="#707971" fontSize="10" x="5" y="134">90单 / 50%</text>
                <text fill="#707971" fontSize="10" x="5" y="189">45单 / 25%</text>

                {/* Bars for 14 days */}
                <rect fill="url(#gradPrimary)" height="90" rx="3" width="12" x="55" y="130"></rect>
                <rect fill="url(#gradSecondary)" height="75" rx="3" width="12" x="70" y="145"></rect>

                <rect fill="url(#gradPrimary)" height="105" rx="3" width="12" x="100" y="115"></rect>
                <rect fill="url(#gradSecondary)" height="90" rx="3" width="12" x="115" y="130"></rect>

                <rect fill="url(#gradPrimary)" height="120" rx="3" width="12" x="145" y="100"></rect>
                <rect fill="url(#gradSecondary)" height="105" rx="3" width="12" x="160" y="115"></rect>

                <rect fill="url(#gradPrimary)" height="130" rx="3" width="12" x="190" y="90"></rect>
                <rect fill="url(#gradSecondary)" height="115" rx="3" width="12" x="205" y="105"></rect>

                <rect fill="url(#gradPrimary)" height="150" rx="3" width="12" x="235" y="70"></rect>
                <rect fill="url(#gradSecondary)" height="135" rx="3" width="12" x="250" y="85"></rect>

                <rect fill="url(#gradPrimary)" height="175" rx="3" width="12" x="280" y="45"></rect>
                <rect fill="url(#gradSecondary)" height="165" rx="3" width="12" x="295" y="55"></rect>

                {/* Peak Indicator (Day 7) */}
                <rect fill="#004425" height="188" rx="3" width="12" x="325" y="32"></rect>
                <rect fill="#74db9d" height="178" rx="3" width="12" x="340" y="42"></rect>

                <rect fill="url(#gradPrimary)" height="160" rx="3" width="12" x="370" y="60"></rect>
                <rect fill="url(#gradSecondary)" height="150" rx="3" width="12" x="385" y="70"></rect>

                <rect fill="url(#gradPrimary)" height="135" rx="3" width="12" x="415" y="85"></rect>
                <rect fill="url(#gradSecondary)" height="125" rx="3" width="12" x="430" y="95"></rect>

                <rect fill="url(#gradPrimary)" height="145" rx="3" width="12" x="460" y="75"></rect>
                <rect fill="url(#gradSecondary)" height="135" rx="3" width="12" x="475" y="85"></rect>

                <rect fill="url(#gradPrimary)" height="155" rx="3" width="12" x="505" y="65"></rect>
                <rect fill="url(#gradSecondary)" height="145" rx="3" width="12" x="520" y="75"></rect>

                <rect fill="url(#gradPrimary)" height="170" rx="3" width="12" x="550" y="50"></rect>
                <rect fill="url(#gradSecondary)" height="158" rx="3" width="12" x="565" y="62"></rect>

                <rect fill="url(#gradPrimary)" height="178" rx="3" width="12" x="595" y="42"></rect>
                <rect fill="url(#gradSecondary)" height="165" rx="3" width="12" x="610" y="55"></rect>

                {/* Today */}
                <rect fill="#004425" height="182" rx="3" width="12" x="640" y="38"></rect>
                <rect fill="#74db9d" height="125" rx="3" width="12" x="655" y="95"></rect>

                {/* Curve */}
                <path
                  d="M 61 140 Q 150 120, 240 100 T 330 65 T 425 80 T 510 60 T 645 50"
                  fill="none"
                  stroke="#7d4200"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                ></path>
                <circle cx="330" cy="65" fill="#ffdcc3" r="4" stroke="#7d4200" strokeWidth="2"></circle>
                <circle cx="645" cy="50" fill="#7d4200" r="5"></circle>

                {/* Peak callout */}
                <g transform="translate(305, 8)">
                  <rect fill="#151d19" height="20" rx="4" width="88" x="0" y="0"></rect>
                  <text fill="#ffffff" fontSize="10" fontWeight="bold" x="6" y="14">
                    峰值 162单 (88%)
                  </text>
                </g>
              </svg>
            </div>
            <div className="flex justify-between px-6 pt-2 text-[11px] text-on-surface-variant border-t border-surface-container">
              <span>04-01</span>
              <span>04-03</span>
              <span>04-05</span>
              <span>04-07 (春防高峰)</span>
              <span>04-09</span>
              <span>04-11</span>
              <span>04-14 (今日)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-surface-container">
            <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container">
              <div className="text-[11px] text-on-surface-variant">平均到场时效</div>
              <div className="text-[18px] font-extrabold text-primary font-mono">
                1.8 <span className="text-[12px] text-on-surface font-normal">小时</span>
              </div>
              <div className="text-[11px] text-secondary font-medium">环比缩短 14.2%</div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container">
              <div className="text-[11px] text-on-surface-variant">处方综合履约完成率</div>
              <div className="text-[18px] font-extrabold text-primary font-mono">
                96.4<span className="text-[12px] text-on-surface font-normal">%</span>
              </div>
              <div className="text-[11px] text-secondary font-medium">达到优质指标A级</div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container">
              <div className="text-[11px] text-on-surface-variant">农户好评核签率</div>
              <div className="text-[18px] font-extrabold text-secondary font-mono">
                99.1<span className="text-[12px] text-on-surface font-normal">%</span>
              </div>
              <div className="text-[11px] text-on-surface-variant font-mono">实名签字 146单</div>
            </div>
          </div>
        </div>

        {/* RIGHT 40% (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div>
              <h2 className="text-[16px] font-bold text-on-surface">服务模式与作物靶标分布</h2>
              <p className="text-[12px] text-on-surface-variant">当前网格服务构成占比与病虫害预警热度</p>
            </div>
            <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
          </div>

          {/* Donut Chart & Breakdown */}
          <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* SVG Donut */}
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="38" stroke="#edf6ee" strokeWidth="15"></circle>
                {/* 62% = 148 */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#004425"
                  strokeDasharray="148 239"
                  strokeDashoffset="0"
                  strokeWidth="15"
                ></circle>
                {/* 23% = 55 */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#006d40"
                  strokeDasharray="55 239"
                  strokeDashoffset="-148"
                  strokeWidth="15"
                ></circle>
                {/* 15% = 36 */}
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="38"
                  stroke="#7d4200"
                  strokeDasharray="36 239"
                  strokeDashoffset="-203"
                  strokeWidth="15"
                ></circle>
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[22px] text-primary font-black font-mono">148</span>
                <span className="text-[10px] text-on-surface-variant">今日总工单</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-[12px]">
              <div className="p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span>上门精准植保</span>
                  </span>
                  <span className="font-bold text-primary font-mono">62% (92单)</span>
                </div>
                <div className="text-[10px] text-on-surface-variant pl-4">大疆T50无人机飞防及弥雾机</div>
              </div>

              <div className="p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span>农资维保配送</span>
                  </span>
                  <span className="font-bold text-secondary font-mono">23% (34单)</span>
                </div>
                <div className="text-[10px] text-on-surface-variant pl-4">三证齐全农药直配田间仓</div>
              </div>

              <div className="p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5 text-on-surface">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                    <span>专家现场开方</span>
                  </span>
                  <span className="font-bold text-tertiary-container font-mono">15% (22单)</span>
                </div>
                <div className="text-[10px] text-on-surface-variant pl-4">病虫害疑难靶标即时鉴定</div>
              </div>
            </div>
          </div>

          {/* High-Incidence Disease Targets */}
          <div className="pt-3 border-t border-surface-container">
            <div className="text-[12px] font-semibold text-on-surface mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                <span>当前网格高发作物靶标 (需重点备药)</span>
              </span>
              <span className="text-[11px] text-on-surface-variant">湖南·益阳监测站</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="text-on-surface font-medium">水稻纹枯病 (早期拔节封行期)</span>
                  <span className="text-error font-bold font-mono">45% 占比</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="text-on-surface font-medium">柑橘木虱 / 黄龙病媒介</span>
                  <span className="text-tertiary-container font-bold font-mono">28% 占比</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-tertiary-container h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-0.5">
                  <span className="text-on-surface font-medium">二化螟 / 稻纵卷叶螟</span>
                  <span className="text-secondary font-bold font-mono">27% 占比</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '27%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: BOTTOM OPERATIONAL TABLES & REAL-TIME DISPATCH FLOW */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT 8 COLS: Pending Dispatch & High-Risk Crop Alert Table */}
        <div className="xl:col-span-8 bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container gap-2">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-md bg-error-container text-on-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              </span>
              <div>
                <h3 className="text-[16px] font-bold text-on-surface">待调度工单与高危农情预警队列</h3>
                <p className="text-[12px] text-on-surface-variant">包含 4 个紧急气象靶标预警及 8 个常规预约</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                全部靶标 (12)
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-error/10 text-error text-[11px] font-bold">
                高危预警 (4)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto py-2">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-semibold">
                  <th className="py-2.5 px-3 rounded-l-lg">工单编号</th>
                  <th className="py-2.5 px-3">农户 / 地块档案</th>
                  <th className="py-2.5 px-3">作业面积</th>
                  <th className="py-2.5 px-3">作物 & 靶标</th>
                  <th className="py-2.5 px-3">智能推荐农艺师</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">调度操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-primary font-mono text-[12px]">#HN-20240414-019</div>
                    <div className="text-[11px] text-error flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                      <span>距降雨还剩 3.5h</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-on-surface text-[13px]">刘建国 (种粮大户)</div>
                    <div className="text-[11px] text-on-surface-variant">湖南益阳市赫山区兰溪镇4组</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-on-surface font-mono text-[13px]">120 亩</span>
                    <div className="text-[11px] text-on-surface-variant">集中连片平原田</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold">
                      水稻纹枯病暴发
                    </span>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">配方: 噻呋酰胺+戊唑醇</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary text-[11px] font-bold flex items-center justify-center">
                        王
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface text-[12px]">王海林 (5★机手)</div>
                        <div className="text-[11px] text-secondary font-medium">距田块 2.8km · 空闲</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleQuickDispatch('#HN-20240414-019')}
                      className={`px-3 py-1.5 rounded-lg text-on-primary text-[12px] font-bold transition-all shadow-xs active:scale-95 ${
                        dispatchedOrders.includes('#HN-20240414-019')
                          ? 'bg-secondary'
                          : 'bg-primary hover:bg-primary-container'
                      }`}
                    >
                      {dispatchedOrders.includes('#HN-20240414-019') ? '已派单' : '一键派单'}
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-primary font-mono text-[12px]">#HN-20240414-022</div>
                    <div className="text-[11px] text-tertiary-container flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      <span>预约今日 14:00</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-on-surface text-[13px]">陈金水 (柑橘合作社)</div>
                    <div className="text-[11px] text-on-surface-variant">湖南常德市汉寿县太子庙</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-on-surface font-mono text-[13px]">85 亩</span>
                    <div className="text-[11px] text-on-surface-variant">丘陵山地果园</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                      柑橘红蜘蛛及木虱
                    </span>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">配方: 联苯肼酯+螺螨酯</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center">
                        李
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface text-[12px]">李德全 (资深植保)</div>
                        <div className="text-[11px] text-secondary font-medium">距田块 5.1km · 作业将结</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleQuickDispatch('#HN-20240414-022')}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                        dispatchedOrders.includes('#HN-20240414-022')
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {dispatchedOrders.includes('#HN-20240414-022') ? '已派单' : '指派调整'}
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-primary font-mono text-[12px]">#HN-20240414-025</div>
                    <div className="text-[11px] text-on-surface-variant">普通预约工单</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-on-surface text-[13px]">彭雪梅 (家庭农场)</div>
                    <div className="text-[11px] text-on-surface-variant">湖南岳阳市华容县三封寺</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-on-surface font-mono text-[13px]">230 亩</span>
                    <div className="text-[11px] text-on-surface-variant">高标准芥菜示范基地</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px]">
                      叶斑病预防与营养调理
                    </span>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">配方: 吡唑醚菌酯+氨基酸</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold flex items-center justify-center">
                        周
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface text-[12px]">周志成创客组 (4机手)</div>
                        <div className="text-[11px] text-secondary font-medium">团队就绪 · 待命</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleQuickDispatch('#HN-20240414-025')}
                      className={`px-3 py-1.5 rounded-lg text-on-primary text-[12px] font-bold transition-all shadow-xs active:scale-95 ${
                        dispatchedOrders.includes('#HN-20240414-025')
                          ? 'bg-secondary'
                          : 'bg-primary hover:bg-primary-container'
                      }`}
                    >
                      {dispatchedOrders.includes('#HN-20240414-025') ? '已派单' : '一键派单'}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-surface-container text-[12px]">
            <span className="text-on-surface-variant">显示 3 条，共有 12 条待调度记录</span>
            <button
              onClick={() => onNavigateTab('order-dispatch-and-scheduling')}
              className="text-primary font-bold hover:underline flex items-center"
            >
              查看全部待办工单队列 <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* RIGHT 4 COLS: Real-Time Field Execution Activity Stream */}
        <div className="xl:col-span-4 bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <h3 className="text-[16px] font-bold text-on-surface">实时履约流水</h3>
            </div>
            <span className="text-[11px] text-on-surface-variant">卫星定位校核</span>
          </div>

          <div className="space-y-4 py-2">
            {/* Stream 1 */}
            <div className="flex gap-3 items-start">
              <div className="p-1 rounded-full bg-primary-fixed text-on-primary-fixed mt-0.5">
                <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-on-surface">农艺师现场打卡签到</span>
                  <span className="text-[11px] text-on-surface-variant">2分钟前</span>
                </div>
                <p className="text-[12px] text-on-surface-variant truncate">
                  李国华技师已到达益阳市大通湖千亩水稻田
                </p>
                <div className="mt-1 flex items-center gap-2.5">
                  <img
                    className="w-14 h-14 rounded-lg object-cover shadow-xs border border-surface-container"
                    alt="现场打卡签到"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFQMhHJU2sBN02qvJWNWnPCh3e15rfWL5rfOnjzeafwiTGn-4PNlaR-atQ5KfhiksCEmzps-zaA2uzQkAYLRhAy5EPD8eO88EcVIc5XFdcNI1mQbp-btWah6NaFFqMPFd5FC1hQddfszSqSMO-6HPYt9evhOWiX5K_RtYFcfuJmopRV9UaiLx5FtFOOyIyMf-ul4AiwJrkFCGKR2J3fbSF9aBj3_Z_UlIE_EPuVMl6I-6bvsMeSKai"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col text-on-surface-variant text-[11px]">
                    <span className="text-primary font-bold">GPS: 29.214N, 112.441E</span>
                    <span>机型: 大疆 T50 满载试飞</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream 2 */}
            <div className="flex gap-3 items-start">
              <div className="p-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed mt-0.5">
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-on-surface">一物一码出库核验成功</span>
                  <span className="text-[11px] text-on-surface-variant">8分钟前</span>
                </div>
                <p className="text-[12px] text-on-surface-variant truncate">
                  订单 #HN-20240414-015 溯源出库完成
                </p>
                <div className="mt-1 p-2 bg-surface-container-low rounded-lg text-[11px] border border-surface-container">
                  <div className="flex justify-between text-on-surface">
                    <span className="font-mono text-[11px]">溯源码: 86.10294.041842</span>
                    <span className="text-secondary font-bold">三证合规</span>
                  </div>
                  <div className="text-on-surface-variant text-[10px] truncate mt-0.5">
                    原药生产批次: 20240315-A4 · 农药登记证号已挂网
                  </div>
                </div>
              </div>
            </div>

            {/* Stream 3 */}
            <div className="flex gap-3 items-start">
              <div className="p-1 rounded-full bg-secondary-container text-on-secondary-container mt-0.5">
                <span className="material-symbols-outlined text-[16px]">draw</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-on-surface">农户电子手写签字验收</span>
                  <span className="text-[11px] text-on-surface-variant">14分钟前</span>
                </div>
                <p className="text-[12px] text-on-surface-variant truncate">
                  桃江县修山镇 160亩 茶园病虫统防统治竣工
                </p>
                <div className="mt-1 flex items-center justify-between p-2 bg-surface-container-low rounded-lg text-[11px] border border-surface-container">
                  <span className="text-on-surface font-medium">验收评星: ★★★★★ (5.0)</span>
                  <span className="text-primary font-bold font-mono">结算分红池入账 ¥420.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-container flex items-center justify-between text-[12px]">
            <span className="text-on-surface-variant">全国即时通信链路正常</span>
            <button
              onClick={() => setShowEagleEyeModal(true)}
              className="text-primary font-bold hover:underline flex items-center gap-0.5"
            >
              <span>全屏鹰眼监控</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Reassurance Hotline */}
      <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 border border-surface-container">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
          </div>
          <div>
            <div className="text-[14px] font-bold text-on-surface">
              突发爆发性暴雨或暴发虫害热线 (调度绿色通道)
            </div>
            <div className="text-[12px] text-on-surface-variant">
              全天候专家 1 对 1 田头视频问诊接入 · 无人机备用机组响应半径 ≤ 15km
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[17px] font-mono font-extrabold text-primary">400-880-9188</span>
          <button
            onClick={() => {
              onShowToast('正在转接湖南应急调度台专线 400-880-9188...', 'info');
            }}
            className="px-4 py-2 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary text-[12px] font-bold transition-all shadow-xs active:scale-95"
          >
            拨打应急调度台
          </button>
        </div>
      </div>

      {/* Emergency Dispatch Order Modal */}
      {showEmergencyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowEmergencyModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
                <h3 className="text-[17px] font-bold">全网农情紧急调度令发布</h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setShowEmergencyModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-3 space-y-3 text-[13px]">
              <p className="text-on-surface-variant">
                向当前辖区内所有在线一线植保机手与合作社无人机群推送强对流防御或突发虫灾统防指令：
              </p>
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-on-surface">选择发布指令等级</label>
                <select className="w-full p-2.5 bg-surface-container rounded-lg border border-surface-container text-[13px] font-medium outline-none">
                  <option>一级红色预警 · 暴发性稻飞虱应急压控 (4小时内全部出动)</option>
                  <option>二级橙色预警 · 局地短时暴雨暂停高空作业 (就近归仓)</option>
                  <option>三级黄色响应 · 气温骤降农作物防冻叶面肥统喷</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-surface-container pt-3">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
                onClick={() => setShowEmergencyModal(false)}
              >
                取消
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-error hover:bg-error/90 text-on-error text-[13px] font-bold shadow-xs active:scale-95"
                onClick={() => {
                  onShowToast('全网紧急调度令已下发！已向 386 位在册一线技师小程序群发广播通知。', 'success');
                  setShowEmergencyModal(false);
                }}
              >
                下发红色调度令
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Eagle Eye Monitor Modal */}
      {showEagleEyeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setShowEagleEyeModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">satellite_alt</span>
                <h3 className="font-bold text-primary text-[17px]">
                  全屏鹰眼数字农业调度总控 · 实时卫星与北斗基站
                </h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setShowEagleEyeModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 relative h-96 rounded-xl overflow-hidden shadow-inner border border-surface-container">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmIndBmPvG8BX_ZAiMZmi37ftBKiOFJfqngikr2akN_1UG5jNguIk2q6614zoQP5u7hjB2FYu-AspFm38AhEG5ORRz7pEWvgE3CwzCA5xEufQS1tfikYWcmN9CqNXiNOflFqLVai02zOEzVvwbpFLol8X2-GOwBLJNhH3dqbQGQ9n_UKGzRLEc_41b74rbMv-od0NCAq9088oaf2buBE6W7zLg1JDOGDGiAoxy3wXFYdUJQB0dKOjm"
                alt="鹰眼卫星底图"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
              <div className="absolute top-4 left-4 p-3 rounded-lg bg-black/60 backdrop-blur text-white text-[12px] space-y-1">
                <div className="font-bold text-secondary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                  北斗RTK厘米级差分基站：全域24基站锁定
                </div>
                <div>飞行中作业机组: 38 架次 (大疆T60/极飞P100)</div>
                <div>实时气象雷达: 洞庭湖平原风速 2.4m/s · 优良作业窗口</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
                onClick={() => setShowEagleEyeModal(false)}
              >
                退出鹰眼全屏
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
