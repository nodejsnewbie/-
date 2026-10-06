import { showAlert } from '../utils/platform';
import { formatCents, formatRelativeTime } from '../utils/format';
import { Button, Image, Text, View } from '@tarojs/components';
import React, { useState } from 'react';
import { TechnicianProfile, AmoebaStat, TeamMemberFeed, RevenueTransaction } from '../types';

interface AmoebaBonusViewProps {
  technician: TechnicianProfile;
  stats: AmoebaStat;
  feeds: TeamMemberFeed[];
  transactions: RevenueTransaction[];
  onOpenWithdraw: () => void;
  onOpenOptionAgreement: () => void;
  onOpenRecruitPoster: () => void;
}

export const AmoebaBonusView: React.FC<AmoebaBonusViewProps> = ({
  technician,
  stats,
  feeds,
  transactions,
  onOpenWithdraw,
  onOpenOptionAgreement,
  onOpenRecruitPoster,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'service' | 'prescription' | 'referral'>('all');

  const filteredTx = transactions.filter((t) => {
    if (filterType === 'all') return true;
    if (filterType === 'service') return t.type === 'service' || t.type === 'mixed';
    if (filterType === 'prescription') return t.type === 'prescription' || t.type === 'mixed';
    if (filterType === 'referral') return t.type === 'referral';
    return true;
  });

  return (
    <View className="flex flex-col w-full px-3 space-y-3 pb-24 select-none">
      {/* 1. 合伙人身份与股权激励卡 */}
      <View className="relative overflow-hidden rounded-xl bg-primary text-white shadow-md p-3.5 border border-primary/20">
        {/* Ambient gold/green particle glow overlay */}
        <View className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-amber-400/20 blur-2xl pointer-events-none"></View>
        <View className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-emerald-400/20 blur-xl pointer-events-none"></View>

        <View className="relative z-10 flex flex-col space-y-2">
          {/* Top Level Tag & Amoeba Unit */}
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-1.5 bg-primary-container/90 px-2.5 py-1 rounded-full text-white text-xs font-semibold">
              <Text className="material-symbols-outlined text-[15px] text-amber-300 material-symbols-filled">
                military_tech
              </Text>
              <Text>黄金级合伙人</Text>
              <Text className="text-[10px] text-amber-200 font-mono ml-0.5">
                {technician.partnerCode}
              </Text>
            </View>
          </View>

          {/* Partner Identity Header */}
          <View className="flex items-center justify-between pt-1">
            <View className="min-w-0">
              <View className="flex items-baseline gap-1.5">
                <Text className="text-[20px] text-white font-extrabold tracking-tight">
                  {technician.name}
                </Text>
                <Text className="text-xs text-green-200">· {technician.role}</Text>
              </View>
              <View className="flex items-center gap-1 text-green-100 text-[11px] mt-0.5">
                <Text className="material-symbols-outlined text-[13px] text-emerald-300">
                  diversity_3
                </Text>
                <Text className="truncate">{technician.groupName}</Text>
              </View>
            </View>

            <View className="flex flex-col items-end shrink-0 pl-2">
              <Text className="text-[10px] text-green-200">小组排名</Text>
              <View className="flex items-center gap-0.5 text-amber-300">
                <Text className="text-xs">第</Text>
                <Text className="font-extrabold text-[20px] leading-none">
                  {technician.groupRank}
                </Text>
                <Text className="text-xs">名</Text>
              </View>
            </View>
          </View>

          {/* Equity & Amoeba Note */}
          <View className="bg-white/10 rounded-lg p-2 flex items-center justify-between text-[11px] text-green-50 mt-1">
            <View className="flex items-center gap-1 min-w-0">
              <Text className="material-symbols-outlined text-[14px] text-amber-200 shrink-0">
                handshake
              </Text>
              <Text className="truncate">技术骨干持股计划 · 个人即平台共建中</Text>
            </View>
            <Button
              onClick={onOpenOptionAgreement}
              className="shrink-0 text-amber-200 font-bold text-[11px] flex items-center hover:opacity-80 transition-opacity cursor-pointer"
            >
              期权协议 <Text className="material-symbols-outlined text-[13px]">arrow_forward</Text>
            </Button>
          </View>
        </View>
      </View>

      {/* 2. 收益核心仪表盘 */}
      <View className="rounded-xl bg-surface-container-lowest shadow-xs p-3.5 space-y-3">
        {/* Total Revenue Head */}
        <View className="flex items-start justify-between">
          <View>
            <View className="flex items-center gap-1 text-on-surface-variant text-xs font-semibold">
              <Text>本月累计总收益</Text>
              <Text
                className="material-symbols-outlined text-[14px] cursor-pointer text-outline"
                title="阿米巴自主核算周期收益：仅来自上门服务的「服务净值」分成（最终分档口径与税目以公司确认制度为准）"
                onClick={() =>
                  showAlert(
                    '阿米巴核算口径（建议值，待确认）：\n1. 分红仅来自上门服务收入（服务净值），不含药剂销售\n2. 服务费按服务净值计提分成\n3. 具体分档系数与税目以公司确认的阿米巴制度为准'
                  )
                }
              >
                help
              </Text>
            </View>
            <View className="flex items-baseline gap-1 mt-1">
              <Text className="text-primary text-[26px] font-extrabold tracking-tight">
                ¥{formatCents(stats.totalMonthIncomeCents)}
              </Text>
              <View className="flex items-center text-primary-container text-xs font-bold ml-1">
                <Text className="material-symbols-outlined text-[14px]">trending_up</Text>
                <Text>+{stats.growthPct}%</Text>
              </View>
            </View>
            <Text className="text-[11px] text-outline">较上月同比超额增长，含服务工单与处方提成</Text>
          </View>

          {/* Fast Settlement CTA */}
          <Button
            onClick={onOpenWithdraw}
            className="flex flex-col items-center justify-center bg-primary-container hover:bg-primary active:scale-95 text-white rounded-xl px-3 py-2 shadow-xs transition-transform shrink-0 cursor-pointer"
          >
            <View className="flex items-center gap-1 text-xs font-bold">
              <Text className="material-symbols-outlined text-[17px]">account_balance_wallet</Text>
              <Text>收益提现</Text>
            </View>
            <Text className="text-[9px] text-emerald-200 mt-0.5">微信/银行卡实时付</Text>
          </Button>
        </View>

        {/* Sub-Metrics Bento Grid（口径 R7：分红仅来自服务收入，无处方/团队/股权等其它收益项） */}
        <View className="grid grid-cols-2 gap-2.5">
          {/* 1: Service Commission */}
          <View className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between space-y-1">
            <View className="flex items-center justify-between text-on-surface-variant">
              <Text className="text-xs font-semibold">上门服务提成</Text>
              <Text className="material-symbols-outlined text-primary text-[17px]">agriculture</Text>
            </View>
            <View>
              <View className="text-on-surface text-[17px] font-extrabold">
                ¥{formatCents(stats.serviceCommissionCents)}
              </View>
              <View className="text-[11px] text-on-surface-variant flex items-center justify-between">
                <Text>本月完成作业服务</Text>
                <Text className="text-primary font-bold">100%履约</Text>
              </View>
            </View>
          </View>

          {/* 2: Service Tasks Count */}
          <View className="bg-surface-container-low rounded-lg p-2.5 flex flex-col justify-between space-y-1">
            <View className="flex items-center justify-between text-on-surface-variant">
              <Text className="text-xs font-semibold">本月服务单量</Text>
              <Text className="material-symbols-outlined text-secondary text-[17px]">task_alt</Text>
            </View>
            <View>
              <View className="text-on-surface text-[17px] font-extrabold">
                {stats.serviceTasksCount} 单
              </View>
              <View className="text-[11px] text-on-surface-variant truncate">
                已验收结算工单
              </View>
            </View>
          </View>
        </View>

        {/* Reserved: 收益分项（R7 口径当前仅服务收入分成，以下能力预留·待接入，不伪造金额） */}
        <View className="rounded-lg border border-dashed border-surface-container-high bg-surface-container-low/50 p-2.5 space-y-1.5">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[15px] text-outline">
              insights
            </Text>
            <Text className="text-[12px] font-bold text-on-surface-variant">
              更多收益分项（预留 · 待接入）
            </Text>
          </View>
          <Text className="text-[10px] text-on-surface-variant leading-snug">
            阿米巴分红口径以客户与财务确认的制度为准；以下分项当前不产数，接入后自动显示真值。
          </Text>
          <View className="grid grid-cols-2 gap-1.5 pt-0.5">
            {(
              [
                ['开方分红', stats.prescriptionDividend],
                ['推荐分红', stats.teamReferralDividend],
                ['期权预支', stats.equityPreDraw],
                ['分档系数', technician.incentiveMultiplier],
              ] as const
            ).map(([fallbackLabel, cap]) => (
              <View
                key={fallbackLabel}
                className="flex items-center justify-between px-2 py-1.5 rounded bg-surface-container"
              >
                <Text className="text-[11px] text-on-surface">{cap?.label ?? fallbackLabel}</Text>
                {cap?.enabled && cap?.value !== null ? (
                  <Text className="text-[11px] font-bold text-primary">{String(cap.value)}</Text>
                ) : (
                  <Text className="text-[10px] font-bold text-on-surface-variant">待接入</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Tax Compliance Guarantee Bar */}
        <View className="flex items-center justify-between bg-surface-container px-2.5 py-1.5 rounded-lg text-[11px] text-on-surface-variant">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-[15px] text-primary">verified_user</Text>
            <Text>华农企业资质合规代扣代缴个税 · 资金银行直管</Text>
          </View>
          <Text className="material-symbols-outlined text-[14px] text-outline">chevron_right</Text>
        </View>
      </View>

      {/* 3. 阿米巴团队战绩与战报实时广播 */}
      <View className="rounded-xl bg-surface-container-lowest shadow-xs p-3.5 space-y-2.5">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <View className="w-2 h-2 rounded-full bg-secondary-container"></View>
            <Text className="text-sm font-bold text-on-surface">安沙创客小组战报</Text>
          </View>
          <Text className="bg-secondary-container text-on-secondary-container text-[11px] px-2 py-0.5 rounded-full font-bold">
            超额奖金池已解锁
          </Text>
        </View>

        {/* Progress Metric Bar */}
        <View className="bg-surface-container-low rounded-lg p-3 space-y-2">
          <View className="flex items-baseline justify-between text-xs">
            <Text className="text-on-surface-variant font-medium">本月小组目标达成率</Text>
            <View className="flex items-baseline gap-1">
              <Text className="text-[18px] font-extrabold text-primary">
                {stats.groupTargetRate}%
              </Text>
              <Text className="text-[11px] text-outline">/ {stats.groupBaseline}%基准</Text>
            </View>
          </View>

          {/* Visual ProgressBar */}
          <View className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
            <View
              className="bg-primary-container h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(stats.groupTargetRate, 100)}%` }}
            ></View>
          </View>

          <View className="flex items-center justify-between text-[11px] text-outline">
            <Text>考核线 (100万服务值)</Text>
            <Text className="text-secondary font-bold">{stats.groupTierBonus}</Text>
          </View>
        </View>

        {/* Real-time Team Activity Pill */}
        {feeds.map((feed) => (
          <View
            key={feed.id}
            className="flex items-center gap-2 bg-surface-container-high/60 rounded-lg p-2.5 text-xs text-on-surface-variant"
          >
            <View className="relative shrink-0">
              <Image
                className="w-7 h-7 rounded-full object-cover"
                alt={feed.name}
                src={feed.avatar}
              />
              <Text className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary-container border-2 border-surface-container-lowest"></Text>
            </View>
            <View className="min-w-0 flex-1 truncate">
              <Text className="font-bold text-on-surface">{feed.name}</Text>
              <Text className="text-on-surface-variant ml-1">{feed.action}</Text>
              <Text className="text-primary font-semibold ml-0.5">{feed.target}</Text>
            </View>
            <View className="shrink-0 flex items-center text-primary-container font-bold text-xs">
              <Text>{feed.points}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 4. 最近收益明细流水清单 */}
      <View className="rounded-xl bg-surface-container-lowest shadow-xs p-3.5 space-y-2.5">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-1.5">
            <Text className="material-symbols-outlined text-primary text-[18px]">receipt_long</Text>
            <Text className="text-sm font-bold text-on-surface">收益流水账单</Text>
          </View>
          {/* Filter Pills */}
          <View className="flex items-center gap-1">
            <Button
              onClick={() => setFilterType('all')}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                filterType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              全部
            </Button>
            <Button
              onClick={() => setFilterType('service')}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                filterType === 'service'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              工单
            </Button>
            <Button
              onClick={() => setFilterType('prescription')}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                filterType === 'prescription'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              处方
            </Button>
          </View>
        </View>

        <View className="space-y-2 pt-1">
          {filteredTx.map((tx) => (
            <View
              key={tx.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low transition-colors"
            >
              <View className="flex items-center gap-2.5 min-w-0">
                <View
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                    tx.type === 'service'
                      ? 'bg-emerald-700'
                      : tx.type === 'prescription'
                      ? 'bg-amber-700'
                      : tx.type === 'referral'
                      ? 'bg-teal-700'
                      : 'bg-primary'
                  }`}
                >
                  <Text className="material-symbols-outlined text-[17px]">
                    {tx.type === 'service'
                      ? 'agriculture'
                      : tx.type === 'prescription'
                      ? 'medication_liquid'
                      : tx.type === 'referral'
                      ? 'person_add'
                      : 'payments'}
                  </Text>
                </View>
                <View className="min-w-0">
                  <View className="text-xs text-on-surface font-bold truncate">{tx.title}</View>
                  <View className="text-[11px] text-outline truncate">{tx.sub}</View>
                </View>
              </View>
              <View className="text-right shrink-0 pl-2">
                <View className="text-primary-container text-sm font-extrabold leading-tight">
                  +¥{formatCents(tx.amountCents)}
                </View>
                <View className="text-[10px] text-outline">{formatRelativeTime(tx.time)}</View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 5. 青年新农人合伙人计划招募横幅 */}
      <View className="rounded-xl bg-gradient-to-r from-primary-container to-secondary text-white p-3.5 shadow-xs relative overflow-hidden">
        <View className="relative z-10 flex flex-col space-y-2">
          <View className="flex items-center justify-between">
            <Text className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full text-[10px] font-bold">
              青年英才招募计划
            </Text>
            <Text className="text-emerald-200 text-[11px] font-semibold">服务分成 · 长期合伙</Text>
          </View>
          <View>
            <Text className="text-sm font-bold leading-snug">推荐优秀农校毕业生 / 持证农艺师入驻</Text>
            <Text className="text-xs text-green-100 mt-1 leading-relaxed">
              技术骨干与个人平台的无缝融合，让每一个新农人成为合伙人。推荐持证植保师入驻即可共享服务分成收益。
            </Text>
          </View>
          <View className="pt-1">
            <Button
              onClick={onOpenRecruitPoster}
              className="w-full bg-white text-primary active:scale-[0.98] text-xs py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-transform cursor-pointer hover:bg-gray-50"
            >
              <Text className="material-symbols-outlined text-[18px]">qr_code_scanner</Text>
              <Text>生成专属招募海报 & 推荐链接</Text>
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};
