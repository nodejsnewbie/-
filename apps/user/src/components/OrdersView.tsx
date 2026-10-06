import { Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import type { ServiceBooking } from '../types';
import { BOOKING_STATUS_TEXT, SERVICE_TYPE_TEXT, statusStepIndex } from '../constants/presentation';
import { StatusSteps } from './StatusSteps';

interface OrdersViewProps {
  bookings: ServiceBooking[];
  onGoBooking: () => void;
}

/** 订单页（原型③/④合并：预约单列表 + 服务进度四步条）。 */
export const OrdersView: React.FC<OrdersViewProps> = ({ bookings, onGoBooking }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!bookings.length) {
    return (
      <View className="p-3 pb-28">
        <View className="mt-16 flex flex-col items-center gap-2">
          <Text className="material-symbols-outlined text-on-surface-variant text-[44px]">receipt_long</Text>
          <Text className="text-[13px] text-on-surface-variant">还没有预约记录</Text>
          <Text
            onClick={onGoBooking}
            className="mt-2 px-5 py-2 rounded-full bg-primary text-on-primary text-[12px] font-bold"
          >
            去预约服务
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="p-3 pb-28 space-y-3">
      {bookings.map((b) => {
        const expanded = expandedId === b.id;
        return (
          <View key={b.id} className="bg-surface-container-lowest rounded-2xl p-3.5">
            {/* 单头 */}
            <View className="flex items-center justify-between mb-2.5">
              <Text className="font-mono text-[11px] text-on-surface-variant">预约单号: {b.id}</Text>
              <Text
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  b.status === 'completed'
                    ? 'bg-primary-fixed text-on-primary-fixed'
                    : b.status === 'in_progress'
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-tertiary-fixed text-on-tertiary-fixed'
                }`}
              >
                {BOOKING_STATUS_TEXT[b.status]}
              </Text>
            </View>

            {/* 服务进度条 */}
            <StatusSteps status={b.status} />

            {/* 服务信息 */}
            <View className="mt-3 pt-2.5 border-t border-surface-container space-y-1.5">
              <View className="flex justify-between">
                <Text className="text-[11px] text-on-surface-variant">服务类型</Text>
                <Text className="text-[11px] font-bold text-on-surface">{SERVICE_TYPE_TEXT[b.serviceType]}</Text>
              </View>
              <View className="flex justify-between">
                <Text className="text-[11px] text-on-surface-variant">作物类型</Text>
                <Text className="text-[11px] text-on-surface">{b.cropType} · {b.acreage} 亩</Text>
              </View>
              <View className="flex justify-between">
                <Text className="text-[11px] text-on-surface-variant">期望上门</Text>
                <Text className="text-[11px] text-on-surface">{b.preferredDate}</Text>
              </View>
              <View>
                <Text className="text-[11px] text-on-surface-variant">服务地址</Text>
                <Text className="text-[11px] text-on-surface">{b.plotAddress}</Text>
              </View>
            </View>

            {/* 指派农艺师（受理后展示） */}
            {b.assignedAgronomist && statusStepIndex(b.status) >= 1 && (
              <View className="mt-2.5 p-2.5 rounded-xl bg-surface-container-low flex items-center gap-2.5">
                <View className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-[12px] font-bold">
                  <Text>{b.assignedAgronomist.name[0]}</Text>
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-[12px] font-bold text-on-surface">{b.assignedAgronomist.name}</Text>
                  <Text className="text-[10px] text-on-surface-variant block">{b.assignedAgronomist.title}</Text>
                </View>
                <Text className="text-[10px] text-secondary font-mono">{b.assignedAgronomist.phone}</Text>
              </View>
            )}

            {/* 展开/收起 */}
            <Text
              className="block text-right text-[11px] text-primary font-bold mt-2"
              onClick={() => setExpandedId(expanded ? null : b.id)}
            >
              {expanded ? '收起详情 ↑' : '查看详情 ↓'}
            </Text>
            {expanded && (
              <View className="mt-2 p-2.5 rounded-xl bg-surface-container-low text-[11px] text-on-surface-variant space-y-1">
                <Text className="block">受理站点: {b.station}</Text>
                {b.associatedProducts?.length > 0 && (
                  <Text className="block">关联农资: {b.associatedProducts.join('、')}</Text>
                )}
                {b.notes && <Text className="block">问题描述: {b.notes}</Text>}
                <Text className="block text-on-surface-variant/70">
                  * 单据状态由服务站推进，进度变化将在消息页通知（通知接口待接入）
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};
