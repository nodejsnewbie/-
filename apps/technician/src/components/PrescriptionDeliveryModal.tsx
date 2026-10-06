import { showAlert } from '../utils/platform';
import { formatCents } from '../utils/format';
import { Button, Canvas, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useEffect, useRef, useState } from 'react';
import { ServiceOrder } from '../types';

interface PrescriptionDeliveryModalProps {
  order: ServiceOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSigned: (orderId: string, signatureData: string) => void;
}

export const PrescriptionDeliveryModal: React.FC<PrescriptionDeliveryModalProps> = ({
  order,
  isOpen,
  onClose,
  onSigned,
}) => {
  // 小程序 Canvas 2d：节点须经 SelectorQuery 获取；触摸坐标用 e.touches[0].x/y（画布内相对坐标）
  const canvasNodeRef = useRef<{ width: number; height: number; getContext: (type: '2d') => CanvasRenderingContext2D } | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // 等弹窗渲染完成后再取节点
    const timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .select('#signature-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res?.[0]?.node) return;
          const canvas = res[0].node;
          const dpr = Taro.getSystemInfoSync().pixelRatio || 1;
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          const ctx = canvas.getContext('2d');
          ctx.scale(dpr, dpr);
          ctx.strokeStyle = '#004425';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          canvasNodeRef.current = canvas;
          ctxRef.current = ctx;
          canvasSizeRef.current = { width: res[0].width, height: res[0].height };
        });
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const startDrawing = (e) => {
    if (!ctxRef.current) return;
    setIsDrawing(true);
    setHasSigned(true);
    const { x, y } = e.touches[0];
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !ctxRef.current) return;
    const { x, y } = e.touches[0];
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { width, height } = canvasSizeRef.current;
    ctx.clearRect(0, 0, width, height);
    setHasSigned(false);
  };

  const handleFinishSigning = () => {
    const finish = (sig: string) => {
      setIsSaved(true);
      onSigned(order.id, sig);
      setTimeout(() => {
        showAlert(
          `交割单 ${order.deliveryNoteId} 已正式生效并同步至长沙县安沙直营药库！农户将收到提药短信与用法提醒。`
        );
        onClose();
      }, 500);
    };

    if (canvasNodeRef.current) {
      Taro.canvasToTempFilePath({
        canvas: canvasNodeRef.current,
        success: (res) => finish(res.tempFilePath),
        fail: () => finish(`手写签名已存证 ${new Date().toLocaleString()}`),
      });
    } else {
      finish(`手写签名已存证 ${new Date().toLocaleString()}`);
    }
  };

  const totalDrugCost = order.prescriptionDrugs.reduce((acc, d) => acc + d.priceCents * d.qty, 0);
  const grandTotal = totalDrugCost + (order.laborFeeCents || 6000);

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <View className="bg-surface-container-lowest w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <View className="h-12 px-3 bg-primary text-white flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[18px]">verified</Text>
            <Text className="font-bold text-xs">华农智服 · 电子处方与农事交割单</Text>
          </View>
          <Button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[20px]">close</Text>
          </Button>
        </View>

        {/* Prescription Certificate Body */}
        <View className="p-3.5 space-y-3 overflow-y-auto relative">
          {/* Watermark official round stamp in corner */}
          <View className="absolute top-8 right-6 pointer-events-none select-none opacity-25 rotate-[-15deg] flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 border-red-600 text-red-600">
            <View className="text-[10px] font-bold tracking-widest text-center uppercase">
              华农智服
            </View>
            <Text className="material-symbols-outlined text-[24px]">verified</Text>
            <View className="text-[8px] font-bold text-center leading-tight">
              电子处方专用章
              防伪溯源有效
            </View>
          </View>

          {/* Delivery Note Number Banner */}
          <View className="bg-surface-container-low p-2.5 rounded-xl border border-surface-container flex items-center justify-between">
            <View>
              <Text className="text-[10px] text-on-surface-variant">交割单号</Text>
              <View className="font-mono text-sm font-extrabold text-primary">
                {order.deliveryNoteId}
              </View>
            </View>
            <View className="text-right">
              <Text className="text-[10px] text-on-surface-variant">工单编号</Text>
              <View className="font-mono text-xs text-on-surface font-semibold">
                {order.orderNo}
              </View>
            </View>
          </View>

          {/* Crop & Agronomist Specs */}
          <View className="grid grid-cols-2 gap-2 text-xs bg-surface-container-lowest p-2 rounded-lg border border-surface-container">
            <View>
              <Text className="text-[10px] text-outline">接单农艺师:</Text>
              <View className="font-bold text-on-surface">张师傅 (高级持证)</View>
            </View>
            <View>
              <Text className="text-[10px] text-outline">受药农户:</Text>
              <View className="font-bold text-on-surface">{order.farmerName}</View>
            </View>
            <View>
              <Text className="text-[10px] text-outline">作物规模:</Text>
              <View className="font-bold text-on-surface">{order.cropScale}</View>
            </View>
            <View>
              <Text className="text-[10px] text-outline">签发日期:</Text>
              <View className="font-bold font-mono text-on-surface">2026-10-02</View>
            </View>
          </View>

          {/* Diagnostic Targets */}
          <View className="text-xs">
            <Text className="font-semibold text-on-surface">确诊病虫害靶标:</Text>
            <View className="flex flex-wrap gap-1.5 mt-1">
              {order.diagnosedTargets.map((t, idx) => (
                <Text
                  key={idx}
                  className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[11px] font-bold"
                >
                  {t}
                </Text>
              ))}
            </View>
          </View>

          {/* Agronomic Advice */}
          <View className="bg-surface-container-low p-2 rounded-lg text-xs leading-relaxed text-on-surface">
            <Text className="font-bold text-primary block mb-0.5">施用规程及农事指导:</Text>
            <Text>{order.agronomicAdvice}</Text>
          </View>

          {/* Prescribed Drug Table */}
          <View>
            <Text className="text-xs font-bold text-on-surface block mb-1">配立药剂清单:</Text>
            <View className="border border-surface-container rounded-lg overflow-hidden text-xs">
              {order.prescriptionDrugs.map((d) => (
                <View
                  key={d.id}
                  className="p-2 flex items-center justify-between bg-surface-container-lowest"
                >
                  <View>
                    <View className="font-bold text-on-surface">{d.name}</View>
                    <View className="text-[10px] text-outline font-mono">{d.code} · {d.spec}</View>
                  </View>
                  <View className="text-right">
                    <Text className="font-bold font-mono text-on-surface">× {d.qty}瓶</Text>
                    <View className="text-[11px] font-mono text-primary font-bold">
                      ¥{formatCents(d.priceCents * d.qty)}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Totals */}
          <View className="flex items-center justify-between text-xs pt-1 px-1">
            <Text className="text-on-surface-variant">药剂+勘验合计金额</Text>
            <Text className="text-base font-extrabold text-primary font-mono">
              ¥{formatCents(grandTotal)}
            </Text>
          </View>

          {/* Farmer Digital Signature Pad */}
          <View className="pt-2 border-t border-surface-container space-y-1.5">
            <View className="flex items-center justify-between">
              <Text className="text-xs font-bold text-on-surface">
                农户在线电子签名确认:
              </Text>
              <Button
                onClick={clearSignature}
                className="text-[11px] text-outline hover:text-red-600 cursor-pointer"
              >
                重签清除
              </Button>
            </View>

            <View className="border-2 border-dashed border-primary/30 rounded-xl bg-surface-container-low relative overflow-hidden h-24">
              <Canvas
                type="2d"
                id="signature-canvas"
                className="w-full h-full touch-none"
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasSigned && (
                <View className="absolute inset-0 pointer-events-none flex items-center justify-center text-outline text-xs">
                  <Text>请在此处手写签名</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="p-3 bg-surface-container-lowest border-t border-surface-container flex items-center gap-2">
          <Button
            onClick={() => {
              showAlert('已将电子处方交割凭证及用药指导一键发送至农户微信服务号！');
            }}
            className="h-11 px-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[16px]">share</Text>
            <Text>发农户微信</Text>
          </Button>

          <Button
            disabled={!hasSigned || isSaved}
            onClick={handleFinishSigning}
            className={`flex-1 h-11 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer ${
              hasSigned ? 'bg-primary hover:bg-primary-container' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Text className="material-symbols-outlined text-[18px]">verified</Text>
            <Text>核签生效并下发仓库出库</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
