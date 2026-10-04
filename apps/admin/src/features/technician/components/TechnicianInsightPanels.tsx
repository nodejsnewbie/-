import React from 'react';

interface TechnicianInsightPanelsProps {
  onGoToTree: () => void;
  onOpenGridDispatch: () => void;
}

/** 底部三联洞察面板：师徒机制 / 持证合规 / 网格战力（自 TechnicianManagement 原样迁入）。 */
export const TechnicianInsightPanels: React.FC<TechnicianInsightPanelsProps> = ({
  onGoToTree,
  onOpenGridDispatch,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Amoeba Hierarchy & Mentorship Model Card */}
      <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between space-y-4 border border-surface-container">
        <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[22px]">share</span>
            <h2 className="font-bold text-primary text-[16px]">阿米巴裂变师徒机制</h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
            合伙人分成引擎
          </span>
        </div>
        <p className="text-[12px] text-on-surface-variant leading-relaxed">
          一线骨干带徒3人即可裂变独立微阿米巴小组，徒弟每完成1亩植保，师傅享有持续 ¥0.5~¥1.2/亩
          的带教津贴与产值提成。
        </p>

        {/* Mentorship Progress Breakdown */}
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary font-bold text-[11px]">
                钻
              </span>
              <div>
                <div className="text-[12px] font-bold text-on-surface">钻石合伙人 (12人)</div>
                <div className="text-[10px] text-on-surface-variant">
                  团队月总产值 ≥ ¥10万 · 享8%分红
                </div>
              </div>
            </div>
            <span className="text-[12px] font-bold text-secondary font-mono">系数 1.35x</span>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-tertiary-fixed-dim flex items-center justify-center text-on-tertiary-fixed font-bold text-[11px]">
                金
              </span>
              <div>
                <div className="text-[12px] font-bold text-on-surface">黄金合伙人 (36人)</div>
                <div className="text-[10px] text-on-surface-variant">
                  团队月总产值 ≥ ¥4万 · 享5%分红
                </div>
              </div>
            </div>
            <span className="text-[12px] font-bold text-secondary font-mono">系数 1.25x</span>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-[11px]">
                银
              </span>
              <div>
                <div className="text-[12px] font-bold text-on-surface">白银合伙人 (37人)</div>
                <div className="text-[10px] text-on-surface-variant">
                  带徒1-2人考核期 · 享基础工单加权
                </div>
              </div>
            </div>
            <span className="text-[12px] font-bold text-secondary font-mono">系数 1.10x</span>
          </div>
        </div>

        <div className="pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>全网带徒活跃战队: 28 个创客组</span>
          <button
            onClick={onGoToTree}
            className="text-primary hover:underline font-semibold"
            type="button"
          >
            查看完整阿米巴拓扑图 →
          </button>
        </div>
      </div>

      {/* Official Pesticide License Compliance Radar */}
      <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between space-y-4 border border-surface-container">
        <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[22px]">policy</span>
            <h2 className="font-bold text-primary text-[16px]">农药经营许可证合规监管</h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold">
            自动联网校验
          </span>
        </div>

        <div className="space-y-3">
          {/* SVG Circular Gauge */}
          <div className="flex items-center justify-center py-1">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="10"
                />
                <circle
                  className="text-secondary"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray="251.2"
                  strokeDashoffset="11.8"
                  strokeLinecap="round"
                  strokeWidth="10"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[22px] font-extrabold text-secondary font-mono">95.3%</span>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                  持证合规率
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-on-surface-variant text-[12px]">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>合规持证正常接单
              </span>
              <span className="font-bold text-on-surface font-mono">368 人</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>30天内面临年审/换证
              </span>
              <span className="font-bold text-tertiary font-mono">6 人</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-error"></span>待入库核验申请
              </span>
              <span className="font-bold text-error font-mono">14 人</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-outline"></span>因逾期临时暂停接单
              </span>
              <span className="font-bold text-on-surface font-mono">4 人</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-surface-container text-right">
          <span className="text-[11px] text-on-surface-variant">
            数据接口对接: 湖南省数字农业综合管理平台 (实时同步)
          </span>
        </div>
      </div>

      {/* Real-time Dispatch Map & Grid Capacity */}
      <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between space-y-4 border border-surface-container">
        <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[22px]">
              satellite_alt
            </span>
            <h2 className="font-bold text-primary text-[16px]">服务网格与战力饱和度</h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
            湘中/湘北核心区
          </span>
        </div>

        {/* Map image banner */}
        <div
          className="w-full h-36 rounded-lg bg-cover bg-center relative overflow-hidden shadow-inner flex items-end p-2.5"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmIndBmPvG8BX_ZAiMZmi37ftBKiOFJfqngikr2akN_1UG5jNguIk2q6614zoQP5u7hjB2FYu-AspFm38AhEG5ORRz7pEWvgE3CwzCA5xEufQS1tfikYWcmN9CqNXiNOflFqLVai02zOEzVvwbpFLol8X2-GOwBLJNhH3dqbQGQ9n_UKGzRLEc_41b74rbMv-od0NCAq9088oaf2buBE6W7zLg1JDOGDGiAoxy3wXFYdUJQB0dKOjm')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
          <div className="relative z-10 flex items-center justify-between w-full text-on-primary text-[12px]">
            <div className="flex flex-col">
              <span className="font-bold">长沙县 / 鼎城区 / 赫山区</span>
              <span className="text-[10px] text-on-primary-container">
                400+ 技师无人机GPS基站联动
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary text-[11px] font-bold">
              响应中 ≤ 2h
            </span>
          </div>
        </div>

        {/* Saturation bars */}
        <div className="space-y-2 text-[12px]">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-on-surface-variant">长沙片区战备度 (142人)</span>
              <span className="font-bold text-secondary font-mono">饱和度 92%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-on-surface-variant">益阳片区战备度 (118人)</span>
              <span className="font-bold text-secondary font-mono">饱和度 86%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '86%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-on-surface-variant">常德片区战备度 (126人)</span>
              <span className="font-bold text-secondary font-mono">饱和度 88%</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenGridDispatch}
          className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-[13px] font-semibold transition-colors text-center"
          type="button"
        >
          查看跨网格农忙应急机动队调度
        </button>
      </div>
    </div>
  );
};
