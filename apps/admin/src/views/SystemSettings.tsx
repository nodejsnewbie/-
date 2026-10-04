import React, { useState } from 'react';

interface SystemSettingsProps {
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ onShowToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'ministry' | 'amoeba' | 'roles'>('ministry');
  const [syncFreq, setSyncFreq] = useState('10s');
  const [apiKey, setApiKey] = useState('HN-MOA-CLOUD-SEC-2024-99812-PROD');
  const [diamondRatio, setDiamondRatio] = useState('1.35');
  const [goldRatio, setGoldRatio] = useState('1.25');
  const [silverRatio, setSilverRatio] = useState('1.10');
  const [mentorPerMu, setMentorPerMu] = useState('0.80');

  const handleSave = () => {
    onShowToast('系统全局合规配置与阿米巴参数已安全保存生效！', 'success');
  };

  return (
    <div className="flex flex-col w-full space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px]">
            <span className="inline-flex items-center text-primary font-semibold">企业合规管控中心</span>
            <span className="text-outline">/</span>
            <span>系统参数与权限治理</span>
          </div>
          <h1 className="text-[24px] font-bold text-primary tracking-tight mt-1">
            系统设置与合规权限中枢
          </h1>
          <p className="text-[12px] text-on-surface-variant">
            管控国家农业农村部监管云接口、阿米巴裂变收益系数矩阵、北斗高精度差分基站及多角色RBAC权限。
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[13px] font-bold shadow-xs active:scale-95 flex items-center gap-2 self-start lg:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>保存全局配置</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-2 text-[13px]">
        <button
          onClick={() => setActiveSubTab('ministry')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'ministry'
              ? 'bg-primary-container text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">policy</span>
          <span>国家农业部接口联网</span>
        </button>
        <button
          onClick={() => setActiveSubTab('amoeba')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'amoeba'
              ? 'bg-primary-container text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span>阿米巴分成系数引擎</span>
        </button>
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            activeSubTab === 'roles'
              ? 'bg-primary-container text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
          <span>角色权限控制 (RBAC)</span>
        </button>
      </div>

      {/* Tab 1: Ministry API */}
      {activeSubTab === 'ministry' && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div>
              <h3 className="font-bold text-primary text-[16px]">
                国家农业农村部农药质量安全追溯云系统 · 接口配置
              </h3>
              <p className="text-[12px] text-on-surface-variant">
                对接《湘农审字[2024]第091号准入规范》，实现法定农药经营许可证、一物一码追溯码双向同步。
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              接口链路：正常联通 (响应 18ms)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="text-[12px] font-bold text-on-surface block mb-1">
                部级安全数据直连端点 (API Gateway)
              </label>
              <input
                readOnly
                value="https://api.moa-gov-trace.cn/hunan/v2/dispatch-bridge"
                className="w-full p-2.5 bg-surface-container-low rounded-lg text-on-surface font-mono text-[12px] border border-surface-container"
              />
            </div>
            <div>
              <label className="text-[12px] font-bold text-on-surface block mb-1">
                政务专属凭证密匙 (National Security Key)
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2.5 bg-surface-container-lowest rounded-lg text-on-surface font-mono text-[12px] border border-surface-container focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[12px] font-bold text-on-surface block mb-1">
                实时农情与流向同步周期
              </label>
              <select
                value={syncFreq}
                onChange={(e) => setSyncFreq(e.target.value)}
                className="w-full p-2.5 bg-surface-container-lowest rounded-lg text-on-surface text-[13px] border border-surface-container cursor-pointer"
              >
                <option value="10s">10秒 (实况突发高频)</option>
                <option value="30s">30秒 (推荐生产标准)</option>
                <option value="60s">1分钟 (低带宽应急)</option>
              </select>
            </div>
            <div>
              <label className="text-[12px] font-bold text-on-surface block mb-1">
                银企直联专户 (中国农业银行财资云)
              </label>
              <input
                readOnly
                value="中国农业银行湖南省分行营业部 · 专户: 1845****0982"
                className="w-full p-2.5 bg-surface-container-low rounded-lg text-on-surface font-mono text-[12px] border border-surface-container"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Amoeba Rules */}
      {activeSubTab === 'amoeba' && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div>
              <h3 className="font-bold text-primary text-[16px]">阿米巴合伙人分成与导师系数规则引擎</h3>
              <p className="text-[12px] text-on-surface-variant">
                设置各级合伙人的产值提成系数与导师带徒专项每亩补贴。
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
              四级阶梯分红模型
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[13px]">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container">
              <div className="font-bold text-primary text-[14px]">钻石合伙人系数</div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">团队月产值 ≥ ¥10万</div>
              <input
                type="number"
                step="0.05"
                value={diamondRatio}
                onChange={(e) => setDiamondRatio(e.target.value)}
                className="w-full mt-3 p-2 bg-surface-container-lowest rounded-lg border border-surface-container font-mono font-bold text-on-surface text-[14px]"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container">
              <div className="font-bold text-tertiary text-[14px]">黄金合伙人系数</div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">团队月产值 ≥ ¥4万</div>
              <input
                type="number"
                step="0.05"
                value={goldRatio}
                onChange={(e) => setGoldRatio(e.target.value)}
                className="w-full mt-3 p-2 bg-surface-container-lowest rounded-lg border border-surface-container font-mono font-bold text-on-surface text-[14px]"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container">
              <div className="font-bold text-on-surface text-[14px]">白银合伙人系数</div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">带徒1-2人考核期</div>
              <input
                type="number"
                step="0.05"
                value={silverRatio}
                onChange={(e) => setSilverRatio(e.target.value)}
                className="w-full mt-3 p-2 bg-surface-container-lowest rounded-lg border border-surface-container font-mono font-bold text-on-surface text-[14px]"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container">
              <div className="font-bold text-secondary text-[14px]">师傅带徒每亩津贴 (元/亩)</div>
              <div className="text-[11px] text-on-surface-variant mt-0.5">徒弟独立作业时享受</div>
              <input
                type="number"
                step="0.1"
                value={mentorPerMu}
                onChange={(e) => setMentorPerMu(e.target.value)}
                className="w-full mt-3 p-2 bg-surface-container-lowest rounded-lg border border-surface-container font-mono font-bold text-secondary text-[14px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Roles */}
      {activeSubTab === 'roles' && (
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container">
            <div>
              <h3 className="font-bold text-primary text-[16px]">管理运营角色与权限矩阵 (RBAC)</h3>
              <p className="text-[12px] text-on-surface-variant">保障农资配药处方核销与资金出纳安全分权。</p>
            </div>
          </div>

          <div className="divide-y divide-surface-container text-[13px]">
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-on-surface">超级管理员 (运营总控中心)</div>
                <div className="text-[11px] text-on-surface-variant">拥有全网订单指派、资质审批、批量代发与系统配置最高权限</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-primary-container text-on-primary text-[11px] font-bold">
                完全控制 (Full Control)
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-on-surface">资质与合规审核专员</div>
                <div className="text-[11px] text-on-surface-variant">专司农药经营许可证AI比对、真伪验真、驳回及电子档案建立</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold">
                审核专权 (Audit Admin)
              </span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-on-surface">订单调度中心值班专员</div>
                <div className="text-[11px] text-on-surface-variant">负责突发虫害/气象预警转派、无人机航线跟踪及农户电话沟通</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant text-[11px] font-bold">
                调度专权 (Dispatch)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
