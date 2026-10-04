import { showAlert } from './utils/platform';
import { Button, Text, View } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
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
import {
  INITIAL_TECHNICIAN,
  INITIAL_ORDERS,
  INITIAL_AMOEBA,
  INITIAL_FEEDS,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
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

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewScreen>('tab-view');
  const [activeTab, setActiveTab] = useState<TabType>('order-hall');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder>(INITIAL_ORDERS[0]);

  // Business State
  const [technician, setTechnician] = useState<TechnicianProfile>(INITIAL_TECHNICIAN);
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [amoebaStats, setAmoebaStats] = useState<AmoebaStat>(INITIAL_AMOEBA);
  const [teamFeeds, setTeamFeeds] = useState<TeamMemberFeed[]>(INITIAL_FEEDS);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>(INITIAL_TRANSACTIONS);

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

  // Fetch initial data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techData, ordersData, statsData, txData, feedData] = await Promise.allSettled([
          api.getTechnician(),
          api.getOrders(),
          api.getAmoebaStats(),
          api.getTransactions(),
          api.getFeeds(),
        ]);

        if (techData.status === 'fulfilled' && techData.value) setTechnician(techData.value);
        if (ordersData.status === 'fulfilled' && ordersData.value?.length) {
          setOrders(ordersData.value);
          setSelectedOrder(ordersData.value[0]);
        }
        if (statsData.status === 'fulfilled' && statsData.value) setAmoebaStats(statsData.value);
        if (txData.status === 'fulfilled' && txData.value?.length) setTransactions(txData.value);
        if (feedData.status === 'fulfilled' && feedData.value?.length) setTeamFeeds(feedData.value);
      } catch (err) {
        console.warn('Backend initial fetch info:', err);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleToggleOnline = async () => {
    const targetStatus = !technician.isOnline;
    setTechnician((prev) => ({
      ...prev,
      isOnline: targetStatus,
    }));
    try {
      const res = await api.updateTechnicianStatus(targetStatus);
      if (res) setTechnician(res);
    } catch (e) {
      console.warn('API update failed, maintained local state', e);
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
    if (selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: 'in_progress' }));
    }
    try {
      const updated = await api.claimOrder(orderId);
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        setSelectedOrder(updated);
      }
    } catch (e) {
      console.warn('API claim failed', e);
    }
  };

  const handleDeclineOrder = async (orderId: string) => {
    showAlert('已将工单推回智能公共池，稍后将由区域调度中心协调。');
    setCurrentView('tab-view');
    setActiveTab('order-hall');
    try {
      await api.declineOrder(orderId);
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
    }
  };

  const handleAddDrug = (drug: PrescriptionDrug) => {
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
    const now = new Date().toLocaleString();
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
        if (res.newTotalIncome) {
          setAmoebaStats((prev) => ({
            ...prev,
            totalMonthIncome: res.newTotalIncome,
            serviceTasksCount: prev.serviceTasksCount + 1,
          }));
        }
      }
    } catch (e) {
      console.warn('API delivery sign sync note', e);
      // Fallback local update
      const totalDrugs = selectedOrder.prescriptionDrugs.reduce((a, b) => a + b.price * b.qty, 0);
      const newTx: RevenueTransaction = {
        id: `tx-${Date.now()}`,
        title: `${selectedOrder.farmerName}水稻病虫害处方交付`,
        sub: `工单费 ¥${selectedOrder.laborFee} + 处方分润 ¥${(totalDrugs * 0.12).toFixed(2)}`,
        amount: selectedOrder.estimatedFee + 38.4,
        type: 'mixed',
        time: '刚刚',
      };
      setTransactions((prev) => [newTx, ...prev]);
      setAmoebaStats((prev) => ({
        ...prev,
        totalMonthIncome: prev.totalMonthIncome + newTx.amount,
        serviceCommission: prev.serviceCommission + selectedOrder.laborFee,
        serviceTasksCount: prev.serviceTasksCount + 1,
      }));
    }
  };

  const handleWithdrawConfirm = async (amount: number, channel: string) => {
    setAmoebaStats((prev) => ({
      ...prev,
      totalMonthIncome: Math.max(0, prev.totalMonthIncome - amount),
    }));

    try {
      const res = await api.withdraw(amount, channel);
      if (res?.remainingBalance !== undefined) {
        setAmoebaStats((prev) => ({
          ...prev,
          totalMonthIncome: res.remainingBalance,
        }));
      }
      const updatedTx = await api.getTransactions();
      if (updatedTx) setTransactions(updatedTx);
    } catch (e) {
      console.warn('API withdraw sync note', e);
      const newTx: RevenueTransaction = {
        id: `tx-wd-${Date.now()}`,
        title: '合伙人收益即时提现支出',
        sub: '资金由银行专户秒级直划',
        amount: -amount,
        type: 'mixed',
        time: '刚刚',
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  const handleQuickClaim = () => {
    const unclaimed = orders.find((o) => o.status === 'dispatching');
    if (unclaimed) {
      handleSelectOrder(unclaimed);
    } else {
      showAlert('已启动智能抢单引擎：当前方圆8公里内已为您自动锁定最优植保急单！');
      handleSelectOrder(orders[0]);
    }
  };

  const handleBackToMain = () => {
    setCurrentView('tab-view');
  };

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
          {currentView === 'order-detail' ? (
            <OrderDetailView
              order={selectedOrder}
              onAcceptOrder={handleAcceptOrder}
              onDeclineOrder={handleDeclineOrder}
              onGoToPrescription={handleGoToPrescription}
              onViewImage={(url, label) => setLightboxData({ url, title: label })}
              onCopyAddress={(addr) => {
                navigator.clipboard?.writeText(addr);
                showAlert('已复制地块地址至剪贴板！');
              }}
              onCallFarmer={(phone, name) => {
                showAlert(`正在模拟呼叫农户 ${name} (${phone})...`);
              }}
            />
          ) : currentView === 'prescription-builder' ? (
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
          availableBalance={amoebaStats.totalMonthIncome}
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
