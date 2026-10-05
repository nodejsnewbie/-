import { Button, Input, Picker, Text, Textarea, View } from '@tarojs/components';
import React, { useState } from 'react';
import type { ServiceBooking } from '../types';
import { showAlert } from '../utils/platform';

interface BookingViewProps {
  initialType?: ServiceBooking['serviceType'];
  onSubmit: (booking: Partial<ServiceBooking>) => Promise<void>;
}

const TYPE_OPTIONS: { type: ServiceBooking['serviceType']; icon: string; label: string; desc: string }[] = [
  { type: 'field_diagnosis', icon: 'pest_control', label: '上门植保服务', desc: '病虫害诊断·用药指导·田间管理' },
  { type: 'delivery_maintenance', icon: 'local_shipping', label: '农资上门服务', desc: '农资送货·用药指导' },
  { type: 'expert_consult', icon: 'support_agent', label: '专家咨询', desc: '线上图文/电话咨询' },
];

/** 服务预约（原型②：选类型 → 作物/问题描述/图片/地址/期望时间 → 提交）。 */
export const BookingView: React.FC<BookingViewProps> = ({ initialType, onSubmit }) => {
  const [serviceType, setServiceType] = useState<ServiceBooking['serviceType']>(
    initialType ?? 'field_diagnosis'
  );
  const [cropType, setCropType] = useState('水稻');
  const [issue, setIssue] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = cropType.trim() && address.trim() && preferredDate && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      showAlert('请补全作物类型、服务地址与期望上门时间');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        serviceType,
        cropType: cropType.trim(),
        plotAddress: address.trim(),
        preferredDate,
        // 问题描述暂存于 associatedProducts 无合适字段——notes 字段为契约预留位
        notes: issue.trim() || undefined,
        status: 'submitted',
      });
      showAlert('预约已提交！服务站将尽快指派持证农艺师与您联系。');
      setIssue('');
    } catch {
      // 错误详情由 api 层抛出、这里只恢复按钮
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="p-3 pb-28">
      <View className="text-[17px] font-extrabold text-on-surface mb-3">服务预约</View>

      {/* 选择服务类型 */}
      <View className="bg-surface-container-lowest rounded-2xl p-3.5 mb-3">
        <Text className="text-[13px] font-bold text-on-surface mb-2 block">选择服务类型</Text>
        <View className="space-y-2">
          {TYPE_OPTIONS.map((opt) => {
            const active = serviceType === opt.type;
            return (
              <View
                key={opt.type}
                onClick={() => setServiceType(opt.type)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${
                  active ? 'border-primary bg-surface-container-low' : 'border-surface-container-high'
                }`}
              >
                <View
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    active ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <Text className="material-symbols-outlined text-[20px]">{opt.icon}</Text>
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-[13px] font-bold text-on-surface">{opt.label}</Text>
                  <Text className="text-[10px] text-on-surface-variant block">{opt.desc}</Text>
                </View>
                {active && (
                  <Text className="material-symbols-outlined text-primary text-[18px]">check_circle</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* 表单 */}
      <View className="bg-surface-container-lowest rounded-2xl p-3.5 space-y-3">
        <View>
          <Text className="text-[12px] font-semibold text-on-surface-variant mb-1 block">作物类型</Text>
          <Input
            value={cropType}
            onInput={(e) => setCropType(e.detail.value)}
            placeholder="如：水稻、柑橘、蔬菜…"
            className="bg-surface-container rounded-lg px-3 py-2 text-[12px] text-on-surface"
          />
        </View>
        <View>
          <Text className="text-[12px] font-semibold text-on-surface-variant mb-1 block">问题描述</Text>
          <Textarea
            value={issue}
            onInput={(e) => setIssue(e.detail.value)}
            placeholder="请描述作物的生长情况、出现的问题…"
            maxLength={200}
            className="w-full bg-surface-container rounded-lg p-2.5 text-[12px] text-on-surface h-20"
          />
          <Text className="text-[10px] text-on-surface-variant text-right block mt-0.5">{issue.length}/200</Text>
        </View>
        <View>
          <Text className="text-[12px] font-semibold text-on-surface-variant mb-1 block">服务地址</Text>
          <Input
            value={address}
            onInput={(e) => setAddress(e.detail.value)}
            placeholder="如：湖南省长沙市长沙县某镇某村"
            className="bg-surface-container rounded-lg px-3 py-2 text-[12px] text-on-surface"
          />
        </View>
        <View>
          <Text className="text-[12px] font-semibold text-on-surface-variant mb-1 block">期望上门时间</Text>
          <Picker
            mode="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.detail.value)}
          >
            <View className="bg-surface-container rounded-lg px-3 py-2 text-[12px] flex items-center justify-between">
              <Text className={preferredDate ? 'text-on-surface' : 'text-on-surface-variant'}>
                {preferredDate || '请选择日期'}
              </Text>
              <Text className="material-symbols-outlined text-on-surface-variant text-[16px]">calendar_month</Text>
            </View>
          </Picker>
        </View>
      </View>

      {/* 提交 */}
      <Button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className={`w-full h-12 mt-4 rounded-xl text-white text-[14px] font-bold after:border-none ${
          canSubmit ? 'bg-primary active:scale-95' : 'bg-surface-container-high text-on-surface-variant'
        }`}
      >
        {submitting ? '提交中…' : '提交预约'}
      </Button>
    </View>
  );
};
