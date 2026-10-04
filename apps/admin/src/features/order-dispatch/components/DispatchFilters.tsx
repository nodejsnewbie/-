import React from 'react';

interface DispatchFiltersProps {
  gridFilter: string;
  serviceFilter: string;
  cropFilter: string;
  statusFilter: string;
  searchQuery: string;
  onGridFilterChange: (v: string) => void;
  onServiceFilterChange: (v: string) => void;
  onCropFilterChange: (v: string) => void;
  onStatusFilterChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  onReset: () => void;
}

/** 多维筛选 + 搜索 + 调度策略条（自 OrderDispatch 原样迁入）。 */
export const DispatchFilters: React.FC<DispatchFiltersProps> = ({
  gridFilter,
  serviceFilter,
  cropFilter,
  statusFilter,
  searchQuery,
  onGridFilterChange,
  onServiceFilterChange,
  onCropFilterChange,
  onStatusFilterChange,
  onSearchChange,
  onReset,
}) => {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col gap-3 border border-surface-container">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Township Grid */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
            <span className="text-[12px] font-semibold text-on-surface-variant">所属网格:</span>
            <select
              value={gridFilter}
              onChange={(e) => onGridFilterChange(e.target.value)}
              className="bg-transparent text-[13px] font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all">全网格 (长沙县重点片区)</option>
              <option value="安沙">安沙镇 (毛塘/黄旗/水塘网格)</option>
              <option value="路口">路口镇 (荆华/龙泉网格)</option>
              <option value="黄兴">黄兴镇 (打卦岭/仙人市网格)</option>
              <option value="高桥">高桥镇 (白石/高桥网格)</option>
            </select>
          </div>

          {/* Service Type */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
            <span className="material-symbols-outlined text-primary text-[18px]">
              medical_services
            </span>
            <span className="text-[12px] font-semibold text-on-surface-variant">服务类目:</span>
            <select
              value={serviceFilter}
              onChange={(e) => onServiceFilterChange(e.target.value)}
              className="bg-transparent text-[13px] font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all">全部服务类型</option>
              <option value="diagnosis">植保上门诊断 (紧急)</option>
              <option value="drone">精准飞防作业</option>
              <option value="machinery">农机维保上门</option>
              <option value="soil">测土配方采样</option>
            </select>
          </div>

          {/* Crop Type */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
            <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
            <span className="text-[12px] font-semibold text-on-surface-variant">作物种类:</span>
            <select
              value={cropFilter}
              onChange={(e) => onCropFilterChange(e.target.value)}
              className="bg-transparent text-[13px] font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all">所有作物</option>
              <option value="稻">优质水稻 (早/晚稻)</option>
              <option value="柑橘">柑橘 / 蜜桔</option>
              <option value="油菜">油菜冬种基地</option>
              <option value="蔬菜">露地精细蔬菜</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container">
            <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
            <span className="text-[12px] font-semibold text-on-surface-variant">调度状态:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-transparent text-[13px] font-medium text-on-surface focus:outline-none cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="pending">待指派 (高优队列)</option>
              <option value="dispatched">已派待接单</option>
              <option value="completed">已验收结单</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container rounded-lg text-on-surface text-[13px] focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
              placeholder="工单ID / 农户姓名 / 手机"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface text-[12px] font-medium transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>重置</span>
          </button>
        </div>
      </div>

      {/* Strategy Bar */}
      <div className="flex flex-wrap items-center justify-between pt-1 text-on-surface-variant text-[12px] border-t border-surface-container">
        <div className="flex items-center gap-2">
          <span className="text-on-surface font-semibold">当前命中调度策略:</span>
          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
            乡镇网格5公里半径就近
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
            高级植保师专技优先
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
            今日负荷 &lt; 4单
          </span>
        </div>
        <div>
          排队池检索耗时: <strong className="text-primary font-bold font-mono">18ms</strong>{' '}
          (无外部商用地图API依赖)
        </div>
      </div>
    </div>
  );
};
