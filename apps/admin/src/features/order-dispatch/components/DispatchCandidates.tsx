import React from 'react';
import type { WorkOrder } from '@hnhall/shared';

interface DispatchCandidatesProps {
  selectedOrder: WorkOrder | undefined;
  isDispatching: boolean;
  dispatchSuccessId: string | null;
  onDispatch: (techId?: string) => void;
  onOpenCall: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

/** 右栏：当前派发目标横幅 + 3 位候选技师卡片（自 OrderDispatch 原样迁入）。 */
export const DispatchCandidates: React.FC<DispatchCandidatesProps> = ({
  selectedOrder,
  isDispatching,
  dispatchSuccessId,
  onDispatch,
  onOpenCall,
  onShowToast,
}) => {
  return (
    <div className="xl:col-span-7 flex flex-col gap-3">
      {/* Active Target Order Banner */}
      <div className="bg-primary-container text-on-primary p-4 rounded-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[15px]">当前派发目标: {selectedOrder?.id}</span>
              <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">
                {selectedOrder?.crop}
              </span>
            </div>
            <span className="text-[12px] text-inverse-primary">
              目标网格: {selectedOrder?.location} · 调度算法已按网格直线测距与专长加权智能排序
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[12px] bg-surface-container-lowest/15 px-3 py-1 rounded-lg">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>三证验真保障中</span>
        </div>
      </div>

      {/* Candidate 1 - Top Matched */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 relative overflow-hidden border border-surface-container">
        <div className="absolute right-0 top-0 bg-primary px-3 py-1 rounded-bl-xl text-on-primary text-[11px] font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">stars</span>
          <span>首选推荐 · 匹配度 98.6%</span>
        </div>

        {/* Profile */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                className="w-16 h-16 rounded-xl object-cover border border-surface-container"
                alt="张茂林 农艺师"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo9nFxQhBBbek7LKbtOgaKd5768mxKCDJhBexUHKqZaQlgjSAdreqs7Gasmim5Zzr1d_7_aA21F_FTTIK1bfCrpTB-RGZSFOfOsX7MjaTo0mgUttFJrD8CB6Vyj1xYzItT-JpLj8k3P2FmP3AcrI5Isax3R0-xnWKKyRHT6jDLZz5qF8cbCLyZcLt_LsGV3UFj-vqJ68GRNzI5zkSoUHhzle-X8PrU4KuHjDbRvSd2Km7Q5qpb3-_8"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-on-surface">张茂林 (农艺师)</span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                  高级植保师
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px]">
                  安沙镇驻点组长
                </span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant text-[12px] mt-1">
                <span>
                  所属网格: <strong>安沙镇片区</strong>
                </span>
                <span>
                  直线测算网格距: <strong className="text-primary font-bold">2.1 km</strong>
                </span>
                <span>
                  预计达现场: <strong>22 分钟</strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant text-[11px] mt-1">
                <span className="material-symbols-outlined text-secondary text-[16px]">policy</span>
                <span>农药经营与处方资质: 湘20240018已校验有效 (至2027年)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Capability & Load Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-surface-container-low p-3 rounded-xl border border-surface-container text-[12px]">
          <div className="flex flex-col">
            <span className="text-on-surface-variant text-[11px]">今日负荷</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[15px] font-bold text-primary font-mono">1单</span>
              <span className="text-on-surface-variant text-[11px]">/ 最大4单 (充裕)</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant text-[11px]">历史综合好评率</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[15px] font-bold text-on-surface font-mono">99.8%</span>
              <span className="text-secondary text-[11px]">420次作业</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant text-[11px]">水稻病害专业评级</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[14px] font-bold text-on-surface">S级专精</span>
              <span className="text-on-surface-variant text-[10px]">精准开方</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface-variant text-[11px]">当前实时状态</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-bold text-secondary text-[12px]">就近待命中</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-surface-container">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              verified_user
            </span>
            <span>派发后将自动推送微信小程序通知、生成工单电子密令，并下发农资溯源箱号</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCall}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold flex items-center gap-1 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span>电话沟通</span>
            </button>
            <button
              onClick={() => onDispatch('cand-001')}
              disabled={isDispatching}
              className={`px-5 py-2 rounded-lg text-on-primary text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                dispatchSuccessId === selectedOrder?.id
                  ? 'bg-secondary'
                  : 'bg-primary hover:bg-primary-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {dispatchSuccessId === selectedOrder?.id ? 'check' : 'send'}
              </span>
              <span>
                {dispatchSuccessId === selectedOrder?.id
                  ? '派单成功 · 已下发通知'
                  : isDispatching
                    ? '派单中...'
                    : '指派立即派单'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Candidate 2 */}
      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs flex flex-col gap-2 border border-surface-container">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img
              className="w-11 h-11 rounded-lg object-cover"
              alt="李国锋"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ2rvcDQcZnOiqLgMTUrM7uPxbt7Tdd6VQYiKZVTjHNi57vqDvScY3Jw1dYY-2FosE-vc_bJWBY4VCW3FmS9C4DzRBToV-2NyX42Jxr6BaMFx2xLZDXRzjbh7LELi9dWm7y7TLgJxg0xn86A5REW1Hut3AhadXpsQlNZwvaw4nL1F1QQQnUy-dFVw2TvhkeeXG6H8El5idujJfIqZVdMGyUUzaXWImhDNfF9KlU7BmczPN8X-0n6Pl"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-on-surface text-[13px]">李国锋 (持证农艺师)</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant text-[10px]">
                  民用无人机驾驶员
                </span>
                <span className="text-on-surface-variant text-[11px]">安沙毛塘网格</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant text-[11px] mt-0.5">
                <span>
                  网格距离: <strong>3.8 km</strong>
                </span>
                <span>
                  负荷: <strong>2单进行中</strong> (可协调)
                </span>
                <span>
                  好评率: <strong>99.1%</strong>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onDispatch('cand-002')}
            className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold"
            type="button"
          >
            改派 / 备选
          </button>
        </div>
      </div>

      {/* Candidate 3 */}
      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs flex flex-col gap-2 border border-surface-container">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <img
              className="w-11 h-11 rounded-lg object-cover"
              alt="陈惠芬"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhqEeKp9F10UHxO2QI4bBHy5yDuSlofdFJvzrItvEA8GWXnchomlnfJc5AD7ZEN6njKU5qzQbYMStqMei2A5o9xVl_T42w4Eimu69j_etL3OKyX6JEC40ABQSl3EGXzS9N8frXQbK_T0bgYfkMgzziImIcSVUadRdoKQW0sQT60R3WNe3ZHVPvE7bR81ZkI47wYwhok8ancNLnVyv3-4xFzKYAy7MxNYuAvC0gtqjrgPb_unSzbE1Y"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-on-surface text-[13px]">
                  陈惠芬 (资深植保研究员)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                  研究员级高级农艺师
                </span>
                <span className="text-on-surface-variant text-[11px]">全县专家组</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant text-[11px] mt-0.5">
                <span>
                  网格距离: <strong>5.4 km</strong>
                </span>
                <span>
                  负荷: <strong>0单 (特邀指导)</strong>
                </span>
                <span>
                  好评率: <strong>100%</strong>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              onShowToast('已向陈惠芬研究员发起专家特邀远程会诊申请！', 'success');
            }}
            className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold"
            type="button"
          >
            指派专家会诊
          </button>
        </div>
      </div>
    </div>
  );
};
