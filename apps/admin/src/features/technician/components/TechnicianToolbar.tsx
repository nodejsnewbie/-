import React from 'react';

interface TechnicianToolbarProps {
  activeTab: 'roster' | 'tree';
  onSelectTab: (tab: 'roster' | 'tree') => void;
  onOpenAuditDrawer: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  filterType: string;
  onFilterChange: (id: string) => void;
}

/** 操作导航 Tabs + 搜索 + 多维筛选条（自 TechnicianManagement 原样迁入）。 */
export const TechnicianToolbar: React.FC<TechnicianToolbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAuditDrawer,
  searchQuery,
  onSearchChange,
  onRefresh,
  filterType,
  onFilterChange,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs space-y-3 border border-surface-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container pb-3">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('roster')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'roster'
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>技师全景花名册 (386)</span>
          </button>
          <button
            onClick={onOpenAuditDrawer}
            className="px-4 py-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-[13px] font-semibold transition-colors flex items-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span>资质审核工作台</span>
            <span className="px-1.5 py-0.2 rounded-full bg-error text-on-error text-[10px] font-bold">
              14
            </span>
          </button>
          <button
            onClick={() => onSelectTab('tree')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'tree'
                ? 'bg-primary-container text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            <span>阿米巴师徒架构树 (28组)</span>
          </button>
        </div>

        {/* Live Search & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container rounded-lg text-on-surface placeholder:text-on-surface-variant/60 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="搜姓名、手机号、许可证编号..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button
            className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
            title="刷新数据"
            type="button"
            onClick={onRefresh}
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Multi-dimensional Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[12px] font-semibold text-on-surface-variant mr-1">快捷筛选:</span>
          {[
            { id: 'all', label: '全部人员 (386)' },
            { id: 'gold', label: '黄金阿米巴合伙人 (24)' },
            { id: 'expiring', label: '经营许可证30天内到期 (6)' },
            { id: 'active', label: '正在执行订单 (118)' },
            { id: 'top_mentor', label: '带徒先锋榜 (TOP10)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => onFilterChange(f.id)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                filterType === f.id
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              type="button"
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant text-[12px]">
          <span>
            当前服务网格: <strong>湖南省域 (长沙/常德/益阳/岳阳)</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
