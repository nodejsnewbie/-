import { Button, Image, Input, Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import { PrescriptionDrug } from '../types';
import { AVAILABLE_PESTICIDE_CATALOG } from '../data/mockData';

interface PesticideScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrug: (drug: PrescriptionDrug) => void;
}

export const PesticideScannerModal: React.FC<PesticideScannerModalProps> = ({
  isOpen,
  onClose,
  onAddDrug,
}) => {
  const [activeTab, setActiveTab] = useState<'scanner' | 'catalog'>('scanner');
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedResult, setScannedResult] = useState<PrescriptionDrug | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (drug: PrescriptionDrug) => {
    setScannedResult(drug);
  };

  const handleConfirmAdd = (drug: PrescriptionDrug) => {
    onAddDrug(drug);
    setScannedResult(null);
    onClose();
  };

  const filteredCatalog = AVAILABLE_PESTICIDE_CATALOG.filter(
    (d) =>
      d.name.includes(searchQuery) ||
      d.code.includes(searchQuery) ||
      d.spec.includes(searchQuery)
  );

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <View className="bg-surface-container-lowest w-full max-w-[390px] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Top Header */}
        <View className="h-12 px-3 bg-primary text-white flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[18px]">qr_code_scanner</Text>
            <Text className="font-bold text-xs">华农合规药剂 · 扫码加药与验真</Text>
          </View>
          <Button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[20px]">close</Text>
          </Button>
        </View>

        {/* Tab Switcher */}
        <View className="flex bg-surface-container p-1 border-b border-surface-container-high">
          <Button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            镜头扫码识别
          </Button>
          <Button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            自营药库检索
          </Button>
        </View>

        {activeTab === 'scanner' ? (
          <View className="p-3 flex flex-col gap-3">
            {/* Camera Viewfinder with laser sweep animation */}
            <View className="relative aspect-square rounded-xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center border border-white/20">
              {/* Corner brackets */}
              <View className="w-48 h-48 border-2 border-emerald-400 relative flex items-center justify-center">
                <View className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-300"></View>
                <View className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-300"></View>
                <View className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-300"></View>
                <View className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-300"></View>

                {/* Laser scan line */}
                <View className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#34d399] animate-pulse"></View>
              </View>

              <View className="absolute bottom-3 text-center text-white/80 text-[11px] px-4">
                将农药瓶身溯源码或电子监管条码放入取景框
              </View>
            </View>

            {/* Quick Simulate Barcode Scan Chips */}
            <View>
              <Text className="text-[11px] text-on-surface-variant font-medium">
                快速模拟扫描药剂条码:
              </Text>
              <View className="grid grid-cols-2 gap-1.5 mt-1.5">
                {AVAILABLE_PESTICIDE_CATALOG.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleSimulateScan(item)}
                    className="p-1.5 text-left rounded-lg bg-surface-container hover:bg-surface-container-high border border-surface-container-high text-xs cursor-pointer transition-colors"
                  >
                    <View className="font-bold text-on-surface truncate">{item.name}</View>
                    <View className="text-[10px] text-primary font-mono font-semibold">
                      ¥{item.price} · {item.code}
                    </View>
                  </Button>
                ))}
              </View>
            </View>

            {/* Recognized Result Card */}
            {scannedResult && (
              <View className="p-3 bg-secondary-container/40 border border-secondary/30 rounded-xl space-y-2 animate-fade-in">
                <View className="flex items-start gap-2.5">
                  <Image
                    src={scannedResult.img}
                    alt={scannedResult.name}
                    className="w-12 h-12 rounded object-cover border border-secondary/30"
                  />
                  <View className="flex-1 min-w-0">
                    <View className="flex items-center gap-1">
                      <Text className="material-symbols-outlined text-secondary text-[16px]">
                        verified
                      </Text>
                      <Text className="font-bold text-xs text-on-surface truncate">
                        {scannedResult.name}
                      </Text>
                    </View>
                    <Text className="text-[11px] text-on-surface-variant truncate">
                      {scannedResult.spec}
                    </Text>
                    <View className="flex items-center justify-between mt-1">
                      <Text className="text-primary font-mono font-extrabold text-sm">
                        ¥{scannedResult.price.toFixed(2)}
                      </Text>
                      <Text className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded text-secondary font-bold">
                        国家三证齐全
                      </Text>
                    </View>
                  </View>
                </View>

                <Button
                  onClick={() => handleConfirmAdd(scannedResult)}
                  className="w-full h-9 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Text className="material-symbols-outlined text-[16px]">add_shopping_cart</Text>
                  <Text>确认添加此药剂到电子处方</Text>
                </Button>
              </View>
            )}
          </View>
        ) : (
          <View className="p-3 flex flex-col gap-2.5 overflow-y-auto">
            {/* Search Input */}
            <View className="relative">
              <Text className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[18px]">
                search
              </Text>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索药剂通用名、杀菌剂、杀虫剂..."
                className="w-full bg-surface-container-low pl-9 pr-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
              />
            </View>

            {/* Catalog List */}
            <View className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredCatalog.map((drug) => (
                <View
                  key={drug.id}
                  className="p-2.5 bg-surface-container-low rounded-xl border border-surface-container flex items-center justify-between gap-2"
                >
                  <Image
                    src={drug.img}
                    alt={drug.name}
                    className="w-12 h-12 rounded object-cover border border-surface-container-high"
                  />
                  <View className="flex-1 min-w-0">
                    <View className="font-bold text-xs text-on-surface truncate">{drug.name}</View>
                    <View className="text-[11px] text-on-surface-variant truncate">{drug.spec}</View>
                    <View className="flex items-center gap-2 mt-1">
                      <Text className="text-primary font-mono font-bold text-xs">
                        ¥{drug.price.toFixed(2)}
                      </Text>
                      <Text className="text-[10px] text-secondary font-mono">{drug.tag}</Text>
                    </View>
                  </View>
                  <Button
                    onClick={() => handleConfirmAdd(drug)}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-container active:scale-95 transition-transform cursor-pointer shrink-0"
                  >
                    加入处方
                  </Button>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
