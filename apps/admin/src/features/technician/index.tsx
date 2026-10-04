import React, { useState } from 'react';
import type { Technician } from '@hnhall/shared';

import { TechnicianHeader } from './components/TechnicianHeader.tsx';
import { TechnicianMetricsGrid } from './components/TechnicianMetricsGrid.tsx';
import { TechnicianToolbar } from './components/TechnicianToolbar.tsx';
import { TechnicianTable } from './components/TechnicianTable.tsx';
import { AmoebaTreeView } from './components/AmoebaTreeView.tsx';
import { TechnicianInsightPanels } from './components/TechnicianInsightPanels.tsx';
import {
  AmoebaMatrixModal,
  GridDispatchModal,
  TechnicianDossierModal,
} from './components/TechnicianModals.tsx';

export interface TechnicianManagementProps {
  technicians: Technician[];
  onOpenAuditDrawer: () => void;
  onRefresh: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

/** 技术人员管理页（自 views/TechnicianManagement.tsx 按 Tab/面板拆分而来，行为不变）。 */
export const TechnicianManagement: React.FC<TechnicianManagementProps> = ({
  technicians,
  onOpenAuditDrawer,
  onRefresh,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'tree'>('roster');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTechForDossier, setSelectedTechForDossier] = useState<Technician | null>(null);
  const [showAmoebaMatrixModal, setShowAmoebaMatrixModal] = useState(false);
  const [showGridDispatchModal, setShowGridDispatchModal] = useState(false);

  // Filter list
  const filteredTechs = technicians.filter((t) => {
    if (filterType === 'gold' && t.amoebaTier !== 'gold') return false;
    if (filterType === 'expiring' && t.licenseStatus !== 'expiring') return false;
    if (filterType === 'active' && t.dispatchStatus !== 'active') return false;
    if (filterType === 'top_mentor' && t.menteeCount < 3) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        t.name.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.licenseNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTechs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTechs.map((t) => t.id));
    }
  };

  return (
    <div className="flex flex-col w-full space-y-5">
      {/* Top Command & Status Ribbon */}
      <TechnicianHeader
        onOpenAuditDrawer={onOpenAuditDrawer}
        onShowToast={onShowToast}
        onFilterExpiring={() => {
          setFilterType('expiring');
          onShowToast('已过滤出 30 天内即将到期须复核换证的 6 位技术人员', 'warning');
        }}
      />

      {/* Metric Overview Grid (Bento Style) */}
      <TechnicianMetricsGrid />

      {/* Operational Navigation Tabs & Filter Row */}
      <TechnicianToolbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuditDrawer={onOpenAuditDrawer}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={onRefresh}
        filterType={filterType}
        onFilterChange={setFilterType}
      />

      {activeTab === 'tree' ? (
        /* Amoeba Mentorship Architecture Tree View */
        <AmoebaTreeView onOpenMatrix={() => setShowAmoebaMatrixModal(true)} />
      ) : (
        /* Primary Technician Data Table (Dense Utilitarian Layout) */
        <TechnicianTable
          filteredTechs={filteredTechs}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onOpenAuditDrawer={onOpenAuditDrawer}
          onShowToast={onShowToast}
          onOpenDossier={setSelectedTechForDossier}
          onOpenMatrix={() => setShowAmoebaMatrixModal(true)}
        />
      )}

      {/* Lower Split Section: Amoeba Incentive Mechanics + Regulatory Compliance Feed + Map Capacity */}
      <TechnicianInsightPanels
        onGoToTree={() => setActiveTab('tree')}
        onOpenGridDispatch={() => setShowGridDispatchModal(true)}
      />

      {/* Technician Electronic Dossier Modal */}
      {selectedTechForDossier && (
        <TechnicianDossierModal
          tech={selectedTechForDossier}
          onClose={() => setSelectedTechForDossier(null)}
          onShowToast={onShowToast}
        />
      )}

      {/* Emergency Grid Dispatch Modal */}
      {showGridDispatchModal && (
        <GridDispatchModal
          onClose={() => setShowGridDispatchModal(false)}
          onShowToast={onShowToast}
        />
      )}

      {/* Amoeba Matrix Modal */}
      {showAmoebaMatrixModal && (
        <AmoebaMatrixModal onClose={() => setShowAmoebaMatrixModal(false)} />
      )}
    </div>
  );
};
