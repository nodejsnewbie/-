import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  currentRegion: string;
  onSelectRegion: (region: string) => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch,
  currentRegion,
  onSelectRegion,
  onOpenNotifications,
  unreadCount = 2,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegionMenu, setShowRegionMenu] = useState(false);

  const regions = [
    '华中大区 · 洞庭湖粮油果木示范带',
    '长沙县 · 安沙/黄兴/路口综合服务区',
    '益阳市 · 赫山/大通湖水稻高产示范片',
    '常德市 · 鼎城油茶与洞庭湖先锋战区',
    '岳阳市 · 君山优质水稻与芥菜基地',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-6 border-b border-surface-container">
      {/* Search and Live Sync indicator */}
      <div className="flex items-center gap-5 flex-1 max-w-2xl">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container rounded-lg text-on-surface placeholder:text-on-surface-variant/60 text-[13px] focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all"
            placeholder="按批次号、订单ID、植保技师或溯源码检索..."
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
          />
        </form>
        <div className="hidden xl:flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full text-[12px] text-on-surface-variant font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
          <span>全国实时调度同步中</span>
        </div>
      </div>

      {/* Right Actions: Notifications, Region Switcher, Admin Profile */}
      <div className="flex items-center gap-4">
        <button
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface relative transition-colors"
          type="button"
          onClick={onOpenNotifications}
          title="系统异常与预警通知"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse"></span>
          )}
        </button>

        {/* Region Switcher */}
        <div className="relative">
          <button
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-on-surface text-[12px] font-medium transition-colors"
            type="button"
            onClick={() => setShowRegionMenu(!showRegionMenu)}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">sync_alt</span>
            <span>运营中心切换</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {showRegionMenu && (
            <div className="absolute right-0 mt-1 w-72 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container p-1 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-on-surface-variant/70 border-b border-surface-container">
                选择管辖服务网格中心
              </div>
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    onSelectRegion(r);
                    setShowRegionMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-[12px] rounded-lg transition-colors flex items-center justify-between ${
                    currentRegion === r
                      ? 'bg-primary-container text-on-primary font-bold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="truncate">{r}</span>
                  {currentRegion === r && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-surface-variant"></div>

        {/* Operator Profile */}
        <div className="flex items-center gap-2 pl-1">
          <div className="flex flex-col text-right hidden md:block">
            <span className="text-[13px] font-bold text-on-surface">超级管理员</span>
            <span className="text-[11px] text-on-surface-variant">运营总控中心</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
