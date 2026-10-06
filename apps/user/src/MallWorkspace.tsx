import { Text, View } from '@tarojs/components';
import React, { useEffect, useState } from 'react';
import type { MallProduct, ServiceBooking, ReservedCapability } from './types';
import { api } from './services/api';
import { showAlert } from './utils/platform';
import { BottomNav } from './components/BottomNav';
import type { MallTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { BookingView } from './components/BookingView';
import { OrdersView } from './components/OrdersView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { TraceVerify } from './components/TraceVerify';

/**
 * 用户端容器（单页 + Tab 切换，模式与技师端一致）。
 * 首次进入拉取真实数据：预约列表 + 商品推荐；失败如实提示，不留空白。
 */
export default function MallWorkspace() {
  const [activeTab, setActiveTab] = useState<MallTab>('home');
  const [bookingPresetType, setBookingPresetType] = useState<ServiceBooking['serviceType'] | undefined>(
    undefined
  );
  const [products, setProducts] = useState<MallProduct[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [traceOpen, setTraceOpen] = useState(false);
  const [traceCode, setTraceCode] = useState('');
  const [loadError, setLoadError] = useState(false);
  const [profile, setProfile] = useState<ReservedCapability<{ name: string; phone: string; avatar: string }> | null>(null);
  const [announcements, setAnnouncements] = useState<
    ReservedCapability<Array<{ id: string; date: string; text: string }>> | null
  >(null);
  const [coupon, setCoupon] = useState<ReservedCapability<number> | null>(null);

  useEffect(() => {
    Promise.allSettled([api.getProducts(), api.getBookings()]).then(([p, b]) => {
      if (p.status === 'fulfilled' && p.value?.length) {
        setProducts(p.value);
      }
      if (b.status === 'fulfilled') {
        setBookings(b.value);
      }
      if (p.status === 'rejected' && b.status === 'rejected') {
        setLoadError(true);
        showAlert('后端服务暂不可达，请确认统一后端（:3000）已启动');
      }
    });

    // 「我的 / 消息」能力本期后端未接入，返回预留标识；各自独立拉取，失败留空由子视图显示「待接入」。
    api.getProfile().then(setProfile).catch(() => setProfile(null));
    api.getAnnouncements().then(setAnnouncements).catch(() => setAnnouncements(null));
    api.getCoupons().then(setCoupon).catch(() => setCoupon(null));
  }, []);

  const goBooking = (type?: ServiceBooking['serviceType']) => {
    setBookingPresetType(type);
    setActiveTab('booking');
  };

  const verifyNow = (code: string) => {
    setTraceCode(code);
    setTraceOpen(true);
  };

  const handleCreateBooking = async (booking: Partial<ServiceBooking>) => {
    // 联系人 / 联系电话由农户在预约表单自行填写（微信登录体系待接入，不注入虚构用户）；
    // 后端出参对手机号统一脱敏（R4）。
    const created = await api.createBooking({
      ...booking,
      station: '长沙县安沙农资自营直供中心',
    });
    setBookings((prev) => [created, ...prev]);
    setActiveTab('orders');
  };

  return (
    <View className="min-h-screen bg-surface text-on-surface">
      {/* 次级页头（首页有 Banner，不重复显示标题） */}
      {activeTab !== 'home' && (
        <View className="h-11 px-3 bg-primary text-on-primary flex items-center">
          <Text className="font-bold text-[14px]">
            {activeTab === 'booking'
              ? '服务预约'
              : activeTab === 'orders'
              ? '我的预约单'
              : activeTab === 'messages'
              ? '消息通知'
              : '我的'}
          </Text>
        </View>
      )}

      {loadError && (
        <View className="mx-3 mt-3 p-3 rounded-xl bg-error-container/30 border border-error/40">
          <Text className="text-[11px] text-error font-semibold">
            后端连接失败：本页数据不可用。启动统一后端（npm run dev:server）后下拉重试。
          </Text>
        </View>
      )}

      <View className="pb-16">
        {activeTab === 'home' && (
          <HomeView
            products={products}
            bookings={bookings}
            onGoBooking={goBooking}
            onOpenTrace={() => setTraceOpen(true)}
            onReservedFeature={(name) => showAlert(`${name}为原型预留功能，待后续版本开放`)}
            onCodeInput={setTraceCode}
            onSearchCode={verifyNow}
          />
        )}
        {activeTab === 'booking' && (
          <BookingView initialType={bookingPresetType} onSubmit={handleCreateBooking} />
        )}
        {activeTab === 'orders' && <OrdersView bookings={bookings} onGoBooking={() => goBooking()} />}
        {activeTab === 'messages' && <MessagesView bookings={bookings} announcements={announcements} />}
        {activeTab === 'profile' && (
          <ProfileView
            bookingCount={bookings.length}
            profile={profile}
            coupon={coupon}
            onGoOrders={() => setActiveTab('orders')}
            onOpenTrace={() => setTraceOpen(true)}
          />
        )}
      </View>

      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {traceOpen && (
        <TraceVerify
          initialCode={traceCode}
          onClose={() => setTraceOpen(false)}
        />
      )}
    </View>
  );
}
