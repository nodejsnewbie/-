import { Text, View } from '@tarojs/components';
import React from 'react';

export type MallTab = 'home' | 'booking' | 'orders' | 'messages' | 'profile';

const TABS: { id: MallTab; icon: string; label: string }[] = [
  { id: 'home', icon: 'home', label: '首页' },
  { id: 'booking', icon: 'edit_calendar', label: '预约' },
  { id: 'orders', icon: 'receipt_long', label: '订单' },
  { id: 'messages', icon: 'chat', label: '消息' },
  { id: 'profile', icon: 'person', label: '我的' },
];

interface BottomNavProps {
  activeTab: MallTab;
  onChangeTab: (tab: MallTab) => void;
  badgeCount?: number;
}

/** 底部五 Tab 导航（自定义组件，免图标资源；icon 位暂用字形文字，见已知遗留）。 */
export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, badgeCount = 0 }) => {
  return (
    <View className="fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest border-t border-surface-container-high flex">
      {TABS.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <View
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 ${active ? 'text-primary' : 'text-on-surface-variant'}`}
          >
            <View className="relative">
              <Text className={`text-[20px] ${active ? 'font-bold' : ''}`}>{tab.icon}</Text>
              {tab.id === 'messages' && badgeCount > 0 && (
                <Text className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-1 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center">
                  {badgeCount}
                </Text>
              )}
            </View>
            <Text className="text-[10px] font-semibold">{tab.label}</Text>
          </View>
        );
      })}
    </View>
  );
};
