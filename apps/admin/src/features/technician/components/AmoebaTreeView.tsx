import React from 'react';

interface AmoebaTreeViewProps {
  onOpenMatrix: () => void;
}

/** 阿米巴师徒拓扑架构树视图（自 TechnicianManagement 原样迁入）。 */
export const AmoebaTreeView: React.FC<AmoebaTreeViewProps> = ({ onOpenMatrix }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container">
      <div className="flex items-center justify-between pb-4 border-b border-surface-container">
        <div>
          <h3 className="text-[17px] font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px]">account_tree</span>
            <span>全网阿米巴师徒拓扑架构树 (28 组创客战队)</span>
          </h3>
          <p className="text-[12px] text-on-surface-variant mt-0.5">
            核心战队以“首席导师/资深合伙人”为单元，带徒裂变创客小组，享受团队全量亩产绩效津贴。
          </p>
        </div>
        <button
          onClick={onOpenMatrix}
          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-[12px] font-semibold"
        >
          分红分配系数测算器
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Team 1: Peng Minghui */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center">
                彭
              </div>
              <div>
                <div className="font-bold text-primary text-[14px]">彭明辉 (首席导师 / 组长)</div>
                <div className="text-[11px] text-on-surface-variant">
                  益阳兰溪创客军团 · 团队月产值 ¥11.64万
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-[11px] font-bold">
              钻石 1.35x
            </span>
          </div>
          <div className="pl-6 border-l-2 border-primary/30 space-y-2 mt-2">
            <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest">
              <span>徒弟 1: 张立成 (已独立执飞大疆T60)</span>
              <span className="text-secondary font-bold font-mono">
                月产值 ¥3.8万 · 导师津贴 ¥1,900
              </span>
            </div>
            <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest">
              <span>徒弟 2: 赵小勇 (已获配方员执照)</span>
              <span className="text-secondary font-bold font-mono">
                月产值 ¥2.9万 · 导师津贴 ¥1,450
              </span>
            </div>
            <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-tertiary-fixed">
              <span>新入职预备徒弟: 陈志平 (实训跟机中)</span>
              <span className="text-tertiary font-bold font-mono">待解锁首单导师奖励 ¥200</span>
            </div>
          </div>
        </div>

        {/* Team 2: Zhou Jianguo */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary font-bold flex items-center justify-center">
                周
              </div>
              <div>
                <div className="font-bold text-primary text-[14px]">周建国 (资深农艺师 / 组长)</div>
                <div className="text-[11px] text-on-surface-variant">
                  安沙创客先锋战队 · 团队月产值 ¥4.28万
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
              黄金 1.25x
            </span>
          </div>
          <div className="pl-6 border-l-2 border-tertiary/30 space-y-2 mt-2">
            <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest">
              <span>徒弟 1: 刘国富 (独立飞手，已完工180单)</span>
              <span className="text-secondary font-bold font-mono">
                月产值 ¥2.2万 · 导师津贴 ¥1,100
              </span>
            </div>
            <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest">
              <span>徒弟 2: 马文兵 (独立飞手，已完工165单)</span>
              <span className="text-secondary font-bold font-mono">
                月产值 ¥1.9万 · 导师津贴 ¥950
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
