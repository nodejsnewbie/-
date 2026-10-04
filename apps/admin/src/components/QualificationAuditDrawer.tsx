import React, { useState } from 'react';
import type { AuditApplication } from '../types/index.ts';

interface QualificationAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditData?: AuditApplication | null;
  onApprove: (id: string, notes: string) => Promise<void>;
  onReject: (id: string, action: 'reject' | 'revision') => Promise<void>;
}

export const QualificationAuditDrawer: React.FC<QualificationAuditDrawerProps> = ({
  isOpen,
  onClose,
  auditData,
  onApprove,
  onReject,
}) => {
  const [selectedTeam, setSelectedTeam] = useState('益阳兰溪创客军团 (彭明辉导师组)');
  const [coefficient, setCoefficient] = useState('1.00x (新人学员初始档)');
  const [notes, setNotes] = useState('农药经营许可证原件清晰合规，省农业农村厅数据核验无误，准予通过建档并开启在线工单派发。');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show4KModal, setShow4KModal] = useState(false);

  if (!isOpen) return null;

  const data = auditData || {
    id: 'AUD-20241108-014',
    code: 'APP-2024-8902',
    applicantName: '陈志平',
    applicantType: '新入网技师申请',
    idCard: '43090319920815****',
    phone: '177****5531',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDR_tkZnaP-kHPIFkgu4GYyAW_cCExTpN4ubj2_UtULeJjbNggXQIsWc1M-nQ_AbCen_VC3ydjpS1mvebDpMF1T1CuQTreLpK3T68jjLeY9lck3FERZEOW3IaUI5judEj4xmfSaEEPCiNUXW-TUgYyDNZOfdpSoW_4yiUg7kuu1SqYTYxX6VPnxelItIVFupryd5dDdLiOStOaKIC2Y_A9JTomnmF7oh5-x1a7BaJfdopwqKjoDQaB',
    targetGrid: '湖南省益阳市赫山区兰溪镇服务中心',
    urgent: true,
    licenseNumber: '湘农经许字(2024)第0918号',
    licenseScanUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh1s8mg6ip3oI-qxhAlq0BtBFicBkSucGfFl8f743OT_FhzYRYiPJewdyFKMbj326rCsXGCTJXBtK5SXmP9Cl3mIiUDUhsMyVxCKifdxrCiOGQGJ9EgqB3x9veBWI-5f2303t_Q__PLfBZsmjsUcf4RGB5WKVmKtCN0QmvLYh8PDQFqDKAW1JqKiR6hSWbd4WNQDKI5AXae4tfDOzFM6oQer6rqVdSBD-G4sziw-H1fJahyb2yG-qj',
    licenseAuthority: '益阳市赫山区农业农村局',
    ocrMatchRate: 98.4,
    nationalRegistryVerified: true,
    identityFaceMatched: true,
    permittedScope: '限制使用农药以外的农药',
    validPeriod: '2024-09-10 至 2029-09-09',
    assignedAmoebaTeam: '益阳兰溪创客军团 (彭明辉导师组)',
    amoebaCoefficient: '1.00x (新人学员初始档)',
    auditNotes: '农药经营许可证原件清晰合规，省农业农村厅数据核验无误，准予通过建档并开启在线工单派发。',
    status: 'pending' as const,
  };

  const handleApproveClick = async () => {
    try {
      setIsSubmitting(true);
      await onApprove(data.id, notes);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectClick = async (action: 'reject' | 'revision') => {
    try {
      setIsSubmitting(true);
      await onReject(data.id, action);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-surface-container-lowest shadow-2xl z-50 flex flex-col border-l border-surface-container transition-transform duration-300 ease-in-out">
        {/* Drawer Header */}
        <div className="h-16 px-6 bg-surface-container-low flex items-center justify-between border-b border-surface-container shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
            <div>
              <h3 className="font-bold text-primary text-[17px]">资质证书核验工作台</h3>
              <span className="text-[12px] text-on-surface-variant">
                工单编号: {data.id} · 待审核入库
              </span>
            </div>
          </div>
          <button
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Drawer Content Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Applicant Snapshot */}
          <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-4">
              <img
                className="w-14 h-14 rounded-full object-cover shadow-sm bg-surface-container"
                alt="陈志平 证件照"
                src={data.avatar}
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-[18px]">{data.applicantName}</span>
                  <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                    {data.applicantType}
                  </span>
                </div>
                <span className="text-[12px] text-on-surface-variant mt-0.5">
                  身份证号: {data.idCard} · 手机号: {data.phone}
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  申请入驻网格: {data.targetGrid}
                </span>
              </div>
            </div>
            {data.urgent && (
              <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container text-[12px] font-bold">
                加急审核
              </span>
            )}
          </div>

          {/* Government Pesticide Business License Document Review Module */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-primary text-[15px] flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">description</span>
                <span>法定农药经营许可证 (提交原件扫码件)</span>
              </h4>
              <span className="text-secondary text-[12px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                <span>AI OCR 字段自动比对完成 (合规可信度 {data.ocrMatchRate}%)</span>
              </span>
            </div>

            {/* High-res Document Preview Container */}
            <div className="rounded-xl overflow-hidden bg-surface-container relative group shadow-sm border border-surface-container">
              <img
                className="w-full h-80 object-cover"
                alt="中华人民共和国农药经营许可证原件扫码件"
                src={data.licenseScanUrl}
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShow4KModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-inverse-surface/90 text-inverse-on-surface text-[12px] font-medium backdrop-blur flex items-center gap-1 hover:bg-inverse-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>查看高清大图 (4K)</span>
                </button>
              </div>
            </div>
          </div>

          {/* OCR Extracted Data Matrix for Official Cross-Check */}
          <div className="space-y-1.5">
            <h4 className="font-semibold text-on-surface text-[13px] mb-2">
              国家农业农村云监管接口校对结果:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              <div className="p-3 bg-surface-container rounded-lg">
                <span className="text-[11px] text-on-surface-variant block">许可证编号 (OCR读取)</span>
                <span className="font-mono font-bold text-primary">{data.licenseNumber}</span>
                <span className="text-secondary text-[11px] block mt-0.5">✔ 编号与省厅数据库登记一致</span>
              </div>
              <div className="p-3 bg-surface-container rounded-lg">
                <span className="text-[11px] text-on-surface-variant block">经营主体 / 持有人</span>
                <span className="font-bold text-primary">{data.applicantName} (本人申报一致)</span>
                <span className="text-secondary text-[11px] block mt-0.5">✔ 实名身份人脸比对吻合</span>
              </div>
              <div className="p-3 bg-surface-container rounded-lg">
                <span className="text-[11px] text-on-surface-variant block">许可经营范围</span>
                <span className="font-bold text-on-surface">{data.permittedScope}</span>
                <span className="text-secondary text-[11px] block mt-0.5">✔ 符合民用植保飞防作业资质</span>
              </div>
              <div className="p-3 bg-surface-container rounded-lg">
                <span className="text-[11px] text-on-surface-variant block">有效期限</span>
                <span className="font-bold text-on-surface">{data.validPeriod}</span>
                <span className="text-secondary text-[11px] block mt-0.5">✔ 效期充足 (5年有效)</span>
              </div>
            </div>
          </div>

          {/* Amoeba Partner Configuration Assignment */}
          <div className="p-4 rounded-xl bg-surface-container-low space-y-3 border border-surface-container">
            <h4 className="font-bold text-primary text-[14px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              <span>入库阿米巴战队及导师绑定配置</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] text-on-surface-variant block mb-1">分配所属阿米巴小组</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full p-2 bg-surface-container-lowest rounded-lg border border-surface-container text-[13px] font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="益阳兰溪创客军团 (彭明辉导师组)">益阳兰溪创客军团 (彭明辉导师组)</option>
                  <option value="长沙安沙先锋创客组">长沙安沙先锋创客组</option>
                  <option value="常德鼎城绿色粮仓战队">常德鼎城绿色粮仓战队</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] text-on-surface-variant block mb-1">初始阿米巴分红系数</label>
                <input
                  type="text"
                  value={coefficient}
                  onChange={(e) => setCoefficient(e.target.value)}
                  className="w-full p-2 bg-surface-container-lowest rounded-lg border border-surface-container text-[13px] font-medium text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Audit Decision Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-on-surface text-[13px] block">
              审核复核审核意见 / 批注
            </label>
            <textarea
              className="w-full p-3 bg-surface-container rounded-xl text-on-surface text-[13px] focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50 border border-surface-container"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="h-20 px-6 bg-surface-container-low flex items-center justify-between border-t border-surface-container shrink-0">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium transition-colors"
              onClick={onClose}
              type="button"
            >
              取消
            </button>
            <button
              className="px-4 py-2 rounded-lg hover:bg-error-container text-error text-[13px] font-medium transition-colors"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRejectClick('revision')}
            >
              退回补正材料
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-surface-container text-error hover:bg-error-container transition-colors text-[13px] font-bold"
              type="button"
              disabled={isSubmitting}
              onClick={() => handleRejectClick('reject')}
            >
              驳回拒绝
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all text-[14px] font-bold shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-60"
              type="button"
              disabled={isSubmitting}
              onClick={handleApproveClick}
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{isSubmitting ? '处理中...' : '审核通过并准入入库'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 4K Modal */}
      {show4KModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-60 flex items-center justify-center p-4"
          onClick={() => setShow4KModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full p-4 overflow-hidden relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <span className="font-bold text-primary text-[16px]">
                中华人民共和国农药经营许可证 (4K 高清防伪扫描存证)
              </span>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setShow4KModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-3 max-h-[75vh] overflow-auto flex items-center justify-center">
              <img
                src={data.licenseScanUrl}
                alt="4K 扫描件"
                className="w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
