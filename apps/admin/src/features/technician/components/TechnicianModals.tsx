import React from 'react';
import type { Technician } from '@hnhall/shared';

/** 技师域的三个弹窗：电子档案 / 应急机动队调度 / 阿米巴分成矩阵（自 TechnicianManagement 原样迁入）。 */

interface TechnicianDossierModalProps {
  tech: Technician;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const TechnicianDossierModal: React.FC<TechnicianDossierModalProps> = ({
  tech,
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
            <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
            <h3 className="font-bold text-primary text-[16px]">
              技术人员合规电子档案 · {tech.name}
            </h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low">
            <img src={tech.avatar} alt={tech.name} className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-primary">{tech.name}</span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                  {tech.title}
                </span>
              </div>
              <div className="text-[12px] text-on-surface-variant mt-1">
                系统工号: {tech.code} · 联系电话: {tech.phone}
              </div>
              <div className="text-[11px] text-secondary font-semibold mt-0.5">
                实名认证状态: 身份证与人脸生物识别已核准入库
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div className="p-3 rounded-lg bg-surface-container">
              <span className="text-on-surface-variant block">法定经营许可证编号</span>
              <span className="font-mono font-bold text-on-surface text-[13px]">
                {tech.licenseNumber}
              </span>
              <span className="text-secondary block mt-0.5">✔ 有效期至 {tech.licenseExpiry}</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container">
              <span className="text-on-surface-variant block">所属阿米巴创客战队</span>
              <span className="font-bold text-on-surface text-[13px]">{tech.teamName}</span>
              <span className="text-tertiary block mt-0.5">
                分红系数: {tech.amoebaCoefficient}x
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container">
              <span className="text-on-surface-variant block">累计履约单量与面积</span>
              <span className="font-bold text-on-surface text-[13px]">
                {tech.completedOrders} 单 · {tech.operationAcreage} 亩
              </span>
              <span className="text-on-surface-variant block mt-0.5">
                好评率 {tech.goodReviewRate}%
              </span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container">
              <span className="text-on-surface-variant block">绑定专业农用机具</span>
              <span className="font-bold text-on-surface text-[13px]">{tech.boundEquipment}</span>
              <span className="text-secondary block mt-0.5">✔ 农机作业北斗终端已联网</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-surface-container flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium"
            onClick={onClose}
          >
            关闭档案
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold shadow-xs"
            onClick={() => {
              onShowToast(`已下载生成 ${tech.name} 的《国家植保从业合规档案.pdf》`, 'success');
              onClose();
            }}
          >
            下载合规归档证明
          </button>
        </div>
      </div>
    </div>
  );
};

interface GridDispatchModalProps {
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const GridDispatchModal: React.FC<GridDispatchModalProps> = ({ onClose, onShowToast }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              emergency_share
            </span>
            <h3 className="font-bold text-primary text-[16px]">跨网格农忙应急机动队快速调度</h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="mt-3 space-y-3 text-[13px] text-on-surface">
          <p className="text-on-surface-variant">
            检测到长沙县北部、常德鼎城区进入早稻拔节期与油菜秋播高峰，可调派 40
            名高工机手机动编队驰援：
          </p>
          <div className="p-3 rounded-lg bg-surface-container space-y-1.5 font-medium">
            <div className="flex justify-between">
              <span>机动队编号:</span>
              <span className="font-mono text-primary font-bold">EMG-HUNAN-08</span>
            </div>
            <div className="flex justify-between">
              <span>待命机手:</span>
              <span className="text-secondary font-bold">40 名带机飞手 (大疆T60/极飞P100)</span>
            </div>
            <div className="flex justify-between">
              <span>调派集结时效:</span>
              <span className="font-bold">≤ 90 分钟抵达现场</span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[13px] font-bold shadow-sm"
            onClick={() => {
              onShowToast('应急机动队指令已下发！已向40位待命机手推送紧急集合令。', 'success');
              onClose();
            }}
          >
            确认下达机动调度令
          </button>
        </div>
      </div>
    </div>
  );
};

interface AmoebaMatrixModalProps {
  onClose: () => void;
}

export const AmoebaMatrixModal: React.FC<AmoebaMatrixModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 relative shadow-2xl border border-surface-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[22px]">payments</span>
            <h3 className="font-bold text-primary text-[16px]">阿米巴裂变分成矩阵测算</h3>
          </div>
          <button
            className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="mt-3 space-y-3 text-[13px]">
          <div className="p-3 bg-surface-container-low rounded-lg space-y-2">
            <div className="flex justify-between font-bold text-primary">
              <span>1. 基础作业提成</span>
              <span>70% ~ 80%</span>
            </div>
            <div className="flex justify-between text-on-surface-variant text-[12px]">
              <span>2. 溯源处方药剂利润分红</span>
              <span>10% ~ 15%</span>
            </div>
            <div className="flex justify-between text-on-surface-variant text-[12px]">
              <span>3. 徒弟裂变带教津贴</span>
              <span>¥0.5~¥1.2 / 亩</span>
            </div>
            <div className="flex justify-between text-on-surface-variant text-[12px]">
              <span>4. 年终阿米巴资本股权池</span>
              <span>5% ~ 8%</span>
            </div>
          </div>
          <p className="text-[11px] text-on-surface-variant">
            对标阿米巴独立核算单元，支持银企直联安全批量代发、一键预提代扣个税与电子签约合规存证。
          </p>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold"
            onClick={onClose}
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
