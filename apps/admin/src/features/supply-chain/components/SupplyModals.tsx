import React from 'react';
import type { SupplyProduct } from '@hnhall/shared';

import { formatDateTime } from '../../../utils/format.ts';

/** 供应链域两个弹窗：链式溯源详情 / 扫码验真。R6「窜货预警 / 批次熔断」以预留接口呈现（UI 已建，后端 enabled=false → 显示「待接入」，不伪造窜货状态/冻结动作）。 */

interface TraceDetailModalProps {
  product: SupplyProduct;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const TraceDetailModal: React.FC<TraceDetailModalProps> = ({
  product,
  onClose,
  onShowToast,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            <h3 className="font-bold text-primary text-[16px]">
              国家农药电子监管码 · 链式溯源详情
            </h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4 text-[13px]">
          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
            <div>
              <div className="font-bold text-on-surface text-[15px]">{product.name}</div>
              <div className="font-mono text-on-surface-variant text-[12px]">
                {product.registrationNumber}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              正品验真认证
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-[12px]">
            <div className="p-2.5 rounded bg-surface-container">
              <span className="text-on-surface-variant block text-[11px]">生产厂商资质</span>
              <span className="text-on-surface font-semibold">湖南华农植保智造第一基地</span>
            </div>
            <div className="p-2.5 rounded bg-surface-container">
              <span className="text-on-surface-variant block text-[11px]">生产许可证号</span>
              <span className="font-mono text-on-surface font-semibold">农药生许 (湘) 0019</span>
            </div>
            <div className="p-2.5 rounded bg-surface-container">
              <span className="text-on-surface-variant block text-[11px]">出厂质检报告</span>
              <span className="text-secondary font-bold">合格 (批次留样备查)</span>
            </div>
            <div className="p-2.5 rounded bg-surface-container">
              <span className="text-on-surface-variant block text-[11px]">电子追溯码段</span>
              <span className="font-mono text-on-surface font-semibold">{product.batchNumber}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
            <div className="font-bold text-on-surface text-[12px] mb-2">国家可追溯平台协同节点</div>
            <div className="space-y-2 text-[12px] text-on-surface-variant">
              {product.traceabilityNodes.map((n, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1.5"></span>
                  <span>
                    <strong className="text-on-surface font-mono">{formatDateTime(n.time)}</strong>{' '}
                    {n.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reserved: 窜货预警 / 批次熔断（R6 本期不做·二期评估，UI 预留，不伪造状态或冻结动作） */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-dashed border-surface-container">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-outline text-[18px]">policy</span>
              <div className="font-bold text-on-surface text-[12px]">窜货预警 / 批次熔断</div>
              <span className="text-[11px] text-on-surface-variant/70">
                预留接口 · 本期未接入，不作溯源结论依据
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              {(
                [
                  ['窜货预警', product.fleeMonitoring],
                  ['批次熔断', product.batchFreeze],
                ] as const
              ).map(([fallbackLabel, cap]) => (
                <div
                  key={fallbackLabel}
                  className="flex items-center justify-between p-2.5 rounded bg-surface-container"
                >
                  <span className="text-on-surface">{cap?.label ?? fallbackLabel}</span>
                  {cap?.enabled && cap?.value !== null ? (
                    <span className="font-bold text-primary">{cap.value.statusText}</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold">
                      待接入{cap?.reason ? ` · ${cap.reason}` : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <button
              className="mt-2.5 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[12px] font-medium border border-surface-container"
              onClick={() =>
                onShowToast(
                  '窜货预警 / 批次熔断本期未接入（二期评估），界面已预留，本次未对真实监管链路下发冻结指令。',
                  'warning'
                )
              }
            >
              <span className="material-symbols-outlined text-[15px] align-middle">
                freeze
              </span>
              <span className="align-middle"> 批次冻结（本期预留）</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-surface-container pt-3">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium"
            onClick={onClose}
          >
            关闭
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[13px] font-bold shadow-xs"
            onClick={() => {
              onShowToast('溯源公证凭证已生成，正在调用打印机或导出国家存证报告PDF...', 'success');
              onClose();
            }}
          >
            下载国家存证报告
          </button>
        </div>
      </div>
    </div>
  );
};

interface ScanVerifyModalProps {
  scanCodeInput: string;
  scanResult: { title: string; pd: string; batch: string; status: string } | null;
  onCodeInputChange: (v: string) => void;
  onManualScan: () => void;
  onClose: () => void;
}

export const ScanVerifyModal: React.FC<ScanVerifyModalProps> = ({
  scanCodeInput,
  scanResult,
  onCodeInputChange,
  onManualScan,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            <h3 className="text-[16px] font-bold">农资包装追溯二维码扫码验真</h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-[12px] text-on-surface-variant">
            支持手持扫描枪直连或手动录入 32 位国家农药追溯编码：
          </p>
          <input
            className="w-full p-2.5 bg-surface-container rounded-lg text-on-surface font-mono text-[13px] border border-surface-container outline-none focus:ring-1 focus:ring-primary"
            value={scanCodeInput}
            onChange={(e) => onCodeInputChange(e.target.value)}
            placeholder="输入 32 位溯源码..."
          />
          <button
            onClick={onManualScan}
            className="w-full py-2 bg-primary text-on-primary rounded-lg text-[13px] font-bold hover:bg-primary-container transition-all"
          >
            立即验真核验
          </button>

          {scanResult && (
            <div className="p-3 bg-secondary-container/30 border border-secondary-container rounded-xl space-y-1 text-[12px] animate-in fade-in">
              <div className="text-secondary font-bold text-[13px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                [验真成功 · 国家云存证]
              </div>
              <div className="text-on-surface font-medium">品名: {scanResult.title}</div>
              <div className="text-on-surface-variant font-mono">
                登记证: {scanResult.pd} · 批次: {scanResult.batch}
              </div>
              <div className="text-secondary font-semibold">{scanResult.status}</div>
            </div>
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-surface-container flex justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
            onClick={onClose}
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
