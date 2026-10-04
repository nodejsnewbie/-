import React, { useState } from 'react';
import { Camera, HelpCircle, Shield, QrCode, Hash, Sparkles } from 'lucide-react';

interface TraceBannerProps {
  onVerify: (code: string) => void;
  onOpenScan: () => void;
  onOpenGuide: () => void;
}

export const TraceBanner: React.FC<TraceBannerProps> = ({ onVerify, onOpenScan, onOpenGuide }) => {
  const [inputCode, setInputCode] = useState('');

  const handleVerifySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCode.trim()) {
      // Default to product 1 sample code if empty
      onVerify('1020210892090124883901');
      return;
    }
    onVerify(inputCode.trim());
  };

  const handleQuickSample = (code: string) => {
    setInputCode(code);
    onVerify(code);
  };

  return (
    <section className="bg-gradient-to-br from-[#004425] via-[#00502c] to-[#135d38] text-white rounded-2xl p-3.5 shadow-sm relative overflow-hidden">
      {/* Background ambient blur */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#8ef5b5]/10 rounded-full blur-xl pointer-events-none" />

      {/* Header section */}
      <div className="flex items-start justify-between relative z-10 mb-2.5">
        <div>
          <div className="inline-flex items-center gap-1 bg-[#8ef5b5]/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1">
            <Shield className="w-3 h-3 text-[#8ef5b5]" />
            国家电子追溯互联
          </div>
          <h2 className="text-[16px] font-extrabold text-white tracking-tight">
            一物一码 · 防伪溯源验真
          </h2>
          <p className="text-[11px] text-white/80 mt-0.5">
            支持全国农药电子溯源码查询 · 杜绝假劣串货
          </p>
        </div>
        <button
          onClick={onOpenScan}
          className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-[#8ef5b5] flex-shrink-0 active:scale-95 transition-all shadow-inner"
          title="打开摄像头扫一扫"
        >
          <QrCode className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={onOpenScan}
          className="flex-1 bg-[#8ef5b5] hover:bg-[#7ceca7] text-[#007243] font-bold text-[13px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>扫码验真</span>
        </button>
        <button
          onClick={onOpenGuide}
          className="bg-white/15 hover:bg-white/25 text-white border border-white/20 font-medium text-[12px] py-2 px-3 rounded-xl flex items-center justify-center gap-1 active:scale-[0.98] transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>验真指南</span>
        </button>
      </div>

      {/* Trace Input Box */}
      <form
        onSubmit={handleVerifySubmit}
        className="bg-white/95 backdrop-blur-sm rounded-xl p-1.5 flex items-center gap-1.5 shadow-xs"
      >
        <Hash className="w-4 h-4 text-[#707971] ml-1.5 flex-shrink-0" />
        <input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          maxLength={24}
          className="w-full bg-transparent text-[11px] text-[#151d19] placeholder:text-[#707971] focus:outline-none min-w-0"
          placeholder="或输入瓶身16-24位农药电子溯源码"
          type="text"
        />
        <button
          type="submit"
          className="bg-[#004425] hover:bg-[#135d38] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex-shrink-0 active:scale-95 transition-all cursor-pointer"
        >
          核验
        </button>
      </form>

      {/* Quick Sample Chips */}
      <div className="mt-2 pt-1 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] text-white/80">
        <span className="flex-shrink-0 flex items-center gap-0.5 text-white/60">
          <Sparkles className="w-2.5 h-2.5" />
          快捷样品:
        </span>
        <button
          type="button"
          onClick={() => handleQuickSample('1020210892090124883901')}
          className="bg-white/10 hover:bg-white/20 text-white/90 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap active:scale-95 transition-all"
        >
          华农肟菌·戊唑醇
        </button>
        <button
          type="button"
          onClick={() => handleQuickSample('1020180431081524771234')}
          className="bg-white/10 hover:bg-white/20 text-white/90 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap active:scale-95 transition-all"
        >
          极飞特约浓悬浮
        </button>
        <button
          type="button"
          onClick={() => handleQuickSample('888888888888888888')}
          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-300/30 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap active:scale-95 transition-all"
        >
          疑似假药告警测试
        </button>
      </div>
    </section>
  );
};
