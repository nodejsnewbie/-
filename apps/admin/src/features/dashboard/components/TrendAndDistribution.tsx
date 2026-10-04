import React from 'react';

/** 中央运营网格：左 60% 工单趋势 SVG 图 + 右 40% 服务模式分布与靶标预警（纯静态示意，原样迁入）。 */
export const TrendAndDistribution: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* LEFT 60% (7 cols) */}
      <div className="lg:col-span-7 bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container gap-2">
          <div>
            <h2 className="text-[16px] font-bold text-on-surface">
              工单趋势与履约效率分析 (近14天)
            </h2>
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
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 700 240"
            >
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
              <line
                stroke="#dce5dd"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="0"
                x2="700"
                y1="20"
                y2="20"
              ></line>
              <line
                stroke="#dce5dd"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="0"
                x2="700"
                y1="75"
                y2="75"
              ></line>
              <line
                stroke="#dce5dd"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="0"
                x2="700"
                y1="130"
                y2="130"
              ></line>
              <line
                stroke="#dce5dd"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="0"
                x2="700"
                y1="185"
                y2="185"
              ></line>
              <line stroke="#bfc9bf" strokeWidth="1.5" x1="0" x2="700" y1="220" y2="220"></line>

              {/* Y Axis values */}
              <text fill="#707971" fontSize="10" x="5" y="24">
                180单 / 100%
              </text>
              <text fill="#707971" fontSize="10" x="5" y="79">
                135单 / 75%
              </text>
              <text fill="#707971" fontSize="10" x="5" y="134">
                90单 / 50%
              </text>
              <text fill="#707971" fontSize="10" x="5" y="189">
                45单 / 25%
              </text>

              {/* Bars for 14 days */}
              <rect fill="url(#gradPrimary)" height="90" rx="3" width="12" x="55" y="130"></rect>
              <rect fill="url(#gradSecondary)" height="75" rx="3" width="12" x="70" y="145"></rect>

              <rect fill="url(#gradPrimary)" height="105" rx="3" width="12" x="100" y="115"></rect>
              <rect fill="url(#gradSecondary)" height="90" rx="3" width="12" x="115" y="130"></rect>

              <rect fill="url(#gradPrimary)" height="120" rx="3" width="12" x="145" y="100"></rect>
              <rect
                fill="url(#gradSecondary)"
                height="105"
                rx="3"
                width="12"
                x="160"
                y="115"
              ></rect>

              <rect fill="url(#gradPrimary)" height="130" rx="3" width="12" x="190" y="90"></rect>
              <rect
                fill="url(#gradSecondary)"
                height="115"
                rx="3"
                width="12"
                x="205"
                y="105"
              ></rect>

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
              <circle
                cx="330"
                cy="65"
                fill="#ffdcc3"
                r="4"
                stroke="#7d4200"
                strokeWidth="2"
              ></circle>
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
            <p className="text-[12px] text-on-surface-variant">
              当前网格服务构成占比与病虫害预警热度
            </p>
          </div>
          <span className="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
        </div>

        {/* Donut Chart & Breakdown */}
        <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          {/* SVG Donut */}
          <div className="relative flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                fill="transparent"
                r="38"
                stroke="#edf6ee"
                strokeWidth="15"
              ></circle>
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
              <div className="text-[10px] text-on-surface-variant pl-4">
                大疆T50无人机飞防及弥雾机
              </div>
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
                <div
                  className="bg-tertiary-container h-full rounded-full"
                  style={{ width: '28%' }}
                ></div>
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
  );
};
