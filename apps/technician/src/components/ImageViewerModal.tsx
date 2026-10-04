import { showAlert } from '../utils/platform';
import { Button, Image, Text, View } from '@tarojs/components';
import React from 'react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <View
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md cursor-zoom-out select-none"
    >
      <View
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[450px] w-full rounded-2xl overflow-hidden bg-black flex flex-col items-center"
      >
        <Button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
        >
          <Text className="material-symbols-outlined text-[20px]">close</Text>
        </Button>

        <Image
          src={imageUrl}
          alt={title}
          className="w-full max-h-[70vh] object-contain"
        />

        <View className="w-full p-3 bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between">
          <View className="flex flex-col">
            <Text className="text-xs font-bold text-on-surface">{title}</Text>
            <Text className="text-[10px] text-outline">田间实勘影像 · 高清防伪存证</Text>
          </View>
          <Button
            onClick={() => showAlert('已将图片高清原图下载至本地')}
            className="px-2.5 py-1 rounded-lg bg-surface-container text-xs font-semibold text-primary cursor-pointer hover:bg-surface-container-high"
          >
            下载原图
          </Button>
        </View>
      </View>
    </View>
  );
};
