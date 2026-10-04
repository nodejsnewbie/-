import React, { useState } from 'react';
import type { WorkOrder } from '@hnhall/shared';

import { DispatchMetricsBar } from './components/DispatchMetricsBar.tsx';
import { DispatchFilters } from './components/DispatchFilters.tsx';
import { OrderQueue } from './components/OrderQueue.tsx';
import { DispatchCandidates } from './components/DispatchCandidates.tsx';
import { TrackingPanel } from './components/TrackingPanel.tsx';
import { CallModal, OrderDetailModal } from './components/DispatchModals.tsx';

export interface OrderDispatchProps {
  orders: WorkOrder[];
  onDispatchOrder: (orderId: string, technicianId?: string) => Promise<void>;
  onStepChange: (orderId: string, step: number) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

/** 订单调度与派单页（自 views/OrderDispatch.tsx 按区块拆分而来，行为不变）。 */
export const OrderDispatch: React.FC<OrderDispatchProps> = ({
  orders,
  onDispatchOrder,
  onStepChange,
  onShowToast,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id || '#ORD-20241028-0914',
  );
  const [gridFilter, setGridFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessId, setDispatchSuccessId] = useState<string | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<WorkOrder>(
    orders.find((o) => o.id === '#ORD-20241028-0720') || orders[0],
  );
  const [showOrderDetailModal, setShowOrderDetailModal] = useState<WorkOrder | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const filteredOrders = orders.filter((o) => {
    if (
      gridFilter !== 'all' &&
      !o.location.includes(gridFilter) &&
      !o.gridCode.toLowerCase().includes(gridFilter.toLowerCase())
    ) {
      return false;
    }
    if (serviceFilter !== 'all' && o.serviceCategory !== serviceFilter) return false;
    if (cropFilter !== 'all' && !o.crop.includes(cropFilter)) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && o.status !== 'pending_dispatch' && o.status !== 'exception')
        return false;
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
      onShowToast(
        `已指派技师！工单 ${selectedOrder.id} 电子密令与农资溯源箱号已推送微信端`,
        'success',
      );
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
      <DispatchMetricsBar />

      {/* Multi-dimensional Filters & Search Bar */}
      <DispatchFilters
        gridFilter={gridFilter}
        serviceFilter={serviceFilter}
        cropFilter={cropFilter}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onGridFilterChange={setGridFilter}
        onServiceFilterChange={setServiceFilter}
        onCropFilterChange={setCropFilter}
        onStatusFilterChange={setStatusFilter}
        onSearchChange={setSearchQuery}
        onReset={() => {
          setGridFilter('all');
          setServiceFilter('all');
          setCropFilter('all');
          setStatusFilter('all');
          setSearchQuery('');
        }}
      />

      {/* Intelligent Grid Matching & Dispatch Matrix (Split View) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Pending Order Queue (5 cols) */}
        <OrderQueue
          filteredOrders={filteredOrders}
          selectedOrderId={selectedOrderId}
          onSelect={setSelectedOrderId}
        />

        {/* RIGHT COLUMN: Technician Dispatch & Capacity Matching (7 cols) */}
        <DispatchCandidates
          selectedOrder={selectedOrder}
          isDispatching={isDispatching}
          dispatchSuccessId={dispatchSuccessId}
          onDispatch={handleDispatch}
          onOpenCall={() => setShowCallModal(true)}
          onShowToast={onShowToast}
        />
      </div>

      {/* Real-time Service Status Tracking Table & Lifecycle Flow */}
      <TrackingPanel
        orders={orders}
        activeTrackingOrder={activeTrackingOrder}
        onStepChange={onStepChange}
        onSetActiveTracking={setActiveTrackingOrder}
        onOpenDetail={setShowOrderDetailModal}
        onShowToast={onShowToast}
      />

      {/* Order Detail Modal */}
      {showOrderDetailModal && (
        <OrderDetailModal
          order={showOrderDetailModal}
          onClose={() => setShowOrderDetailModal(null)}
          onShowToast={onShowToast}
        />
      )}

      {/* Phone Call Modal */}
      {showCallModal && <CallModal onClose={() => setShowCallModal(false)} />}
    </div>
  );
};
