import React from 'react';
import type { SupplyProduct } from '@hnhall/shared';

/** 供应链域三个弹窗：链式溯源详情 / 防窜货预警处置 / 扫码验真（自 SupplyChainAndTraceability 原样迁入）。 */

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
                    <strong className="text-on-surface font-mono">{n.time}</strong> {n.desc}
                  </span>
                </div>
              ))}
            </div>
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

interface FleeWarningModalProps {
  product: SupplyProduct;
  onClose: () => void;
  onExecuteFreeze: () => void;
}

export const FleeWarningModal: React.FC<FleeWarningModalProps> = ({
  product,
  onClose,
  onExecuteFreeze,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-error mb-2">
          <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          <h3 className="text-[17px] font-bold text-error">防伪窜货预警处置中心</h3>
        </div>
        <p className="text-[12px] text-on-surface-variant">
          检测到该批次药品在非授权授权经营区域发生频发扫码，触发供应链风险熔断：
        </p>

        <div className="mt-3 p-3 rounded-xl bg-error-container/30 space-y-1.5 text-[12px] border border-error-container">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">预警商品:</span>
            <span className="font-bold text-on-surface">{product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">登记证号:</span>
            <span className="font-mono text-on-surface">{product.registrationNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">异动批次:</span>
            <span className="font-mono text-on-surface">{product.batchNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">违规异常点:</span>
            <span className="font-bold text-error">{product.fleeLocation}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-[12px] font-bold text-on-surface">处置动作建议</label>
          <div className="flex flex-col gap-2 text-[12px] text-on-surface">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-surface-container-low border border-surface-container">
              <input
                defaultChecked
                className="accent-primary"
                name="alertAction"
                type="radio"
                value="lock"
              />
              <span>对该异动批次实施电子监管码即时冻结 (禁止处方核销)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-surface-container-low border border-surface-container">
              <input className="accent-primary" name="alertAction" type="radio" value="team" />
              <span>派单常德区域督导员 4 小时内现场稽查</span>
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-surface-container pt-3">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
            onClick={onClose}
          >
            稍后处置
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-error hover:bg-error/90 text-on-error text-[13px] font-bold shadow-xs active:scale-95"
            onClick={onExecuteFreeze}
          >
            执行熔断处置
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
