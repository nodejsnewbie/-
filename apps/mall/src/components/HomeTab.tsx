import React from 'react';
import {
  AlertTriangle,
  Phone,
  MapPin,
  Sparkles,
  Plane,
  QrCode,
  UserCheck,
} from 'lucide-react';
import { SERVICE_STATIONS, PRODUCTS } from '../data/mockData.ts';
import { MallProduct } from '@hnhall/shared';

interface HomeTabProps {
  onNavigateToTab: (tab: string) => void;
  onOpenScan: () => void;
  onOpenBooking: () => void;
  onSelectProduct: (product: MallProduct) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onNavigateToTab,
  onOpenScan,
  onOpenBooking,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-3.5 pb-4">
      {/* Weather & Drone Spraying Index */}
      <section className="bg-gradient-to-br from-[#004425] via-[#00502c] to-[#135d38] text-white rounded-2xl p-3.5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1 bg-[#8ef5b5]/20 text-[#8ef5b5] text-[10px] font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8ef5b5] animate-ping mr-0.5"></span>
            今日安沙示范区田间微气象
          </div>
          <span className="text-[10px] text-white/70 font-mono">10-01 09:40 实测</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-[24px] font-extrabold flex items-baseline gap-1">
              26<span className="text-[14px] font-normal">℃</span>
              <span className="text-[13px] font-bold text-[#8ef5b5] ml-2 px-2 py-0.5 bg-white/10 rounded-full">
                适宜飞防作业
              </span>
            </div>
            <p className="text-[11px] text-white/80 mt-0.5">
              气温温和 · 东南风 1.8m/s (2级) · 药滴沉降附着率高
            </p>
          </div>
          <Plane className="w-10 h-10 text-[#8ef5b5]/40" />
        </div>

        {/* Micro-metrics */}
        <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="bg-white/10 rounded-lg py-1.5">
            <div className="text-white/60">相对湿度</div>
            <div className="font-bold text-[12px] text-white mt-0.5">64%</div>
          </div>
          <div className="bg-white/10 rounded-lg py-1.5">
            <div className="text-white/60">平均风速</div>
            <div className="font-bold text-[12px] text-[#8ef5b5] mt-0.5">1.8 m/s</div>
          </div>
          <div className="bg-white/10 rounded-lg py-1.5">
            <div className="text-white/60">4小时降水率</div>
            <div className="font-bold text-[12px] text-white mt-0.5">&lt; 5%</div>
          </div>
        </div>
      </section>

      {/* Official Advisory Alert */}
      <section className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="min-w-0 text-[11px]">
          <div className="font-bold text-amber-900 flex items-center justify-between">
            <span>长沙县水稻病虫情第8期测报预警</span>
            <span className="text-[9px] bg-amber-200/80 text-amber-800 px-1 rounded">紧急</span>
          </div>
          <p className="text-amber-800 mt-1 leading-relaxed">
            近期三代稻纵卷叶螟在早熟晚稻田间产卵量急增，伴随破口期纹枯病高发。建议在齐穗破口前5天抢晴统防统治。
          </p>
        </div>
      </section>

      {/* 4 Quick Entry Tiles */}
      <section className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenScan}
          className="bg-white p-2.5 rounded-xl border border-[#e2eae2] flex flex-col items-center justify-center text-center shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#004425]/10 text-[#004425] flex items-center justify-center mb-1">
            <QrCode className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#151d19]">扫码验真</span>
          <span className="text-[9px] text-[#707971]">全国溯源</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="bg-white p-2.5 rounded-xl border border-[#e2eae2] flex flex-col items-center justify-center text-center shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-[#006d40]/10 text-[#006d40] flex items-center justify-center mb-1">
            <Plane className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#151d19]">预约飞防</span>
          <span className="text-[9px] text-[#707971]">上门施用</span>
        </button>

        <button
          onClick={() => onNavigateToTab('mall')}
          className="bg-white p-2.5 rounded-xl border border-[#e2eae2] flex flex-col items-center justify-center text-center shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#151d19]">选购农资</span>
          <span className="text-[9px] text-[#707971]">官方直营</span>
        </button>

        <button
          onClick={() => onNavigateToTab('doorstep')}
          className="bg-white p-2.5 rounded-xl border border-[#e2eae2] flex flex-col items-center justify-center text-center shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-800 flex items-center justify-center mb-1">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#151d19]">农艺师</span>
          <span className="text-[9px] text-[#707971]">现场开方</span>
        </button>
      </section>

      {/* Recommended Formulation Package ("晚稻破口期一喷多促黄金组合") */}
      <section className="bg-white rounded-xl p-3.5 border border-[#e2eae2] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[13px] text-[#004425]">晚稻破口期“一喷多促”科学配方</h3>
              <span className="text-[9px] bg-[#004425] text-white px-1 py-0.2 rounded font-bold">
                农艺师定制
              </span>
            </div>
            <p className="text-[10px] text-[#707971] mt-0.5">
              杀菌(肟菌·戊唑醇) + 杀虫(氯虫苯甲酰胺) + 灌浆(磷酸二氢钾)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[#e2eae2]">
          {PRODUCTS.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className="bg-[#edf6ee]/70 p-2 rounded-lg border border-[#bfc9bf]/50 text-center cursor-pointer hover:border-[#004425] transition-all"
            >
              <div className="w-12 h-12 rounded bg-white mx-auto overflow-hidden">
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="font-bold text-[11px] text-[#151d19] truncate mt-1">
                {prod.name.split('·')[1] || prod.name}
              </div>
              <div className="text-[10px] font-extrabold text-[#ba1a1a]">
                ¥{prod.price.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Physical Stations */}
      <section className="bg-white rounded-xl p-3.5 border border-[#e2eae2] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-[13px] text-[#004425] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#006d40]" />
            <span>周边直属实体直营站</span>
          </h3>
          <span className="text-[10px] text-[#006d40] font-medium">支持自提/极速闪送</span>
        </div>

        <div className="space-y-2">
          {SERVICE_STATIONS.map((st, i) => (
            <div
              key={i}
              className="p-2 rounded-lg bg-[#f3fcf3] border border-[#e2eae2] flex items-center justify-between text-[11px]"
            >
              <div className="min-w-0 pr-2">
                <div className="font-bold text-[#151d19] truncate">{st.name}</div>
                <div className="text-[10px] text-[#707971] truncate">{st.address}</div>
                <div className="text-[9px] text-[#006d40] font-medium mt-0.5">
                  {st.distance} · {st.deliveryTime}
                </div>
              </div>
              <a
                href={`tel:${st.phone}`}
                className="bg-[#004425] text-white p-2 rounded-lg flex items-center justify-center flex-shrink-0 active:scale-95 transition-all"
                title="拨打电话"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
