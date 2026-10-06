import { formatCents, formatRelativeTime } from '../utils/format';
import { Button, Image, Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import { TechnicianProfile, ServiceOrder, TabType } from '../types';

interface OrderHallViewProps {
  technician: TechnicianProfile;
  orders: ServiceOrder[];
  onToggleOnline: () => void;
  onSelectOrder: (order: ServiceOrder) => void;
  onQuickClaim: () => void;
  onChangeTab: (tab: TabType) => void;
  onOpenPrescriptionBuilder: (order: ServiceOrder) => void;
}

export const OrderHallView: React.FC<OrderHallViewProps> = ({
  technician,
  orders,
  onToggleOnline,
  onSelectOrder,
  onQuickClaim,
  onChangeTab,
  onOpenPrescriptionBuilder,
}) => {
  const [claimedOrderIds, setClaimedOrderIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleClaim = (e: React.MouseEvent, order: ServiceOrder) => {
    e.stopPropagation();
    if (claimedOrderIds.includes(order.id)) return;
    setClaimedOrderIds((prev) => [...prev, order.id]);
    showToast(`已成功锁定工单：${order.title}`);
  };

  const activeInServiceOrder = orders.find((o) => o.status === 'in_progress') || orders[0];

  return (
    <View className="flex flex-col w-full px-3 pb-24 gap-3 select-none">
      {/* 顶部技术人员身份卡 */}
      <View className="bg-surface-container-lowest rounded-xl shadow-xs p-3.5 flex flex-col gap-2.5">
        <View className="flex items-start justify-between gap-2">
          <View className="flex items-center gap-2.5 min-w-0">
            <View className="relative shrink-0">
              <Image
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10"
                alt="农艺师张师傅"
                src={technician.avatarUrl}
              />
              <Text className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 flex items-center justify-center">
                <Text className="material-symbols-outlined text-[13px]">verified</Text>
              </Text>
            </View>
            <View className="flex flex-col min-w-0">
              <View className="flex items-center gap-1.5 flex-wrap">
                <Text className="font-bold text-[18px] text-on-surface truncate">
                  {technician.name}
                </Text>
                <Text className="bg-primary-fixed text-on-primary-fixed font-semibold text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap">
                  {technician.title}
                </Text>
              </View>
              <View className="flex items-center gap-1 text-on-surface-variant text-[11px] mt-0.5">
                <Text className="flex items-center text-amber-700 font-bold">
                  <Text className="material-symbols-outlined text-[14px] text-amber-500 fill-amber-500 material-symbols-filled">
                    star
                  </Text>
                  {technician.rating}
                </Text>
                <Text className="text-outline-variant">|</Text>
                <Text>从业{technician.yearsOfService}年</Text>
                <Text className="text-outline-variant">|</Text>
                <Text className="truncate">安沙镇直营站</Text>
              </View>
            </View>
          </View>

          {/* 实时状态切换 */}
          <View className="flex flex-col items-end shrink-0">
            <Button
              onClick={onToggleOnline}
              className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded-full cursor-pointer hover:bg-surface-container-highest transition-colors active:scale-95"
            >
              <Text
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  technician.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
              ></Text>
              <Text
                className={`text-[12px] font-bold ${
                  technician.isOnline ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {technician.isOnline ? '接单中' : '休息中'}
              </Text>
              <Text className="material-symbols-outlined text-[14px] text-on-surface-variant">
                sync_alt
              </Text>
            </Button>
            <Text className="text-[11px] text-on-surface-variant mt-1">
              今日在线 {technician.onlineHoursToday}h
            </Text>
          </View>
        </View>

        {/* 资质许可与合规防伪条 */}
        <View className="bg-surface-container-low rounded-lg p-2 flex items-center justify-between gap-2">
          <View className="flex items-center gap-1.5 text-on-surface-variant text-[11px] min-w-0">
            <Text className="material-symbols-outlined text-[14px] text-secondary shrink-0">
              workspace_premium
            </Text>
            <Text className="text-outline shrink-0">农药经营许可:</Text>
            <Text className="font-mono text-on-surface font-semibold truncate">
              {technician.pesticideLicense}
            </Text>
          </View>
          <Text className="text-[10px] font-bold text-secondary bg-surface-container-lowest px-1.5 py-0.5 rounded text-center shrink-0">
            官方认证保真
          </Text>
        </View>
      </View>

      {/* 今日业务核心看板 */}
      <View className="grid grid-cols-3 gap-2">
        <View className="bg-surface-container-lowest rounded-xl p-2.5 shadow-xs flex flex-col items-center justify-center text-center">
          <View className="flex items-center gap-1 text-tertiary-container">
            <Text className="material-symbols-outlined text-[16px]">notifications_active</Text>
            <Text className="text-xs text-on-surface-variant">待抢单</Text>
          </View>
          <View className="text-[24px] text-tertiary-container font-extrabold mt-0.5 leading-none">
            3
          </View>
          <Text className="text-[10px] text-on-surface-variant mt-1">待处理工单</Text>
        </View>

        <View
          onClick={() => onChangeTab('service-orders')}
          className="bg-surface-container-lowest rounded-xl p-2.5 shadow-xs flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low transition-colors"
        >
          <View className="flex items-center gap-1 text-primary">
            <Text className="material-symbols-outlined text-[16px]">agriculture</Text>
            <Text className="text-xs text-on-surface-variant">服务中</Text>
          </View>
          <View className="text-[24px] text-primary font-extrabold mt-0.5 leading-none">
            2
          </View>
          <Text className="text-[10px] text-on-surface-variant mt-1">作业质检验收中</Text>
        </View>

        <View className="bg-surface-container-lowest rounded-xl p-2.5 shadow-xs flex flex-col items-center justify-center text-center">
          <View className="flex items-center gap-1 text-on-surface-variant">
            <Text className="material-symbols-outlined text-[16px]">check_circle</Text>
            <Text className="text-xs text-on-surface-variant">已完成</Text>
          </View>
          <View className="text-[24px] text-on-surface font-extrabold mt-0.5 leading-none">
            12
          </View>
          <Text className="text-[10px] text-on-surface-variant mt-1">好评率 100%</Text>
        </View>

        {/* 阿米巴分红横幅看板 */}
        <View className="col-span-3 bg-gradient-to-r from-primary-container via-primary to-primary-container rounded-xl p-3 text-white shadow-xs flex items-center justify-between">
          <View className="flex items-center gap-2.5">
            <View className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Text className="material-symbols-outlined text-[22px] text-amber-200">
                payments
              </Text>
            </View>
            <View className="flex flex-col">
              <View className="flex items-center gap-1">
                <Text className="text-xs text-green-100">今日预估阿米巴提成</Text>
                <Text className="bg-secondary text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                  含处方分红
                </Text>
              </View>
              <View className="text-[22px] font-extrabold tracking-tight text-white leading-tight">
                <Text className="text-xs font-normal">¥</Text>428.50
              </View>
            </View>
          </View>
          <Button
            onClick={() => onChangeTab('amoeba-bonus')}
            className="flex items-center gap-0.5 bg-white/20 hover:bg-white/30 active:scale-95 px-3 py-1.5 rounded-full font-bold text-xs text-white transition-all cursor-pointer"
          >
            <Text>账目明细</Text>
            <Text className="material-symbols-outlined text-[14px]">arrow_forward</Text>
          </Button>
        </View>
      </View>

      {/* 常用快捷工具入口 (4格宫格) */}
      <View className="bg-surface-container-lowest rounded-xl p-3 shadow-xs">
        <View className="grid grid-cols-4 gap-2 text-center">
          <Button
            onClick={onQuickClaim}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <View className="w-11 h-11 rounded-xl bg-primary-fixed/40 group-hover:bg-primary-fixed/60 flex items-center justify-center text-primary transition-all group-active:scale-95">
              <Text className="material-symbols-outlined text-[22px]">electric_bolt</Text>
            </View>
            <Text className="text-xs text-on-surface font-semibold">一键抢单</Text>
          </Button>

          <Button
            onClick={() => onChangeTab('service-orders')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <View className="w-11 h-11 rounded-xl bg-secondary-container/40 group-hover:bg-secondary-container/60 flex items-center justify-center text-secondary transition-all group-active:scale-95">
              <Text className="material-symbols-outlined text-[22px]">fact_check</Text>
            </View>
            <Text className="text-xs text-on-surface font-semibold">任务台账</Text>
          </Button>

          <Button
            onClick={() => onOpenPrescriptionBuilder(activeInServiceOrder)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <View className="w-11 h-11 rounded-xl bg-tertiary-fixed/60 group-hover:bg-tertiary-fixed/80 flex items-center justify-center text-tertiary transition-all group-active:scale-95">
              <Text className="material-symbols-outlined text-[22px]">psychiatry</Text>
            </View>
            <Text className="text-xs text-on-surface font-semibold">现场诊断</Text>
          </Button>

          <Button
            onClick={() => onChangeTab('amoeba-bonus')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <View className="w-11 h-11 rounded-xl bg-surface-container-high group-hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-all group-active:scale-95">
              <Text className="material-symbols-outlined text-[22px]">monitoring</Text>
            </View>
            <Text className="text-xs text-on-surface font-semibold">收入看板</Text>
          </Button>
        </View>
      </View>

      {/* 待抢订单列表标题 */}
      <View className="flex items-center justify-between pt-1">
        <View className="flex items-center gap-1.5">
          <Text className="w-1 h-3.5 bg-primary rounded-full"></Text>
          <Text className="font-bold text-[16px] text-on-surface">附近待接工单</Text>
          <Text className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
            3单急需
          </Text>
        </View>
        {/* 本期无定位能力，不提供距离范围筛选（注意事项2：distanceKm 不得作派单决策依据） */}
      </View>

      {/* 订单卡片列表流 */}
      <View className="flex flex-col gap-2.5">
        {orders.map((order) => {
          const isClaimed = claimedOrderIds.includes(order.id);

          return (
            <View
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs relative overflow-hidden flex flex-col gap-2 cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Top status indicator tag */}
              <View className="flex items-center justify-between">
                <View className="flex items-center gap-1.5 min-w-0 pr-1">
                  <Text
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                      order.urgencyTag === '急单'
                        ? 'bg-red-600'
                        : order.urgencyTag === '农机维保'
                        ? 'bg-emerald-700'
                        : 'bg-amber-700'
                    }`}
                  >
                    {order.urgencyTag}
                  </Text>
                  <Text className="font-bold text-[15px] text-on-surface truncate">
                    {order.title}
                  </Text>
                </View>
                <View className="text-[10px] text-on-surface-variant shrink-0 flex items-center gap-0.5 font-medium">
                  <Text className="material-symbols-outlined text-[12px] text-outline">schedule</Text>
                  <Text>{formatRelativeTime(order.dispatchedAt)}</Text>
                </View>
              </View>

              {/* 网格细分位置 */}
              <View className="bg-surface-container-low rounded-lg p-2 flex items-center justify-between">
                <View className="flex items-center gap-1.5 text-on-surface-variant text-xs min-w-0">
                  <Text className="material-symbols-outlined text-[16px] text-primary shrink-0">
                    pin_drop
                  </Text>
                  <Text className="truncate font-semibold text-on-surface">
                    {order.farmerName}
                  </Text>
                  <Text className="text-outline-variant">|</Text>
                  {order.location?.enabled && order.location.value ? (
                    <Text className="text-primary font-bold shrink-0">
                      距您约 {order.location.value.distanceKm}km
                    </Text>
                  ) : (
                    <Text className="text-[10px] text-outline shrink-0 flex items-center gap-0.5">
                      <Text className="material-symbols-outlined text-[11px]">
                        gps_off
                      </Text>
                      距离 · 定位待接入
                    </Text>
                  )}
                </View>
                <Button
                  href={`tel:${order.farmerPhone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0 hover:bg-surface-container-highest transition-colors cursor-pointer"
                  title="致电农户咨询"
                >
                  <Text className="material-symbols-outlined text-[15px]">phone</Text>
                </Button>
              </View>

              {/* 作业参数与补贴 */}
              <View className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
                <View className="flex items-center gap-1 truncate">
                  <Text className="material-symbols-outlined text-[14px] text-outline">crop</Text>
                  <Text>
                    规模: <Text className="text-on-surface font-semibold">{order.cropScale}</Text>
                  </Text>
                </View>
                <View className="flex items-center gap-1 truncate">
                  <Text className="material-symbols-outlined text-[14px] text-secondary">
                    verified_user
                  </Text>
                  <Text className="text-secondary font-medium truncate">官方绿色配方补贴</Text>
                </View>
              </View>

              {/* 价格与接单操作栏 */}
              <View className="flex items-center justify-between pt-2 mt-0.5 bg-surface-container-low/50 -mx-3.5 -mb-3.5 p-3 rounded-b-xl border-t border-surface-container">
                <View className="flex flex-col">
                  <Text className="text-[11px] text-on-surface-variant">工单标准报酬</Text>
                  <View className="text-[20px] text-tertiary-container font-extrabold leading-none">
                    <Text className="text-xs font-semibold">¥</Text>
                    {formatCents(order.estimatedFeeCents)}
                  </View>
                </View>

                <View className="flex items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                  >
                    查看详情
                  </Button>
                  <Button
                    onClick={(e) => handleClaim(e, order)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer ${
                      isClaimed
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-primary hover:bg-primary-container text-white'
                    }`}
                  >
                    <Text className="material-symbols-outlined text-[16px]">
                      {isClaimed ? 'check' : 'touch_app'}
                    </Text>
                    <Text>{isClaimed ? '抢单成功' : '立即接单'}</Text>
                  </Button>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* 底部质保与贴心提示条 */}
      <View className="bg-surface-container-high rounded-xl p-3 flex items-center gap-2.5 mt-1">
        <View className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Text className="material-symbols-outlined text-[18px]">shield_with_heart</Text>
        </View>
        <View className="flex flex-col text-on-surface-variant text-xs min-w-0">
          <Text className="font-semibold text-on-surface">华农自营农药库直供正品保障</Text>
          <Text className="truncate text-[11px]">技术服务享受100%全额工单履约险及药害兜底赔付</Text>
        </View>
      </View>

      {/* Toast Notification */}
      {toastMessage && (
        <View className="fixed top-20 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-semibold text-xs px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 z-50 animate-bounce">
          <Text className="material-symbols-outlined text-secondary-fixed text-[18px]">
            task_alt
          </Text>
          <Text>{toastMessage}</Text>
        </View>
      )}
    </View>
  );
};
