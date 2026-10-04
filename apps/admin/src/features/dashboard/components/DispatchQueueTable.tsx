import React from 'react';

interface DispatchQueueTableProps {
  dispatchedOrders: string[];
  onQuickDispatch: (orderCode: string) => void;
  onNavigateTab: (tab: string) => void;
}

/** 待调度工单与高危农情预警队列（静态示例行 + 一键派单，原样迁入）。 */
export const DispatchQueueTable: React.FC<DispatchQueueTableProps> = ({
  dispatchedOrders,
  onQuickDispatch,
  onNavigateTab,
}) => {
  return (
    <div className="xl:col-span-8 bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container gap-2">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-md bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </span>
          <div>
            <h3 className="text-[16px] font-bold text-on-surface">待调度工单与高危农情预警队列</h3>
            <p className="text-[12px] text-on-surface-variant">
              包含 4 个紧急气象靶标预警及 8 个常规预约
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-semibold">
            全部靶标 (12)
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-error/10 text-error text-[11px] font-bold">
            高危预警 (4)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto py-2">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-semibold">
              <th className="py-2.5 px-3 rounded-l-lg">工单编号</th>
              <th className="py-2.5 px-3">农户 / 地块档案</th>
              <th className="py-2.5 px-3">作业面积</th>
              <th className="py-2.5 px-3">作物 & 靶标</th>
              <th className="py-2.5 px-3">智能推荐农艺师</th>
              <th className="py-2.5 px-3 rounded-r-lg text-right">调度操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-on-surface">
            {/* Row 1 */}
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-3 px-3">
                <div className="font-bold text-primary font-mono text-[12px]">#HN-20240414-019</div>
                <div className="text-[11px] text-error flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                  <span>距降雨还剩 3.5h</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-on-surface text-[13px]">刘建国 (种粮大户)</div>
                <div className="text-[11px] text-on-surface-variant">湖南益阳市赫山区兰溪镇4组</div>
              </td>
              <td className="py-3 px-3">
                <span className="font-bold text-on-surface font-mono text-[13px]">120 亩</span>
                <div className="text-[11px] text-on-surface-variant">集中连片平原田</div>
              </td>
              <td className="py-3 px-3">
                <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold">
                  水稻纹枯病暴发
                </span>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  配方: 噻呋酰胺+戊唑醇
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary text-[11px] font-bold flex items-center justify-center">
                    王
                  </div>
                  <div>
                    <div className="font-semibold text-on-surface text-[12px]">王海林 (5★机手)</div>
                    <div className="text-[11px] text-secondary font-medium">
                      距田块 2.8km · 空闲
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3 text-right">
                <button
                  onClick={() => onQuickDispatch('#HN-20240414-019')}
                  className={`px-3 py-1.5 rounded-lg text-on-primary text-[12px] font-bold transition-all shadow-xs active:scale-95 ${
                    dispatchedOrders.includes('#HN-20240414-019')
                      ? 'bg-secondary'
                      : 'bg-primary hover:bg-primary-container'
                  }`}
                >
                  {dispatchedOrders.includes('#HN-20240414-019') ? '已派单' : '一键派单'}
                </button>
              </td>
            </tr>

            {/* Row 2 */}
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-3 px-3">
                <div className="font-bold text-primary font-mono text-[12px]">#HN-20240414-022</div>
                <div className="text-[11px] text-tertiary-container flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>预约今日 14:00</span>
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-on-surface text-[13px]">陈金水 (柑橘合作社)</div>
                <div className="text-[11px] text-on-surface-variant">湖南常德市汉寿县太子庙</div>
              </td>
              <td className="py-3 px-3">
                <span className="font-bold text-on-surface font-mono text-[13px]">85 亩</span>
                <div className="text-[11px] text-on-surface-variant">丘陵山地果园</div>
              </td>
              <td className="py-3 px-3">
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                  柑橘红蜘蛛及木虱
                </span>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  配方: 联苯肼酯+螺螨酯
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary text-[11px] font-bold flex items-center justify-center">
                    李
                  </div>
                  <div>
                    <div className="font-semibold text-on-surface text-[12px]">
                      李德全 (资深植保)
                    </div>
                    <div className="text-[11px] text-secondary font-medium">
                      距田块 5.1km · 作业将结
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3 text-right">
                <button
                  onClick={() => onQuickDispatch('#HN-20240414-022')}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                    dispatchedOrders.includes('#HN-20240414-022')
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  {dispatchedOrders.includes('#HN-20240414-022') ? '已派单' : '指派调整'}
                </button>
              </td>
            </tr>

            {/* Row 3 */}
            <tr className="hover:bg-surface-container/50 transition-colors">
              <td className="py-3 px-3">
                <div className="font-bold text-primary font-mono text-[12px]">#HN-20240414-025</div>
                <div className="text-[11px] text-on-surface-variant">普通预约工单</div>
              </td>
              <td className="py-3 px-3">
                <div className="font-bold text-on-surface text-[13px]">彭雪梅 (家庭农场)</div>
                <div className="text-[11px] text-on-surface-variant">湖南岳阳市华容县三封寺</div>
              </td>
              <td className="py-3 px-3">
                <span className="font-bold text-on-surface font-mono text-[13px]">230 亩</span>
                <div className="text-[11px] text-on-surface-variant">高标准芥菜示范基地</div>
              </td>
              <td className="py-3 px-3">
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px]">
                  叶斑病预防与营养调理
                </span>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  配方: 吡唑醚菌酯+氨基酸
                </div>
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold flex items-center justify-center">
                    周
                  </div>
                  <div>
                    <div className="font-semibold text-on-surface text-[12px]">
                      周志成创客组 (4机手)
                    </div>
                    <div className="text-[11px] text-secondary font-medium">团队就绪 · 待命</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-3 text-right">
                <button
                  onClick={() => onQuickDispatch('#HN-20240414-025')}
                  className={`px-3 py-1.5 rounded-lg text-on-primary text-[12px] font-bold transition-all shadow-xs active:scale-95 ${
                    dispatchedOrders.includes('#HN-20240414-025')
                      ? 'bg-secondary'
                      : 'bg-primary hover:bg-primary-container'
                  }`}
                >
                  {dispatchedOrders.includes('#HN-20240414-025') ? '已派单' : '一键派单'}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-surface-container text-[12px]">
        <span className="text-on-surface-variant">显示 3 条，共有 12 条待调度记录</span>
        <button
          onClick={() => onNavigateTab('order-dispatch-and-scheduling')}
          className="text-primary font-bold hover:underline flex items-center"
        >
          查看全部待办工单队列{' '}
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
