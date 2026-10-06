import Taro from '@tarojs/taro';
import { showAlert } from './utils/platform';
import { centsToYuan } from './utils/format';
import { Button, Text, View } from '@tarojs/components';
import React, { useState, useEffect, useCallback } from 'react';
import {
  TabType,
  ViewScreen,
  TechnicianProfile,
  ServiceOrder,
  AmoebaStat,
  TeamMemberFeed,
  RevenueTransaction,
  FieldEvidencePhoto,
  PrescriptionDrug,
} from './types';
import { api } from './services/api';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OrderHallView } from './components/OrderHallView';
import { OrderDetailView } from './components/OrderDetailView';
import { PrescriptionBuilderView } from './components/PrescriptionBuilderView';
import { AmoebaBonusView } from './components/AmoebaBonusView';
import { ServiceOrdersView } from './components/ServiceOrdersView';
import { PartnerProfileView } from './components/PartnerProfileView';

import { PhotoCaptureModal } from './components/PhotoCaptureModal';
import { PesticideScannerModal } from './components/PesticideScannerModal';
import { PrescriptionDeliveryModal } from './components/PrescriptionDeliveryModal';
import { WithdrawModal } from './components/WithdrawModal';
import { RecruitPosterModal } from './components/RecruitPosterModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import { ExpertSupportModal } from './components/ExpertSupportModal';
import { OptionAgreementModal } from './components/OptionAgreementModal';

/**
 * 技师端工作台容器。
 *
 * 数据契约（红线 R4「Mock/假数据不得充当真实数据源」+ 项目「所有数据来自后端」）：
 * - **不再以本地 mock 初始化业务 state**：初始为空态，唯一来源是 `/api/tech/*`。
 * - 加载失败 → 显示可见错误与重试入口，**不做静默本地兜底**（旧「乐观 fallback」已废弃）。
 * - 写操作失败仍会 `console.warn`，但不再有 mock 数据可回退——以接口结果为准。
 */
export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewScreen>('tab-view');
  const [activeTab, setActiveTab] = useState<TabType>('order-hall');

  // Business State — 全部来自后端，初始为空（无 mock 兜底）
  const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [amoebaStats, setAmoebaStats] = useState<AmoebaStat | null>(null);
  const [teamFeeds, setTeamFeeds] = useState<TeamMemberFeed[]>([]);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  // Load State（可见加载 / 错误反馈，禁止静默降级）
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modals state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [expertModalType, setExpertModalType] = useState<'expert' | 'sos' | null>(null);
  const [lightboxData, setLightboxData] = useState<{ url: string; title: string } | null>(null);

  // Desktop simulator frame state (allows testing both 390px mobile viewport and responsive full)
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Fetch initial data from backend API — 任一必需接口失败即进入可见错误态，不回退本地数据
  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [techData, ordersData, statsData, txData, feedData] = await Promise.all([
        api.getTechnician(),
        api.getOrders(),
        api.getAmoebaStats(),
        api.getTransactions(),
        api.getFeeds(),
      ]);

      setTechnician(techData);
      setOrders(ordersData);
      setSelectedOrder((prev) => prev ?? ordersData[0] ?? null);
      setAmoebaStats(statsData);
      setTransactions(txData);
      setTeamFeeds(feedData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误';
      console.warn('Backend initial fetch failed:', err);
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleToggleOnline = async () => {
    if (!technician) return;
    const targetStatus = !technician.isOnline;
    setTechnician((prev) => (prev ? { ...prev, isOnline: targetStatus } : prev));
    try {
      const res = await api.updateTechnicianStatus(targetStatus);
      if (res) setTechnician(res);
    } catch (e) {
      console.warn('API update status failed', e);
      showAlert('在线状态同步失败，请稍后重试');
    }
  };

  const handleSelectOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setCurrentView('order-detail');
  };

  const handleAcceptOrder = async (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'in_progress' } : o))
    );
    setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: 'in_progress' } : prev));
    try {
      const updated = await api.claimOrder(orderId);
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        setSelectedOrder(updated);
      }
    } catch (e) {
      console.warn('API claim failed', e);
      showAlert('接单失败，请检查网络后重试');
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    showAlert('已将工单推回智能公共池，稍后将由区域调度中心协调。');
    setCurrentView('tab-view');
    setActiveTab('order-hall');
    try {
      await api.declineOrder(orderId);
      // 以接口为准：重取列表，避免本地乐观状态与后端漂移
      const refreshed = await api.getOrders();
      setOrders(refreshed);
    } catch (e) {
      console.warn('API decline failed', e);
    }
  };

  const handleGoToPrescription = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setCurrentView('prescription-builder');
  };

  const handleUpdateOrder = (updated: ServiceOrder) => {
    setSelectedOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const handlePhotoCaptured = async (photo: FieldEvidencePhoto) => {
    if (!selectedOrder) return;
    const updatedPhotos = [...(selectedOrder.fieldEvidencePhotos || []), photo];
    const updatedOrder = {
      ...selectedOrder,
      fieldEvidencePhotos: updatedPhotos,
    };
    handleUpdateOrder(updatedOrder);

    try {
      await api.addEvidencePhoto(selectedOrder.id, {
        url: photo.url,
        label: photo.label,
        location: photo.location,
      });
    } catch (e) {
      console.warn('API add photo sync note', e);
      showAlert('现场照片上传后端同步失败，已保留本地草稿');
    }
  };

  const handleAddDrug = (drug: PrescriptionDrug) => {
    if (!selectedOrder) return;
    const existing = selectedOrder.prescriptionDrugs.find((d) => d.id === drug.id);
    let nextDrugs: PrescriptionDrug[];
    if (existing) {
      nextDrugs = selectedOrder.prescriptionDrugs.map((d) =>
        d.id === drug.id ? { ...d, qty: d.qty + 1 } : d
      );
    } else {
      nextDrugs = [...selectedOrder.prescriptionDrugs, { ...drug, qty: 1 }];
    }
    handleUpdateOrder({
      ...selectedOrder,
      prescriptionDrugs: nextDrugs,
    });
  };

  const handleDeliverySigned = async (orderId: string, signature: string) => {
    if (!selectedOrder || !amoebaStats) return;
    const now = new Date().toISOString();
    const updated = {
      ...selectedOrder,
      status: 'completed' as const,
      farmerSignature: signature,
      signedAt: now,
    };
    handleUpdateOrder(updated);

    try {
      const res = await api.signDeliveryNote(orderId, signature);
      if (res?.order) {
        handleUpdateOrder(res.order);
        if (res.newTotalIncomeCents) {
          setAmoebaStats((prev) =>
            prev
              ? {
                  ...prev,
                  totalMonthIncomeCents: res.newTotalIncomeCents,
                  serviceTasksCount: prev.serviceTasksCount + 1,
                }
              : prev
          );
        }
        // 以接口为准刷新流水
        const tx = await api.getTransactions();
        setTransactions(tx);
      }
    } catch (e) {
      console.warn('API delivery sign sync note', e);
      showAlert('签收同步失败，请稍后重试');
    }
  };

  const handleWithdrawConfirm = async (amount: number, channel: string) => {
    if (!amoebaStats) return;
    try {
      const res = await api.withdraw(amount, channel);
      if (res?.remainingBalanceCents !== undefined) {
        setAmoebaStats((prev) =>
          prev ? { ...prev, totalMonthIncomeCents: res.remainingBalanceCents } : prev
        );
      }
      const updatedTx = await api.getTransactions();
      if (updatedTx) setTransactions(updatedTx);
    } catch (e) {
      console.warn('API withdraw sync note', e);
      showAlert('提现请求失败，请稍后重试');
    }
  };

  const handleQuickClaim = () => {
    const unclaimed = orders.find((o) => o.status === 'dispatching');
    if (unclaimed) {
      handleSelectOrder(unclaimed);
    } else {
      showAlert('暂无可抢工单，请稍后刷新公共池');
    }
  };

  const handleBackToMain = () => {
    setCurrentView('tab-view');
  };

  // 加载 / 错误态：可见反馈，不展示本地假数据（红线 R4）
  if (loading) {
    return (
      <View className="flex items-center justify-center min-h-screen bg-[#0f1712] text-white">
        <Text>正在从服务端加载工单与经营数据…</Text>
      </View>
    );
  }

  if (loadError || !technician || !amoebaStats) {
    return (
      <View className="flex flex-col items-center justify-center gap-3 min-h-screen bg-[#0f1712] text-white p-6 text-center">
        <Text className="font-bold text-[16px]">数据加载失败</Text>
        <Text className="text-xs opacity-80">
          {loadError ?? '后端未返回技师档案'}。请确认统一后端已启动（`/api/tech`）且微信开发者工具已勾选「不校验合法域名」。
        </Text>
        <Button
          onClick={fetchData}
          className="mt-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold"
        >
          重新加载
        </Button>
      </View>
    );
  }

  return (
    <View className="min-h-screen bg-[#0f1712] flex flex-col items-center justify-start text-on-surface antialiased py-0 sm:py-6 select-none font-sans">
      {/* Top Device & View Switcher Bar (Desktop Utility Toolbar) */}
      <View className="w-full max-w-[430px] hidden sm:flex items-center justify-between px-2 py-1 mb-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-xs border border-white/10">
        <View className="flex items-center gap-1.5 font-bold">
          <Text className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></Text>
          <Text>华农智服 · 农艺师合伙人终端</Text>
        </View>
        <View className="flex items-center gap-1">
          <Button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[11px] font-semibold transition-colors cursor-pointer"
            title="切换视口"
          >
            {isMobileFrame ? '手机外勤机框 (390px)' : '自适应宽屏'}
          </Button>
        </View>
      </View>

      {/* Main Mobile Container Frame */}
      <View
        className={`relative flex flex-col bg-surface overflow-hidden transition-all ${
          isMobileFrame
            ? 'w-full sm:w-[390px] h-[100dvh] sm:h-[844px] sm:max-h-[844px] sm:rounded-[32px] sm:shadow-[0_16px_48px_rgba(0,0,0,0.55)] border border-surface-container-high'
            : 'w-full max-w-2xl min-h-screen sm:rounded-2xl shadow-xl'
        }`}
      >
        {/* Dynamic Header */}
        <Header
          currentView={currentView}
          activeTab={activeTab}
          technician={technician}
          onToggleOnline={handleToggleOnline}
          onBack={handleBackToMain}
          onOpenExpert={() => setExpertModalType('expert')}
          onOpenSos={() => setExpertModalType('sos')}
          onOpenProfile={() => {
            setCurrentView('tab-view');
            setActiveTab('partner-profile');
          }}
        />

        {/* Scrollable View Content */}
        <View className="flex-1 overflow-y-auto w-full bg-surface no-scrollbar">
          {currentView === 'order-detail' && selectedOrder ? (
            <OrderDetailView
              order={selectedOrder}
              onAcceptOrder={handleAcceptOrder}
              onDeclineOrder={handleDeclineOrder}
              onGoToPrescription={handleGoToPrescription}
              onViewImage={(url, label) => setLightboxData({ url, title: label })}
              onCopyAddress={(addr) => {
                Taro.setClipboardData({ data: addr });
                showAlert('已复制地块地址至剪贴板！');
              }}
              onCallFarmer={(phone, name) => {
                showAlert(`正在呼叫农户 ${name} (${phone})...`);
              }}
            />
          ) : currentView === 'prescription-builder' && selectedOrder ? (
            <PrescriptionBuilderView
              order={selectedOrder}
              onUpdateOrder={handleUpdateOrder}
              onOpenPhotoCapture={() => setIsPhotoModalOpen(true)}
              onOpenScanner={() => setIsScannerModalOpen(true)}
              onOpenDeliveryModal={() => setIsDeliveryModalOpen(true)}
              onViewImage={(url, label) => setLightboxData({ url, title: label })}
            />
          ) : (
            <>
              {activeTab === 'order-hall' && (
                <OrderHallView
                  technician={technician}
                  orders={orders}
                  onToggleOnline={handleToggleOnline}
                  onSelectOrder={handleSelectOrder}
                  onQuickClaim={handleQuickClaim}
                  onChangeTab={(tab) => setActiveTab(tab)}
                  onOpenPrescriptionBuilder={handleGoToPrescription}
                />
              )}

              {activeTab === 'service-orders' && (
                <ServiceOrdersView
                  orders={orders}
                  onSelectOrder={handleSelectOrder}
                  onOpenPrescription={handleGoToPrescription}
                  onOpenDelivery={(o) => {
                    setSelectedOrder(o);
                    setIsDeliveryModalOpen(true);
                  }}
                />
              )}

              {activeTab === 'amoeba-bonus' && (
                <AmoebaBonusView
                  technician={technician}
                  stats={amoebaStats}
                  feeds={teamFeeds}
                  transactions={transactions}
                  onOpenWithdraw={() => setIsWithdrawModalOpen(true)}
                  onOpenOptionAgreement={() => setIsAgreementModalOpen(true)}
                  onOpenRecruitPoster={() => setIsRecruitModalOpen(true)}
                />
              )}

              {activeTab === 'partner-profile' && (
                <PartnerProfileView
                  technician={technician}
                  onOpenOptionAgreement={() => setIsAgreementModalOpen(true)}
                  onOpenRecruitPoster={() => setIsRecruitModalOpen(true)}
                  onOpenWithdraw={() => setIsWithdrawModalOpen(true)}
                />
              )}
            </>
          )}
        </View>

        {/* Bottom Tab Navigation (Only shown in Tab View) */}
        {currentView === 'tab-view' && (
          <BottomNav
            activeTab={activeTab}
            onChangeTab={(tab) => setActiveTab(tab)}
            ordersBadgeCount={orders.filter((o) => o.status === 'dispatching').length}
          />
        )}

        {/* Global Modals */}
        <PhotoCaptureModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onCapture={handlePhotoCaptured}
        />

        <PesticideScannerModal
          isOpen={isScannerModalOpen}
          onClose={() => setIsScannerModalOpen(false)}
          onAddDrug={handleAddDrug}
        />

        <PrescriptionDeliveryModal
          isOpen={isDeliveryModalOpen}
          order={selectedOrder}
          onClose={() => setIsDeliveryModalOpen(false)}
          onSigned={handleDeliverySigned}
        />

        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          availableBalance={centsToYuan(amoebaStats.totalMonthIncomeCents)}
          onConfirmWithdraw={handleWithdrawConfirm}
        />

        <RecruitPosterModal
          isOpen={isRecruitModalOpen}
          onClose={() => setIsRecruitModalOpen(false)}
          technician={technician}
        />

        <OptionAgreementModal
          isOpen={isAgreementModalOpen}
          onClose={() => setIsAgreementModalOpen(false)}
          technician={technician}
        />

        <ExpertSupportModal
          isOpen={expertModalType !== null}
          type={expertModalType || 'expert'}
          onClose={() => setExpertModalType(null)}
        />

        {lightboxData && (
          <ImageViewerModal
            isOpen={true}
            imageUrl={lightboxData.url}
            title={lightboxData.title}
            onClose={() => setLightboxData(null)}
          />
        )}
      </View>
    </View>
  );
}
