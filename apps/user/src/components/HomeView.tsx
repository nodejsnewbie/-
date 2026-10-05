import { Button, Image, Input, Text, View } from '@tarojs/components';
import React from 'react';
import type { MallProduct, ServiceBooking } from '../types';
import { SAMPLE_TRACE_CODES, SERVICE_TYPE_TEXT } from '../data/mockData';

interface HomeViewProps {
  products: MallProduct[];
  bookings: ServiceBooking[];
  onGoBooking: (type?: ServiceBooking['serviceType']) => void;
  onOpenTrace: () => void;
  onReservedFeature: (name: string) => void;
  /** 输入框逐字回填（父组件持有草稿码） */
  onCodeInput: (code: string) => void;
  /** 示例码点击 = 直接验真该码 */
  onSearchCode: (code: string) => void;
}

/** 首页（原型①：服务入口 + 平台公告 + 溯源验真 + 最新服务动态）。 */
export const HomeView: React.FC<HomeViewProps> = ({
  products,
  bookings,
  onGoBooking,
  onOpenTrace,
  onReservedFeature,
  onCodeInput,
  onSearchCode,
}) => {
  return (
    <View className="pb-4">
      {/* Banner */}
      <View className="mx-3 mt-3 rounded-2xl bg-primary text-on-primary p-4 flex items-center justify-between">
        <View>
          <View className="text-[18px] font-extrabold">农资上门服务</View>
          <View className="text-[12px] opacity-90 mt-0.5">专业植保 贴心服务</View>
          <View className="text-[10px] opacity-70 mt-1">让种植更轻松，让丰收更有保障</View>
        </View>
        <Text className="material-symbols-outlined text-[44px] opacity-80">agriculture</Text>
      </View>

      {/* 服务入口（原型：上门植保/农资上门/专家咨询/在线商城（预留）） */}
      <View className="mx-3 mt-3 bg-surface-container-lowest rounded-2xl p-3 grid grid-cols-4 gap-2">
        {(
          [
            { type: 'field_diagnosis', icon: 'pest_control', label: '上门植保服务' },
            { type: 'delivery_maintenance', icon: 'local_shipping', label: '农资上门服务' },
            { type: 'expert_consult', icon: 'support_agent', label: '专家咨询' },
          ] as const
        ).map((entry) => (
          <View
            key={entry.type}
            onClick={() => onGoBooking(entry.type)}
            className="flex flex-col items-center gap-1 py-2 rounded-xl active:bg-surface-container"
          >
            <View className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <Text className="material-symbols-outlined text-[22px]">{entry.icon}</Text>
            </View>
            <Text className="text-[10px] font-semibold text-on-surface text-center leading-tight">
              {entry.label}
            </Text>
          </View>
        ))}
        <View
          onClick={() => onReservedFeature('在线商城')}
          className="flex flex-col items-center gap-1 py-2 rounded-xl active:bg-surface-container"
        >
          <View className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center relative">
            <Text className="material-symbols-outlined text-[22px]">storefront</Text>
            <Text className="absolute -top-1 -right-1 px-1 rounded-full bg-tertiary text-on-tertiary text-[8px] font-bold">
              预留
            </Text>
          </View>
          <Text className="text-[10px] font-semibold text-on-surface-variant text-center leading-tight">
            在线商城
          </Text>
        </View>
      </View>

      {/* 平台公告 */}
      <View className="mx-3 mt-3 bg-surface-container-lowest rounded-2xl p-3 flex items-center gap-2">
        <Text className="material-symbols-outlined text-primary text-[18px]">campaign</Text>
        <Text className="text-[11px] text-on-surface-variant truncate flex-1">
          适应各地病虫害高发，请及时预约上门植保服务
        </Text>
        <Text
          className="text-[11px] text-primary font-bold"
          onClick={() => onGoBooking('field_diagnosis')}
        >
          去预约 ›
        </Text>
      </View>

      {/* 溯源验真（一物一码，真实后端能力） */}
      <View className="mx-3 mt-3 bg-surface-container-lowest rounded-2xl p-3.5">
        <View className="flex items-center gap-1.5 mb-2">
          <Text className="material-symbols-outlined text-primary text-[20px]">qr_code_scanner</Text>
          <Text className="text-[15px] font-bold text-on-surface">农资溯源码验真</Text>
        </View>
        <Text className="text-[11px] text-on-surface-variant mb-2">
          输入瓶身 16-24 位国家农药电子溯源码，一物一码验真
        </Text>
        <View className="flex items-center gap-2">
          <Input
            id="trace-input"
            type="text"
            placeholder="输入或扫码录入溯源码"
            className="flex-1 bg-surface-container rounded-lg px-3 py-2 text-[12px] text-on-surface font-mono"
            onInput={(e) => onCodeInput(e.detail.value)}
          />
          <Button
            onClick={onOpenTrace}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[12px] font-bold after:border-none"
          >
            验真
          </Button>
        </View>
        <View className="flex items-center gap-1.5 mt-2">
          <Text className="text-[10px] text-on-surface-variant">示例码:</Text>
          {SAMPLE_TRACE_CODES.map((code) => (
            <Text
              key={code}
              onClick={() => onSearchCode(code)}
              className="text-[9px] font-mono text-primary bg-surface-container rounded px-1.5 py-0.5"
            >
              {code.slice(-6)}
            </Text>
          ))}
        </View>
      </View>

      {/* 最新服务动态（来自真实预约数据） */}
      <View className="mx-3 mt-3 bg-surface-container-lowest rounded-2xl p-3.5">
        <View className="flex items-center justify-between mb-2">
          <Text className="text-[15px] font-bold text-on-surface">最新服务动态</Text>
          <Text className="text-[11px] text-primary font-bold" onClick={() => onGoBooking()}>
            去预约 ›
          </Text>
        </View>
        {bookings.slice(0, 3).map((b) => (
          <View key={b.id} className="flex items-center gap-2 py-1.5">
            <View className="w-7 h-7 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-[10px] font-bold">
              <Text>{(b.contactName || '农')[0]}</Text>
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-[12px] text-on-surface font-medium truncate">
                {b.contactName} 预约了{SERVICE_TYPE_TEXT[b.serviceType]}
              </Text>
              <Text className="text-[10px] text-on-surface-variant">{b.preferredDate} · {b.station}</Text>
            </View>
            <Text className="text-[10px] text-on-surface-variant shrink-0">{b.status === 'completed' ? '已完成' : '进行中'}</Text>
          </View>
        ))}
        {bookings.length === 0 && (
          <Text className="text-[11px] text-on-surface-variant">暂无服务动态，快来预约第一单吧</Text>
        )}
      </View>

      {/* 商品推荐（在线商城预留位的真实能力预览） */}
      <View className="mx-3 mt-3">
        <View className="flex items-center justify-between mb-2">
          <Text className="text-[15px] font-bold text-on-surface">自营农资推荐</Text>
          <Text
            className="text-[11px] text-on-surface-variant"
            onClick={() => onReservedFeature('在线商城完整购物流程')}
          >
            商城建设中 ›
          </Text>
        </View>
        <View className="grid grid-cols-2 gap-2">
          {products.slice(0, 4).map((p) => (
            <View key={p.id} className="bg-surface-container-lowest rounded-xl overflow-hidden">
              {p.image ? (
                <Image src={p.image} mode="aspectFill" className="w-full h-24" />
              ) : (
                <View className="w-full h-24 bg-surface-container flex items-center justify-center">
                  <Text className="material-symbols-outlined text-on-surface-variant text-[28px]">image</Text>
                </View>
              )}
              <View className="p-2">
                <Text className="text-[11px] font-bold text-on-surface line-clamp-1">{p.name}</Text>
                <View className="flex items-center justify-between mt-1">
                  <Text className="text-[13px] font-extrabold text-primary font-mono">¥{p.price}</Text>
                  <Text className="text-[9px] text-secondary font-bold">一物一码</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
