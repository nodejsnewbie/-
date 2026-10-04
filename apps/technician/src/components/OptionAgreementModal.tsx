import { Button, Text, View } from '@tarojs/components';
import React from 'react';
import { TechnicianProfile } from '../types';

interface OptionAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianProfile;
}

export const OptionAgreementModal: React.FC<OptionAgreementModalProps> = ({
  isOpen,
  onClose,
  technician,
}) => {
  if (!isOpen) return null;

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <View className="bg-surface-container-lowest w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <View className="h-12 px-3 bg-primary text-white flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[18px]">handshake</Text>
            <Text className="font-bold text-xs">华农智服 · 创客合伙人期权分配协议</Text>
          </View>
          <Button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[20px]">close</Text>
          </Button>
        </View>

        {/* Contract Text */}
        <View className="p-4 space-y-3 overflow-y-auto text-xs text-on-surface leading-relaxed">
          <View className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container text-[11px] space-y-1">
            <View className="flex justify-between">
              <Text className="text-outline">协议编号:</Text>
              <Text className="font-mono font-bold text-primary">HN-OPT-2024-0082</Text>
            </View>
            <View className="flex justify-between">
              <Text className="text-outline">签约合伙人:</Text>
              <Text className="font-bold">{technician.name} ({technician.partnerCode})</Text>
            </View>
            <View className="flex justify-between">
              <Text className="text-outline">所属阿米巴单元:</Text>
              <Text className="font-semibold text-on-surface">{technician.groupName}</Text>
            </View>
            <View className="flex justify-between">
              <Text className="text-outline">期权激励等级:</Text>
              <Text className="text-amber-800 font-bold">黄金级 (激励系数 1.25x)</Text>
            </View>
          </View>

          <View className="space-y-2">
            <Text className="font-bold text-primary text-xs">第一条：合伙共建宗旨与原则</Text>
            <Text className="text-on-surface-variant text-[11px]">
              甲方（华农智服集团）与乙方（{technician.name}）基于“个人即平台、技师即股东”的阿米巴创客经营哲学，致力于打破传统雇佣模式，将平台供应链资源与基层农艺师的专业技能深度绑定。
            </Text>

            <Text className="font-bold text-primary text-xs">第二条：阿米巴期权收益测算与沉淀</Text>
            <Text className="text-on-surface-variant text-[11px]">
              1. 乙方所在创客小组当月超额达成经营目标（超100%基准）时，所产生超额净利润的25%自动滚入“年终创客期权池”。
              <br />
              2. 乙方享有个人激励系数 1.25x 的加权分红权，按季度沉淀核算并在年末决算后兑现。
            </Text>

            <Text className="font-bold text-primary text-xs">第三条：师徒裂变与团队收益永续权</Text>
            <Text className="text-on-surface-variant text-[11px]">
              乙方直接引荐并带教青年持证农艺师入驻并独立接单后，长期享有该徒弟工单纯收益的5%育人技术津贴，并享有小组综合排名奖励。
            </Text>
          </View>

          <View className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[16px] text-emerald-700">verified</Text>
            <Text>双方已于2024年3月完成电子存证核签，具完全法律效力。</Text>
          </View>
        </View>

        {/* Footer */}
        <View className="p-3 bg-surface-container-lowest border-t border-surface-container">
          <Button
            onClick={onClose}
            className="w-full h-10 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            我已知晓协议内容
          </Button>
        </View>
      </View>
    </View>
  );
};
