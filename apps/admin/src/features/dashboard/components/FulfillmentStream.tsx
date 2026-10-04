import React from 'react';

interface FulfillmentStreamProps {
  onOpenEagleEye: () => void;
}

/** 右侧实时履约流水面板（静态示意流，原样迁入）。 */
export const FulfillmentStream: React.FC<FulfillmentStreamProps> = ({ onOpenEagleEye }) => {
  return (
    <div className="xl:col-span-4 bg-surface-container-lowest p-5 rounded-xl shadow-xs flex flex-col justify-between border border-surface-container">
      <div className="flex items-center justify-between pb-3 border-b border-surface-container">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
          </span>
          <h3 className="text-[16px] font-bold text-on-surface">实时履约流水</h3>
        </div>
        <span className="text-[11px] text-on-surface-variant">卫星定位校核</span>
      </div>

      <div className="space-y-4 py-2">
        {/* Stream 1 */}
        <div className="flex gap-3 items-start">
          <div className="p-1 rounded-full bg-primary-fixed text-on-primary-fixed mt-0.5">
            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-on-surface">农艺师现场打卡签到</span>
              <span className="text-[11px] text-on-surface-variant">2分钟前</span>
            </div>
            <p className="text-[12px] text-on-surface-variant truncate">
              李国华技师已到达益阳市大通湖千亩水稻田
            </p>
            <div className="mt-1 flex items-center gap-2.5">
              <img
                className="w-14 h-14 rounded-lg object-cover shadow-xs border border-surface-container"
                alt="现场打卡签到"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFQMhHJU2sBN02qvJWNWnPCh3e15rfWL5rfOnjzeafwiTGn-4PNlaR-atQ5KfhiksCEmzps-zaA2uzQkAYLRhAy5EPD8eO88EcVIc5XFdcNI1mQbp-btWah6NaFFqMPFd5FC1hQddfszSqSMO-6HPYt9evhOWiX5K_RtYFcfuJmopRV9UaiLx5FtFOOyIyMf-ul4AiwJrkFCGKR2J3fbSF9aBj3_Z_UlIE_EPuVMl6I-6bvsMeSKai"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col text-on-surface-variant text-[11px]">
                <span className="text-primary font-bold">GPS: 29.214N, 112.441E</span>
                <span>机型: 大疆 T50 满载试飞</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stream 2 */}
        <div className="flex gap-3 items-start">
          <div className="p-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed mt-0.5">
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-on-surface">一物一码出库核验成功</span>
              <span className="text-[11px] text-on-surface-variant">8分钟前</span>
            </div>
            <p className="text-[12px] text-on-surface-variant truncate">
              订单 #HN-20240414-015 溯源出库完成
            </p>
            <div className="mt-1 p-2 bg-surface-container-low rounded-lg text-[11px] border border-surface-container">
              <div className="flex justify-between text-on-surface">
                <span className="font-mono text-[11px]">溯源码: 86.10294.041842</span>
                <span className="text-secondary font-bold">三证合规</span>
              </div>
              <div className="text-on-surface-variant text-[10px] truncate mt-0.5">
                原药生产批次: 20240315-A4 · 农药登记证号已挂网
              </div>
            </div>
          </div>
        </div>

        {/* Stream 3 */}
        <div className="flex gap-3 items-start">
          <div className="p-1 rounded-full bg-secondary-container text-on-secondary-container mt-0.5">
            <span className="material-symbols-outlined text-[16px]">draw</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-on-surface">农户电子手写签字验收</span>
              <span className="text-[11px] text-on-surface-variant">14分钟前</span>
            </div>
            <p className="text-[12px] text-on-surface-variant truncate">
              桃江县修山镇 160亩 茶园病虫统防统治竣工
            </p>
            <div className="mt-1 flex items-center justify-between p-2 bg-surface-container-low rounded-lg text-[11px] border border-surface-container">
              <span className="text-on-surface font-medium">验收评星: ★★★★★ (5.0)</span>
              <span className="text-primary font-bold font-mono">结算分红池入账 ¥420.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-surface-container flex items-center justify-between text-[12px]">
        <span className="text-on-surface-variant">全国即时通信链路正常</span>
        <button
          onClick={onOpenEagleEye}
          className="text-primary font-bold hover:underline flex items-center gap-0.5"
        >
          <span>全屏鹰眼监控</span>
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
        </button>
      </div>
    </div>
  );
};

interface EmergencyHotlineProps {
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

/** 应急调度热线横幅（原样迁入）。 */
export const EmergencyHotline: React.FC<EmergencyHotlineProps> = ({ onShowToast }) => {
  return (
    <div className="p-4 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 border border-surface-container">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined text-[20px]">support_agent</span>
        </div>
        <div>
          <div className="text-[14px] font-bold text-on-surface">
            突发爆发性暴雨或暴发虫害热线 (调度绿色通道)
          </div>
          <div className="text-[12px] text-on-surface-variant">
            全天候专家 1 对 1 田头视频问诊接入 · 无人机备用机组响应半径 ≤ 15km
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[17px] font-mono font-extrabold text-primary">400-880-9188</span>
        <button
          onClick={() => {
            onShowToast('正在转接湖南应急调度台专线 400-880-9188...', 'info');
          }}
          className="px-4 py-2 rounded-lg bg-tertiary-container hover:bg-tertiary text-on-tertiary text-[12px] font-bold transition-all shadow-xs active:scale-95"
        >
          拨打应急调度台
        </button>
      </div>
    </div>
  );
};
