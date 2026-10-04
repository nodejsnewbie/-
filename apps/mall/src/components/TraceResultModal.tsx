import React from 'react';
import {
  X,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  FileText,
  Award,
  PhoneCall,
} from 'lucide-react';
import { TraceVerificationResult } from '@hnhall/shared';

interface TraceResultModalProps {
  result: TraceVerificationResult | null;
  onClose: () => void;
  onBookService?: (productName: string) => void;
}

export const TraceResultModal: React.FC<TraceResultModalProps> = ({
  result,
  onClose,
  onBookService,
}) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div
          className={`p-4 flex items-center justify-between text-white ${
            result.isValid
              ? 'bg-gradient-to-r from-[#004425] to-[#135d38]'
              : 'bg-gradient-to-r from-[#ba1a1a] to-[#93000a]'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.isValid ? (
              <ShieldCheck className="w-6 h-6 text-[#8ef5b5]" />
            ) : (
              <AlertOctagon className="w-6 h-6 text-amber-300" />
            )}
            <div>
              <h3 className="font-extrabold text-[15px] leading-tight">
                {result.isValid ? '国家农药电子追溯系统 · 验真合格' : '追溯安全风险警示'}
              </h3>
              <p className="text-[11px] text-white/80 font-mono mt-0.5">追溯码: {result.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[#151d19]">
          {/* Certificate Banner */}
          {result.isValid ? (
            <div className="bg-[#edf6ee] border border-[#bfc9bf]/60 rounded-xl p-3 relative overflow-hidden">
              {/* Simulated Official Seal */}
              <div className="absolute -right-2 -bottom-2 w-24 h-24 border-2 border-red-500/60 rounded-full flex items-center justify-center text-red-600/70 rotate-[-18deg] pointer-events-none select-none">
                <div className="border border-dashed border-red-500/60 w-20 h-20 rounded-full flex flex-col items-center justify-center text-[9px] font-bold p-1 text-center">
                  <span>★</span>
                  <span>国家农药追溯</span>
                  <span className="text-[8px]">官方验真在档</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[#006d40] font-bold text-[13px] mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>经核验：属原厂正品，已联锁进销存台账</span>
              </div>
              <p className="text-[11px] text-[#404941] leading-relaxed">
                该产品已通过农业农村部农药数字监管系统实名验真，享有实体服务站直供保障与假一赔十承诺。
              </p>
              <div className="mt-2 pt-2 border-t border-[#bfc9bf]/40 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[#707971]">首次核验: </span>
                  <span className="font-medium text-[#151d19]">{result.firstQueryTime}</span>
                </div>
                <div>
                  <span className="text-[#707971]">核验次数: </span>
                  <span className="font-bold text-[#006d40]">
                    {result.queryCount} 次 (首次正品)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-300 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[13px] mb-1">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>未备案仿冒高风险警示！</span>
              </div>
              <div className="space-y-1 mt-2 text-[11px] text-rose-800">
                {result.warnings?.map((warn, i) => (
                  <p key={i} className="flex items-start gap-1">
                    <span className="text-rose-500 mt-0.5">•</span>
                    <span>{warn}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* MallProduct Profile */}
          <div className="bg-[#e7f0e8]/50 rounded-xl p-3 border border-[#e2eae2]">
            <h4 className="font-bold text-[13px] text-[#004425] flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4" />
              <span>法定备案与产品档案</span>
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-[#bfc9bf]/30">
                <span className="text-[#707971]">产品通用名:</span>
                <span className="font-bold text-[#151d19] text-right">{result.productName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#bfc9bf]/30">
                <span className="text-[#707971]">农药登记证号:</span>
                <span className="font-mono font-bold text-[#004425] text-right">
                  {result.licenseNo}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#bfc9bf]/30">
                <span className="text-[#707971]">有效成分及含量:</span>
                <span className="text-right text-[#151d19]">{result.activeIngredient}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#bfc9bf]/30">
                <span className="text-[#707971]">生产批次号:</span>
                <span className="font-mono text-right">{result.batchNo}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#bfc9bf]/30">
                <span className="text-[#707971]">生产日期/保质期:</span>
                <span className="text-right">
                  {result.productionDate} ~ {result.expiryDate}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#bfc9bf]/30">
                <span className="text-[#707971]">生产批准许可:</span>
                <span className="text-right">{result.productionApprovalNo}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#bfc9bf]/30">
                <span className="text-[#707971]">生产企业:</span>
                <span className="text-right font-medium">{result.manufacturer}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#707971]">直供实体站:</span>
                <span className="text-right text-[#006d40] font-semibold">
                  {result.distributionStation}
                </span>
              </div>
            </div>
          </div>

          {/* Supply Chain Lifecycle */}
          {result.chain && result.chain.length > 0 && (
            <div>
              <h4 className="font-bold text-[13px] text-[#004425] flex items-center gap-1.5 mb-2.5">
                <Award className="w-4 h-4" />
                <span>全链条追溯履历 (出厂至到田)</span>
              </h4>
              <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#8ef5b5]">
                {result.chain.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full bg-[#006d40] border-2 border-white shadow-xs flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#8ef5b5] rounded-full"></div>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-[#e2eae2] shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[12px] text-[#004425]">
                          {item.step}. {item.title}
                        </span>
                        <span className="text-[10px] text-[#707971] font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#404941] mt-1">{item.detail}</div>
                      <div className="text-[10px] text-[#707971] mt-1 flex items-center justify-between">
                        <span>经手/操作: {item.operator}</span>
                        <span className="truncate max-w-[150px]">{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#e2eae2] bg-[#f3fcf3] flex items-center gap-2">
          {result.isValid ? (
            <>
              {onBookService && (
                <button
                  onClick={() => {
                    onClose();
                    onBookService(result.productName);
                  }}
                  className="flex-1 bg-[#004425] hover:bg-[#135d38] text-white font-bold text-[12px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#8ef5b5]" />
                  <span>预约农艺师上门施用</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-white hover:bg-[#e7f0e8] text-[#151d19] border border-[#bfc9bf] font-medium text-[12px] py-2.5 px-3 rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                关闭
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  alert(
                    '已启动维权备案：证据编号 WQ20241001-9921，当地农业行政综合执法部门将跟进核实！',
                  );
                  onClose();
                }}
                className="flex-1 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold text-[12px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <span>一键投诉举报假劣</span>
              </button>
              <button
                onClick={onClose}
                className="bg-white hover:bg-[#e7f0e8] text-[#151d19] border border-[#bfc9bf] font-medium text-[12px] py-2.5 px-3 rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                取消
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
