import React from 'react';
import {
  UserCheck,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  PlusCircle,
} from 'lucide-react';
import { ServiceBooking } from '@hnhall/shared';
import { AGRONOMISTS } from '../data/mockData.ts';

interface DoorstepTabProps {
  bookings: ServiceBooking[];
  onOpenNewBooking: () => void;
  onCallAgronomist: (name: string, phone: string) => void;
}

export const DoorstepTab: React.FC<DoorstepTabProps> = ({
  bookings,
  onOpenNewBooking,
  onCallAgronomist,
}) => {
  return (
    <div className="space-y-3.5 pb-4">
      {/* Top Banner */}
      <section className="bg-gradient-to-br from-[#004425] to-[#135d38] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1 bg-[#8ef5b5]/20 text-[#8ef5b5] text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
            <ShieldCheck className="w-3 h-3" />
            官方实体服务站直派 · 留痕可溯
          </div>
          <h2 className="text-[17px] font-bold">持证农艺师上门 & 飞防植保</h2>
          <p className="text-[11px] text-white/80 mt-1">
            测土配方、病虫害田间会诊、极飞/大疆无人机统防统治
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onOpenNewBooking}
              className="bg-[#8ef5b5] text-[#007243] font-bold text-[12px] py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>预约新作业 (最快2小时到田)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Active Work Orders */}
      <section className="bg-white rounded-xl p-3.5 border border-[#e2eae2] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[14px] text-[#004425] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#006d40]" />
            <span>我的田间作业工单 ({bookings.length})</span>
          </h3>
          <span className="text-[10px] text-[#707971]">实时定位进度</span>
        </div>

        {bookings.length === 0 ? (
          <div className="py-6 text-center text-[#707971]">
            <p className="text-[12px]">暂无进行中的上门工单</p>
            <button
              onClick={onOpenNewBooking}
              className="mt-2 text-[11px] font-bold text-[#006d40] underline"
            >
              立即预约一次农艺师田间诊断
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#edf6ee]/70 rounded-xl p-3 border border-[#bfc9bf]/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[13px] text-[#151d19]">
                      {booking.cropType} · {booking.acreage}亩
                    </span>
                    <span className="bg-[#004425] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {booking.serviceType === 'drone_spraying' ? '飞防喷药' : '现场会诊'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#006d40]">
                    {booking.id}
                  </span>
                </div>

                <div className="text-[11px] text-[#404941] space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#707971] flex-shrink-0" />
                    <span className="truncate">{booking.plotAddress}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#707971] flex-shrink-0" />
                    <span>
                      预约时间: {booking.preferredDate} {booking.timeSlot}
                    </span>
                  </div>
                </div>

                {/* Progress Pipeline */}
                <div className="pt-2 border-t border-[#bfc9bf]/40">
                  <div className="grid grid-cols-4 text-center text-[10px] relative">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-[#006d40] text-white flex items-center justify-center text-[8px] font-bold z-10">
                        ✓
                      </div>
                      <span className="mt-1 font-bold text-[#006d40]">已派单</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-[#006d40] text-white flex items-center justify-center text-[8px] font-bold z-10">
                        ✓
                      </div>
                      <span className="mt-1 font-bold text-[#006d40]">农艺师接单</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-[#8ef5b5] text-[#007243] border border-[#006d40] flex items-center justify-center text-[8px] font-bold z-10 animate-pulse">
                        ●
                      </div>
                      <span className="mt-1 font-bold text-[#004425]">备药调配</span>
                    </div>
                    <div className="flex flex-col items-center opacity-40">
                      <div className="w-4 h-4 rounded-full bg-[#e2eae2] border border-[#707971] flex items-center justify-center text-[8px] z-10">
                        ○
                      </div>
                      <span className="mt-1">田间验收</span>
                    </div>
                  </div>
                </div>

                {/* Assigned Agronomist */}
                {booking.assignedAgronomist && (
                  <div className="mt-2 bg-white rounded-lg p-2 border border-[#e2eae2] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#004425]/10 text-[#004425] flex items-center justify-center font-bold text-xs">
                        {booking.assignedAgronomist.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-[11px] text-[#151d19]">
                          {booking.assignedAgronomist.name} (
                          {booking.assignedAgronomist.title.split('/')[0]})
                        </div>
                        <div className="text-[9px] text-[#707971] font-mono">
                          {booking.assignedAgronomist.certId}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        onCallAgronomist(
                          booking.assignedAgronomist!.name,
                          booking.assignedAgronomist!.phone,
                        )
                      }
                      className="bg-[#006d40]/10 hover:bg-[#006d40]/20 text-[#006d40] font-bold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Phone className="w-3 h-3" />
                      <span>呼叫专家</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Agronomists Roster */}
      <section className="bg-white rounded-xl p-3.5 border border-[#e2eae2] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[14px] text-[#004425] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#006d40]" />
            <span>特约驻站农艺师团队</span>
          </h3>
          <span className="text-[10px] text-[#006d40] font-semibold">100%持证在编</span>
        </div>

        <div className="space-y-2.5">
          {AGRONOMISTS.map((agro) => (
            <div
              key={agro.id}
              className="p-2.5 rounded-xl bg-[#f3fcf3] border border-[#e2eae2] flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-[#004425] text-white flex items-center justify-center font-bold text-[14px] flex-shrink-0 shadow-xs">
                  {agro.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[13px] text-[#151d19]">{agro.name}</span>
                    <span className="text-[9px] bg-[#004425]/10 text-[#004425] px-1 py-0.2 rounded font-semibold">
                      从业{agro.experienceYears}年
                    </span>
                  </div>
                  <div className="text-[10px] text-[#404941] truncate mt-0.5">
                    {agro.title} · 评分 {agro.rating}
                  </div>
                  <div className="text-[9px] text-[#707971] truncate font-mono mt-0.5">
                    {agro.certNumber}
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenNewBooking}
                className="bg-[#004425] hover:bg-[#135d38] text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex-shrink-0 cursor-pointer"
              >
                点他上门
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 48-Hour Field Guarantee */}
      <section className="bg-[#edf6ee] rounded-xl p-3 border border-[#bfc9bf]/60 flex items-start gap-2.5 text-[11px] text-[#404941]">
        <ShieldCheck className="w-5 h-5 text-[#006d40] flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-[#004425] text-[12px]">48小时田间复诊保障</div>
          <p className="mt-0.5 leading-relaxed">
            施药或飞防作业完成后48小时内，农艺师将实地回访复核防效。如遇异常虫情反弹或防效不达标，免费进行二次补防！
          </p>
        </div>
      </section>
    </div>
  );
};
