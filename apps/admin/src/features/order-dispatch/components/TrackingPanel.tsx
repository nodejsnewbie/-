import React from 'react';
import type { WorkOrder } from '@hnhall/shared';

interface TrackingPanelProps {
  orders: WorkOrder[];
  activeTrackingOrder: WorkOrder;
  onStepChange: (orderId: string, step: number) => void;
  onSetActiveTracking: (order: WorkOrder) => void;
  onOpenDetail: (order: WorkOrder) => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

/** 实时全流程作业追踪：5 步履约节点 + 工单表（自 OrderDispatch 原样迁入）。 */
export const TrackingPanel: React.FC<TrackingPanelProps> = ({
  orders,
  activeTrackingOrder,
  onStepChange,
  onSetActiveTracking,
  onOpenDetail,
  onShowToast,
}) => {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col gap-4 border border-surface-container">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-on-secondary">
            <span className="material-symbols-outlined text-[18px]">timeline</span>
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-on-surface">实时全流程作业追踪与履约监控</h2>
            <p className="text-[12px] text-on-surface-variant">
              标准履约五步节点：预约提交 → 技师接单 → 现场签到(实拍水印) → 开具电子处方 →
              农户验收结单
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-lg border border-surface-container">
          <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
          <span>国家农药可追溯编码与北斗水印已全部接入存证</span>
        </div>
      </div>

      {/* 5-Step Progress Timeline Card for Active Order */}
      <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3 border border-surface-container">
        <div className="flex flex-wrap items-center justify-between text-on-surface text-[13px]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-primary">正在履约监控: {activeTrackingOrder.id}</span>
            <span className="text-on-surface-variant text-[12px]">
              {activeTrackingOrder.farmerName} · {activeTrackingOrder.crop} · 技师:{' '}
              {activeTrackingOrder.assignedTechnician?.name || '王培根'}
            </span>
          </div>
          <div className="text-secondary font-bold text-[12px]">
            预计 30 分钟内完成农户数字化验收
          </div>
        </div>

        {/* 5-Step Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {/* Step 1 */}
          <div
            onClick={() => onStepChange(activeTrackingOrder.id, 1)}
            className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-surface-container cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold">
                1
              </span>
              <span className="text-[11px] font-bold text-secondary">已完成</span>
            </div>
            <span className="font-bold text-on-surface text-[13px] mt-2">预约提交</span>
            <span className="text-[11px] text-on-surface-variant">07:20:15 微信端</span>
            <span className="text-[10px] text-on-surface-variant/80 mt-0.5">农户自主发起需求</span>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onStepChange(activeTrackingOrder.id, 2)}
            className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-surface-container cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold">
                2
              </span>
              <span className="text-[11px] font-bold text-secondary">已完成</span>
            </div>
            <span className="font-bold text-on-surface text-[13px] mt-2">技师接单</span>
            <span className="text-[11px] text-on-surface-variant">07:26:40 调度指派</span>
            <span className="text-[10px] text-on-surface-variant/80 mt-0.5">耗时6分25秒响应</span>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onStepChange(activeTrackingOrder.id, 3)}
            className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-surface-container cursor-pointer hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[11px] font-bold">
                3
              </span>
              <span className="text-[11px] font-bold text-secondary">已核验</span>
            </div>
            <span className="font-bold text-on-surface text-[13px] mt-2">现场签到(实拍水印)</span>
            <span className="text-[11px] text-on-surface-variant">08:05:12 田间抵达</span>
            <span className="text-[10px] text-primary font-bold mt-0.5">北斗时间水印核验通过</span>
          </div>

          {/* Step 4 */}
          <div
            onClick={() => onStepChange(activeTrackingOrder.id, 4)}
            className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border-2 border-primary cursor-pointer ring-1 ring-primary/20"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold animate-pulse">
                4
              </span>
              <span className="text-[11px] font-bold text-primary">作业中</span>
            </div>
            <span className="font-bold text-on-surface text-[13px] mt-2">开具电子处方</span>
            <span className="text-[11px] text-on-surface-variant">08:42:00 处方生成</span>
            <span className="text-[10px] text-on-surface-variant/80 mt-0.5">
              吡蚜酮+烯啶虫胺组合
            </span>
          </div>

          {/* Step 5 */}
          <div
            onClick={() => onStepChange(activeTrackingOrder.id, 5)}
            className="flex flex-col bg-surface-container-lowest p-3 rounded-lg shadow-xs border border-surface-container opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center justify-between">
              <span className="w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-[11px] font-bold">
                5
              </span>
              <span className="text-[11px] font-bold text-on-surface-variant">待确认</span>
            </div>
            <span className="font-bold text-on-surface text-[13px] mt-2">农户验收结单</span>
            <span className="text-[11px] text-on-surface-variant">预计 09:30</span>
            <span className="text-[10px] text-on-surface-variant/80 mt-0.5">
              手机短信+手写电子签名
            </span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-semibold">
              <th className="py-2.5 px-3 rounded-l-lg">工单编号</th>
              <th className="py-2.5 px-3">农户与乡镇网格</th>
              <th className="py-2.5 px-3">作物 & 亩数</th>
              <th className="py-2.5 px-3">责任网格技师</th>
              <th className="py-2.5 px-3">电子处方/用药追溯码</th>
              <th className="py-2.5 px-3">当前状态</th>
              <th className="py-2.5 px-3">现场水印核验</th>
              <th className="py-2.5 px-3 rounded-r-lg text-right">管理操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-on-surface">
            {orders.slice(0, 6).map((ord) => {
              const isException = ord.status === 'exception';

              return (
                <tr
                  key={ord.id}
                  onClick={() => onSetActiveTracking(ord)}
                  className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                >
                  <td
                    className={`py-3 px-3 font-bold font-mono ${isException ? 'text-error' : 'text-primary'}`}
                  >
                    {ord.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-on-surface text-[13px]">
                        {ord.farmerName}
                      </span>
                      <span className="text-on-surface-variant text-[11px] truncate max-w-[160px]">
                        {ord.location}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-medium font-mono">
                      {ord.crop} · {ord.acreage}亩
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-[12px]">
                        {ord.assignedTechnician?.name || '王培根 (持证)'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    {ord.prescriptionCode ? (
                      <span className="bg-surface-container px-2 py-0.5 rounded text-primary font-bold">
                        {ord.prescriptionCode}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">尚未开方</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {ord.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">task_alt</span>
                        已验收结单
                      </span>
                    ) : ord.status === 'exception' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                        接单超时预警
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        {ord.statusText}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[12px]">
                    {ord.watermarkVerified ? (
                      <span className="text-secondary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        实拍水印已核实
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">等待签到中</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDetail(ord);
                        }}
                        className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-colors"
                        type="button"
                      >
                        详情
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowToast(`已启动工单 ${ord.id} 音视频云调度信道！`, 'info');
                        }}
                        className="px-2.5 py-1 rounded bg-primary text-on-primary text-[12px] font-medium transition-colors shadow-xs"
                        type="button"
                      >
                        音视频跟进
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
