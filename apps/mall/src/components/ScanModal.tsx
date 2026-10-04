import React, { useState, useEffect } from 'react';
import {
  X,
  Flashlight,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (code: string) => void;
}

export const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, onScanComplete }) => {
  const [torchOn, setTorchOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
      setSelectedTarget(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const playBeep = () => {
    try {
      const audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext fallback
    }
  };

  const handleSimulateScan = (code: string, label: string) => {
    setSelectedTarget(label);
    playBeep();
    setTimeout(() => {
      onScanComplete(code);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between max-w-[430px] mx-auto animate-fade-in text-white p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10 pt-2">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5 text-center">
          <ShieldCheck className="w-4 h-4 text-[#8ef5b5]" />
          <span className="text-[13px] font-bold tracking-wide">国家农药电子追溯码扫描</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTorchOn(!torchOn)}
            className={`w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all cursor-pointer ${
              torchOn ? 'bg-amber-400 text-black' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title="手电筒补光"
          >
            <Flashlight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="relative flex-1 my-4 flex flex-col items-center justify-center">
        {/* Frame Box */}
        <div className="relative w-64 h-64 border-2 border-dashed border-white/40 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl bg-black/40">
          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#8ef5b5] rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#8ef5b5] rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#8ef5b5] rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#8ef5b5] rounded-br-lg"></div>

          {/* Laser scanning beam */}
          {scanning && (
            <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#8ef5b5] to-transparent shadow-[0_0_12px_#8ef5b5] animate-scan pointer-events-none" />
          )}

          {/* Torch Light effect */}
          {torchOn && <div className="absolute inset-0 bg-amber-100/10 pointer-events-none" />}

          {/* Central Target Guidance */}
          <div className="text-center px-4 pointer-events-none z-10">
            <p className="text-[12px] font-medium text-white/90 drop-shadow">
              对准农药瓶身或外箱上的
            </p>
            <p className="text-[14px] font-bold text-[#8ef5b5] mt-0.5 drop-shadow">
              全国农药追溯二维码 / 条码
            </p>
            <p className="text-[10px] text-white/60 mt-2 font-mono">[ 自动对焦识别中... ]</p>
          </div>
        </div>

        {selectedTarget && (
          <div className="mt-4 px-3 py-1.5 rounded-full bg-[#006d40] text-white text-[12px] font-medium flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#8ef5b5]" />
            <span>已成功锁定：{selectedTarget}</span>
          </div>
        )}
      </div>

      {/* Preset Test Bottles for Interactive Testing */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
        <div className="text-[11px] font-semibold text-white/80 mb-2 flex items-center justify-between">
          <span>点击快速模拟扫描样品（测试通道）：</span>
          <span className="text-[10px] text-[#8ef5b5] font-mono">100% 真实追溯链</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleSimulateScan('1020210892090124883901', '华农植保·悬浮剂')}
            className="bg-white/15 hover:bg-white/25 active:scale-95 text-left p-2 rounded-xl border border-white/10 transition-all text-xs"
          >
            <div className="font-bold text-[#8ef5b5] flex items-center gap-1">
              <span>● 样品 1: 华农植保</span>
            </div>
            <div className="text-[10px] text-white/70 truncate mt-0.5">
              75%肟菌·戊唑醇 (绿标正品)
            </div>
          </button>

          <button
            onClick={() => handleSimulateScan('1020180431081524771234', '极飞特约·浓悬浮')}
            className="bg-white/15 hover:bg-white/25 active:scale-95 text-left p-2 rounded-xl border border-white/10 transition-all text-xs"
          >
            <div className="font-bold text-[#8ef5b5] flex items-center gap-1">
              <span>● 样品 2: 极飞特约</span>
            </div>
            <div className="text-[10px] text-white/70 truncate mt-0.5">氯虫苯甲酰胺 (飞防原浆)</div>
          </button>

          <button
            onClick={() => handleSimulateScan('1020228892110224669871', '湘农丰·高纯二氢钾')}
            className="bg-white/15 hover:bg-white/25 active:scale-95 text-left p-2 rounded-xl border border-white/10 transition-all text-xs"
          >
            <div className="font-bold text-amber-300 flex items-center gap-1">
              <span>● 样品 3: 湘农丰晶体</span>
            </div>
            <div className="text-[10px] text-white/70 truncate mt-0.5">
              99%磷酸二氢钾 (高纯合格)
            </div>
          </button>

          <button
            onClick={() => handleSimulateScan('888888888888888888', '疑似假劣农药告警')}
            className="bg-rose-500/25 hover:bg-rose-500/35 border border-rose-400/40 active:scale-95 text-left p-2 rounded-xl transition-all text-xs"
          >
            <div className="font-bold text-rose-300 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>测试: 假冒告警</span>
            </div>
            <div className="text-[10px] text-rose-200/80 truncate mt-0.5">
              克隆假码 / 未备案黑作坊
            </div>
          </button>
        </div>

        {/* Alternative buttons */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[11px]">
          <button
            onClick={() => {
              playBeep();
              onScanComplete('1020210892090124883901');
            }}
            className="text-white/80 hover:text-white flex items-center gap-1 py-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>相册选取条码图</span>
          </button>
          <span className="text-white/50 text-[10px]">国标 GB/T 32956-2016 规范</span>
        </div>
      </div>
    </div>
  );
};
