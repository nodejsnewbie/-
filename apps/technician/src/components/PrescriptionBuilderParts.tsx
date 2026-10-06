import { Button, Image, Text, View } from '@tarojs/components';
import React from 'react';
import type { ServiceOrder } from '../types';
import { formatDateTime } from '../utils/format';

/**
 * 电子处方开立页的自包含展示区块（自 PrescriptionBuilderView 按 R10 拆出，JSX 原样迁入）。
 */

interface PrescriptionHeaderCardProps {
  order: ServiceOrder;
}

/** 状态与定位头卡。 */
export const PrescriptionHeaderCard: React.FC<PrescriptionHeaderCardProps> = ({ order }) => {
  return (
    <View className="p-3">
      <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
        <View className="flex items-start justify-between gap-2">
          <View className="min-w-0">
            <View className="flex items-center gap-1.5 mb-1 flex-wrap">
              <Text className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                <Text className="w-1.5 h-1.5 rounded-full bg-secondary mr-1 animate-pulse"></Text>
                服务进行中
              </Text>
              <Text className="text-[11px] text-on-surface-variant font-mono">
                工单 {order.orderNo}
              </Text>
            </View>
            <Text className="text-[18px] font-bold text-on-surface truncate">
              {order.title}
            </Text>
          </View>
        </View>

        {/* 服务地址（本期无定位能力，仅作地址展示，到达与验收以现场实拍+农户签字为准） */}
        <View className="mt-3 p-2.5 rounded-lg bg-surface-container-low flex items-center gap-2">
          <View className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0">
            <Text className="material-symbols-outlined text-[15px]">location_on</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-xs font-bold text-on-surface truncate">
              {order.locationName}
            </Text>
            <Text className="text-[11px] text-on-surface-variant">
              到达与验收以现场实拍及农户签字为准（本期无定位核验）
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

interface EvidenceGalleryProps {
  order: ServiceOrder;
  onViewImage: (url: string, label: string) => void;
  onOpenPhotoCapture: () => void;
}

/** 现场取样实拍相册。 */
export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  order,
  onViewImage,
  onOpenPhotoCapture,
}) => {
  return (
    <View className="px-3 mb-2.5">
      <View className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs">
        <View className="flex items-center justify-between mb-2.5">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-primary text-[20px]">
              photo_camera
            </Text>
            <Text className="text-[16px] font-bold text-on-surface">现场取样实拍</Text>
          </View>
          <Text className="text-xs text-on-surface-variant">
            已采集{' '}
            <Text className="text-primary font-bold">
              {order.fieldEvidencePhotos?.length || 2}
            </Text>
            /4 张
          </Text>
        </View>

        {/* Horizontal Photo Evidence Gallery */}
        <View className="grid grid-cols-3 gap-2">
          {order.fieldEvidencePhotos?.map((photo) => (
            <View
              key={photo.id}
              onClick={() => onViewImage(photo.url, photo.label)}
              className="relative rounded-lg overflow-hidden aspect-square bg-surface-container shadow-xs group cursor-pointer border border-surface-container-high"
            >
              <Image
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                alt={photo.label}
                src={photo.url}
              />
              <View className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1">
                <Text className="block text-[8px] text-white font-mono leading-tight">
                  {formatDateTime(photo.time)}
                </Text>
                <Text className="block text-[9px] text-secondary-container font-semibold truncate">
                  {photo.label}
                </Text>
              </View>
              <Text className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 flex items-center justify-center">
                <Text className="material-symbols-outlined text-[10px]">check</Text>
              </Text>
            </View>
          ))}

          {/* Upload Trigger */}
          <Button
            onClick={onOpenPhotoCapture}
            className="rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center aspect-square text-on-surface-variant active:scale-95 transition-all cursor-pointer"
          >
            <Text className="material-symbols-outlined text-primary text-[26px] mb-0.5">
              add_a_photo
            </Text>
            <Text className="text-xs font-bold text-on-surface">添加实拍</Text>
            <Text className="text-[10px] text-outline font-mono">支持水印</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
