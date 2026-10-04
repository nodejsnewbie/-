import React, { useState } from 'react';
import type { Technician } from '../types/index.ts';

interface TechnicianManagementProps {
  technicians: Technician[];
  onOpenAuditDrawer: () => void;
  onRefresh: () => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const TechnicianManagement: React.FC<TechnicianManagementProps> = ({
  technicians,
  onOpenAuditDrawer,
  onRefresh,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'tree'>('roster');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTechForDossier, setSelectedTechForDossier] = useState<Technician | null>(null);
  const [showAmoebaMatrixModal, setShowAmoebaMatrixModal] = useState(false);
  const [showGridDispatchModal, setShowGridDispatchModal] = useState(false);

  // Filter list
  const filteredTechs = technicians.filter((t) => {
    if (filterType === 'gold' && t.amoebaTier !== 'gold') return false;
    if (filterType === 'expiring' && t.licenseStatus !== 'expiring') return false;
    if (filterType === 'active' && t.dispatchStatus !== 'active') return false;
    if (filterType === 'top_mentor' && t.menteeCount < 3) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        t.name.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.licenseNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTechs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTechs.map((t) => t.id));
    }
  };

  return (
    <div className="flex flex-col w-full space-y-5">
      {/* Top Command & Status Ribbon */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold tracking-wide">
              国家农业农村部合规标准联网端
            </span>
            <span className="text-on-surface-variant text-[12px]">
              · 湘农审字[2024]第091号准入规范
            </span>
          </div>
          <h1 className="text-[24px] font-bold text-primary tracking-tight">
            技术人员管理与合规资质审核中心
          </h1>
          <p className="text-[13px] text-on-surface-variant mt-1">
            负责全网300-400名一线植保机手、农药配方师实名建档、法定经营许可证全量核验与阿米巴合伙人层级权益配置。
          </p>
        </div>

        {/* Quick Operations Action Group */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onShowToast('正在导出《华农智服 2024 全网技术人员在册合规花名册.xlsx》', 'info')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors text-[13px] font-semibold shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_download</span>
            <span>导出在册花名册</span>
          </button>
          <button
            onClick={() => {
              setFilterType('expiring');
              onShowToast('已过滤出 30 天内即将到期须复核换证的 6 位技术人员', 'warning');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors text-[13px] font-semibold shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
            <span>批量发证效期预警(6)</span>
          </button>
          <button
            onClick={onOpenAuditDrawer}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-all text-[14px] font-bold shadow-sm active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            <span>处理待审核资质 (14)</span>
          </button>
        </div>
      </div>

      {/* Metric Overview Grid (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Workforce Total */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between z-10">
            <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              全国一线技术人员总库
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </span>
          </div>
          <div className="mt-3 z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-extrabold text-primary font-mono tabular-nums">386</span>
              <span className="text-[13px] text-on-surface-variant">人</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[12px]">
              <span className="text-on-surface-variant">在岗活跃实时调度</span>
              <span className="text-secondary font-bold font-mono">342 人 (88.6%)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Pending Audits */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between z-10">
            <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              待审核入库资质
            </span>
            <span className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </span>
          </div>
          <div className="mt-3 z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-extrabold text-error font-mono tabular-nums">14</span>
              <span className="text-[13px] text-on-surface-variant">份加急</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[12px]">
              <span className="text-on-surface-variant">平均审核时效目标</span>
              <span className="text-error font-bold font-mono">≤ 2.0 小时 (已超时 2)</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Pesticide Business License Compliance */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between z-10">
            <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              农药经营许可证持证率
            </span>
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </span>
          </div>
          <div className="mt-3 z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-extrabold text-secondary font-mono tabular-nums">95.3%</span>
              <span className="text-[13px] text-on-surface-variant">368 / 386 人</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[12px]">
              <span className="text-on-surface-variant">三证齐全验真上云</span>
              <span className="text-secondary font-bold">农业农村厅接口直连</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Amoeba Partners */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container">
          <div className="flex items-center justify-between z-10">
            <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              认证合伙人 / 阿米巴骨干
            </span>
            <span className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
            </span>
          </div>
          <div className="mt-3 z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-extrabold text-tertiary font-mono tabular-nums">85</span>
              <span className="text-[13px] text-on-surface-variant">人 (带徒裂变中)</span>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container text-[12px]">
              <span className="text-on-surface-variant">本月裂变师徒战队</span>
              <span className="text-tertiary font-bold">28 个创客小组</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Navigation Tabs & Filter Row */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs space-y-3 border border-surface-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container pb-3">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'roster'
                  ? 'bg-primary-container text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>技师全景花名册 (386)</span>
            </button>
            <button
              onClick={onOpenAuditDrawer}
              className="px-4 py-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-[13px] font-semibold transition-colors flex items-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              <span>资质审核工作台</span>
              <span className="px-1.5 py-0.2 rounded-full bg-error text-on-error text-[10px] font-bold">
                14
              </span>
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'tree'
                  ? 'bg-primary-container text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">account_tree</span>
              <span>阿米巴师徒架构树 (28组)</span>
            </button>
          </div>

          {/* Live Search & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                className="w-full pl-9 pr-3 py-1.5 bg-surface-container rounded-lg text-on-surface placeholder:text-on-surface-variant/60 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="搜姓名、手机号、许可证编号..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
              title="刷新数据"
              type="button"
              onClick={onRefresh}
            >
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Multi-dimensional Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] font-semibold text-on-surface-variant mr-1">快捷筛选:</span>
            {[
              { id: 'all', label: '全部人员 (386)' },
              { id: 'gold', label: '黄金阿米巴合伙人 (24)' },
              { id: 'expiring', label: '经营许可证30天内到期 (6)' },
              { id: 'active', label: '正在执行订单 (118)' },
              { id: 'top_mentor', label: '带徒先锋榜 (TOP10)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                  filterType === f.id
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-[12px]">
            <span>
              当前服务网格: <strong>湖南省域 (长沙/常德/益阳/岳阳)</strong>
            </span>
          </div>
        </div>
      </div>

      {activeTab === 'tree' ? (
        /* Amoeba Mentorship Architecture Tree View */
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container">
          <div className="flex items-center justify-between pb-4 border-b border-surface-container">
            <div>
              <h3 className="text-[17px] font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px]">account_tree</span>
                <span>全网阿米巴师徒拓扑架构树 (28 组创客战队)</span>
              </h3>
              <p className="text-[12px] text-on-surface-variant mt-0.5">
                核心战队以“首席导师/资深合伙人”为单元，带徒裂变创客小组，享受团队全量亩产绩效津贴。
              </p>
            </div>
            <button
              onClick={() => setShowAmoebaMatrixModal(true)}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-[12px] font-semibold"
            >
              分红分配系数测算器
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {/* Team 1: Peng Minghui */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center">
                    彭
                  </div>
                  <div>
                    <div className="font-bold text-primary text-[14px]">彭明辉 (首席导师 / 组长)</div>
                    <div className="text-[11px] text-on-surface-variant">益阳兰溪创客军团 · 团队月产值 ¥11.64万</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-[11px] font-bold">
                  钻石 1.35x
                </span>
              </div>
              <div className="pl-6 border-l-2 border-primary/30 space-y-2 mt-2">
                <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest">
                  <span>徒弟 1: 张立成 (已独立执飞大疆T60)</span>
                  <span className="text-secondary font-bold font-mono">月产值 ¥3.8万 · 导师津贴 ¥1,900</span>
                </div>
                <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest">
                  <span>徒弟 2: 赵小勇 (已获配方员执照)</span>
                  <span className="text-secondary font-bold font-mono">月产值 ¥2.9万 · 导师津贴 ¥1,450</span>
                </div>
                <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest border border-tertiary-fixed">
                  <span>新入职预备徒弟: 陈志平 (实训跟机中)</span>
                  <span className="text-tertiary font-bold font-mono">待解锁首单导师奖励 ¥200</span>
                </div>
              </div>
            </div>

            {/* Team 2: Zhou Jianguo */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary font-bold flex items-center justify-center">
                    周
                  </div>
                  <div>
                    <div className="font-bold text-primary text-[14px]">周建国 (资深农艺师 / 组长)</div>
                    <div className="text-[11px] text-on-surface-variant">安沙创客先锋战队 · 团队月产值 ¥4.28万</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                  黄金 1.25x
                </span>
              </div>
              <div className="pl-6 border-l-2 border-tertiary/30 space-y-2 mt-2">
                <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest">
                  <span>徒弟 1: 刘国富 (独立飞手，已完工180单)</span>
                  <span className="text-secondary font-bold font-mono">月产值 ¥2.2万 · 导师津贴 ¥1,100</span>
                </div>
                <div className="text-[12px] text-on-surface flex items-center justify-between p-2 rounded bg-surface-container-lowest">
                  <span>徒弟 2: 马文兵 (独立飞手，已完工165单)</span>
                  <span className="text-secondary font-bold font-mono">月产值 ¥1.9万 · 导师津贴 ¥950</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Primary Technician Data Table (Dense Utilitarian Layout) */
        <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col border border-surface-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">
                    <input
                      className="rounded accent-primary w-4 h-4 cursor-pointer"
                      type="checkbox"
                      checked={selectedIds.length === filteredTechs.length && filteredTechs.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-3">技师身份与基本信息</th>
                  <th className="py-3 px-3">农药经营许可证 (法定核验)</th>
                  <th className="py-3 px-3">阿米巴合伙层级 / 激励组</th>
                  <th className="py-3 px-3">带徒团队 / 产值贡献</th>
                  <th className="py-3 px-3">常驻网格片区</th>
                  <th className="py-3 px-3">履约单量 / 评分</th>
                  <th className="py-3 px-3">调度状态</th>
                  <th className="py-3 px-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-[13px] text-on-surface">
                {filteredTechs.map((tech) => {
                  const isExpiring = tech.licenseStatus === 'expiring';
                  const isPending = tech.dispatchStatus === 'pending_qualification';

                  return (
                    <tr
                      key={tech.id}
                      className={`hover:bg-surface-container-low/60 transition-colors ${
                        isExpiring ? 'bg-error-container/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          className="rounded accent-primary w-4 h-4 cursor-pointer"
                          type="checkbox"
                          checked={selectedIds.includes(tech.id)}
                          onChange={() => toggleSelect(tech.id)}
                        />
                      </td>

                      {/* Tech Info */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-11 h-11 rounded-full object-cover shadow-xs bg-surface-container shrink-0"
                            alt={tech.name}
                            src={tech.avatar}
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-primary text-[14px]">{tech.name}</span>
                              <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                                {tech.title}
                              </span>
                            </div>
                            <span className="text-on-surface-variant text-[11px] font-mono">
                              工号: {tech.code}
                            </span>
                            <span className="text-on-surface-variant text-[11px]">{tech.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* License */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-10 h-10 rounded bg-surface-container overflow-hidden shrink-0 cursor-pointer shadow-xs relative group border border-surface-container"
                            onClick={() => {
                              if (isPending) onOpenAuditDrawer();
                              else setSelectedTechForDossier(tech);
                            }}
                          >
                            <img
                              className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                              alt="许可证缩略图"
                              src={tech.licenseThumb}
                              referrerPolicy="no-referrer"
                            />
                            <span className="material-symbols-outlined absolute inset-0 m-auto text-on-primary opacity-0 group-hover:opacity-100 transition-opacity text-[18px]">
                              zoom_in
                            </span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-[12px] font-bold text-on-surface truncate max-w-[130px]">
                                {tech.licenseNumber}
                              </span>
                              {isExpiring ? (
                                <span
                                  className="material-symbols-outlined text-error text-[16px]"
                                  title="证书即将到期需复审"
                                >
                                  warning
                                </span>
                              ) : isPending ? (
                                <span className="px-1 rounded bg-error text-on-error text-[10px] font-bold">
                                  待核验
                                </span>
                              ) : (
                                <span
                                  className="material-symbols-outlined text-secondary text-[16px]"
                                  title="官方接口已验真"
                                >
                                  check_circle
                                </span>
                              )}
                            </div>
                            <span className="text-on-surface-variant text-[11px]">
                              {tech.licenseAuthority}
                            </span>
                            <span
                              className={`text-[11px] font-semibold ${
                                isExpiring
                                  ? 'text-error font-bold'
                                  : isPending
                                  ? 'text-on-surface-variant'
                                  : 'text-secondary'
                              }`}
                            >
                              {isExpiring
                                ? `剩 ${tech.licenseExpiryDays} 天到期 (${tech.licenseExpiry})`
                                : isPending
                                ? 'OCR匹配通过率 98.4%'
                                : `有效期至 ${tech.licenseExpiry} (正常)`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Amoeba Tier */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                              {tech.amoebaTierName}
                            </span>
                            <span className="text-tertiary font-bold text-[11px]">
                              {tech.amoebaCoefficient}x 系数
                            </span>
                          </div>
                          <span className="text-on-surface-variant text-[11px] mt-0.5 font-medium">
                            {tech.teamName}
                          </span>
                          <span className="text-on-surface-variant/80 text-[10px]">
                            {tech.commissionRatio}
                          </span>
                        </div>
                      </td>

                      {/* Team Output */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 text-[12px] font-semibold text-on-surface">
                            <span className="material-symbols-outlined text-[15px] text-primary">
                              diversity_3
                            </span>
                            <span>
                              带徒 <strong>{tech.menteeCount}</strong> 人
                              {tech.independentMentees > 0 && ` (${tech.independentMentees}人已独立)`}
                            </span>
                          </div>
                          <span className="text-secondary font-bold text-[11px] mt-0.5">
                            月团队产值 ¥{(tech.teamMonthlyOutput / 10000).toFixed(2)} 万
                          </span>
                          <span className="text-on-surface-variant text-[10px]">
                            师傅管理津贴: ¥{tech.mentorshipAllowance}/月
                          </span>
                        </div>
                      </td>

                      {/* Grid Station */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="text-[12px] font-bold text-on-surface">{tech.gridName}</span>
                          <span className="text-on-surface-variant text-[11px]">
                            覆盖半径: {tech.coverageRadius}公里
                          </span>
                          <span className="text-on-surface-variant text-[10px]">
                            {tech.boundEquipment}
                          </span>
                        </div>
                      </td>

                      {/* Orders and Rating */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-on-surface font-mono">{tech.completedOrders} 单</span>
                            <span className="text-on-surface-variant text-[11px]">
                              作业 {(tech.operationAcreage / 1000).toFixed(1)}k 亩
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 text-tertiary text-[11px] font-bold mt-0.5">
                            <span
                              className="material-symbols-outlined text-[14px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span>{tech.rating} 星</span>
                            <span className="text-on-surface-variant font-normal text-[10px]">
                              (好评率 {tech.goodReviewRate}%)
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {tech.dispatchStatus === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            <span>正常展业接单</span>
                          </span>
                        ) : tech.dispatchStatus === 'need_annual_review' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            <span>急需年审复核</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            <span>等待资质审核</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {isPending ? (
                            <>
                              <button
                                className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container text-[12px] font-bold hover:bg-secondary hover:text-on-secondary transition-colors"
                                onClick={onOpenAuditDrawer}
                                type="button"
                              >
                                审核入库
                              </button>
                              <button
                                className="px-2 py-1 rounded text-on-surface-variant hover:bg-surface-container text-[12px]"
                                onClick={() => onShowToast('已向申请人发送材料补正短信通知', 'info')}
                                type="button"
                              >
                                驳回申请
                              </button>
                            </>
                          ) : isExpiring ? (
                            <>
                              <button
                                className="px-2.5 py-1 rounded bg-primary-container text-on-primary text-[12px] font-bold shadow-xs hover:bg-primary transition-all"
                                onClick={onOpenAuditDrawer}
                                type="button"
                              >
                                立即年审
                              </button>
                              <button
                                className="px-2 py-1 rounded text-on-surface-variant hover:bg-surface-container text-[12px]"
                                onClick={() => onShowToast(`已向 ${tech.name} 发送农药经营许可证换证催办通知短信！`, 'info')}
                                type="button"
                              >
                                发催办短信
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="px-2 py-1 rounded text-primary hover:bg-surface-container text-[12px] font-medium"
                                onClick={() => setSelectedTechForDossier(tech)}
                                type="button"
                              >
                                电子档案
                              </button>
                              <button
                                className="px-2 py-1 rounded text-on-surface-variant hover:bg-surface-container text-[12px] font-medium"
                                onClick={() => setShowAmoebaMatrixModal(true)}
                                type="button"
                              >
                                分红配置
                              </button>
                              <button
                                className="p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
                                title="冻结/解冻权限"
                                onClick={() => onShowToast(`技师 ${tech.name} 权限状态已核验安全锁定。`, 'info')}
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[17px]">lock</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-surface-container text-[12px]">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span>
                已选中 <strong className="text-primary font-bold">{selectedIds.length}</strong> / {filteredTechs.length} 位技术人员
              </span>
              <button
                className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-medium"
                type="button"
                onClick={() => onShowToast(`已为选中的 ${selectedIds.length || 1} 位技师批量开启网格常驻站调度调整向导`, 'info')}
              >
                批量修改片区
              </button>
              <button
                className="px-2.5 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-medium"
                type="button"
                onClick={() => onShowToast('已通过国家农业云接口触发批量电子许可证效期验证指令！', 'success')}
              >
                批量资质核验推送信件
              </button>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span>第 1 / 39 页</span>
              <div className="flex items-center gap-1 font-mono">
                <button
                  className="p-1 rounded bg-surface-container text-on-surface-variant disabled:opacity-40"
                  disabled
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <button className="px-2.5 py-0.5 rounded bg-primary-container text-on-primary font-bold" type="button">
                  1
                </button>
                <button className="px-2.5 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface" type="button">
                  2
                </button>
                <button className="px-2.5 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface" type="button">
                  3
                </button>
                <span className="px-1 text-on-surface-variant">...</span>
                <button className="px-2.5 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface" type="button">
                  39
                </button>
                <button className="p-1 rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high" type="button">
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lower Split Section: Amoeba Incentive Mechanics + Regulatory Compliance Feed + Map Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Amoeba Hierarchy & Mentorship Model Card */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between space-y-4 border border-surface-container">
          <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[22px]">share</span>
              <h2 className="font-bold text-primary text-[16px]">阿米巴裂变师徒机制</h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
              合伙人分成引擎
            </span>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            一线骨干带徒3人即可裂变独立微阿米巴小组，徒弟每完成1亩植保，师傅享有持续 ¥0.5~¥1.2/亩 的带教津贴与产值提成。
          </p>

          {/* Mentorship Progress Breakdown */}
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary font-bold text-[11px]">
                  钻
                </span>
                <div>
                  <div className="text-[12px] font-bold text-on-surface">钻石合伙人 (12人)</div>
                  <div className="text-[10px] text-on-surface-variant">团队月总产值 ≥ ¥10万 · 享8%分红</div>
                </div>
              </div>
              <span className="text-[12px] font-bold text-secondary font-mono">系数 1.35x</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-tertiary-fixed-dim flex items-center justify-center text-on-tertiary-fixed font-bold text-[11px]">
                  金
                </span>
                <div>
                  <div className="text-[12px] font-bold text-on-surface">黄金合伙人 (36人)</div>
                  <div className="text-[10px] text-on-surface-variant">团队月总产值 ≥ ¥4万 · 享5%分红</div>
                </div>
              </div>
              <span className="text-[12px] font-bold text-secondary font-mono">系数 1.25x</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-[11px]">
                  银
                </span>
                <div>
                  <div className="text-[12px] font-bold text-on-surface">白银合伙人 (37人)</div>
                  <div className="text-[10px] text-on-surface-variant">带徒1-2人考核期 · 享基础工单加权</div>
                </div>
              </div>
              <span className="text-[12px] font-bold text-secondary font-mono">系数 1.10x</span>
            </div>
          </div>

          <div className="pt-2 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>全网带徒活跃战队: 28 个创客组</span>
            <button
              onClick={() => setActiveTab('tree')}
              className="text-primary hover:underline font-semibold"
              type="button"
            >
              查看完整阿米巴拓扑图 →
            </button>
          </div>
        </div>

        {/* Official Pesticide License Compliance Radar */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between space-y-4 border border-surface-container">
          <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[22px]">policy</span>
              <h2 className="font-bold text-primary text-[16px]">农药经营许可证合规监管</h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              自动联网校验
            </span>
          </div>

          <div className="space-y-3">
            {/* SVG Circular Gauge */}
            <div className="flex items-center justify-center py-1">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-container"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                  <circle
                    className="text-secondary"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset="11.8"
                    strokeLinecap="round"
                    strokeWidth="10"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[22px] font-extrabold text-secondary font-mono">95.3%</span>
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">持证合规率</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-on-surface-variant text-[12px]">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>合规持证正常接单
                </span>
                <span className="font-bold text-on-surface font-mono">368 人</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>30天内面临年审/换证
                </span>
                <span className="font-bold text-tertiary font-mono">6 人</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error"></span>待入库核验申请
                </span>
                <span className="font-bold text-error font-mono">14 人</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-outline"></span>因逾期临时暂停接单
                </span>
                <span className="font-bold text-on-surface font-mono">4 人</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-surface-container text-right">
            <span className="text-[11px] text-on-surface-variant">
              数据接口对接: 湖南省数字农业综合管理平台 (实时同步)
            </span>
          </div>
        </div>

        {/* Real-time Dispatch Map & Grid Capacity */}
        <div className="p-5 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col justify-between space-y-4 border border-surface-container">
          <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[22px]">satellite_alt</span>
              <h2 className="font-bold text-primary text-[16px]">服务网格与战力饱和度</h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">
              湘中/湘北核心区
            </span>
          </div>

          {/* Map image banner */}
          <div
            className="w-full h-36 rounded-lg bg-cover bg-center relative overflow-hidden shadow-inner flex items-end p-2.5"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmIndBmPvG8BX_ZAiMZmi37ftBKiOFJfqngikr2akN_1UG5jNguIk2q6614zoQP5u7hjB2FYu-AspFm38AhEG5ORRz7pEWvgE3CwzCA5xEufQS1tfikYWcmN9CqNXiNOflFqLVai02zOEzVvwbpFLol8X2-GOwBLJNhH3dqbQGQ9n_UKGzRLEc_41b74rbMv-od0NCAq9088oaf2buBE6W7zLg1JDOGDGiAoxy3wXFYdUJQB0dKOjm')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between w-full text-on-primary text-[12px]">
              <div className="flex flex-col">
                <span className="font-bold">长沙县 / 鼎城区 / 赫山区</span>
                <span className="text-[10px] text-on-primary-container">400+ 技师无人机GPS基站联动</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary text-[11px] font-bold">
                响应中 ≤ 2h
              </span>
            </div>
          </div>

          {/* Saturation bars */}
          <div className="space-y-2 text-[12px]">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-on-surface-variant">长沙片区战备度 (142人)</span>
                <span className="font-bold text-secondary font-mono">饱和度 92%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-on-surface-variant">益阳片区战备度 (118人)</span>
                <span className="font-bold text-secondary font-mono">饱和度 86%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-on-surface-variant">常德片区战备度 (126人)</span>
                <span className="font-bold text-secondary font-mono">饱和度 88%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowGridDispatchModal(true)}
            className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-[13px] font-semibold transition-colors text-center"
            type="button"
          >
            查看跨网格农忙应急机动队调度
          </button>
        </div>
      </div>

      {/* Technician Electronic Dossier Modal */}
      {selectedTechForDossier && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTechForDossier(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 relative shadow-2xl border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
                <h3 className="font-bold text-primary text-[16px]">
                  技术人员合规电子档案 · {selectedTechForDossier.name}
                </h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setSelectedTechForDossier(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low">
                <img
                  src={selectedTechForDossier.avatar}
                  alt={selectedTechForDossier.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] font-bold text-primary">{selectedTechForDossier.name}</span>
                    <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[11px] font-bold">
                      {selectedTechForDossier.title}
                    </span>
                  </div>
                  <div className="text-[12px] text-on-surface-variant mt-1">
                    系统工号: {selectedTechForDossier.code} · 联系电话: {selectedTechForDossier.phone}
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
                    {selectedTechForDossier.licenseNumber}
                  </span>
                  <span className="text-secondary block mt-0.5">✔ 有效期至 {selectedTechForDossier.licenseExpiry}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container">
                  <span className="text-on-surface-variant block">所属阿米巴创客战队</span>
                  <span className="font-bold text-on-surface text-[13px]">{selectedTechForDossier.teamName}</span>
                  <span className="text-tertiary block mt-0.5">
                    分红系数: {selectedTechForDossier.amoebaCoefficient}x
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container">
                  <span className="text-on-surface-variant block">累计履约单量与面积</span>
                  <span className="font-bold text-on-surface text-[13px]">
                    {selectedTechForDossier.completedOrders} 单 · {selectedTechForDossier.operationAcreage} 亩
                  </span>
                  <span className="text-on-surface-variant block mt-0.5">好评率 {selectedTechForDossier.goodReviewRate}%</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container">
                  <span className="text-on-surface-variant block">绑定专业农用机具</span>
                  <span className="font-bold text-on-surface text-[13px]">
                    {selectedTechForDossier.boundEquipment}
                  </span>
                  <span className="text-secondary block mt-0.5">✔ 农机作业北斗终端已联网</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-surface-container flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium"
                onClick={() => setSelectedTechForDossier(null)}
              >
                关闭档案
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold shadow-xs"
                onClick={() => {
                  onShowToast(`已下载生成 ${selectedTechForDossier.name} 的《国家植保从业合规档案.pdf》`, 'success');
                  setSelectedTechForDossier(null);
                }}
              >
                下载合规归档证明
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Grid Dispatch Modal */}
      {showGridDispatchModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowGridDispatchModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 relative shadow-2xl border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">emergency_share</span>
                <h3 className="font-bold text-primary text-[16px]">跨网格农忙应急机动队快速调度</h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setShowGridDispatchModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-3 space-y-3 text-[13px] text-on-surface">
              <p className="text-on-surface-variant">
                检测到长沙县北部、常德鼎城区进入早稻拔节期与油菜秋播高峰，可调派 40 名高工机手机动编队驰援：
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
                onClick={() => setShowGridDispatchModal(false)}
              >
                取消
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[13px] font-bold shadow-sm"
                onClick={() => {
                  onShowToast('应急机动队指令已下发！已向40位待命机手推送紧急集合令。', 'success');
                  setShowGridDispatchModal(false);
                }}
              >
                确认下达机动调度令
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amoeba Matrix Modal */}
      {showAmoebaMatrixModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setShowAmoebaMatrixModal(false)}
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
                onClick={() => setShowAmoebaMatrixModal(false)}
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
                onClick={() => setShowAmoebaMatrixModal(false)}
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
