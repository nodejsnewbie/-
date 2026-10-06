import { Image, Text, View } from '@tarojs/components';
import React from 'react';
import { showAlert } from '../utils/platform';
import type { ReservedCapability } from '../types';

interface ProfileViewProps {
  bookingCount: number;
  profile: ReservedCapability<{ name: string; phone: string; avatar: string }> | null;
  coupon: ReservedCapability<number> | null;
  onGoOrders: () => void;
  onOpenTrace: () => void;
}

const MENU = [
  { icon: 'place', label: '我的地址' },
  { icon: 'receipt', label: '发票管理' },
  { icon: 'chat_bubble', label: '在线咨询' },
  { icon: 'help', label: '帮助中心' },
  { icon: 'settings', label: '设置' },
];

/** 我的（原型⑥：用户卡 + 统计 + 功能入口）。用户体系 = 微信登录，后端返回预留标识（待接入）。 */
export const ProfileView: React.FC<ProfileViewProps> = ({
  bookingCount,
  profile,
  coupon,
  onGoOrders,
  onOpenTrace,
}) => {
  const reserved = (label: string) => showAlert(`${label}为预留功能，待后续版本开放`);

  const user = profile?.enabled && profile.value ? profile.value : null;
  const couponCount = coupon?.enabled && coupon.value !== null ? coupon.value : null;

  return (
    <View className="pb-28">
      {/* 用户卡 */}
      <View className="mx-3 mt-3 bg-primary rounded-2xl p-4 text-on-primary flex items-center gap-3">
        {user?.avatar ? (
          <Image src={user.avatar} className="w-14 h-14 rounded-full" />
        ) : (
          <View className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-[20px] font-bold">
            <Text>{user ? user.name[0] : '农'}</Text>
          </View>
        )}
        <View className="flex-1">
          {user ? (
            <>
              <Text className="text-[17px] font-extrabold">{user.name}</Text>
              <Text className="text-[11px] opacity-80 block mt-0.5">{user.phone}</Text>
            </>
          ) : (
            <>
              <Text className="text-[17px] font-extrabold">未登录</Text>
              <Text className="text-[11px] opacity-80 block mt-0.5">
                {profile?.label ?? '微信登录'} · 待接入
              </Text>
            </>
          )}
        </View>
      </View>

      {/* 统计（预约数为真实数据；优惠券为后端预留位） */}
      <View className="mx-3 mt-3 bg-surface-container-lowest rounded-2xl p-3 flex">
        <View className="flex-1 flex flex-col items-center" onClick={onGoOrders}>
          <Text className="text-[18px] font-extrabold text-primary">{bookingCount}</Text>
          <Text className="text-[10px] text-on-surface-variant">我的预约</Text>
        </View>
        <View className="flex-1 flex flex-col items-center" onClick={() => reserved('优惠券')}>
          <Text className="text-[18px] font-extrabold text-primary">
            {couponCount === null ? '—' : couponCount}
          </Text>
          <Text className="text-[10px] text-on-surface-variant">
            {couponCount === null ? '优惠券 · 待接入' : '优惠券'}
          </Text>
        </View>
        <View className="flex-1 flex flex-col items-center" onClick={onOpenTrace}>
          <Text className="text-[18px] font-extrabold text-primary">∞</Text>
          <Text className="text-[10px] text-on-surface-variant">溯源验真</Text>
        </View>
      </View>

      {/* 功能入口 */}
      <View className="mx-3 mt-3 bg-surface-container-lowest rounded-2xl px-3.5">
        <View className="flex items-center gap-2.5 py-3.5 border-b border-surface-container" onClick={onGoOrders}>
          <Text className="material-symbols-outlined text-primary text-[20px]">receipt_long</Text>
          <Text className="flex-1 text-[13px] text-on-surface font-medium">我的预约单</Text>
          <Text className="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</Text>
        </View>
        {MENU.map((item, idx) => (
          <View
            key={item.label}
            onClick={() => reserved(item.label)}
            className={`flex items-center gap-2.5 py-3.5 ${
              idx < MENU.length - 1 ? 'border-b border-surface-container' : ''
            }`}
          >
            <Text className="material-symbols-outlined text-primary text-[20px]">{item.icon}</Text>
            <Text className="flex-1 text-[13px] text-on-surface font-medium">{item.label}</Text>
            <Text className="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</Text>
          </View>
        ))}
      </View>

      <Text className="block text-center text-[10px] text-on-surface-variant/70 mt-3">
        {user ? '已接入微信登录' : '用户身份：后端返回预留标识 · 微信登录待接入'}
      </Text>
    </View>
  );
};
