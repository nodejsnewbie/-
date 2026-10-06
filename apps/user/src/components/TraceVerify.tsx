import { Button, Input, Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import type { TraceVerificationResult } from '../types';
import { api } from '../services/api';
import { showAlert } from '../utils/platform';
import { formatDateTime } from '../utils/format';

interface TraceVerifyProps {
  initialCode: string;
  onClose: () => void;
}

/** 溯源验真浮层（C 端核心能力：POST /api/trace/verify，真实监管链路数据）。 */
export const TraceVerify: React.FC<TraceVerifyProps> = ({ initialCode, onClose }) => {
  const [code, setCode] = useState(initialCode);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<TraceVerificationResult | null>(null);

  const handleVerify = async () => {
    if (!code.trim()) {
      showAlert('请输入瓶身 16-24 位农药电子溯源码');
      return;
    }
    setVerifying(true);
    try {
      const data = await api.verifyTrace(code);
      setResult(data);
    } catch (e) {
      showAlert(`验真失败：${(e as Error).message}`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
      <View className="bg-surface-container-lowest w-full max-w-[400px] rounded-2xl max-h-[86vh] flex flex-col overflow-hidden">
        {/* 头 */}
        <View className="h-12 px-3 bg-primary text-on-primary flex items-center justify-between shrink-0">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[18px]">verified_user</Text>
            <Text className="font-bold text-xs">国家农药电子溯源码 · 一物一码验真</Text>
          </View>
          <Button onClick={onClose} className="w-8 h-8 rounded-full text-on-primary/80 after:border-none">
            <Text className="material-symbols-outlined text-[20px]">close</Text>
          </Button>
        </View>

        <View className="p-3.5 overflow-y-auto space-y-3">
          {/* 输入 */}
          <View className="flex items-center gap-2">
            <Input
              value={code}
              onInput={(e) => setCode(e.detail.value)}
              placeholder="输入 16-24 位溯源码"
              className="flex-1 bg-surface-container rounded-lg px-3 py-2.5 text-[12px] text-on-surface font-mono"
            />
            <Button
              onClick={handleVerify}
              disabled={verifying}
              className="px-4 py-2.5 rounded-lg bg-primary text-on-primary text-[12px] font-bold after:border-none"
            >
              {verifying ? '验真中…' : '立即验真'}
            </Button>
          </View>

          {result && (
            <View
              className={`rounded-xl p-3 space-y-2 ${
                result.isValid
                  ? 'bg-secondary-container/30 border border-secondary/40'
                  : 'bg-error-container/30 border border-error/40'
              }`}
            >
              {/* 判定 */}
              <View className="flex items-center gap-1.5">
                <Text
                  className={`material-symbols-outlined text-[20px] ${
                    result.isValid ? 'text-secondary' : 'text-error'
                  }`}
                >
                  {result.isValid ? 'verified' : 'dangerous'}
                </Text>
                <Text
                  className={`text-[14px] font-extrabold ${result.isValid ? 'text-secondary' : 'text-error'}`}
                >
                  {result.isValid ? '✅ 正品验真通过' : '⛔ 疑似假劣 / 异常码'}
                </Text>
              </View>
              <Text className="text-[12px] font-bold text-on-surface block">{result.productName}</Text>
              <Text className="text-[10px] text-on-surface-variant font-mono block">
                登记证: {result.licenseNo} · 批次: {result.batchNo}
              </Text>
              <Text className="text-[10px] text-on-surface-variant block">
                生产单位: {result.manufacturer}
              </Text>

              {/* 异常码警告（国家预警文案） */}
              {result.warnings && result.warnings.length > 0 && (
                <View className="space-y-1 pt-1">
                  {result.warnings.map((w, i) => (
                    <Text key={i} className="block text-[11px] text-error font-semibold">
                      {w}
                    </Text>
                  ))}
                </View>
              )}

              {/* 溯源链条 */}
              {result.chain.length > 0 && (
                <View className="pt-1.5 border-t border-surface-container space-y-1.5">
                  <Text className="text-[11px] font-bold text-on-surface block">溯源链条</Text>
                  {result.chain.map((step) => (
                    <View key={step.step} className="flex items-start gap-2">
                      <Text className="w-4 h-4 mt-0.5 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center shrink-0">
                        {step.step}
                      </Text>
                      <View className="min-w-0">
                        <Text className="text-[11px] font-bold text-on-surface block">
                          {step.title} · {formatDateTime(step.timestamp)}
                        </Text>
                        <Text className="text-[10px] text-on-surface-variant block">{step.detail}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <Text className="block text-[9px] text-on-surface-variant/70">
                验真结果来自国家农药数字监管链路演示数据 · 正品享 48 小时持证农艺师复诊保障
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
