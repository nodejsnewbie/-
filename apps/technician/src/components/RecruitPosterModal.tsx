import { showAlert } from '../utils/platform';
import { Button, Image, Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import { TechnicianProfile } from '../types';

interface RecruitPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianProfile;
}

export const RecruitPosterModal: React.FC<RecruitPosterModalProps> = ({
  isOpen,
  onClose,
  technician,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteCode = `HN-${technician.partnerCode.replace('HN-ST-', 'ZHANG-')}`;
  const inviteLink = `https://huanong-zhifu.com/join?ref=${inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <View className="bg-surface-container-lowest w-full max-w-[380px] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <View className="h-12 px-3 bg-primary text-white flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[18px]">share</Text>
            <Text className="font-bold text-xs">青年新农人合伙人 · 专属招募海报</Text>
          </View>
          <Button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[20px]">close</Text>
          </Button>
        </View>

        {/* Poster Canvas */}
        <View className="p-3.5 space-y-3 overflow-y-auto">
          <View className="bg-gradient-to-br from-primary via-primary-container to-secondary text-white rounded-2xl p-4 shadow-lg relative overflow-hidden space-y-3">
            {/* Header info */}
            <View className="flex items-center justify-between">
              <Text className="bg-amber-300 text-amber-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                华农智服 · 创客合伙人
              </Text>
              <Text className="text-emerald-200 text-xs font-mono font-bold">
                期权激励计划
              </Text>
            </View>

            <View>
              <Text className="text-lg font-extrabold leading-snug">
                招募乡村持证农艺师 / 农校英才
              </Text>
              <Text className="text-xs text-green-100 mt-1">
                与张师傅师徒结对，依托安沙直营站与全套无人机飞防体系，让每一个农艺师成为平台合伙股东。
              </Text>
            </View>

            {/* Highlights */}
            <View className="bg-white/10 rounded-xl p-2.5 space-y-1.5 text-xs text-green-50">
              <View className="flex items-center gap-2">
                <Text className="material-symbols-outlined text-amber-300 text-[16px]">
                  workspace_premium
                </Text>
                <Text>持证农艺师享保底收益 + 40%工单直分润</Text>
              </View>
              <View className="flex items-center gap-2">
                <Text className="material-symbols-outlined text-amber-300 text-[16px]">
                  medication_liquid
                </Text>
                <Text>自营药库三证保真，享7%~15%处方销售流转红利</Text>
              </View>
              <View className="flex items-center gap-2">
                <Text className="material-symbols-outlined text-amber-300 text-[16px]">
                  military_tech
                </Text>
                <Text>纳入技术骨干期权池，年终享创客小组二次加权分红</Text>
              </View>
            </View>

            {/* Technician Stamp & QR Code */}
            <View className="bg-white rounded-xl p-3 text-on-surface flex items-center justify-between gap-3">
              <View className="flex items-center gap-2.5 min-w-0">
                <Image
                  src={technician.avatarUrl}
                  alt={technician.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                />
                <View className="min-w-0">
                  <View className="font-bold text-xs text-on-surface truncate">
                    推荐人：{technician.name}
                  </View>
                  <View className="text-[10px] text-outline truncate">{technician.role}</View>
                  <View className="text-[10px] text-primary font-mono font-bold mt-0.5">
                    邀请码: {inviteCode}
                  </View>
                </View>
              </View>

              {/* QR Code graphic */}
              <View className="w-16 h-16 bg-surface-container p-1 rounded-lg border border-surface-container-high flex flex-col items-center justify-center shrink-0">
                <Text className="material-symbols-outlined text-[34px] text-primary">qr_code_2</Text>
                <Text className="text-[8px] text-outline">扫码入驻</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Dock */}
        <View className="p-3 bg-surface-container-lowest border-t border-surface-container flex items-center gap-2">
          <Button
            onClick={handleCopyLink}
            className="flex-1 h-11 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <Text className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </Text>
            <Text>{copied ? '已复制招募链接' : '复制专属推荐链接'}</Text>
          </Button>

          <Button
            onClick={() => {
              showAlert('招募海报已生成高清图片，已保存至手机相册！');
            }}
            className="flex-1 h-11 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[16px]">download</Text>
            <Text>保存海报发朋友圈</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
