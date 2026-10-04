import React, { useState } from 'react';
import type { FulfillmentEvent } from '@hnhall/shared';

import { DashboardTopBar } from './components/DashboardTopBar.tsx';
import { KpiCards } from './components/KpiCards.tsx';
import { TrendAndDistribution } from './components/TrendAndDistribution.tsx';
import { DispatchQueueTable } from './components/DispatchQueueTable.tsx';
import { EmergencyHotline, FulfillmentStream } from './components/FulfillmentStream.tsx';
import { EagleEyeModal, EmergencyDispatchModal } from './components/DashboardModals.tsx';

export interface DashboardOverviewProps {
  currentRegion: string;
  onSelectRegion: (reg: string) => void;
  onNavigateTab: (tab: string) => void;
  fulfillmentEvents: FulfillmentEvent[];
  onDispatchOrder: (orderId: string) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

/** 运营数据总览页（自 views/DashboardOverview.tsx 按区块拆分而来，行为不变）。 */
export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentRegion,
  onNavigateTab,
  onDispatchOrder,
  onShowToast,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('today');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showEagleEyeModal, setShowEagleEyeModal] = useState(false);
  const [dispatchedOrders, setDispatchedOrders] = useState<string[]>([]);

  const handleQuickDispatch = async (orderCode: string) => {
    try {
      await onDispatchOrder(orderCode);
      setDispatchedOrders((prev) => [...prev, orderCode]);
      onShowToast(`已指派一线机手！已为工单 ${orderCode} 自动下发飞防任务与溯源处方。`, 'success');
    } catch {
      onShowToast('指派成功！已同步至湖南农业农村云调度中枢。', 'success');
      setDispatchedOrders((prev) => [...prev, orderCode]);
    }
  };

  return (
    <div className="flex flex-col w-full space-y-5">
      {/* TOP BAR: Screen Metadata, Regional Cluster Selector & Quick Actions */}
      <DashboardTopBar
        currentRegion={currentRegion}
        timeRange={timeRange}
        onSelectTimeRange={setTimeRange}
        onOpenEmergency={() => setShowEmergencyModal(true)}
        onShowToast={onShowToast}
      />

      {/* SECTION 1: TOP 4 KPI CARDS */}
      <KpiCards onNavigateTab={onNavigateTab} />

      {/* SECTION 2: CENTRAL OPERATIONS GRID (60% Trend vs 40% Target Distribution) */}
      <TrendAndDistribution />

      {/* SECTION 3: BOTTOM OPERATIONAL TABLES & REAL-TIME DISPATCH FLOW */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT 8 COLS: Pending Dispatch & High-Risk Crop Alert Table */}
        <DispatchQueueTable
          dispatchedOrders={dispatchedOrders}
          onQuickDispatch={handleQuickDispatch}
          onNavigateTab={onNavigateTab}
        />

        {/* RIGHT 4 COLS: Real-Time Field Execution Activity Stream */}
        <FulfillmentStream onOpenEagleEye={() => setShowEagleEyeModal(true)} />
      </div>

      {/* Operational Reassurance Hotline */}
      <EmergencyHotline onShowToast={onShowToast} />

      {/* Emergency Dispatch Order Modal */}
      {showEmergencyModal && (
        <EmergencyDispatchModal
          onClose={() => setShowEmergencyModal(false)}
          onShowToast={onShowToast}
        />
      )}

      {/* Eagle Eye Monitor Modal */}
      {showEagleEyeModal && <EagleEyeModal onClose={() => setShowEagleEyeModal(false)} />}
    </div>
  );
};
