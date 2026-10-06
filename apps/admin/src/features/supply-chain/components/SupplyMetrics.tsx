import React from 'react';

/** 四张指标卡：入库商品 / 扫码频次 / 待结佣金 / 税银存管（静态示意值，原样迁入）。 */
export const SupplyMetrics: React.FC = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1 */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface-variant font-semibold">
            监管合规入库商品
          </span>
          <span className="p-1 rounded-lg bg-surface-container text-primary">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] text-primary font-extrabold font-mono tabular-nums tracking-tight">
              32
            </span>
            <span className="text-[13px] text-on-surface-variant font-medium">款核心农资</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[12px]">
            <span className="text-secondary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 100% 赋码联网
            </span>
            <span className="text-on-surface-variant/70">PD登记证全覆核</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-[12px]">
          <span>在库赋码总量</span>
          <span className="font-mono font-medium text-on-surface">1,480,000 袋/瓶</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface-variant font-semibold">
            本月扫码验真频次
          </span>
          <span className="p-1 rounded-lg bg-surface-container text-secondary">
            <span className="material-symbols-outlined text-[20px]">document_scanner</span>
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-[32px] text-on-surface font-extrabold font-mono tabular-nums tracking-tight">
              28,490
            </span>
            <span className="text-[13px] text-on-surface-variant font-medium">次</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[12px]">
            <span className="text-secondary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">trending_up</span> 环比增
              18.4%
            </span>
            <span className="text-on-surface-variant/60">窜货拦截 · 待接入</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-[12px]">
          <span>田间首验正品率</span>
          <span className="font-mono font-bold text-secondary">99.98%</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface-variant font-semibold">
            本月阿米巴待结佣金
          </span>
          <span className="p-1 rounded-lg bg-surface-container text-tertiary">
            <span className="material-symbols-outlined text-[20px]">payments</span>
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[15px] text-tertiary font-bold">¥</span>
            <span className="text-[32px] text-tertiary font-extrabold font-mono tabular-nums tracking-tight">
              184,520.00
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[12px]">
            <span className="text-on-surface-variant">涉及 42 位认证合伙人</span>
            <span className="font-semibold text-tertiary">含处方+裂变+股权</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-[12px]">
          <span>已完成前置质检验收</span>
          <span className="font-mono font-medium text-primary">100% 凭单闭环</span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-on-surface-variant font-semibold">
            合规代扣个税与银行存管
          </span>
          <span className="p-1 rounded-lg bg-surface-container text-primary">
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
          </span>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] text-primary font-extrabold font-mono tabular-nums tracking-tight">
              100%
            </span>
            <span className="text-[13px] text-secondary font-bold">银行专户直管</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[12px]">
            <span className="text-secondary font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">security</span>{' '}
              中国农业银行财资云
            </span>
            <span className="text-on-surface-variant/70">税企系统联通</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-[12px]">
          <span>个税累计代缴</span>
          <span className="font-mono font-medium text-on-surface">¥5,535.60</span>
        </div>
      </div>
    </section>
  );
};
