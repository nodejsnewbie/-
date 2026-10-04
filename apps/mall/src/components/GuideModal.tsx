import React from 'react';
import { X, ShieldAlert, CheckCircle2, QrCode, FileCheck2 } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in text-[#151d19]">
      <div className="w-full max-w-[430px] max-h-[88vh] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="p-4 bg-[#004425] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#8ef5b5]" />
            <div>
              <h3 className="font-extrabold text-[15px]">农药电子溯源码验真指南</h3>
              <p className="text-[11px] text-white/80">农业农村部统一编码规范 · 假一赔十维权指引</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[12px]">
          {/* Section 1: Code breakdown */}
          <div className="bg-[#edf6ee] rounded-xl p-3 border border-[#bfc9bf]/60">
            <h4 className="font-bold text-[13px] text-[#004425] flex items-center gap-1.5 mb-2">
              <QrCode className="w-4 h-4 text-[#006d40]" />
              <span>16-24位农药电子溯源码结构解析</span>
            </h4>
            <div className="space-y-2">
              <div className="bg-white p-2 rounded-lg border border-[#e2eae2] font-mono text-[11px]">
                <div className="text-center font-bold text-[#004425] tracking-widest text-[13px] py-1 bg-[#e7f0e8] rounded">
                  1 02021 0892 0901 24883901
                </div>
                <div className="grid grid-cols-5 gap-1 text-[9px] text-[#707971] text-center mt-1">
                  <span>包装类别</span>
                  <span>企业编码</span>
                  <span>登记序号</span>
                  <span>批次月日</span>
                  <span>唯一随机防伪</span>
                </div>
              </div>
              <ul className="space-y-1 text-[11px] text-[#404941] list-disc list-inside">
                <li>
                  <strong className="text-[#151d19]">一物一码：</strong>
                  每瓶、每袋农药赋唯一二维码，犹如农药身份证。
                </li>
                <li>
                  <strong className="text-[#151d19]">闭环留痕：</strong>
                  从出厂、入库、批发到实体直营站零售全流程扫码上链。
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: "Three Certificates" Checklist */}
          <div className="bg-white rounded-xl p-3 border border-[#e2eae2] shadow-xs">
            <h4 className="font-bold text-[13px] text-[#004425] flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#006d40]" />
              <span>正规农药必备“三证齐全”核查标准</span>
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded-lg bg-[#f3fcf3] border border-[#e2eae2]">
                <span className="font-bold text-[#004425]">1. 农药登记证号 (PD开头):</span>
                <p className="text-[#404941] mt-0.5">
                  如 <span className="font-mono text-[#006d40]">PD20210892</span>
                  ，无证或临时证超期均为违规劣药。
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#f3fcf3] border border-[#e2eae2]">
                <span className="font-bold text-[#004425]">2. 农药生产许可证 (农药生许):</span>
                <p className="text-[#404941] mt-0.5">
                  如 <span className="font-mono text-[#006d40]">农药生许(湘)0023</span>
                  ，确保合法合规生产实体企业。
                </p>
              </div>
              <div className="p-2 rounded-lg bg-[#f3fcf3] border border-[#e2eae2]">
                <span className="font-bold text-[#004425]">3. 产品质量执行标准号 (GB/Q):</span>
                <p className="text-[#404941] mt-0.5">
                  如国标 <span className="font-mono text-[#006d40]">GB/T</span>{' '}
                  或经备案企业标准，确保有效成分达标。
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Spotting Counterfeits */}
          <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
            <h4 className="font-bold text-[13px] text-rose-800 flex items-center gap-1.5 mb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>警惕假劣农资特征</span>
            </h4>
            <div className="space-y-1.5 text-[11px] text-rose-900">
              <p>
                • <strong>条码刮擦涂抹：</strong>
                凡外包装二维码被撕毁、覆盖贴纸者多为窜货或伪劣假药。
              </p>
              <p>
                • <strong>查询次数异常：</strong>
                首次新拆封瓶装，扫码若显示已被多次查验，存在套码翻新假货嫌疑。
              </p>
              <p>
                • <strong>无实体站背书：</strong>
                非授权渠道流动车叫卖，无法开具国家监管进销存追溯小票。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#e2eae2] bg-[#f3fcf3]">
          <button
            onClick={onClose}
            className="w-full bg-[#004425] hover:bg-[#135d38] text-white font-bold text-[12px] py-2.5 rounded-xl active:scale-98 transition-all cursor-pointer"
          >
            我已知晓，返回验真
          </button>
        </div>
      </div>
    </div>
  );
};
