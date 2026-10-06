import { Text, View } from '@tarojs/components';
import React from 'react';
import type { ServiceBooking } from '../types';
import { statusStepIndex } from '../constants/presentation';

const STEPS = ['待接单', '已接单', '服务中', '已完成'];

interface StatusStepsProps {
  status: ServiceBooking['status'];
}

/** 服务进度四步条（原型：待接单 → 已接单 → 服务中 → 已完成）。 */
export const StatusSteps: React.FC<StatusStepsProps> = ({ status }) => {
  const current = statusStepIndex(status);
  return (
    <View className="flex items-center">
      {STEPS.map((step, idx) => {
        const done = idx <= current;
        return (
          <View key={step} className="flex items-center flex-1 last:flex-none">
            <View className="flex flex-col items-center gap-0.5">
              <View
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  done ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <Text>{idx + 1}</Text>
              </View>
              <Text className={`text-[9px] ${done ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                {step}
              </Text>
            </View>
            {idx < STEPS.length - 1 && (
              <View className={`flex-1 h-0.5 mx-1 mb-3.5 ${idx < current ? 'bg-primary' : 'bg-surface-container-high'}`} />
            )}
          </View>
        );
      })}
    </View>
  );
};
