import { Button, Text, View } from '@tarojs/components';
import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  ordersBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  ordersBadgeCount = 3,
}) => {
  const tabs = [
    {
      id: 'order-hall' as TabType,
      label: '接单大厅',
      icon: 'assignment_late',
      badge: ordersBadgeCount > 0 ? ordersBadgeCount : undefined,
    },
    {
      id: 'service-orders' as TabType,
      label: '服务工单',
      icon: 'agriculture',
    },
    {
      id: 'amoeba-bonus' as TabType,
      label: '阿米巴提成',
      icon: 'monetization_on',
    },
    {
      id: 'partner-profile' as TabType,
      label: '合伙人我的',
      icon: 'account_circle',
    },
  ];

  return (
    <View className="absolute bottom-0 inset-x-0 z-30 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-4px_16px_rgba(28,36,31,0.08)] border-t border-surface-container">
      <View className="flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] h-12 transition-all relative cursor-pointer ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              <View className="relative">
                <Text
                  className={`material-symbols-outlined text-[24px] ${
                    isActive ? 'material-symbols-filled text-primary' : ''
                  }`}
                >
                  {tab.icon}
                </Text>
                {tab.badge && (
                  <Text className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-tight shadow-xs">
                    {tab.badge}
                  </Text>
                )}
              </View>
              <Text className="text-[11px] mt-0.5 tracking-tight">{tab.label}</Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
};
