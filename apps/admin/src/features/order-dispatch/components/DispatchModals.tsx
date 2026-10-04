import React from 'react';
import type { WorkOrder } from '@hnhall/shared';

/** 派单页两个弹窗：工单详情 / 电话沟通（自 OrderDispatch 原样迁入）。 */

interface OrderDetailModalProps {
  order: WorkOrder;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onShowToast,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 relative shadow-2xl border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">description</span>
            <h3 className="font-bold text-primary text-[16px]">
              工单全程履约数字凭证 · {order.id}
            </h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3 text-[13px]">
          <div className="p-3 bg-surface-container-low rounded-xl space-y-1.5 border border-surface-container">
            <div className="flex justify-between font-medium">
              <span className="text-on-surface-variant">农户姓名:</span>
              <span className="font-bold text-on-surface">{order.farmerName}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-on-surface-variant">作业地块:</span>
              <span className="text-on-surface">{order.location}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-on-surface-variant">作物与面积:</span>
              <span className="font-mono text-primary font-bold">
                {order.crop} · {order.acreage} 亩
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-on-surface-variant">实地诊断靶标:</span>
              <span className="text-error font-bold">{order.symptom}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-on-surface-variant">电子处方编码:</span>
              <span className="font-mono font-bold text-secondary">
                {order.prescriptionCode || 'RX-HN-20241028-0842'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-surface-container flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
            onClick={onClose}
          >
            关闭
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold"
            onClick={() => {
              onShowToast(`已下载工单 ${order.id} 的国家标准化植保履约验收报告.pdf`, 'success');
              onClose();
            }}
          >
            下载国家验收报告
          </button>
        </div>
      </div>
    </div>
  );
};

interface CallModalProps {
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 text-center relative shadow-2xl border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <span className="material-symbols-outlined text-[32px] animate-bounce">call</span>
        </div>
        <h3 className="font-bold text-on-surface text-[17px]">正在呼叫一线网格专员</h3>
        <p className="text-[13px] text-on-surface-variant mt-1">张茂林 (农艺师) · 139****2210</p>
        <p className="text-[12px] text-secondary font-medium mt-2">
          专线电话已建立 · 通话全程进行农业服务合规录音存证
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-error text-on-error text-[13px] font-bold shadow-xs hover:bg-error/90"
          >
            挂断通话
          </button>
        </div>
      </div>
    </div>
  );
};
