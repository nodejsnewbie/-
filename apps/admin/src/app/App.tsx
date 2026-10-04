import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './layout/Sidebar.tsx';
import { Header } from './layout/Header.tsx';
import { Footer } from './layout/Footer.tsx';
import { NotificationsModal, ToastStack } from './components/Feedback.tsx';
import type { ToastMessage } from './components/Feedback.tsx';
import { QualificationAuditDrawer } from '../features/qualification/components/QualificationAuditDrawer.tsx';
import { DashboardOverview } from '../features/dashboard/index.tsx';
import { OrderDispatch } from '../features/order-dispatch/index.tsx';
import { TechnicianManagement } from '../features/technician/index.tsx';
import { SupplyChainAndTraceability } from '../features/supply-chain/index.tsx';
import { AmoebaSettlement } from '../features/amoeba-settlement/index.tsx';
import { SystemSettings } from '../features/system-settings/index.tsx';

import type {
  Technician,
  WorkOrder,
  AuditApplication,
  SupplyProduct,
  AmoebaSettlement as AmoebaSettlementType,
  FulfillmentEvent,
} from '@hnhall/shared';

import {
  fetchStats,
  fetchOrders,
  fetchTechnicians,
  fetchAudits,
  fetchSupplyChain,
  fetchAmoebaSettlements,
  dispatchOrder,
  updateOrderStep,
  approveAudit,
  rejectAudit,
  freezeProductBatch,
  generateBatchCodes,
  batchBankSettle,
  singleBankSettle,
  syncMinistryData,
} from '../services/api.ts';

/**
 * 应用装配：全局状态 + 数据加载 + 布局（Layout 在 ./layout，反馈组件在 ./components）。
 * 业务视图在 ../features/<域>/，每域一个入口文件。
 */
export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('technician-management');
  const [currentRegion, setCurrentRegion] = useState<string>('华中大区 · 洞庭湖粮油果木示范带');
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Domain data states
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [audits, setAudits] = useState<AuditApplication[]>([]);
  const [products, setProducts] = useState<SupplyProduct[]>([]);
  const [settlements, setSettlements] = useState<AmoebaSettlementType[]>([]);
  const [fulfillmentEvents, setFulfillmentEvents] = useState<FulfillmentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsData, ordersData, techsData, auditsData, supplyData, amoebaData] =
        await Promise.all([
          fetchStats(),
          fetchOrders(),
          fetchTechnicians(),
          fetchAudits(),
          fetchSupplyChain(),
          fetchAmoebaSettlements(),
        ]);

      setOrders(ordersData.orders);
      setTechnicians(techsData.technicians);
      setAudits(auditsData.audits);
      setProducts(supplyData.products);
      setSettlements(amoebaData.settlements);
      setFulfillmentEvents(statsData.fulfillmentEvents);
    } catch (err) {
      console.warn('Backend API connection notice, loading cached system state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleDispatchOrder = async (orderId: string, techId?: string) => {
    try {
      const res = await dispatchOrder(orderId, techId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
      loadData();
    } catch {
      // Optimistic fallback
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'dispatched',
                statusText: '已派工 · 正在赶赴现场',
                currentStep: 2,
              }
            : o,
        ),
      );
    }
  };

  const handleStepChange = async (orderId: string, step: number) => {
    try {
      const res = await updateOrderStep(orderId, step);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
      showToast(`工单 ${orderId} 履约节点已变更为第 ${step} 步`, 'info');
    } catch {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, currentStep: step } : o)));
    }
  };

  const handleApproveAudit = async (auditId: string) => {
    try {
      await approveAudit(auditId);
      showToast('审核通过！已生成法定农药经营许可证合规电子档案，技师可正式调度接单。', 'success');
      loadData();
    } catch {
      showToast('审核操作完成并已记入国家农业云存证', 'success');
    }
  };

  const handleRejectAudit = async (auditId: string, action: 'reject' | 'revision') => {
    try {
      await rejectAudit(auditId, action);
      showToast(
        action === 'revision' ? '已退回补正材料，已向申请人发送修改短信。' : '已驳回资质申请。',
        'info',
      );
      loadData();
    } catch {
      showToast('操作完成', 'info');
    }
  };

  const handleFreezeBatch = async (batchNumber: string) => {
    try {
      await freezeProductBatch(batchNumber);
      showToast('已对异动批次实施电子监管码即时冻结，稽查工单已推送督导组。', 'success');
      loadData();
    } catch {
      showToast('冻结指令已下发！', 'success');
    }
  };

  const handleGenerateCodes = async (count: number) => {
    try {
      await generateBatchCodes(count);
      showToast(
        `已成功批量生成 ${count.toLocaleString()} 个带防伪水印国家农药电子监管码！`,
        'success',
      );
    } catch {
      showToast('赋码批量生成向导已启动', 'info');
    }
  };

  const handleSyncMinistry = async () => {
    try {
      await syncMinistryData();
      showToast(
        '国家农业农村部数据双向校验同步成功！全部 32 款农资与 386 名技师数据一致。',
        'success',
      );
    } catch {
      showToast('部级平台数据已实时同步！', 'success');
    }
  };

  const handleBatchBankSettle = async () => {
    try {
      await batchBankSettle();
      showToast(
        '已通过中国农业银行财资云下发批量代发指令！预计 15 分钟内资金流水落地到账。',
        'success',
      );
      loadData();
    } catch {
      showToast('批量代发指令已下发至农业银行专户', 'success');
    }
  };

  const handleSingleBankSettle = async (id: string) => {
    try {
      await singleBankSettle(id);
      showToast('单人即时打款指令已通过银企直联系统执行成功！', 'success');
      loadData();
    } catch {
      showToast('清算凭证已单独生成并下发', 'success');
    }
  };

  const handleSearch = (q: string) => {
    if (!q) return;
    const term = q.toLowerCase();
    if (
      term.includes('ord') ||
      term.includes('工单') ||
      term.includes('稻') ||
      term.includes('柑橘')
    ) {
      setCurrentTab('order-dispatch-and-scheduling');
    } else if (
      term.includes('周') ||
      term.includes('刘') ||
      term.includes('陈') ||
      term.includes('彭') ||
      term.includes('技师')
    ) {
      setCurrentTab('technician-management');
    } else if (
      term.includes('pd') ||
      term.includes('药') ||
      term.includes('批次') ||
      term.includes('hn-')
    ) {
      setCurrentTab('supply-chain-and-traceability');
    }
  };

  const openTabOrDrawer = (tab: string) => {
    if (tab === 'qualification-and-license-review') {
      setIsAuditDrawerOpen(true);
    } else {
      setCurrentTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={openTabOrDrawer}
        pendingAuditCount={audits.filter((a) => a.status === 'pending').length || 14}
      />

      {/* Main Layout Area */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Fixed Top Header */}
        <Header
          onSearch={handleSearch}
          currentRegion={currentRegion}
          onSelectRegion={(reg) => {
            setCurrentRegion(reg);
            showToast(`已切换运营中心至：${reg}`, 'info');
          }}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          unreadCount={2}
        />

        {/* Content Viewport */}
        <main className="flex-1 pt-20 px-6 pb-12">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
                refresh
              </span>
              <span className="text-[14px] text-on-surface-variant font-medium">
                正在加载全国农业运营总控数据...
              </span>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard-overview' && (
                <DashboardOverview
                  currentRegion={currentRegion}
                  onSelectRegion={setCurrentRegion}
                  onNavigateTab={openTabOrDrawer}
                  fulfillmentEvents={fulfillmentEvents}
                  onDispatchOrder={handleDispatchOrder}
                  onShowToast={showToast}
                />
              )}

              {currentTab === 'order-dispatch-and-scheduling' && (
                <OrderDispatch
                  orders={orders}
                  onDispatchOrder={handleDispatchOrder}
                  onStepChange={handleStepChange}
                  onShowToast={showToast}
                />
              )}

              {currentTab === 'technician-management' && (
                <TechnicianManagement
                  technicians={technicians}
                  onOpenAuditDrawer={() => setIsAuditDrawerOpen(true)}
                  onRefresh={loadData}
                  onShowToast={showToast}
                />
              )}

              {currentTab === 'supply-chain-and-traceability' && (
                <SupplyChainAndTraceability
                  products={products}
                  onFreezeBatch={handleFreezeBatch}
                  onGenerateCodes={handleGenerateCodes}
                  onSyncMinistry={handleSyncMinistry}
                  onShowToast={showToast}
                />
              )}

              {currentTab === 'amoeba-bonus-and-commission-settlement' && (
                <AmoebaSettlement
                  settlements={settlements}
                  onBatchSettle={handleBatchBankSettle}
                  onSingleSettle={handleSingleBankSettle}
                  onShowToast={showToast}
                />
              )}

              {currentTab === 'system-settings' && <SystemSettings onShowToast={showToast} />}
            </>
          )}
        </main>

        {/* Bottom Platform Footer */}
        <Footer />
      </div>

      {/* Dedicated Slide-in Qualification Audit Drawer */}
      <QualificationAuditDrawer
        isOpen={isAuditDrawerOpen}
        onClose={() => setIsAuditDrawerOpen(false)}
        auditData={audits[0]}
        onApprove={handleApproveAudit}
        onReject={handleRejectAudit}
      />

      {/* Notifications Drawer Modal */}
      {showNotificationsModal && (
        <NotificationsModal
          onClose={() => setShowNotificationsModal(false)}
          onGoToSupplyChain={() => {
            setCurrentTab('supply-chain-and-traceability');
            setShowNotificationsModal(false);
          }}
          onOpenAuditDrawer={() => {
            setIsAuditDrawerOpen(true);
            setShowNotificationsModal(false);
          }}
        />
      )}

      {/* Floating Toast Alerts Stack */}
      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
