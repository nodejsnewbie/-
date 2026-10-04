import React, { useState } from 'react';
import {
  X,
  MapPin,
  UserCheck,
  Plane,
  ShieldCheck,
} from 'lucide-react';
import { MallProduct, ServiceBooking } from '@hnhall/shared';
import { SERVICE_STATIONS, AGRONOMISTS } from '../data/mockData.ts';

interface DoorstepBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: MallProduct | null;
  initialAcreage?: number;
  onSubmitBooking: (booking: ServiceBooking) => void;
}

export const DoorstepBookingModal: React.FC<DoorstepBookingModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  initialAcreage = 30,
  onSubmitBooking,
}) => {
  const [station, setStation] = useState(SERVICE_STATIONS[0].name);
  const [cropType, setCropType] = useState('晚稻 / 一季稻');
  const [acreage, setAcreage] = useState(initialAcreage);
  const [serviceType, setServiceType] = useState<ServiceBooking['serviceType']>('drone_spraying');
  const [contactName, setContactName] = useState('李建平 (安沙水稻合作社)');
  const [contactPhone, setContactPhone] = useState('138-7589-9921');
  const [plotAddress, setPlotAddress] = useState('长沙县安沙镇水渡河村8组');
  const [preferredDate, setPreferredDate] = useState('2024-10-02');
  const [timeSlot, setTimeSlot] = useState('上午 (07:00-11:00 飞防适期)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: ServiceBooking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      serviceType,
      cropType,
      acreage,
      preferredDate,
      timeSlot,
      station,
      contactName,
      contactPhone,
      plotAddress,
      associatedProducts: initialProduct
        ? [initialProduct.name]
        : ['华农植保·75%肟菌·戊唑醇悬浮剂'],
      status: 'submitted',
      assignedAgronomist: {
        name: AGRONOMISTS[0].name,
        certId: AGRONOMISTS[0].certNumber,
        phone: '139-7312-8800',
        title: AGRONOMISTS[0].title,
      },
    };

    onSubmitBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in text-[#151d19]">
      <div className="w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="p-3.5 bg-[#004425] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#8ef5b5]" />
            <div>
              <h3 className="font-bold text-[14px]">预约持证农艺师 / 飞防队上门施用</h3>
              <p className="text-[10px] text-white/80">实体站直派 · 最快2小时到田</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 space-y-3.5 text-[12px]"
        >
          {/* Associated MallProduct if any */}
          {initialProduct && (
            <div className="p-2.5 bg-[#edf6ee] rounded-xl border border-[#bfc9bf]/60 flex items-center gap-2">
              <span className="bg-[#006d40] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                已关联用药
              </span>
              <span className="font-bold text-[12px] text-[#004425] truncate">
                {initialProduct.name}
              </span>
            </div>
          )}

          {/* Service Station */}
          <div>
            <label className="block text-[12px] font-bold text-[#151d19] mb-1">
              接单调度自营服务站：
            </label>
            <select
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="w-full bg-[#edf6ee] border border-[#bfc9bf] rounded-xl p-2 text-[12px] font-medium text-[#151d19] focus:outline-none focus:ring-1 focus:ring-[#004425]"
            >
              {SERVICE_STATIONS.map((st) => (
                <option key={st.name} value={st.name}>
                  {st.name} ({st.deliveryTime})
                </option>
              ))}
            </select>
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-[12px] font-bold text-[#151d19] mb-1.5">
              所需服务类型：
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setServiceType('drone_spraying')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  serviceType === 'drone_spraying'
                    ? 'border-[#004425] bg-[#004425]/5 text-[#004425] font-bold'
                    : 'border-[#e2eae2] bg-white text-[#404941]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-[#006d40]" />
                  <span>极飞/大疆无人机飞防</span>
                </div>
                <div className="text-[10px] text-[#707971] mt-0.5">持证机手+原厂药剂精喷</div>
              </button>

              <button
                type="button"
                onClick={() => setServiceType('field_diagnosis')}
                className={`p-2 rounded-xl border text-left transition-all ${
                  serviceType === 'field_diagnosis'
                    ? 'border-[#004425] bg-[#004425]/5 text-[#004425] font-bold'
                    : 'border-[#e2eae2] bg-white text-[#404941]'
                }`}
              >
                <div className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-[#006d40]" />
                  <span>高级农艺师田间诊断</span>
                </div>
                <div className="text-[10px] text-[#707971] mt-0.5">病虫草害现场复核开方</div>
              </button>
            </div>
          </div>

          {/* Plot Details */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-bold text-[#151d19] mb-1">作物种类</label>
              <input
                type="text"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-[#edf6ee] border border-[#bfc9bf] rounded-xl p-2 text-[12px] text-[#151d19]"
                placeholder="例如: 水稻、柑橘"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#151d19] mb-1">
                地块面积 (亩)
              </label>
              <input
                type="number"
                min={1}
                value={acreage}
                onChange={(e) => setAcreage(Number(e.target.value) || 1)}
                className="w-full bg-[#edf6ee] border border-[#bfc9bf] rounded-xl p-2 text-[12px] text-[#151d19]"
                required
              />
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-bold text-[#151d19] mb-1">
                期望上门日期
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-[#edf6ee] border border-[#bfc9bf] rounded-xl p-2 text-[12px] text-[#151d19]"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#151d19] mb-1">时间段</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#edf6ee] border border-[#bfc9bf] rounded-xl p-2 text-[12px] text-[#151d19]"
              >
                <option value="上午 (07:00-11:00 飞防适期)">早晨 07:00-11:00 (最佳)</option>
                <option value="傍晚 (16:30-19:30 避开高温)">傍晚 16:30-19:30</option>
                <option value="全天应急调度">紧急险情 优先抢防</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <div>
              <label className="block text-[12px] font-bold text-[#151d19] mb-1">
                农田位置 (地块地址)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#707971] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={plotAddress}
                  onChange={(e) => setPlotAddress(e.target.value)}
                  className="w-full bg-[#edf6ee] border border-[#bfc9bf] rounded-xl py-2 pl-8 pr-2 text-[12px] text-[#151d19]"
                  placeholder="如：长沙县安沙镇水渡河高产片区5号机耕道"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[12px] font-bold text-[#151d19] mb-1">联系人</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-[#edf6ee] border border-[#bfc9bf] rounded-xl p-2 text-[12px] text-[#151d19]"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#151d19] mb-1">手机号</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#edf6ee] border border-[#bfc9bf] rounded-xl p-2 text-[12px] text-[#151d19]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="bg-[#f3fcf3] p-2.5 rounded-xl border border-[#bfc9bf]/60 flex items-center gap-2 text-[11px] text-[#006d40]">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>自营承诺：持证农艺师专职负责，48小时田间跟踪防效！</span>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#004425] hover:bg-[#135d38] text-white font-bold text-[13px] py-3 rounded-xl active:scale-98 transition-all shadow-md cursor-pointer"
            >
              提交上门预约并派单至实体站
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
