import { Text, View } from '@tarojs/components';
import React from 'react';
import type { ServiceBooking } from '../types';
import { PLATFORM_ANNOUNCEMENTS } from '../data/mockData';

interface MessagesViewProps {
  bookings: ServiceBooking[];
}

/**
 * 消息页（原型④：服务进度/消息通知）。
 *
 * ⚠️ 消息通知后端接口**待接入**（无消息表/推送通道）——当前：
 * - 服务动态由真实预约数据（GET /api/bookings）本地推导；
 * - 平台公告为本地 Mock 占位（已标注，R4）。
 */
export const MessagesView: React.FC<MessagesViewProps> = ({ bookings }) => {
  return (
    <View className="p-3 pb-28 space-y-3">
      <View className="flex gap-2">
        {['全部', '服务动态', '系统公告'].map((tab, i) => (
          <Text
            key={tab}
            className={`px-3 py-1 rounded-full text-[11px] font-bold ${
              i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {tab}
          </Text>
        ))}
      </View>

      {/* 服务动态（由真实预约数据推导） */}
      {bookings.slice(0, 4).map((b) => (
        <View key={b.id} className="bg-surface-container-lowest rounded-2xl p-3.5 flex gap-2.5">
          <View className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <Text className="material-symbols-outlined text-[18px]">task_alt</Text>
          </View>
          <View className="flex-1 min-w-0">
            <View className="flex items-center justify-between">
              <Text className="text-[12px] font-bold text-on-surface">
                {b.status === 'completed' ? '服务已完成' : '服务进度更新'}
              </Text>
              <Text className="text-[10px] text-on-surface-variant">{b.preferredDate}</Text>
            </View>
            <Text className="text-[11px] text-on-surface-variant mt-0.5 block">
              您预约的{b.serviceType === 'field_diagnosis' ? '上门植保服务' : '上门服务'}
              （{b.cropType} · {b.acreage} 亩）当前状态：{b.status === 'submitted' ? '已提交，待受理' : b.status === 'assigned' ? '已受理' : b.status === 'in_progress' ? '服务进行中' : '已完成，欢迎评价'}
            </Text>
          </View>
        </View>
      ))}

      {/* 系统公告（本地 Mock 占位，接口待接） */}
      {PLATFORM_ANNOUNCEMENTS.map((a) => (
        <View key={a.id} className="bg-surface-container-lowest rounded-2xl p-3.5 flex gap-2.5">
          <View className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
            <Text className="material-symbols-outlined text-[18px]">campaign</Text>
          </View>
          <View className="flex-1 min-w-0">
            <View className="flex items-center justify-between">
              <Text className="text-[12px] font-bold text-on-surface">系统公告</Text>
              <Text className="text-[10px] text-on-surface-variant">{a.date}</Text>
            </View>
            <Text className="text-[11px] text-on-surface-variant mt-0.5 block">{a.text}</Text>
          </View>
        </View>
      ))}

      <Text className="block text-center text-[10px] text-on-surface-variant/70 pt-1">
        消息推送接口待接入，以上公告为本地占位数据
      </Text>
    </View>
  );
};
