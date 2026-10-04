import { Button, Image, Text, View } from '@tarojs/components';
import React from 'react';
import { TechnicianProfile, ViewScreen, TabType } from '../types';

interface HeaderProps {
  currentView: ViewScreen;
  activeTab: TabType;
  technician: TechnicianProfile;
  onToggleOnline: () => void;
  onBack: () => void;
  onOpenExpert: () => void;
  onOpenSos: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  activeTab,
  technician,
  onToggleOnline,
  onBack,
  onOpenExpert,
  onOpenSos,
  onOpenProfile,
}) => {
  // If we are in child sub-screens (Order Detail or Prescription Builder)
  if (currentView === 'order-detail' || currentView === 'prescription-builder') {
    const title = currentView === 'order-detail' ? 'Order Detail & Field Execution' : 'Crop Prescription Builder';
    return (
      <View className="relative z-20 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe border-b border-surface-container">
        <View className="h-14 px-3 flex items-center justify-between gap-2">
          <View className="flex items-center gap-1 min-w-0">
            <Button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center text-on-surface rounded-full active:bg-surface-container-high transition-colors -ml-1 cursor-pointer"
              title="返回上一页"
            >
              <Text className="material-symbols-outlined text-[22px]">arrow_back_ios_new</Text>
            </Button>
            <Image
              alt="Brand logo"
              className="h-6 w-auto object-contain shrink-0"
              src={technician.logoUrl}
            />
            <Text className="font-bold text-[16px] text-on-surface truncate tracking-tight">
              {title}
            </Text>
          </View>
          <View className="flex items-center gap-1.5 shrink-0">
            <Button
              onClick={onOpenExpert}
              className="w-9 h-9 flex items-center justify-center rounded-full text-amber-800 bg-amber-100 hover:bg-amber-200 active:scale-95 transition-all cursor-pointer"
              title="农艺专家在线协同"
            >
              <Text className="material-symbols-outlined text-[20px]">support_agent</Text>
            </Button>
            <Button
              onClick={onOpenSos}
              className="w-9 h-9 flex items-center justify-center rounded-full text-red-700 bg-red-100 hover:bg-red-200 active:scale-95 transition-all cursor-pointer"
              title="外勤紧急求助"
            >
              <Text className="material-symbols-outlined text-[20px]">phone_in_talk</Text>
            </Button>
            <Button
              onClick={onOpenProfile}
              className="focus:outline-none cursor-pointer"
              title="个人主页"
            >
              <Image
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shrink-0 ml-0.5 ring-2 ring-primary-container/20"
                src={technician.headerProfileUrl}
              />
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // Otherwise in Tab View (Order Hall, Amoeba Bonus, Service Orders, Profile)
  const tabTitle = activeTab === 'order-hall' ? 'Order Hall' 
    : activeTab === 'amoeba-bonus' ? 'Amoeba Bonus' 
    : activeTab === 'service-orders' ? '服务工单台账' 
    : '合伙人中心';

  return (
    <View className="relative z-20 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe border-b border-surface-container">
      <View className="h-16 px-3 flex items-center justify-between gap-2">
        <View className="flex items-center gap-2 min-w-0 flex-1">
          <Image
            alt="Brand logo"
            className="h-7 w-auto object-contain shrink-0"
            src={technician.logoUrl}
          />
          <View className="flex flex-col min-w-0">
            <View className="flex items-center gap-1.5">
              <Text className="font-bold text-[15px] text-primary truncate leading-tight">
                {tabTitle}
              </Text>
              <Text className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-container font-semibold text-[10px] tracking-wide shrink-0">
                高级植保师
              </Text>
            </View>
            <View className="flex items-center gap-1 text-on-surface-variant text-[10px] leading-tight mt-0.5">
              <Text className="material-symbols-outlined text-[11px] text-primary">verified</Text>
              <Text className="truncate font-mono">CERT-HB2024-9812</Text>
              <Text className="h-2 w-px bg-outline-variant"></Text>
              <Text className="truncate">黄冈团风服务站</Text>
            </View>
          </View>
        </View>

        <View className="flex items-center gap-2 shrink-0">
          <Button
            onClick={onToggleOnline}
            className="flex items-center gap-1.5 bg-surface-container-high px-2 py-1 rounded-full cursor-pointer hover:bg-surface-container-highest transition-colors"
            title="切换接单状态"
          >
            <Text
              className={`w-2 h-2 rounded-full transition-colors ${
                technician.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
              }`}
            ></Text>
            <Text className="text-xs font-semibold text-on-surface-variant">
              {technician.isOnline ? '接单中' : '休息中'}
            </Text>
            <View
              className={`w-6 h-3.5 rounded-full transition-colors relative flex items-center ${
                technician.isOnline ? 'bg-primary-container justify-end' : 'bg-outline-variant justify-start'
              }`}
            >
              <View className="w-2.5 h-2.5 bg-white rounded-full mx-0.5 shadow-sm"></View>
            </View>
          </Button>
          
          <Button
            onClick={onOpenProfile}
            className="focus:outline-none cursor-pointer"
            title="查看个人资料"
          >
            <Image
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-primary-container/20"
              src={technician.headerProfileUrl}
            />
          </Button>
        </View>
      </View>
    </View>
  );
};
