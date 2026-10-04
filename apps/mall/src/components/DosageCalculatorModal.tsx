import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Droplets, Plane, UserCheck, ShoppingBag } from 'lucide-react';
import { MallProduct } from '@hnhall/shared';

interface DosageCalculatorModalProps {
  product: MallProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: MallProduct, quantity: number) => void;
  onBookService: (product: MallProduct, acreage: number) => void;
}

export const DosageCalculatorModal: React.FC<DosageCalculatorModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBookService,
}) => {
  const [acreage, setAcreage] = useState<number>(30); // 30 亩 default
  const [sprayMethod, setSprayMethod] = useState<'drone' | 'manual'>('drone');

  if (!isOpen || !product) return null;

  // Calculate bottles needed based on average recommendation
  // Example: 10-15ml / 亩 for 100ml bottle -> ~8-10 mu per bottle
  let muPerBottle: number;
  if (product.name.includes('肟菌·戊唑醇')) {
    muPerBottle = 8; // 100ml / 12ml ≈ 8.3 mu
  } else if (product.name.includes('氯虫苯甲酰胺')) {
    muPerBottle = 20; // 200ml / 10ml ≈ 20 mu
  } else if (product.name.includes('磷酸二氢钾')) {
    muPerBottle = 8; // 1000g / 120g ≈ 8.3 mu
  } else if (product.name.includes('草铵膦')) {
    muPerBottle = 6; // 1000ml / 170ml ≈ 6 mu
  } else {
    muPerBottle = 10;
  }

  const bottlesNeeded = Math.max(1, Math.ceil(acreage / muPerBottle));
  const totalCost = bottlesNeeded * product.price;
  const costPerMu = totalCost / (acreage || 1);

  const waterTotal = sprayMethod === 'drone' ? acreage * 1.5 : acreage * 30;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in text-[#151d19]">
      <div className="w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="p-3.5 bg-[#004425] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#8ef5b5]" />
            <div>
              <h3 className="font-bold text-[14px]">田块用药配方与亩用量计算</h3>
              <p className="text-[10px] text-white/80">农艺师科学减药增效标准</p>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[12px]">
          {/* Target MallProduct Summary */}
          <div className="flex gap-2.5 p-2.5 bg-[#edf6ee] rounded-xl border border-[#bfc9bf]/50">
            <div className="w-14 h-14 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-[#bfc9bf]/30">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#004425]">
                  <Droplets className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-[13px] text-[#151d19] truncate">{product.name}</h4>
              <p className="text-[11px] text-[#404941] mt-0.5 font-mono">
                {product.spec} · 证号: {product.licenseNo}
              </p>
              <p className="text-[11px] text-[#006d40] font-semibold mt-0.5">
                单价: ¥{product.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Acreage Input & Presets */}
          <div>
            <label className="block text-[12px] font-bold text-[#151d19] mb-1.5">
              种植与防治面积 (亩)：
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={5000}
                value={acreage}
                onChange={(e) => setAcreage(Math.max(1, Number(e.target.value) || 1))}
                className="w-28 text-center text-[16px] font-extrabold text-[#004425] bg-[#edf6ee] border border-[#bfc9bf] rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-[#004425]"
              />
              <span className="font-bold text-[13px] text-[#404941]">亩</span>

              {/* Presets */}
              <div className="flex items-center gap-1.5 ml-auto">
                {[10, 30, 50, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => setAcreage(num)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      acreage === num
                        ? 'bg-[#004425] text-white'
                        : 'bg-[#edf6ee] text-[#404941] hover:bg-[#e2eae2]'
                    }`}
                  >
                    {num}亩
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spraying Method Choice */}
          <div>
            <label className="block text-[12px] font-bold text-[#151d19] mb-1.5">
              施用作业方式：
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSprayMethod('drone')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                  sprayMethod === 'drone'
                    ? 'border-[#004425] bg-[#004425]/5 text-[#004425] font-bold'
                    : 'border-[#e2eae2] bg-white text-[#404941]'
                }`}
              >
                <Plane className="w-5 h-5 text-[#006d40] flex-shrink-0" />
                <div>
                  <div className="text-[12px] leading-tight">植保无人机飞防</div>
                  <div className="text-[10px] text-[#707971] mt-0.5">低容量超细雾化，节药省水</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSprayMethod('manual')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                  sprayMethod === 'manual'
                    ? 'border-[#004425] bg-[#004425]/5 text-[#004425] font-bold'
                    : 'border-[#e2eae2] bg-white text-[#404941]'
                }`}
              >
                <Droplets className="w-5 h-5 text-[#006d40] flex-shrink-0" />
                <div>
                  <div className="text-[12px] leading-tight">人工常规喷雾</div>
                  <div className="text-[10px] text-[#707971] mt-0.5">高容量淋洗，湿润均匀</div>
                </div>
              </button>
            </div>
          </div>

          {/* Calculation Result Card */}
          <div className="bg-[#edf6ee] rounded-xl p-3 border border-[#bfc9bf]/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#707971]">
              <span>推荐订购数量</span>
              <span className="text-[14px] font-extrabold text-[#ba1a1a]">
                {bottlesNeeded}{' '}
                <span className="text-[11px] font-normal text-[#151d19]">
                  {product.spec.split('/')[1] || '瓶'}
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#707971]">
              <span>总用水配药量</span>
              <span className="font-semibold text-[#151d19]">
                约 {waterTotal.toFixed(0)} 升 (L)
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#707971]">
              <span>预估亩均用药成本</span>
              <span className="font-bold text-[#006d40]">¥{costPerMu.toFixed(2)} / 亩</span>
            </div>
            <div className="pt-2 border-t border-[#bfc9bf]/40 flex items-center justify-between">
              <span className="font-bold text-[12px] text-[#151d19]">药剂总计：</span>
              <span className="font-extrabold text-[17px] text-[#ba1a1a]">
                ¥{totalCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Agronomist Advisory */}
          <div className="p-2.5 rounded-xl bg-white border border-[#e2eae2] shadow-xs text-[11px] space-y-1 text-[#404941]">
            <div className="flex items-center gap-1 font-bold text-[#004425]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#006d40]" />
              <span>农艺师用药指引与安全间隔期</span>
            </div>
            <p>
              • <strong>防治对象：</strong>
              {product.targetDisease}
            </p>
            <p>
              • <strong>安全间隔：</strong>
              {product.safeInterval}
            </p>
            <p>
              • <strong>施药时期：</strong>水稻破口前5-7天或发病初期晴天傍晚喷施效果最佳。
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-[#e2eae2] bg-[#f3fcf3] flex items-center gap-2">
          <button
            onClick={() => {
              onAddToCart(product, bottlesNeeded);
              onClose();
            }}
            className="flex-1 bg-white hover:bg-[#e7f0e8] text-[#004425] border border-[#004425] font-bold text-[12px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>按量加入清单 ({bottlesNeeded}件)</span>
          </button>
          <button
            onClick={() => {
              onClose();
              onBookService(product, acreage);
            }}
            className="flex-1 bg-[#004425] hover:bg-[#135d38] text-white font-bold text-[12px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#8ef5b5]" />
            <span>预约上门施用</span>
          </button>
        </div>
      </div>
    </div>
  );
};
