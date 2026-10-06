import { showAlert } from '../utils/platform';
import { formatCents } from '../utils/format';
import { Button, Image, Text, View } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
import { ServiceOrder } from '../types';

interface OrderDetailViewProps {
  order: ServiceOrder;
  onAcceptOrder: (orderId: string) => void;
  onDeclineOrder: (orderId: string) => void;
  onGoToPrescription: (order: ServiceOrder) => void;
  onViewImage: (url: string, label: string) => void;
  onCopyAddress: (addr: string) => void;
  onCallFarmer: (phone: string, name: string) => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onAcceptOrder,
  onDeclineOrder,
  onGoToPrescription,
  onViewImage,
  onCopyAddress,
  onCallFarmer,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(14 * 60 + 26);
  const [isAccepted, setIsAccepted] = useState(order.status !== 'dispatching');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAccepted) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isAccepted]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleConfirmAccept = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAccepted(true);
      onAcceptOrder(order.id);
    }, 600);
  };

  return (
    <View className="flex flex-col w-full pb-28 select-none">
      {/* 顶部专属派单倒计时横幅 */}
      <View className="bg-primary px-3.5 pt-3.5 pb-4 text-white shadow-xs">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="inline-block w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping"></Text>
            <Text className="font-semibold text-secondary-fixed text-xs tracking-wide">
              {isAccepted ? '工单已接单 · 服务履约中' : '专属派单锁定中'}
            </Text>
          </View>
          <Text className="text-xs text-green-100 font-mono">工单号 {order.orderNo}</Text>
        </View>

        <View className="mt-2 flex items-baseline justify-between">
          <Text className="text-[22px] font-extrabold text-white">
            {isAccepted ? '待上门现场勘验' : '待确认接单'}
          </Text>
          <View className="flex items-center gap-1 bg-primary-container/80 px-2.5 py-1 rounded-full text-white">
            <Text className="material-symbols-outlined text-[16px] text-amber-200">timer</Text>
            <Text className="text-xs font-mono font-bold text-amber-200">
              {isAccepted ? '已就绪' : formatTimer(secondsLeft)}
            </Text>
          </View>
        </View>

        {/* Micro meta pill */}
        <View className="mt-2.5 flex items-center gap-2 text-xs">
          <Text className="bg-white/15 text-white px-2 py-0.5 rounded font-medium">
            {order.serviceType}
          </Text>
          <Text className="text-green-200">•</Text>
          <Text className="text-green-100 truncate">病虫害现场诊断与精准施药</Text>
        </View>
      </View>

      {/* 核心内容流 */}
      <View className="px-3 flex flex-col gap-3 mt-3">
        {/* Earnings & Incentive Hero Card */}
        <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
          <View className="flex items-center justify-between">
            <View>
              <Text className="text-xs text-on-surface-variant font-medium">本单预计服务费</Text>
              <View className="flex items-baseline gap-1 mt-0.5">
                <Text className="text-xs text-primary font-bold">¥</Text>
                <Text className="text-[26px] text-primary font-extrabold tracking-tight">
                  {formatCents(order.estimatedFeeCents)}
                </Text>
              </View>
            </View>

            <View className="bg-amber-100/70 border border-amber-200 px-3 py-1.5 rounded-lg text-right">
              <Text className="text-[11px] text-amber-900 font-medium">
                阿米巴合伙提成 ({order.bonusPercent}%)
              </Text>
              <View className="text-[17px] text-amber-950 font-bold mt-0.5">
                + ¥{formatCents(order.amoebaBonusCents)}
              </View>
            </View>
          </View>

          <View className="mt-3 pt-2 bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between text-on-surface-variant">
            <View className="flex items-center gap-1.5 text-xs">
              <Text className="material-symbols-outlined text-[16px] text-secondary">
                verified_user
              </Text>
              <Text className="text-on-surface font-medium">
                持证农艺师专责制 · 假一赔十 · 农险兜底
              </Text>
            </View>
            <Text className="text-[11px] text-secondary font-bold">已承保</Text>
          </View>
        </View>

        {/* Farmer & Field Parcel Dossier */}
        <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
          <View className="flex items-center justify-between pb-2">
            <View className="flex items-center gap-1.5">
              <Text className="material-symbols-outlined text-primary text-[20px]">person_pin</Text>
              <Text className="text-[16px] font-bold text-on-surface">农户与地块</Text>
            </View>
            <Text className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-xs font-bold">
              {order.farmerTag}
            </Text>
          </View>

          {/* Farmer Contact Bar */}
          <View className="flex items-center justify-between py-2 bg-surface-container-low rounded-lg px-3 mt-1">
            <View className="flex items-center gap-2.5">
              <View className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
                张
              </View>
              <View>
                <View className="font-bold text-sm text-on-surface">{order.farmerName}</View>
                <View className="text-xs text-on-surface-variant font-mono">138****8888</View>
              </View>
            </View>

            <Button
              onClick={() => onCallFarmer('13800008888', order.farmerName)}
              className="flex items-center gap-1 bg-primary hover:bg-primary-container text-white px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-transform cursor-pointer"
            >
              <Text className="material-symbols-outlined text-[15px]">call</Text>
              <Text>呼叫农户</Text>
            </Button>
          </View>

          {/* Address and Routing Box */}
          <View className="mt-3 flex flex-col gap-2">
            <View className="flex items-start gap-2">
              <Text className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                location_on
              </Text>
              <View className="flex-1 min-w-0">
                <Text className="text-sm text-on-surface font-semibold leading-snug">
                  {order.locationName}
                </Text>
                <Text className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  路况说明：{order.roadCondition}
                </Text>
              </View>
            </View>

            <View className="flex items-center gap-2 pl-6 pt-1">
              <Button
                onClick={() => onCopyAddress(order.locationName)}
                className="flex items-center gap-1 text-secondary font-semibold text-xs bg-surface-container px-2.5 py-1 rounded-md active:bg-surface-container-high transition-colors cursor-pointer"
              >
                <Text className="material-symbols-outlined text-[14px]">content_copy</Text>
                <Text>复制地址</Text>
              </Button>
              {/* 本期无地图/定位能力（AGENTS 非目标 + 注意事项2），不提供导航入口，仅支持复制地址人工前往 */}
            </View>
          </View>

          {/* Key Service Specs Grid */}
          <View className="grid grid-cols-2 gap-2 mt-3 pt-2 bg-surface-container-low/70 p-2.5 rounded-lg text-xs">
            <View className="flex items-center gap-2">
              <View className="w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-on-secondary-fixed">
                <Text className="material-symbols-outlined text-[18px]">calendar_clock</Text>
              </View>
              <View>
                <View className="text-[11px] text-on-surface-variant">期望服务时间</View>
                <View className="font-bold text-on-surface">{order.scheduledTime}</View>
              </View>
            </View>

            <View className="flex items-center gap-2">
              <View className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                <Text className="material-symbols-outlined text-[18px]">grass</Text>
              </View>
              <View>
                <View className="text-[11px] text-on-surface-variant">作物与规模</View>
                <View className="font-bold text-on-surface">{order.cropScale}</View>
              </View>
            </View>
          </View>
        </View>

        {/* Pest & Agronomic Symptom Dossier (农情自报) */}
        <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
          <View className="flex items-center justify-between mb-2">
            <View className="flex items-center gap-1.5">
              <Text className="material-symbols-outlined text-primary text-[20px]">
                psychiatry
              </Text>
              <Text className="text-[16px] font-bold text-on-surface">田间农情自报</Text>
            </View>
            <Text className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              阴雨扩散中
            </Text>
          </View>

          {/* Farmer Quote Box */}
          <View className="bg-surface-container-low rounded-lg p-3">
            <View className="flex items-start gap-1.5">
              <Text className="material-symbols-outlined text-outline text-[16px] shrink-0 mt-0.5">
                format_quote
              </Text>
              <Text className="text-xs text-on-surface leading-relaxed font-medium">
                {order.farmerQuote}
              </Text>
            </View>
          </View>

          {/* Field Photo Attachments */}
          <View className="mt-3">
            <View className="flex items-center justify-between mb-1.5">
              <Text className="text-xs text-on-surface-variant font-medium">
                农户上传田间凭证 (2张)
              </Text>
              <Text className="text-[11px] text-outline">点击查看大图</Text>
            </View>

            <View className="grid grid-cols-2 gap-2">
              {order.farmerPhotos.map((photo, idx) => (
                <View
                  key={idx}
                  onClick={() => onViewImage(photo.url, photo.label)}
                  className="relative rounded-lg overflow-hidden h-28 bg-surface-container group cursor-pointer border border-surface-container-high hover:opacity-95"
                >
                  <Image
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    alt={photo.label}
                    src={photo.url}
                  />
                  <View className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                    {photo.label}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Cost Breakdown Details */}
        <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
          <View className="flex items-center justify-between mb-2">
            <Text className="text-sm font-bold text-on-surface">服务费用构成</Text>
            <Text className="text-[11px] text-outline">已由华农智慧平台核价</Text>
          </View>
          <View className="space-y-2 text-xs text-on-surface-variant">
            {order.costBreakdown.map((item, index) => (
              <View key={index} className="flex items-center justify-between">
                <Text>{item.item}</Text>
                {item.amountCents > 0 ? (
                  <Text className="text-on-surface font-semibold">¥{formatCents(item.amountCents)}</Text>
                ) : (
                  <Text className="italic text-outline">{item.note}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Sticky Bottom Dock */}
      <View className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-surface-container-lowest/95 backdrop-blur-md px-3 pt-3 pb-safe z-30 shadow-[0_-4px_16px_rgba(28,36,31,0.08)] border-t border-surface-container">
        {!isAccepted ? (
          <View className="flex items-center gap-2">
            <Button
              onClick={() => onDeclineOrder(order.id)}
              className="w-28 h-12 rounded-xl bg-surface-container text-on-surface font-semibold text-xs flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <Text>转派 / 暂不接</Text>
              <Text className="text-[10px] text-on-surface-variant leading-none mt-0.5">无考核扣分</Text>
            </Button>

            <Button
              disabled={isSubmitting}
              onClick={handleConfirmAccept}
              className="flex-1 h-12 rounded-xl bg-primary-container hover:bg-primary text-white font-bold text-sm flex flex-col items-center justify-center shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <View className="flex items-center gap-1.5">
                {isSubmitting ? (
                  <Text className="material-symbols-outlined text-[18px] animate-spin">sync</Text>
                ) : (
                  <Text className="material-symbols-outlined text-[18px]">assignment_turned_in</Text>
                )}
                <Text>立即确认接单</Text>
              </View>
              <Text className="text-[10px] text-emerald-200 leading-none mt-0.5">
                接单后立即向农户发送短信通知
              </Text>
            </Button>
          </View>
        ) : (
          <View className="flex items-center gap-2">
            <Button
              onClick={() =>
                showAlert(`已重新发送服务位置及预估到达时间短信至农户手机：${order.farmerPhone}`)
              }
              className="h-12 px-3 rounded-xl bg-surface-container text-on-surface font-semibold text-xs flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer"
            >
              <Text className="material-symbols-outlined text-[18px]">sms</Text>
              <Text className="text-[10px] text-on-surface-variant">重发通知</Text>
            </Button>

            <Button
              onClick={() => onGoToPrescription(order)}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-sm flex flex-col items-center justify-center shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <View className="flex items-center gap-1.5">
                <Text className="material-symbols-outlined text-[18px]">psychiatry</Text>
                <Text>前往现场勘验与开处方</Text>
              </View>
              <Text className="text-[10px] text-emerald-200 leading-none mt-0.5">
                已达现场 · 采集实拍与诊断开药
              </Text>
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};
