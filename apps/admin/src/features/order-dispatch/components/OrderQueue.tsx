import React from 'react';
import type { WorkOrder } from '@hnhall/shared';

interface OrderQueueProps {
  filteredOrders: WorkOrder[];
  selectedOrderId: string;
  onSelect: (id: string) => void;
}

/** 左栏：待调度工单队列（点击选中，自 OrderDispatch 原样迁入）。 */
export const OrderQueue: React.FC<OrderQueueProps> = ({
  filteredOrders,
  selectedOrderId,
  onSelect,
}) => {
  return (
    <div className="xl:col-span-5 flex flex-col gap-3">
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs flex items-center justify-between border border-surface-container">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-on-surface">待调度工单队列</h2>
            <p className="text-[12px] text-on-surface-variant">
              点击选择工单实时进行智能网格算力匹配
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
          3 笔加急
        </span>
      </div>

      {/* Tickets List */}
      <div className="flex flex-col gap-3">
        {filteredOrders.map((order) => {
          const isSelected = order.id === selectedOrderId;
          const isDispatched = order.status === 'dispatched';

          return (
            <div
              key={order.id}
              onClick={() => onSelect(order.id)}
              className={`p-4 rounded-xl shadow-xs flex flex-col gap-3 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-surface-container-lowest border-l-4 border-l-primary border-primary/20 shadow-md ring-1 ring-primary/10'
                  : 'bg-surface-container-lowest hover:bg-surface-container-low/60 border-surface-container'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-primary text-[14px] font-mono">{order.id}</span>
                    {order.urgency === 'critical' ? (
                      <span className="px-1.5 py-0.5 rounded bg-error text-on-error text-[10px] font-bold">
                        紧急加急
                      </span>
                    ) : order.urgency === 'high' ? (
                      <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                        飞防统防
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[10px]">
                        {order.urgencyText}
                      </span>
                    )}
                    {order.specialSubsidy && (
                      <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                        {order.specialSubsidy}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-on-surface-variant mt-1">
                    报单: {order.reportedTime}{' '}
                    {order.waitingMinutes > 0 ? `(等待 ${order.waitingMinutes} 分钟)` : ''}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isDispatched
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-secondary-container text-on-secondary-container'
                  }`}
                >
                  {order.statusText}
                </span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1 text-[12px] border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[17px]">
                      person
                    </span>
                    {order.farmerName} {order.coopName ? `(${order.coopName})` : ''}
                  </span>
                  {order.farmerName === '刘建国' && (
                    <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                      VIP大客户
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    share_location
                  </span>
                  <span className="truncate">{order.location}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface pt-1">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      potted_plant
                    </span>
                    <span>
                      {order.crop} ({order.acreage} 亩)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-error">
                      coronavirus
                    </span>
                    <span className="text-error font-semibold truncate">{order.symptom}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[12px]">
                <div className="flex items-center gap-1 text-on-surface-variant truncate mr-2">
                  <span className="font-semibold">诉求:</span>
                  <span className="text-on-surface truncate">{order.requestedAction}</span>
                </div>
                <span className="text-primary font-semibold shrink-0 flex items-center gap-0.5">
                  智能推荐{' '}
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
