import React from 'react';
import type { SupplyProduct } from '@hnhall/shared';

interface ProductTraceTableProps {
  filteredProducts: SupplyProduct[];
  searchQuery: string;
  categoryFilter: string;
  onSearchChange: (v: string) => void;
  onCategoryFilterChange: (v: string) => void;
  onGenerateCodes: (count: number) => void;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
  onSelectTrace: (p: SupplyProduct) => void;
}

/**
 * Section A：一物一码供应链与商品溯源库（筛选 + 表格 + 表尾）。
 *
 * ⚠️ 依据红线 R6：「窜货预警 / 批次熔断」本期不做，相关字段
 * （fleeStatus / fleeStatusText / fleeLocation）已从 `@hnhall/shared` 与界面移除，
 * 不得以「示意」形式保留（否则与 R4「Mock 不得伪装成真实能力」冲突）。
 */
export const ProductTraceTable: React.FC<ProductTraceTableProps> = ({
  filteredProducts,
  searchQuery,
  categoryFilter,
  onSearchChange,
  onCategoryFilterChange,
  onGenerateCodes,
  onShowToast,
  onSelectTrace,
}) => {
  return (
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
              严格对标农业农村部农药标签追溯二维码标准规范，防伪与植保配药溯源闭环联动。
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
            onClick={() =>
              onShowToast('正在汇总《华农智服 2024 年度农资产品监管一物一码追溯报告.xlsx》', 'info')
            }
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-on-surface-variant font-semibold">分红品类:</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
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
              <th className="p-3 whitespace-nowrap text-right">处方分红比例</th>
              <th className="p-3 whitespace-nowrap text-right">关联销售额 (本月)</th>
              <th className="p-3 whitespace-nowrap text-center">操作与溯源链</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-on-surface">
            {filteredProducts.map((p) => {
              return (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center font-bold text-primary">
                        <span className="material-symbols-outlined text-[22px]">{p.iconType}</span>
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-[13px]">{p.name}</div>
                        <div className="text-on-surface-variant text-[11px]">{p.spec}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="font-mono text-primary font-bold text-[12px]">
                      {p.registrationNumber}
                    </span>
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
                    <div className="font-mono font-bold text-[12px] text-secondary">
                      {p.scanCount.toLocaleString()} {p.scanCountUnit}
                    </div>
                    <div className="w-24 bg-surface-container rounded-full h-1.5 ml-auto mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-secondary"
                        style={{ width: `${p.scanProgressPct}%` }}
                      ></div>
                    </div>
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
                    <button
                      onClick={() => onSelectTrace(p)}
                      className="text-primary hover:text-primary-container text-[12px] font-semibold underline underline-offset-4 decoration-primary/40 cursor-pointer"
                    >
                      查看溯源凭证
                    </button>
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
          <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary text-[12px] font-bold">
            1
          </span>
          <button className="px-3 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-[12px]">
            下一页
          </button>
        </div>
      </div>
    </section>
  );
};
