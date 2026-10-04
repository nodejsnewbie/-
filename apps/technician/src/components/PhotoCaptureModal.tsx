import { Button, Image, Input, Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import { FieldEvidencePhoto } from '../types';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photo: FieldEvidencePhoto) => void;
}

const PRESET_SHOTS = [
  {
    label: '病斑微距特写',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs_6zk0Bxl4Vfbdi-B1dRBELdJWY1Cp6jaxCH_Wk1v-IVY8uVCBZms-RibgwqaN3Wef6ZlYilPE458dhaFJ6dob0VblJJFgLiTGD8S8D9Zw851CbnTMLiL1kkUPiC5G-o9Pbb4jsNVkj6UCvPbeSzd-9bd-D6zCyDEfn2aLqN5s9WkuADAY-umaEvbH3aMXV7u-GjkAeHksDRRy-Exl3y7GRJv2lAeJmdjht2Mp-9wTe-NVEQ6H4jx',
  },
  {
    label: '全景长势航拍',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYyN0xfIm7vgr6QE5dUsWutwk7xLpl4CG3RBTqLk67zZD2uaJ4WEJ9VL-9D89GWV2sEodVCHOD7bgd_n4CwGCajpr7ELmLqzMsTHvbAIyFXjkth_CBzz9EjBkFQcIbUL7Tw5kTmHE3gxfs-mg9MPiKd7N4NYjryp1PJTKnd_i9cWO9tIgzpOBhTNCu_3xijntAbbeJgb4o2C8LEepFHlSYzm5lInuDW8x8EYcnM1maDsO4NUioanIf',
  },
  {
    label: '稻瘟卷叶自检',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeOeRTPposhqafdFa1IcRswNjA8E46JBJ6WiFcDG_n1T0ZeNRw1-CdgumE9vspf3NDvQdSXBVwmIN4ke-idlv407mgtfEcrwKah1OcDy7vHKHgl0C6K5LNX5LEgX0qnPxf-mF2D1vXvV-kATBv8wtmfZK9vDjYQLuiZRNaOJnJ6m1j0ojgNHttn8Vx2tSXGdGws5CJo0t1dC7k68Y9-HaPQm8N__adA5bWdWChroXmHwNaJcmIZ0vK',
  },
  {
    label: '田埂机耕道全貌',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbIMtvbBVJcJtG2QetRfObF2JLaOS2xUSS1T5R-Otc9G7fUI5TMyREjHBEVTs6zoPaZJm_bOpVh1cMbz3pXiWmg5gd0-SfDLr1BkmecOPMfDSmOlNiNFH-yBoIEQZKyTb3YG0tz7uDK_XpEaR6Zf4gmg4Vow246V7CAYz1Vvr2y_096FaKalfyvHjL7TIqupqh-bTjS68qS53lEmRlU2lph9-61Pc_bndTUsD2uCgYbyL1rSA6cJ3K',
  },
];

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customLabel, setCustomLabel] = useState('安沙镇·病斑微距');
  const [isFlashing, setIsFlashing] = useState(false);

  if (!isOpen) return null;

  const nowTime = new Date();
  const timeStr = `${(nowTime.getMonth() + 1).toString().padStart(2, '0')}-${nowTime
    .getDate()
    .toString()
    .padStart(2, '0')} ${nowTime.getHours().toString().padStart(2, '0')}:${nowTime
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;

  const handleSnap = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
      const newPhoto: FieldEvidencePhoto = {
        id: `ev-${Date.now()}`,
        url: PRESET_SHOTS[selectedPreset].url,
        label: customLabel || PRESET_SHOTS[selectedPreset].label,
        time: timeStr,
        location: '长沙县安沙镇黄旗村',
      };
      onCapture(newPhoto);
      onClose();
    }, 300);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newPhoto: FieldEvidencePhoto = {
          id: `ev-${Date.now()}`,
          url: result,
          label: customLabel || '现场实拍',
          time: timeStr,
          location: '长沙县安沙镇黄旗村',
        };
        onCapture(newPhoto);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <View className="bg-surface-container-lowest w-full max-w-[390px] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Header */}
        <View className="h-12 px-3 bg-primary text-white flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[18px]">photo_camera</Text>
            <Text className="font-bold text-xs">田间实拍相机 · 防伪水印已开启</Text>
          </View>
          <Button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[20px]">close</Text>
          </Button>
        </View>

        {/* Viewfinder Preview */}
        <View className="relative aspect-4/3 bg-black overflow-hidden flex items-center justify-center">
          <Image
            src={PRESET_SHOTS[selectedPreset].url}
            alt="Viewfinder"
            className="w-full h-full object-cover"
          />

          {/* Flash animation */}
          {isFlashing && (
            <View className="absolute inset-0 bg-white z-20 animate-fade-out"></View>
          )}

          {/* Viewfinder Focus Reticle */}
          <View className="absolute inset-8 border border-white/40 pointer-events-none rounded flex items-center justify-center">
            <View className="w-10 h-10 border-2 border-emerald-400/80 rounded-sm"></View>
          </View>

          {/* Watermark Overlay (Real-time agronomic stamp) */}
          <View className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded-md p-2 text-white text-[10px] space-y-0.5 pointer-events-none border border-white/20">
            <View className="flex items-center justify-between text-emerald-300 font-bold font-mono">
              <Text>28.3742°N, 113.0619°E</Text>
              <Text>{timeStr}</Text>
            </View>
            <View className="flex items-center justify-between text-white/90">
              <Text className="truncate">湖南省长沙县安沙镇黄旗村 04组</Text>
              <Text className="text-amber-300 font-bold shrink-0">{customLabel}</Text>
            </View>
            <View className="text-[9px] text-white/60 font-mono">华农智服 · 农艺师出诊取样认证</View>
          </View>
        </View>

        {/* Preset Selector & Label Input */}
        <View className="p-3 bg-surface-container-low space-y-2.5">
          <View className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {PRESET_SHOTS.map((preset, idx) => (
              <Button
                key={idx}
                onClick={() => {
                  setSelectedPreset(idx);
                  setCustomLabel(preset.label);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedPreset === idx
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {preset.label}
              </Button>
            ))}
          </View>

          <View className="flex items-center gap-2">
            <Text className="text-xs text-on-surface-variant font-medium shrink-0">照片备注:</Text>
            <Input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              className="flex-1 bg-surface-container-lowest border border-surface-container-high rounded-md px-2.5 py-1 text-xs text-on-surface focus:outline-none focus:border-primary"
              placeholder="如：安沙镇·病斑微距"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="p-3 bg-surface-container-lowest flex items-center justify-between gap-3 border-t border-surface-container">
          <View className="flex items-center gap-1 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold cursor-pointer">
            <Text className="material-symbols-outlined text-[16px]">upload_file</Text>
            <Text>相册上传</Text>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </View>

          <Button
            onClick={handleSnap}
            className="flex-1 h-11 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[20px]">camera</Text>
            <Text>拍照并附加水印存证</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
