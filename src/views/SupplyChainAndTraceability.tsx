import React, { useState } from 'react';
import type { SupplyProduct } from '../types/index.ts';

interface SupplyChainAndTraceabilityProps {
  products: SupplyProduct[];
  onFreezeBatch: (batchNumber: string) => Promise<void>;
  onGenerateCodes: (count: number) => Promise<void>;
  onSyncMinistry: () => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SupplyChainAndTraceability: React.FC<SupplyChainAndTraceabilityProps> = ({
  products,
  onFreezeBatch,
  onGenerateCodes,
  onSyncMinistry,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fleeFilter, setFleeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTraceProduct, setSelectedTraceProduct] = useState<SupplyProduct | null>(null);
  const [selectedAlertProduct, setSelectedAlertProduct] = useState<SupplyProduct | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanCodeInput, setScanCodeInput] = useState('01069281729001921240315102008');
  const [scanResult, setScanResult] = useState<{ title: string; pd: string; batch: string; status: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (fleeFilter === 'alert' && p.fleeStatus !== 'alert') return false;
    if (fleeFilter === 'normal' && p.fleeStatus !== 'normal') return false;

    if (categoryFilter === 'fungicide' && !p.name.includes('醇') && !p.name.includes('胺')) return false;
    if (categoryFilter === 'insecticide' && !p.name.includes('虫') && !p.name.includes('脲')) return false;
    if (categoryFilter === 'nutrition' && !p.name.includes('肥')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.registrationNumber.toLowerCase().includes(q) ||
        p.batchNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleManualScan = () => {
    if (!scanCodeInput.trim()) return;
    setScanResult({
      title: '75% 肟菌·戊唑醇悬浮剂',
      pd: 'PD20210892',
      batch: 'HN-20240315-A',
      status: '正品合格 · 首验正规湖南区域 · 国家数据库登记有效',
    });
  };

  const handleSyncClick = async () => {
    try {
      setIsSyncing(true);
      await onSyncMinistry();
      onShowToast('已成功拉取国家农业农村部农药质量安全追溯云系统最新赋码核销流水！全部数据保持同步。', 'success');
    } catch {
      onShowToast('部级平台同步超时，请稍后重试', 'warning');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExecuteFreeze = async () => {
    if (!selectedAlertProduct) return;
    try {
      await onFreezeBatch(selectedAlertProduct.batchNumber);
      onShowToast('已执行批次防伪冻结指令！防伪中心将拦截任何异地处方核销，稽查工单已推送督导组。', 'success');
      setSelectedAlertProduct(null);
    } catch {
      onShowToast('冻结失败，请重试', 'warning');
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Breadcrumb and Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-on-surface-variant text-[12px]">
            <span className="inline-flex items-center text-primary font-semibold">企业合规管控中心</span>
            <span className="text-outline">/</span>
            <span>供应链与阿米巴财税核算台</span>
          </div>
          <h1 className="text-[24px] font-bold text-primary tracking-tight mt-1 flex items-center gap-3">
            农资溯源与阿米巴分红结算台
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
              国家农业农村部平台实时在联
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-lg text-on-surface text-[12px] shadow-xs">
            <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
            <span>
              农药电子监管码接入率：<strong className="text-primary font-bold">100%</strong>
            </span>
          </div>
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[13px] font-semibold transition-all shadow-xs active:scale-95 disabled:opacity-60"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] ${isSyncing ? 'animate-spin' : ''}`}>
              cached
            </span>
            <span>{isSyncing ? '同步中...' : '同步农业农村部数据'}</span>
          </button>
          <button
            onClick={() => {
              setShowScanModal(true);
              setScanResult(null);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-[13px] font-bold transition-all shadow-sm active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>扫码验真与防窜质检</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-on-surface-variant font-semibold">监管合规入库商品</span>
            <span className="p-1 rounded-lg bg-surface-container text-primary">
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] text-primary font-extrabold font-mono tabular-nums tracking-tight">32</span>
              <span className="text-[13px] text-on-surface-variant font-medium">款核心农资</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[12px]">
              <span className="text-secondary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 100% 赋码联网
              </span>
              <span className="text-on-surface-variant/70">PD登记证全覆核</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-[12px]">
            <span>在库赋码总量</span>
            <span className="font-mono font-medium text-on-surface">1,480,000 袋/瓶</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-on-surface-variant font-semibold">本月扫码验真频次</span>
            <span className="p-1 rounded-lg bg-surface-container text-secondary">
              <span className="material-symbols-outlined text-[20px]">document_scanner</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] text-on-surface font-extrabold font-mono tabular-nums tracking-tight">
                28,490
              </span>
              <span className="text-[13px] text-on-surface-variant font-medium">次</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[12px]">
              <span className="text-secondary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">trending_up</span> 环比增 18.4%
              </span>
              <span className="text-on-surface-variant/70">窜货拦截 3 次</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-[12px]">
            <span>田间首验正品率</span>
            <span className="font-mono font-bold text-secondary">99.98%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-on-surface-variant font-semibold">本月阿米巴待结佣金</span>
            <span className="p-1 rounded-lg bg-surface-container text-tertiary">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[15px] text-tertiary font-bold">¥</span>
              <span className="text-[32px] text-tertiary font-extrabold font-mono tabular-nums tracking-tight">
                184,520.00
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[12px]">
              <span className="text-on-surface-variant">涉及 42 位认证合伙人</span>
              <span className="font-semibold text-tertiary">含处方+裂变+股权</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-[12px]">
            <span>已完成前置质检验收</span>
            <span className="font-mono font-medium text-primary">100% 凭单闭环</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-on-surface-variant font-semibold">合规代扣个税与银行存管</span>
            <span className="p-1 rounded-lg bg-surface-container text-primary">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] text-primary font-extrabold font-mono tabular-nums tracking-tight">100%</span>
              <span className="text-[13px] text-secondary font-bold">银行专户直管</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[12px]">
              <span className="text-secondary font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">security</span> 中国农业银行财资云
              </span>
              <span className="text-on-surface-variant/70">税企系统联通</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container flex items-center justify-between text-on-surface-variant text-[12px]">
            <span>个税累计代缴</span>
            <span className="font-mono font-medium text-on-surface">¥5,535.60</span>
          </div>
        </div>
      </section>

      {/* Section A: 一物一码供应链与商品溯源库 */}
      <section className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col gap-4 border border-surface-container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <div>
              <h2 className="text-[18px] font-bold text-primary flex items-center gap-2">
                Section A: 一物一码供应链与商品溯源库
                <span className="text-[12px] text-on-surface-variant font-normal">
                  (全国植保电子处方追溯体系)
                </span>
              </h2>
              <p className="text-[12px] text-on-surface-variant">
                严格对标农业农村部农药标签追溯二维码标准规范，防伪、防窜货与植保配药溯源闭环联动。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onGenerateCodes(50000)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[13px] font-semibold transition-all shadow-xs active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              <span>批量生成追溯码</span>
            </button>
            <button
              onClick={() => {
                onShowToast('入库批次合规质检：当前已核验三证全部合格，无违禁添加风险。', 'success');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[13px] font-semibold transition-all shadow-xs active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
              <span>入库质检合规核验</span>
            </button>
            <button
              onClick={() => onShowToast('正在汇总《华农智服 2024 年度农资产品监管一物一码追溯报告.xlsx》', 'info')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary hover:bg-primary-container rounded-lg text-[13px] font-semibold transition-all shadow-xs active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>导出监管报表 (PDF/XLSX)</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-surface-container-low p-2 rounded-lg border border-surface-container text-[12px]">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-lg flex-1 min-w-[240px] shadow-xs">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <input
              className="bg-transparent border-none outline-none text-[13px] w-full text-on-surface placeholder:text-outline"
              placeholder="输入农药名称、登记证号 (如 PD20210892) 或批次号检索..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-on-surface-variant font-semibold">窜货预警状态:</span>
            <select
              value={fleeFilter}
              onChange={(e) => setFleeFilter(e.target.value)}
              className="bg-surface-container-lowest text-on-surface text-[12px] font-medium rounded-lg px-2.5 py-1.5 border border-surface-container outline-none shadow-xs cursor-pointer"
            >
              <option value="all">全部预警状态</option>
              <option value="normal">正常 (绿标通过)</option>
              <option value="alert">预警 (跨区扫码)</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-on-surface-variant font-semibold">分红品类:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface-container-lowest text-on-surface text-[12px] font-medium rounded-lg px-2.5 py-1.5 border border-surface-container outline-none shadow-xs cursor-pointer"
            >
              <option value="all">全部品类 (杀菌/杀虫/营养)</option>
              <option value="fungicide">杀菌剂</option>
              <option value="insecticide">杀虫剂</option>
              <option value="nutrition">生物刺激素与特肥</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-lg border border-surface-container">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-[12px] font-bold">
                <th className="p-3 whitespace-nowrap">商品名称 / 规格</th>
                <th className="p-3 whitespace-nowrap">农药登记证号</th>
                <th className="p-3 whitespace-nowrap">生产批次与日期</th>
                <th className="p-3 whitespace-nowrap text-right">已赋码总量</th>
                <th className="p-3 whitespace-nowrap text-right">田间扫码激活量</th>
                <th className="p-3 whitespace-nowrap text-center">防伪窜货预警</th>
                <th className="p-3 whitespace-nowrap text-right">处方分红比例</th>
                <th className="p-3 whitespace-nowrap text-right">关联销售额 (本月)</th>
                <th className="p-3 whitespace-nowrap text-center">操作与溯源链</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-on-surface">
              {filteredProducts.map((p) => {
                const isAlert = p.fleeStatus === 'alert';

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-surface-container-low transition-colors ${
                      isAlert ? 'bg-error-container/20' : ''
                    }`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-bold ${
                            isAlert ? 'text-error' : 'text-primary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[22px]">{p.iconType}</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface text-[13px]">{p.name}</div>
                          <div className="text-on-surface-variant text-[11px]">{p.spec}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-mono text-primary font-bold text-[12px]">{p.registrationNumber}</span>
                      <div className="text-on-surface-variant text-[11px]">{p.registrationNotes}</div>
                    </td>

                    <td className="p-3">
                      <span className="font-mono font-medium text-[12px]">{p.batchNumber}</span>
                      <div className="text-on-surface-variant text-[11px]">{p.manufactureDate}</div>
                    </td>

                    <td className="p-3 text-right font-mono font-medium text-[12px]">
                      {p.totalCoded.toLocaleString()} {p.totalCodedUnit}
                    </td>

                    <td className="p-3 text-right">
                      <div className={`font-mono font-bold text-[12px] ${isAlert ? 'text-on-surface' : 'text-secondary'}`}>
                        {p.scanCount.toLocaleString()} {p.scanCountUnit}
                      </div>
                      <div className="w-24 bg-surface-container rounded-full h-1.5 ml-auto mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isAlert ? 'bg-error' : 'bg-secondary'}`}
                          style={{ width: `${p.scanProgressPct}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      {isAlert ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[13px]">fmd_bad</span>
                          {p.fleeStatusText}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> 正常 (全域可控)
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-bold font-mono text-[12px]">
                        {p.prescriptionCommissionRate.toFixed(1)}%
                      </span>
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-on-surface text-[13px]">
                      ¥{p.monthlySales.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3 text-center">
                      {isAlert ? (
                        <button
                          onClick={() => setSelectedAlertProduct(p)}
                          className="text-error hover:text-on-error-container text-[12px] font-bold underline underline-offset-4 decoration-error/40 cursor-pointer"
                        >
                          窜货处置工单
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedTraceProduct(p)}
                          className="text-primary hover:text-primary-container text-[12px] font-semibold underline underline-offset-4 decoration-primary/40 cursor-pointer"
                        >
                          查看溯源凭证
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-[12px] pt-1 border-t border-surface-container">
          <div className="flex items-center gap-1.5">
            <span>显示第 1 至 5 条，共 32 款核心监管入库品项</span>
            <span className="w-1 h-1 rounded-full bg-outline"></span>
            <span>已关联全部阿米巴处方利润分配机制</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-[12px]">
              上一页
            </button>
            <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary text-[12px] font-bold">1</span>
            <button className="px-3 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-[12px]">
              下一页
            </button>
          </div>
        </div>
      </section>

      {/* Trace Detail Modal */}
      {selectedTraceProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedTraceProduct(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                <h3 className="font-bold text-primary text-[16px]">
                  国家农药电子监管码 · 链式溯源详情
                </h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setSelectedTraceProduct(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13px]">
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-surface-container">
                <div>
                  <div className="font-bold text-on-surface text-[15px]">{selectedTraceProduct.name}</div>
                  <div className="font-mono text-on-surface-variant text-[12px]">
                    {selectedTraceProduct.registrationNumber}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                  正品验真认证
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[12px]">
                <div className="p-2.5 rounded bg-surface-container">
                  <span className="text-on-surface-variant block text-[11px]">生产厂商资质</span>
                  <span className="text-on-surface font-semibold">湖南华农植保智造第一基地</span>
                </div>
                <div className="p-2.5 rounded bg-surface-container">
                  <span className="text-on-surface-variant block text-[11px]">生产许可证号</span>
                  <span className="font-mono text-on-surface font-semibold">农药生许 (湘) 0019</span>
                </div>
                <div className="p-2.5 rounded bg-surface-container">
                  <span className="text-on-surface-variant block text-[11px]">出厂质检报告</span>
                  <span className="text-secondary font-bold">合格 (批次留样备查)</span>
                </div>
                <div className="p-2.5 rounded bg-surface-container">
                  <span className="text-on-surface-variant block text-[11px]">电子追溯码段</span>
                  <span className="font-mono text-on-surface font-semibold">
                    {selectedTraceProduct.batchNumber}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container">
                <div className="font-bold text-on-surface text-[12px] mb-2">国家可追溯平台协同节点</div>
                <div className="space-y-2 text-[12px] text-on-surface-variant">
                  {selectedTraceProduct.traceabilityNodes.map((n, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1.5"></span>
                      <span>
                        <strong className="text-on-surface font-mono">{n.time}</strong> {n.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-surface-container pt-3">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium"
                onClick={() => setSelectedTraceProduct(null)}
              >
                关闭
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[13px] font-bold shadow-xs"
                onClick={() => {
                  onShowToast('溯源公证凭证已生成，正在调用打印机或导出国家存证报告PDF...', 'success');
                  setSelectedTraceProduct(null);
                }}
              >
                下载国家存证报告
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flee Warning Alert Modal */}
      {selectedAlertProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedAlertProduct(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-error mb-2">
              <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
              <h3 className="text-[17px] font-bold text-error">防伪窜货预警处置中心</h3>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              检测到该批次药品在非授权授权经营区域发生频发扫码，触发供应链风险熔断：
            </p>

            <div className="mt-3 p-3 rounded-xl bg-error-container/30 space-y-1.5 text-[12px] border border-error-container">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">预警商品:</span>
                <span className="font-bold text-on-surface">{selectedAlertProduct.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">登记证号:</span>
                <span className="font-mono text-on-surface">{selectedAlertProduct.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">异动批次:</span>
                <span className="font-mono text-on-surface">{selectedAlertProduct.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">违规异常点:</span>
                <span className="font-bold text-error">{selectedAlertProduct.fleeLocation}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label className="text-[12px] font-bold text-on-surface">处置动作建议</label>
              <div className="flex flex-col gap-2 text-[12px] text-on-surface">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-surface-container-low border border-surface-container">
                  <input defaultChecked className="accent-primary" name="alertAction" type="radio" value="lock" />
                  <span>对该异动批次实施电子监管码即时冻结 (禁止处方核销)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-surface-container-low border border-surface-container">
                  <input className="accent-primary" name="alertAction" type="radio" value="team" />
                  <span>派单常德区域督导员 4 小时内现场稽查</span>
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-surface-container pt-3">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
                onClick={() => setSelectedAlertProduct(null)}
              >
                稍后处置
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-error hover:bg-error/90 text-on-error text-[13px] font-bold shadow-xs active:scale-95"
                onClick={handleExecuteFreeze}
              >
                执行熔断处置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Scan Verify Modal */}
      {showScanModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowScanModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
                <h3 className="text-[16px] font-bold">农资包装追溯二维码扫码验真</h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setShowScanModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-[12px] text-on-surface-variant">
                支持手持扫描枪直连或手动录入 32 位国家农药追溯编码：
              </p>
              <input
                className="w-full p-2.5 bg-surface-container rounded-lg text-on-surface font-mono text-[13px] border border-surface-container outline-none focus:ring-1 focus:ring-primary"
                value={scanCodeInput}
                onChange={(e) => setScanCodeInput(e.target.value)}
                placeholder="输入 32 位溯源码..."
              />
              <button
                onClick={handleManualScan}
                className="w-full py-2 bg-primary text-on-primary rounded-lg text-[13px] font-bold hover:bg-primary-container transition-all"
              >
                立即验真核验
              </button>

              {scanResult && (
                <div className="p-3 bg-secondary-container/30 border border-secondary-container rounded-xl space-y-1 text-[12px] animate-in fade-in">
                  <div className="text-secondary font-bold text-[13px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    [验真成功 · 国家云存证]
                  </div>
                  <div className="text-on-surface font-medium">品名: {scanResult.title}</div>
                  <div className="text-on-surface-variant font-mono">登记证: {scanResult.pd} · 批次: {scanResult.batch}</div>
                  <div className="text-secondary font-semibold">{scanResult.status}</div>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-surface-container flex justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
                onClick={() => setShowScanModal(false)}
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
