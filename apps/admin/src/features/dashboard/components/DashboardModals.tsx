import React from 'react';

/** 总览页两个弹窗：紧急调度令发布 / 鹰眼全屏监控（自 DashboardOverview 原样迁入）。 */

interface EmergencyDispatchModalProps {
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const EmergencyDispatchModal: React.FC<EmergencyDispatchModalProps> = ({
  onClose,
  onShowToast,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2 text-error">
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
            <h3 className="text-[17px] font-bold">全网农情紧急调度令发布</h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="mt-3 space-y-3 text-[13px]">
          <p className="text-on-surface-variant">
            向当前辖区内所有在线一线植保机手与合作社无人机群推送强对流防御或突发虫灾统防指令：
          </p>
          <div className="space-y-2">
            <label className="block text-[12px] font-bold text-on-surface">选择发布指令等级</label>
            <select className="w-full p-2.5 bg-surface-container rounded-lg border border-surface-container text-[13px] font-medium outline-none">
              <option>一级红色预警 · 暴发性稻飞虱应急压控 (4小时内全部出动)</option>
              <option>二级橙色预警 · 局地短时暴雨暂停高空作业 (就近归仓)</option>
              <option>三级黄色响应 · 气温骤降农作物防冻叶面肥统喷</option>
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-surface-container pt-3">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-error hover:bg-error/90 text-on-error text-[13px] font-bold shadow-xs active:scale-95"
            onClick={() => {
              onShowToast(
                '全网紧急调度令已下发！已向 386 位在册一线技师小程序群发广播通知。',
                'success',
              );
              onClose();
            }}
          >
            下发红色调度令
          </button>
        </div>
      </div>
    </div>
  );
};

interface EagleEyeModalProps {
  onClose: () => void;
}

export const EagleEyeModal: React.FC<EagleEyeModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              satellite_alt
            </span>
            <h3 className="font-bold text-primary text-[17px]">
              全屏鹰眼数字农业调度总控 · 实时卫星与北斗基站
            </h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="mt-4 relative h-96 rounded-xl overflow-hidden shadow-inner border border-surface-container">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmIndBmPvG8BX_ZAiMZmi37ftBKiOFJfqngikr2akN_1UG5jNguIk2q6614zoQP5u7hjB2FYu-AspFm38AhEG5ORRz7pEWvgE3CwzCA5xEufQS1tfikYWcmN9CqNXiNOflFqLVai02zOEzVvwbpFLol8X2-GOwBLJNhH3dqbQGQ9n_UKGzRLEc_41b74rbMv-od0NCAq9088oaf2buBE6W7zLg1JDOGDGiAoxy3wXFYdUJQB0dKOjm"
            alt="鹰眼卫星底图"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
          <div className="absolute top-4 left-4 p-3 rounded-lg bg-black/60 backdrop-blur text-white text-[12px] space-y-1">
            <div className="font-bold text-secondary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              北斗RTK厘米级差分基站：全域24基站锁定
            </div>
            <div>飞行中作业机组: 38 架次 (大疆T60/极飞P100)</div>
            <div>实时气象雷达: 洞庭湖平原风速 2.4m/s · 优良作业窗口</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
            onClick={onClose}
          >
            退出鹰眼全屏
          </button>
        </div>
      </div>
    </div>
  );
};
