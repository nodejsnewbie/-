import { showAlert } from '../utils/platform';
import { Button, Input, Text, View } from '@tarojs/components';
import React, { useState } from 'react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onConfirmWithdraw: (amount: number, channel: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onConfirmWithdraw,
}) => {
  const [amount, setAmount] = useState<string>(availableBalance.toString());
  const [channel, setChannel] = useState<'wechat' | 'bank_abc' | 'bank_cmb'>('wechat');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;

  const handleWithdraw = () => {
    if (numAmount <= 0 || numAmount > availableBalance) {
      showAlert('请输入有效的提现金额！');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmWithdraw(numAmount, channel);
      showAlert(`已成功发起提现 ¥${numAmount.toFixed(2)}！资金将实时划拨入账。`);
      onClose();
    }, 700);
  };

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm select-none">
      <View className="bg-surface-container-lowest w-full max-w-[390px] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <View className="h-12 px-3 bg-primary text-white flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[18px]">account_balance_wallet</Text>
            <Text className="font-bold text-xs">收益提现 · 资金银行直管</Text>
          </View>
          <Button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
          >
            <Text className="material-symbols-outlined text-[20px]">close</Text>
          </Button>
        </View>

        {/* Form Body */}
        <View className="p-3.5 space-y-3">
          {/* Account Channel Selector */}
          <View>
            <Text className="text-xs font-semibold text-on-surface">选择到账账户:</Text>
            <View className="grid grid-cols-3 gap-2 mt-1.5">
              <Button
                onClick={() => setChannel('wechat')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  channel === 'wechat'
                    ? 'border-primary bg-primary-fixed/20 text-primary font-bold'
                    : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <View className="text-xs">微信零钱</View>
                <View className="text-[10px] text-outline mt-0.5">秒级到账</View>
              </Button>

              <Button
                onClick={() => setChannel('bank_abc')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  channel === 'bank_abc'
                    ? 'border-primary bg-primary-fixed/20 text-primary font-bold'
                    : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <View className="text-xs">中国农业银行</View>
                <View className="text-[10px] text-outline mt-0.5">尾号 8819</View>
              </Button>

              <Button
                onClick={() => setChannel('bank_cmb')}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  channel === 'bank_cmb'
                    ? 'border-primary bg-primary-fixed/20 text-primary font-bold'
                    : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                }`}
              >
                <View className="text-xs">招商银行卡</View>
                <View className="text-[10px] text-outline mt-0.5">尾号 4201</View>
              </Button>
            </View>
          </View>

          {/* Amount Input */}
          <View className="bg-surface-container-low p-3 rounded-xl border border-surface-container space-y-1">
            <View className="flex items-center justify-between text-xs text-on-surface-variant">
              <Text>提现金额</Text>
              <Text>
                可用余额: <Text className="font-mono text-primary">¥{availableBalance.toFixed(2)}</Text>
              </Text>
            </View>
            <View className="flex items-baseline gap-1 pt-1">
              <Text className="text-xl font-bold text-on-surface">¥</Text>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.detail.value)}
                className="w-full bg-transparent text-2xl font-extrabold text-on-surface font-mono focus:outline-none"
              />
              <Button
                onClick={() => setAmount(availableBalance.toString())}
                className="text-xs text-primary font-bold whitespace-nowrap cursor-pointer hover:underline"
              >
                全部提现
              </Button>
            </View>
          </View>

          {/* Tax & Fee Free Note */}
          <View className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs space-y-0.5">
            <View className="font-bold flex items-center gap-1">
              <Text className="material-symbols-outlined text-[15px] text-emerald-700">
                check_circle
              </Text>
              <Text>合伙人专属免手续费通道</Text>
            </View>
            <Text className="text-[11px] text-emerald-800">
              平台已依法代扣代缴经营个税，所提金额为税后纯收益，无需技师另行报税。
            </Text>
          </View>
        </View>

        {/* Action Dock */}
        <View className="p-3 bg-surface-container-lowest border-t border-surface-container">
          <Button
            disabled={isProcessing || numAmount <= 0}
            onClick={handleWithdraw}
            className="w-full h-11 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <Text className="material-symbols-outlined text-[18px] animate-spin">sync</Text>
            ) : (
              <Text className="material-symbols-outlined text-[18px]">payments</Text>
            )}
            <Text>确认提现 ¥{numAmount.toFixed(2)}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
