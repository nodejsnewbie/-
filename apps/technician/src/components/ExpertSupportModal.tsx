import { showAlert } from '../utils/platform';
import { Button, Text, View } from '@tarojs/components';
import React from 'react';

interface ExpertSupportModalProps {
  isOpen: boolean;
  type: 'expert' | 'sos';
  onClose: () => void;
}

export const ExpertSupportModal: React.FC<ExpertSupportModalProps> = ({
  isOpen,
  type,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <View className="bg-surface-container-lowest w-full max-w-[380px] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {type === 'expert' ? (
          <>
            <View className="h-12 px-3 bg-amber-800 text-white flex items-center justify-between">
              <View className="flex items-center gap-1.5">
                <Text className="material-symbols-outlined text-[18px]">support_agent</Text>
                <Text className="font-bold text-xs">华农植保专家会诊中心 · 在线连线</Text>
              </View>
              <Button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
              >
                <Text className="material-symbols-outlined text-[20px]">close</Text>
              </Button>
            </View>

            <View className="p-4 space-y-3 text-xs text-on-surface">
              <View className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <View className="font-bold text-amber-950 flex items-center gap-1">
                  <Text className="material-symbols-outlined text-[16px] text-amber-700">
                    psychiatry
                  </Text>
                  <Text>省级植保院专家随时连线支持</Text>
                </View>
                <Text className="text-[11px] text-amber-900 leading-relaxed">
                  遇到罕见病斑或复杂药害？可将现场采集的水印实拍图一键上传，专家库10分钟内出具联合会诊诊断书。
                </Text>
              </View>

              <View className="space-y-2">
                <Button
                  onClick={() => {
                    showAlert('正在发起专家高清视频远程显微镜检连线...');
                    onClose();
                  }}
                  className="w-full h-11 bg-primary hover:bg-primary-container text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Text className="material-symbols-outlined text-[18px]">video_call</Text>
                  <Text>发起视频远程专家会诊</Text>
                </Button>

                <Button
                  href="tel:4008809988"
                  onClick={() => onClose()}
                  className="w-full h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-surface-container-high"
                >
                  <Text className="material-symbols-outlined text-[18px] text-amber-700">call</Text>
                  <Text>致电农技专家直拨热线 (400-880-9988)</Text>
                </Button>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="h-12 px-3 bg-red-700 text-white flex items-center justify-between">
              <View className="flex items-center gap-1.5">
                <Text className="material-symbols-outlined text-[18px]">phone_in_talk</Text>
                <Text className="font-bold text-xs">外勤紧急求助 · 实时安全保障</Text>
              </View>
              <Button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
              >
                <Text className="material-symbols-outlined text-[20px]">close</Text>
              </Button>
            </View>

            <View className="p-4 space-y-3 text-xs text-on-surface">
              <View className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                <View className="font-bold text-red-950 flex items-center gap-1">
                  <Text className="material-symbols-outlined text-[16px] text-red-700">
                    warning
                  </Text>
                  <Text>突发农机故障 / 农险突发 / 人身安全</Text>
                </View>
                <Text className="text-[11px] text-red-900 leading-relaxed">
                  系统已锁定您当前的田间经纬度 (28.3742°N, 113.0619°E)。点击以下按钮可立即拨打紧急求助电话或向区域主管派发安全SOS。
                </Text>
              </View>

              <View className="space-y-2">
                <Button
                  href="tel:110"
                  onClick={() => onClose()}
                  className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Text className="material-symbols-outlined text-[18px]">emergency</Text>
                  <Text>拨打紧急报警求助 110</Text>
                </Button>

                <Button
                  onClick={() => {
                    showAlert('已向长沙县安沙直营站救援车队与保险公司发送SOS定位，调度专员正在火速回电！');
                    onClose();
                  }}
                  className="w-full h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-surface-container-high"
                >
                  <Text className="material-symbols-outlined text-[18px] text-red-700">
                    sos
                  </Text>
                  <Text>向安沙直营站派发农机救援抢修</Text>
                </Button>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};
