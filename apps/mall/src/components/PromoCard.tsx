import React from 'react';
import { HeartHandshake, CheckCircle2 } from 'lucide-react';

interface PromoCardProps {
  cartTotal: number;
  onGoOrder: () => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({ cartTotal, onGoOrder }) => {
  const isQualified = cartTotal >= 200;
  const diff = Math.max(0, 200 - cartTotal);

  return (
    <section className="bg-[#edf6ee] border border-[#e2eae2] rounded-xl p-2.5 flex items-center justify-between gap-2.5 shadow-xs transition-all">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-[#7d4200]/15 text-[#5c2f00] flex items-center justify-center flex-shrink-0">
          <HeartHandshake className="w-5 h-5 text-[#7d4200]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-bold text-[12px] text-[#151d19]">购农资满 ¥200 赠配方服务</span>
            <span className="bg-[#7d4200] text-[#ffb477] text-[9px] font-bold px-1 rounded">
              官方特约
            </span>
            {isQualified && (
              <span className="bg-[#006d40] text-white text-[9px] font-bold px-1 rounded flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                已达标
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#404941] truncate mt-0.5">
            {isQualified ? (
              <span className="text-[#006d40] font-medium">
                已解锁高级农艺师免费上门指导及飞防用药检测！
              </span>
            ) : (
              `享持证农艺师免费上门指导及飞防用药检测 (还差 ¥${diff.toFixed(2)})`
            )}
          </p>
        </div>
      </div>
      <button
        onClick={onGoOrder}
        className="bg-[#006d40] hover:bg-[#005a35] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0 active:scale-95 transition-all shadow-xs cursor-pointer"
      >
        {isQualified ? '查看清单' : '去凑单'}
      </button>
    </section>
  );
};
