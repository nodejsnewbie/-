import { showAlert } from '../utils/platform';
import { Button, Image, Text, View } from '@tarojs/components';
import React from 'react';
import { TechnicianProfile } from '../types';

interface PartnerProfileViewProps {
  technician: TechnicianProfile;
  onOpenOptionAgreement: () => void;
  onOpenRecruitPoster: () => void;
  onOpenWithdraw: () => void;
}

export const PartnerProfileView: React.FC<PartnerProfileViewProps> = ({
  technician,
  onOpenOptionAgreement,
  onOpenRecruitPoster,
  onOpenWithdraw,
}) => {
  return (
    <View className="flex flex-col w-full px-3 pb-24 gap-3 select-none">
      {/* 个人主卡 */}
      <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container">
        <View className="flex items-center gap-3">
          <Image
            className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
            alt={technician.name}
            src={technician.avatarUrl}
          />
          <View className="flex-1 min-w-0">
            <View className="flex items-center gap-1.5 flex-wrap">
              <Text className="text-lg font-bold text-on-surface">{technician.name}</Text>
              <Text className="bg-primary-container text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                黄金合伙人
              </Text>
            </View>
            <Text className="text-xs text-on-surface-variant mt-0.5">{technician.role}</Text>
            <Text className="text-[11px] text-outline font-mono mt-0.5">工号: {technician.partnerCode}</Text>
          </View>
        </View>

        {/* Quick balance overview */}
        <View className="mt-3 pt-3 border-t border-surface-container flex items-center justify-between">
          <View>
            <Text className="text-[11px] text-on-surface-variant">钱包可用可提现</Text>
            <View className="text-[18px] font-extrabold text-primary font-mono leading-tight">
              ¥8,940.00
            </View>
          </View>
          <Button
            onClick={onOpenWithdraw}
            className="px-3.5 py-1.5 bg-primary-container text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors cursor-pointer"
          >
            去提现
          </Button>
        </View>
      </View>

      {/* 资质认证墙 */}
      <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container space-y-2.5">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-primary text-[18px]">verified</Text>
            <Text className="text-sm font-bold text-on-surface">官方从业资质证书 (3项认证)</Text>
          </View>
          <Text className="text-[11px] text-secondary font-bold">已年检合格</Text>
        </View>

        <View className="space-y-2 text-xs">
          <View className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between">
            <View className="flex items-center gap-2">
              <Text className="material-symbols-outlined text-primary text-[18px]">badge</Text>
              <View>
                <View className="font-bold text-on-surface">农业农村部 · 高级农艺师执业证书</View>
                <View className="text-[11px] text-outline font-mono">{technician.certId}</View>
              </View>
            </View>
            <Text className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
              全国有效
            </Text>
          </View>

          <View className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between">
            <View className="flex items-center gap-2">
              <Text className="material-symbols-outlined text-amber-700 text-[18px]">
                local_pharmacy
              </Text>
              <View>
                <View className="font-bold text-on-surface">农药经营许可证 (合规处方权)</View>
                <View className="text-[11px] text-outline font-mono">{technician.pesticideLicense}</View>
              </View>
            </View>
            <Text className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
              保真追溯
            </Text>
          </View>

          <View className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between">
            <View className="flex items-center gap-2">
              <Text className="material-symbols-outlined text-teal-700 text-[18px]">flight</Text>
              <View>
                <View className="font-bold text-on-surface">民航CAAC · 植保无人驾驶航空器执照</View>
                <View className="text-[11px] text-outline font-mono">UAS-HN-2023-4410</View>
              </View>
            </View>
            <Text className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
              多旋翼III类
            </Text>
          </View>
        </View>
      </View>

      {/* 阿米巴创客团队 & 徒弟体系 */}
      <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container space-y-2.5">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-primary text-[18px]">group</Text>
            <Text className="text-sm font-bold text-on-surface">师徒结对与裂变团队</Text>
          </View>
          <Button
            onClick={onOpenRecruitPoster}
            className="text-xs text-primary font-bold hover:underline cursor-pointer"
          >
            + 邀请新徒弟
          </Button>
        </View>

        <View className="space-y-2 text-xs">
          <View className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between">
            <View className="flex items-center gap-2">
              <Image
                className="w-8 h-8 rounded-full object-cover"
                alt="李师弟"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4xta4r7PAJTIc6ccs8Lg4UBc82pPzjrtMTkbJf6E4Gnblp7i7iDvfQxyWIfPI0S150jksXUrn5MaSjyg7eL7YSl5onLbD15MetzgWh3f3bbIM7EYOD33INt1aYFKz9vm1V3B-Clka46SM0t3yR0qVk_4M5B7XEaHYkbRo8BMlSeSoFadK32vKQp4-Anc78tYdz39Kl3JmZJG-US-nsqekmMrgtuKS39gAvAtErNxxdwlPcnsa_xBO"
              />
              <View>
                <View className="font-bold text-on-surface">李师弟 (湖南农大植保系)</View>
                <View className="text-[11px] text-outline">入驻45天 · 累计出诊28单</View>
              </View>
            </View>
            <View className="text-right">
              <Text className="text-xs font-bold text-primary font-mono">+¥680.00</Text>
              <View className="text-[10px] text-outline">带教培育分红</View>
            </View>
          </View>

          <View className="p-2 rounded-lg bg-surface-container-low flex items-center justify-between">
            <View className="flex items-center gap-2">
              <View className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-xs">
                王
              </View>
              <View>
                <View className="font-bold text-on-surface">王海涛 (飞防大队长)</View>
                <View className="text-[11px] text-outline">入驻90天 · 执飞作业3200亩</View>
              </View>
            </View>
            <View className="text-right">
              <Text className="text-xs font-bold text-primary font-mono">+¥420.00</Text>
              <View className="text-[10px] text-outline">机队协同分红</View>
            </View>
          </View>
        </View>
      </View>

      {/* 快捷操作与功能区 */}
      <View className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container divide-y divide-surface-container text-xs">
        <Button
          onClick={onOpenOptionAgreement}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          <View className="flex items-center gap-2">
            <Text className="material-symbols-outlined text-amber-700 text-[18px]">contract</Text>
            <Text className="font-semibold text-on-surface">合伙人期权分配协议 (HN-ST-0082)</Text>
          </View>
          <Text className="material-symbols-outlined text-[16px] text-outline">chevron_right</Text>
        </Button>

        <Button
          onClick={() =>
            showAlert(
              '【长沙县安沙直营智服仓】\n地址：安沙镇黄旗村机耕主路口01号\n仓储能力：常备药剂500+箱，支持无人车20分钟极速配药到田。'
            )
          }
          className="w-full p-3 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          <View className="flex items-center gap-2">
            <Text className="material-symbols-outlined text-primary text-[18px]">warehouse</Text>
            <Text className="font-semibold text-on-surface">直联自营仓库与应急调药网络</Text>
          </View>
          <Text className="material-symbols-outlined text-[16px] text-outline">chevron_right</Text>
        </Button>

        <Button
          onClick={() => showAlert('离线农情图谱与农药防伪数据库已自动同步完成！版本：2026.10-R3')}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          <View className="flex items-center gap-2">
            <Text className="material-symbols-outlined text-secondary text-[18px]">cloud_sync</Text>
            <Text className="font-semibold text-on-surface">田间离线数据包缓存 (已同步)</Text>
          </View>
          <Text className="text-[10px] text-emerald-700 font-mono">最新版</Text>
        </Button>
      </View>
    </View>
  );
};
