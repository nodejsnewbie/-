import React from 'react';

interface SupplyHeaderProps {
  isSyncing: boolean;
  onSync: () => void;
  onOpenScan: () => void;
}

/** 面包屑 + 页头 + 同步/扫码操作组（自 SupplyChainAndTraceability 原样迁入）。 */
export const SupplyHeader: React.FC<SupplyHeaderProps> = ({ isSyncing, onSync, onOpenScan }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px]">
          <span className="inline-flex items-center text-primary font-semibold">
            企业合规管控中心
          </span>
          <span className="text-outline">/</span>
          <span>供应链与阿米巴财税核算台</span>
        </div>
        <h1 className="text-[24px] font-bold text-primary tracking-tight mt-1 flex items-center gap-3">
          农资溯源与阿米巴分红结算台
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
            国家农业农村部平台实时在联
          </span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg text-on-surface text-[12px] shadow-xs">
          <span className="material-symbols-outlined text-secondary text-[18px]">
            verified_user
          </span>
          <span>
            农药电子监管码接入率：<strong className="text-primary font-bold">100%</strong>
          </span>
        </div>
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[13px] font-semibold transition-all shadow-xs active:scale-95 disabled:opacity-60"
          type="button"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}
          >
            cached
          </span>
          <span>{isSyncing ? '同步中...' : '同步农业农村部数据'}</span>
        </button>
        <button
          onClick={onOpenScan}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-[13px] font-bold transition-all shadow-sm active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
          <span>扫码验真与防窜质检</span>
        </button>
      </div>
    </div>
  );
};
