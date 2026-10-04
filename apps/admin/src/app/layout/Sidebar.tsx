import React from 'react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingAuditCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingAuditCount = 14,
}) => {
  const navItems = [
    {
      id: 'dashboard-overview',
      label: '运营数据总览',
      icon: 'grid_view',
    },
    {
      id: 'order-dispatch-and-scheduling',
      label: '订单调度管理',
      icon: 'local_shipping',
      badge: '3加急',
    },
    {
      id: 'technician-management',
      label: '技术人员管理',
      icon: 'badge',
    },
    {
      id: 'qualification-and-license-review',
      label: '资质与合规审核',
      icon: 'verified_user',
      badgeCount: pendingAuditCount,
    },
    {
      id: 'supply-chain-and-traceability',
      label: '农资供应链与溯源',
      icon: 'qr_code_scanner',
    },
    {
      id: 'amoeba-bonus-and-commission-settlement',
      label: '阿米巴分红与结算',
      icon: 'account_balance_wallet',
    },
    {
      id: 'system-settings',
      label: '系统设置与权限',
      icon: 'settings',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex flex-col justify-between select-none border-r border-surface-container">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo and Platform Name */}
        <div className="h-16 px-5 flex items-center gap-3 bg-surface-container-low border-b border-surface-container">
          <img
            alt="华农智服 品牌标识"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WIwHA3AoDJSjdzg2rG3BZGWi4OpNPFsS8hs1KT8yG2xqwg_ujB5QLAvQUJCW0tFRwUZRCx-RFqMnNnwmpMdYYpakL37xQYLEGKb9p-FNeq9vmhR07H60Id0ZSrYABZalIsHbQaIhKl-VtppEEk6m2T-XRS3UufI3RgNOc0M7DxH8gGkVjXGu7CzrJKa67PUriC04mBC8VmOL_783dXcn-6Lymp7tYnubsWyyuzDU1dxorO-FNGryrqwqE"
          />
          <div className="flex flex-col">
            <span className="font-bold text-primary text-[15px] leading-tight tracking-tight">
              华农智服
            </span>
            <span className="text-[12px] text-on-surface-variant">企业综合管理平台</span>
          </div>
        </div>

        {/* Navigation Category */}
        <div className="px-3 py-3">
          <div className="px-3 py-1.5 mb-1 text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider">
            业务运营管理
          </div>
          <nav className="space-y-1 flex flex-col">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left text-[14px] ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px] shrink-0">
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-error text-on-error">
                      {item.badge}
                    </span>
                  )}
                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                        isActive ? 'bg-error text-on-error' : 'bg-error text-on-error'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Online Dispatch Status Footer */}
      <div className="p-3 bg-surface-container-low border-t border-surface-container">
        <div className="flex items-center justify-between text-on-surface-variant text-[13px] mb-1">
          <span>调度中心就绪</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
        </div>
        <div className="text-[12px] text-on-surface-variant/80">400+ 技师全网调度在线</div>
      </div>
    </aside>
  );
};
