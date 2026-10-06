import React from 'react';

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'info';
}

export type { ToastMessage };

interface NotificationsModalProps {
  onClose: () => void;
  onGoToSupplyChain: () => void;
  onOpenAuditDrawer: () => void;
}

/** 系统突发预警与调度通知弹窗（自 App.tsx 原样迁入）。 */
export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  onClose,
  onGoToSupplyChain,
  onOpenAuditDrawer,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-5 shadow-2xl relative border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              notifications
            </span>
            <h3 className="font-bold text-primary text-[16px]">系统突发预警与调度通知</h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-3 space-y-2.5 text-[12px]">
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-1">
            <div className="flex items-center justify-between font-bold text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                窜货预警 · 监测能力待接入
              </span>
              <span className="text-[11px] font-medium">预留接口</span>
            </div>
            <p className="text-on-surface">
              「窜货预警 / 批次熔断」本期不做、二期评估（R6）。当前无实时窜货监测运行，界面与处置入口已预留，
              不会产生真实拦截或冻结事件。
            </p>
            <button onClick={onGoToSupplyChain} className="text-primary font-bold hover:underline">
              查看溯源与预留能力 →
            </button>
          </div>

          <div className="p-3 rounded-xl bg-tertiary-fixed/30 border border-tertiary-fixed space-y-1">
            <div className="flex items-center justify-between font-bold text-tertiary">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">pending_actions</span>
                新入网技师资质待审
              </span>
              <span>25分钟前</span>
            </div>
            <p className="text-on-surface">
              申请人 陈志平 (APP-2024-8902)
              提交了益阳市赫山区法定农药经营许可证原件，等待审核员人工核验（本期无 OCR 自动比对，该能力预留待接入）。
            </p>
            <button onClick={onOpenAuditDrawer} className="text-primary font-bold hover:underline">
              开启资质审核工作台 →
            </button>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-surface-container flex justify-end">
          <button
            className="px-4 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-semibold"
            onClick={onClose}
          >
            已全部标记已读
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

/** 浮动 Toast 通知栈（自 App.tsx 原样迁入）。 */
export const ToastStack: React.FC<ToastStackProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-60 flex flex-col gap-2 pointer-events-none max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-[13px] border animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-primary-container text-on-primary border-primary-fixed/30'
              : toast.type === 'warning'
                ? 'bg-error-container text-on-error-container border-error/20'
                : 'bg-surface-container-highest text-on-surface border-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === 'success'
              ? 'check_circle'
              : toast.type === 'warning'
                ? 'warning'
                : 'info'}
          </span>
          <span className="flex-1 font-medium">{toast.text}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="opacity-70 hover:opacity-100 text-[14px]"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
