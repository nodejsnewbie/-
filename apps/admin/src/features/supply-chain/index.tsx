import React, { useState } from 'react';
import type { SupplyProduct } from '@hnhall/shared';

import { SupplyHeader } from './components/SupplyHeader.tsx';
import { SupplyMetrics } from './components/SupplyMetrics.tsx';
import { ProductTraceTable } from './components/ProductTraceTable.tsx';
import { ScanVerifyModal, TraceDetailModal } from './components/SupplyModals.tsx';

export interface SupplyChainAndTraceabilityProps {
  products: SupplyProduct[];
  onGenerateCodes: (count: number) => Promise<void>;
  onSyncMinistry: () => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

/** 农资供应链与溯源页（自 views/SupplyChainAndTraceability.tsx 按区块拆分而来，行为不变）。 */
export const SupplyChainAndTraceability: React.FC<SupplyChainAndTraceabilityProps> = ({
  products,
  onGenerateCodes,
  onSyncMinistry,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTraceProduct, setSelectedTraceProduct] = useState<SupplyProduct | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanCodeInput, setScanCodeInput] = useState('01069281729001921240315102008');
  const [scanResult, setScanResult] = useState<{
    title: string;
    pd: string;
    batch: string;
    status: string;
  } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (categoryFilter === 'fungicide' && !p.name.includes('醇') && !p.name.includes('胺'))
      return false;
    if (categoryFilter === 'insecticide' && !p.name.includes('虫') && !p.name.includes('脲'))
      return false;
    if (categoryFilter === 'nutrition' && !p.name.includes('肥')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.registrationNumber.toLowerCase().includes(q) ||
        p.batchNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleManualScan = () => {
    if (!scanCodeInput.trim()) return;
    setScanResult({
      title: '75% 肟菌·戊唑醇悬浮剂',
      pd: 'PD20210892',
      batch: 'HN-20240315-A',
      status: '正品合格 · 首验正规湖南区域 · 国家数据库登记有效',
    });
  };

  const handleSyncClick = async () => {
    try {
      setIsSyncing(true);
      await onSyncMinistry();
      onShowToast(
        '已成功拉取国家农业农村部农药质量安全追溯云系统最新赋码核销流水！全部数据保持同步。',
        'success',
      );
    } catch {
      onShowToast('部级平台同步超时，请稍后重试', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Breadcrumb and Header */}
      <SupplyHeader
        isSyncing={isSyncing}
        onSync={handleSyncClick}
        onOpenScan={() => {
          setShowScanModal(true);
          setScanResult(null);
        }}
      />

      {/* Top 4 Metric Cards */}
      <SupplyMetrics />

      {/* Section A: 一物一码供应链与商品溯源库 */}
      <ProductTraceTable
        filteredProducts={filteredProducts}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        onSearchChange={setSearchQuery}
        onCategoryFilterChange={setCategoryFilter}
        onGenerateCodes={onGenerateCodes}
        onShowToast={onShowToast}
        onSelectTrace={setSelectedTraceProduct}
      />

      {/* Trace Detail Modal */}
      {selectedTraceProduct && (
        <TraceDetailModal
          product={selectedTraceProduct}
          onClose={() => setSelectedTraceProduct(null)}
          onShowToast={onShowToast}
        />
      )}

      {/* Quick Scan Verify Modal */}
      {showScanModal && (
        <ScanVerifyModal
          scanCodeInput={scanCodeInput}
          scanResult={scanResult}
          onCodeInputChange={setScanCodeInput}
          onManualScan={handleManualScan}
          onClose={() => setShowScanModal(false)}
        />
      )}
    </div>
  );
};
