import React, { useState } from 'react';
import type { WorkOrder } from '../types/index.ts';

interface OrderDispatchProps {
  orders: WorkOrder[];
  onDispatchOrder: (orderId: string, technicianId?: string) => Promise<void>;
  onStepChange: (orderId: string, step: number) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const OrderDispatch: React.FC<OrderDispatchProps> = ({
  orders,
  onDispatchOrder,
  onStepChange,
  onShowToast,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '#ORD-20241028-0914');
  const [gridFilter, setGridFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessId, setDispatchSuccessId] = useState<string | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<WorkOrder>(
    orders.find((o) => o.id === '#ORD-20241028-0720') || orders[0]
  );
  const [showOrderDetailModal, setShowOrderDetailModal] = useState<WorkOrder | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const filteredOrders = orders.filter((o) => {
    if (gridFilter !== 'all' && !o.location.includes(gridFilter) && !o.gridCode.toLowerCase().includes(gridFilter.toLowerCase())) {
      return false;
    }
    if (serviceFilter !== 'all' && o.serviceCategory !== serviceFilter) return false;
    if (cropFilter !== 'all' && !o.crop.includes(cropFilter)) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && o.status !== 'pending_dispatch' && o.status !== 'exception') return false;
      if (statusFilter === 'completed' && o.status !== 'completed') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        o.id.toLowerCase().includes(q) ||
        o.farmerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.crop.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDispatch = async (techId?: string) => {
    if (!selectedOrder) return;
    try {
      setIsDispatching(true);
      await onDispatchOrder(selectedOrder.id, techId);
      setDispatchSuccessId(selectedOrder.id);
      onShowToast(`已指派技师！工单 ${selectedOrder.id} 电子密令与农资溯源箱号已推送微信端`, 'success');
      setTimeout(() => setDispatchSuccessId(null), 3000);
    } catch {
      onShowToast('派单异常，请重试', 'warning');
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
              待调度工单 (紧急待派)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[32px] font-extrabold text-on-surface font-mono tabular-nums">14</span>
              <span className="text-[12px] text-error font-bold font-mono">4单近超期</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[26px]">pending_actions</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              在线网格技师
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[32px] font-extrabold text-on-surface font-mono tabular-nums">38</span>
              <span className="text-[12px] text-on-surface-variant">/ 45人已上岗</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[26px]">groups</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              今日飞防与巡检作业面
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[32px] font-extrabold text-on-surface font-mono tabular-nums">1,420</span>
              <span className="text-[12px] text-on-surface-variant font-mono">亩 · 履约率 98.4%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[26px]">agriculture</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between shadow-xs border border-surface-container">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              气象/病害异常预警
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[32px] font-extrabold text-error font-mono tabular-nums">2</span>
              <span className="text-[12px] text-on-surface-variant">处路口镇强降雨暂缓</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[26px]">warning</span>
          </div>
        </div>
      </div>

      {/* Multi-dimensional Filters & Search Bar */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col gap-3 border border-surface-container">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Township Grid */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
              <span className="text-[12px] font-semibold text-on-surface-variant">所属网格:</span>
              <select
                value={gridFilter}
                onChange={(e) => setGridFilter(e.target.value)}
                className="bg-transparent text-[13px] font-medium text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="all">全网格 (长沙县重点片区)</option>
                <option value="安沙">安沙镇 (毛塘/黄旗/水塘网格)</option>
                <option value="路口">路口镇 (荆华/龙泉网格)</option>
                <option value="黄兴">黄兴镇 (打卦岭/仙人市网格)</option>
                <option value="高桥">高桥镇 (白石/高桥网格)</option>
              </select>
            </div>

            {/* Service Type */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-primary text-[18px]">medical_services</span>
              <span className="text-[12px] font-semibold text-on-surface-variant">服务类目:</span>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="bg-transparent text-[13px] font-medium text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="all">全部服务类型</option>
                <option value="diagnosis">植保上门诊断 (紧急)</option>
                <option value="drone">精准飞防作业</option>
                <option value="machinery">农机维保上门</option>
                <option value="soil">测土配方采样</option>
              </select>
            </div>

            {/* Crop Type */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
              <span className="text-[12px] font-semibold text-on-surface-variant">作物种类:</span>
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="bg-transparent text-[13px] font-medium text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="all">所有作物</option>
                <option value="稻">优质水稻 (早/晚稻)</option>
                <option value="柑橘">柑橘 / 蜜桔</option>
                <option value="油菜">油菜冬种基地</option>
                <option value="蔬菜">露地精细蔬菜</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
              <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
              <span className="text-[12px] font-semibold text-on-surface-variant">调度状态:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-[13px] font-medium text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="pending">待指派 (高优队列)</option>
                <option value="dispatched">已派待接单</option>
                <option value="completed">已验收结单</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                className="w-full pl-9 pr-3 py-1.5 bg-surface-container rounded-lg text-on-surface text-[13px] focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                placeholder="工单ID / 农户姓名 / 手机"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setGridFilter('all');
                setServiceFilter('all');
                setCropFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-[12px] font-medium transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>重置</span>
            </button>
          </div>
        </div>

        {/* Strategy Bar */}
        <div className="flex flex-wrap items-center justify-between pt-1 text-on-surface-variant text-[12px] border-t border-surface-container">
          <div className="flex items-center gap-2">
            <span className="text-on-surface font-semibold">当前命中调度策略:</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              乡镇网格5公里半径就近
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
              高级植保师专技优先
            </span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
              今日负荷 &lt; 4单
            </span>
          </div>
          <div>
            排队池检索耗时: <strong className="text-primary font-bold font-mono">18ms</strong> (无外部商用地图API依赖)
          </div>
        </div>
      </div>

      {/* Intelligent Grid Matching & Dispatch Matrix (Split View) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Pending Order Queue (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-3">
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-on-surface">待调度工单队列</h2>
                <p className="text-[12px] text-on-surface-variant">点击选择工单实时进行智能网格算力匹配</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
              3 笔加急
            </span>
          </div>

          {/* Tickets List */}
          <div className="flex flex-col gap-3">
            {filteredOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              const isDispatched = order.status === 'dispatched';

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-xl shadow-xs flex flex-col gap-3 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-surface-container-lowest border-l-4 border-l-primary border-primary/20 shadow-md ring-1 ring-primary/10'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low/60 border-surface-container'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-primary text-[14px] font-mono">{order.id}</span>
                        {order.urgency === 'critical' ? (
                          <span className="px-1.5 py-0.5 rounded bg-error text-on-error text-[10px] font-bold">
                            紧急加急
                          </span>
                        ) : order.urgency === 'high' ? (
                          <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                            飞防统防
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[10px]">
                            {order.urgencyText}
                          </span>
                        )}
                        {order.specialSubsidy && (
                          <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                            {order.specialSubsidy}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-1">
                        报单: {order.reportedTime} {order.waitingMinutes > 0 ? `(等待 ${order.waitingMinutes} 分钟)` : ''}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isDispatched
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {order.statusText}
                    </span>
                  </div>

                  <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1 text-[12px] border border-surface-container">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[17px]">person</span>
                        {order.farmerName} {order.coopName ? `(${order.coopName})` : ''}
                      </span>
                      {order.farmerName === '刘建国' && (
                        <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                          VIP大客户
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[16px]">share_location</span>
                      <span className="truncate">{order.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface pt-1">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-primary">potted_plant</span>
                        <span>
                          {order.crop} ({order.acreage} 亩)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-error">coronavirus</span>
                        <span className="text-error font-semibold truncate">{order.symptom}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[12px]">
                    <div className="flex items-center gap-1 text-on-surface-variant truncate mr-2">
                      <span className="font-semibold">诉求:</span>
                      <span className="text-on-surface truncate">{order.requestedAction}</span>
                    </div>
                    <span className="text-primary font-semibold shrink-0 flex items-center gap-0.5">
                      智能推荐 <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Technician Dispatch & Capacity Matching (7 cols) */}
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
                <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                <span>派发后将自动推送微信小程序通知、生成工单电子密令，并下发农资溯源箱号</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCallModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold flex items-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>电话沟通</span>
                </button>
                <button
                  onClick={() => handleDispatch('cand-001')}
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
                onClick={() => handleDispatch('cand-002')}
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
                    <span className="font-bold text-on-surface text-[13px]">陈惠芬 (资深植保研究员)</span>
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
      </div>

      {/* Real-time Service Status Tracking Table & Lifecycle Flow */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col gap-4 border border-surface-container">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-on-secondary">
              <span className="material-symbols-outlined text-[18px]">timeline</span>
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-on-surface">实时全流程作业追踪与履约监控</h2>
              <p className="text-[12px] text-on-surface-variant">
                标准履约五步节点：预约提交 → 技师接单 → 现场签到(实拍水印) → 开具电子处方 → 农户验收结单
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-lg border border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
            <span>国家农药可追溯编码与北斗水印已全部接入存证</span>
          </div>
        </div>

        {/* 5-Step Progress Timeline Card for Active Order */}
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 border border-surface-container">
          <div className="flex flex-wrap items-center justify-between text-on-surface text-[13px]">
            <div className="flex items-center gap-3">
              <span className="font-bold text-primary">正在履约监控: {activeTrackingOrder.id}</span>
              <span className="text-on-surface-variant text-[12px]">
                {activeTrackingOrder.farmerName} · {activeTrackingOrder.crop} · 技师:{' '}
                {activeTrackingOrder.assignedTechnician?.name || '王培根'}
              </span>
            </div>
            <div className="text-secondary font-bold text-[12px]">预计 30 分钟内完成农户数字化验收</div>
          </div>

          {/* 5-Step Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            {/* Step 1 */}
            <div
              onClick={() => onStepChange(activeTrackingOrder.id, 1)}
              className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-surface-container cursor-pointer hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold">
                  1
                </span>
                <span className="text-[11px] font-bold text-secondary">已完成</span>
              </div>
              <span className="font-bold text-on-surface text-[13px] mt-2">预约提交</span>
              <span className="text-[11px] text-on-surface-variant">07:20:15 微信端</span>
              <span className="text-[10px] text-on-surface-variant/80 mt-0.5">农户自主发起需求</span>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => onStepChange(activeTrackingOrder.id, 2)}
              className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-surface-container cursor-pointer hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold">
                  2
                </span>
                <span className="text-[11px] font-bold text-secondary">已完成</span>
              </div>
              <span className="font-bold text-on-surface text-[13px] mt-2">技师接单</span>
              <span className="text-[11px] text-on-surface-variant">07:26:40 调度指派</span>
              <span className="text-[10px] text-on-surface-variant/80 mt-0.5">耗时6分25秒响应</span>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => onStepChange(activeTrackingOrder.id, 3)}
              className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-surface-container cursor-pointer hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold">
                  3
                </span>
                <span className="text-[11px] font-bold text-secondary">已核验</span>
              </div>
              <span className="font-bold text-on-surface text-[13px] mt-2">现场签到(实拍水印)</span>
              <span className="text-[11px] text-on-surface-variant">08:05:12 田间抵达</span>
              <span className="text-[10px] text-primary font-bold mt-0.5">北斗时间水印核验通过</span>
            </div>

            {/* Step 4 */}
            <div
              onClick={() => onStepChange(activeTrackingOrder.id, 4)}
              className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border-2 border-primary cursor-pointer ring-1 ring-primary/20"
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold animate-pulse">
                  4
                </span>
                <span className="text-[11px] font-bold text-primary">作业中</span>
              </div>
              <span className="font-bold text-on-surface text-[13px] mt-2">开具电子处方</span>
              <span className="text-[11px] text-on-surface-variant">08:42:00 处方生成</span>
              <span className="text-[10px] text-on-surface-variant/80 mt-0.5">吡蚜酮+烯啶虫胺组合</span>
            </div>

            {/* Step 5 */}
            <div
              onClick={() => onStepChange(activeTrackingOrder.id, 5)}
              className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-surface-container opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-[11px] font-bold">
                  5
                </span>
                <span className="text-[11px] font-bold text-on-surface-variant">待确认</span>
              </div>
              <span className="font-bold text-on-surface text-[13px] mt-2">农户验收结单</span>
              <span className="text-[11px] text-on-surface-variant">预计 09:30</span>
              <span className="text-[10px] text-on-surface-variant/80 mt-0.5">手机短信+手写电子签名</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-semibold">
                <th className="py-2.5 px-3 rounded-l-lg">工单编号</th>
                <th className="py-2.5 px-3">农户与乡镇网格</th>
                <th className="py-2.5 px-3">作物 & 亩数</th>
                <th className="py-2.5 px-3">责任网格技师</th>
                <th className="py-2.5 px-3">电子处方/用药追溯码</th>
                <th className="py-2.5 px-3">当前状态</th>
                <th className="py-2.5 px-3">现场水印核验</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-on-surface">
              {orders.slice(0, 6).map((ord) => {
                const isException = ord.status === 'exception';

                return (
                  <tr
                    key={ord.id}
                    onClick={() => setActiveTrackingOrder(ord)}
                    className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                  >
                    <td className={`py-3 px-3 font-bold font-mono ${isException ? 'text-error' : 'text-primary'}`}>
                      {ord.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-[13px]">{ord.farmerName}</span>
                        <span className="text-on-surface-variant text-[11px] truncate max-w-[160px]">
                          {ord.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-medium font-mono">
                        {ord.crop} · {ord.acreage}亩
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[12px]">
                          {ord.assignedTechnician?.name || '王培根 (持证)'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      {ord.prescriptionCode ? (
                        <span className="bg-surface-container px-2 py-0.5 rounded text-primary font-bold">
                          {ord.prescriptionCode}
                        </span>
                      ) : (
                        <span className="text-on-surface-variant">尚未开方</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {ord.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[13px]">task_alt</span>
                          已验收结单
                        </span>
                      ) : ord.status === 'exception' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                          接单超时预警
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          {ord.statusText}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[12px]">
                      {ord.watermarkVerified ? (
                        <span className="text-secondary font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">check_circle</span>
                          实拍水印已核实
                        </span>
                      ) : (
                        <span className="text-on-surface-variant">等待签到中</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowOrderDetailModal(ord);
                          }}
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-colors"
                          type="button"
                        >
                          详情
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowToast(`已启动工单 ${ord.id} 音视频云调度信道！`, 'info');
                          }}
                          className="px-2.5 py-1 rounded bg-primary text-on-primary text-[12px] font-medium transition-colors shadow-xs"
                          type="button"
                        >
                          音视频跟进
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetailModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowOrderDetailModal(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 relative shadow-2xl border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">description</span>
                <h3 className="font-bold text-primary text-[16px]">
                  工单全程履约数字凭证 · {showOrderDetailModal.id}
                </h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setShowOrderDetailModal(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-3 text-[13px]">
              <div className="p-3 bg-surface-container-low rounded-xl space-y-1.5 border border-surface-container">
                <div className="flex justify-between font-medium">
                  <span className="text-on-surface-variant">农户姓名:</span>
                  <span className="font-bold text-on-surface">{showOrderDetailModal.farmerName}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-on-surface-variant">作业地块:</span>
                  <span className="text-on-surface">{showOrderDetailModal.location}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-on-surface-variant">作物与面积:</span>
                  <span className="font-mono text-primary font-bold">
                    {showOrderDetailModal.crop} · {showOrderDetailModal.acreage} 亩
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-on-surface-variant">实地诊断靶标:</span>
                  <span className="text-error font-bold">{showOrderDetailModal.symptom}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-on-surface-variant">电子处方编码:</span>
                  <span className="font-mono font-bold text-secondary">
                    {showOrderDetailModal.prescriptionCode || 'RX-HN-20241028-0842'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-surface-container flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
                onClick={() => setShowOrderDetailModal(null)}
              >
                关闭
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold"
                onClick={() => {
                  onShowToast(`已下载工单 ${showOrderDetailModal.id} 的国家标准化植保履约验收报告.pdf`, 'success');
                  setShowOrderDetailModal(null);
                }}
              >
                下载国家验收报告
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Call Modal */}
      {showCallModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowCallModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 text-center relative shadow-2xl border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[32px] animate-bounce">call</span>
            </div>
            <h3 className="font-bold text-on-surface text-[17px]">正在呼叫一线网格专员</h3>
            <p className="text-[13px] text-on-surface-variant mt-1">张茂林 (农艺师) · 139****2210</p>
            <p className="text-[12px] text-secondary font-medium mt-2">
              专线电话已建立 · 通话全程进行农业服务合规录音存证
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowCallModal(false)}
                className="px-6 py-2 rounded-lg bg-error text-on-error text-[13px] font-bold shadow-xs hover:bg-error/90"
              >
                挂断通话
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
