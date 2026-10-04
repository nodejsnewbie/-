import React, { useState } from 'react';
import type { AmoebaSettlement as AmoebaSettlementType } from '@hnhall/shared';

interface AmoebaSettlementProps {
  settlements: AmoebaSettlementType[];
  onBatchSettle: () => Promise<void>;
  onSingleSettle: (id: string) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'warning' | 'info') => void;
}

export const AmoebaSettlement: React.FC<AmoebaSettlementProps> = ({
  settlements,
  onBatchSettle,
  onSingleSettle,
  onShowToast,
}) => {
  const [selectedPartner, setSelectedPartner] = useState<AmoebaSettlementType | null>(null);
  const [isSettling, setIsSettling] = useState(false);
  const [showTaxExportModal, setShowTaxExportModal] = useState(false);
  const [showMatrixRuleModal, setShowMatrixRuleModal] = useState(false);

  const grossTotal = settlements.reduce((acc, s) => acc + s.grossAmount, 0);
  const taxTotal = settlements.reduce((acc, s) => acc + s.taxWithheld, 0);
  const netTotal = settlements.reduce((acc, s) => acc + s.netPay, 0);

  const handleBatchSettleClick = async () => {
    const confirmed = window.confirm(
      `本次将发起 42 位阿米巴合伙人本月佣金总计 ¥${grossTotal.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
      })} 的银行直联代发结算（已依法代扣个税 ¥${taxTotal.toFixed(2)}，实付 ¥${netTotal.toFixed(
        2,
      )}），是否确认提交中国农业银行专户？`,
    );

    if (!confirmed) return;

    try {
      setIsSettling(true);
      await onBatchSettle();
      onShowToast(
        '已通过专线向中国农业银行财资云下发合规批量代发指令！正在进行资金流水自动承兑，预计 15 分钟内落地到账。',
        'success',
      );
    } catch {
      onShowToast('结算指令通讯超时，请稍后重试', 'warning');
    } finally {
      setIsSettling(false);
    }
  };

  const handleSingleSettleClick = async (item: AmoebaSettlementType) => {
    try {
      await onSingleSettle(item.id);
      onShowToast(
        `已为 ${item.partnerName} 单独生成本月银企直联清算凭单！资金已下发直连账户。`,
        'success',
      );
      setSelectedPartner(null);
    } catch {
      onShowToast('单笔结算失败', 'warning');
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Section B: 阿米巴合伙人佣金结算与分红中心 */}
      <section className="bg-surface-container-lowest rounded-xl p-5 shadow-xs flex flex-col gap-4 border border-surface-container">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-tertiary rounded-full"></div>
            <div>
              <h2 className="text-[18px] font-bold text-on-surface flex items-center gap-2">
                Section B: 阿米巴合伙人佣金结算与分红中心
                <span className="text-[12px] text-tertiary font-semibold">
                  (服务提成 + 处方分红 + 徒弟裂变 + 股权预提)
                </span>
              </h2>
              <p className="text-[12px] text-on-surface-variant">
                对标阿米巴经营独立核算单元，支持银企直联安全批量代发、一键预提代扣个税与电子签约合规存证。
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowTaxExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[13px] font-semibold transition-all shadow-xs active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>导出税务申报单 (代扣明细)</span>
            </button>
            <button
              onClick={() => setShowMatrixRuleModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-[13px] font-semibold transition-all shadow-xs active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">summarize</span>
              <span>查看分红明细账单</span>
            </button>
            <button
              onClick={handleBatchSettleClick}
              disabled={isSettling}
              className="flex items-center gap-1.5 px-4 py-2 bg-tertiary text-on-tertiary hover:opacity-95 rounded-lg text-[13px] font-bold transition-all shadow-sm active:scale-95 disabled:opacity-60"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
              <span>{isSettling ? '银行清算处理中...' : '一键发起银行合规批量结算'}</span>
            </button>
          </div>
        </div>

        {/* 3 Overview Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-xl border border-surface-container">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
            </div>
            <div>
              <div className="text-[12px] text-on-surface-variant font-medium">
                当期应发合伙人总额
              </div>
              <div className="text-[20px] font-extrabold text-on-surface font-mono">
                ¥{grossTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-surface-container pt-3 md:pt-0 md:pl-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">receipt</span>
            </div>
            <div>
              <div className="text-[12px] text-on-surface-variant font-medium">
                代扣代缴经营个税 (依法代扣)
              </div>
              <div className="text-[20px] font-extrabold text-primary font-mono">
                ¥{taxTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-surface-container pt-3 md:pt-0 md:pl-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">credit_score</span>
            </div>
            <div>
              <div className="text-[12px] text-on-surface-variant font-medium">
                银行清算实付总金额
              </div>
              <div className="text-[20px] font-extrabold text-secondary font-mono">
                ¥{netTotal.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Settlement Table */}
        <div className="overflow-x-auto rounded-lg border border-surface-container">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant text-[12px] font-bold">
                <th className="p-3 whitespace-nowrap">技师合伙人姓名 / 编号</th>
                <th className="p-3 whitespace-nowrap">所属阿米巴网格</th>
                <th className="p-3 whitespace-nowrap text-right">上门服务提成</th>
                <th className="p-3 whitespace-nowrap text-right">处方销售分红</th>
                <th className="p-3 whitespace-nowrap text-right">徒弟裂变奖</th>
                <th className="p-3 whitespace-nowrap text-right">年终股权预提</th>
                <th className="p-3 whitespace-nowrap text-right">应发总额</th>
                <th className="p-3 whitespace-nowrap text-right">代扣代缴个税</th>
                <th className="p-3 whitespace-nowrap text-right">实发金额 (存管)</th>
                <th className="p-3 whitespace-nowrap text-center">清算状态与明细</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-on-surface">
              {settlements.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim/40 text-tertiary font-bold flex items-center justify-center text-[12px]">
                        {item.partnerAvatarLetter}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-[13px] flex items-center gap-1.5">
                          {item.partnerName}
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                            {item.partnerLevel}
                          </span>
                        </div>
                        <div className="text-on-surface-variant font-mono text-[11px]">
                          {item.partnerCode}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-on-surface text-[12px]">{item.teamName}</div>
                    <div className="text-on-surface-variant text-[11px]">{item.menteeStatus}</div>
                  </td>

                  <td className="p-3 text-right font-mono font-medium text-[12px]">
                    ¥{item.serviceFee.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-primary text-[12px]">
                    ¥{item.prescriptionBonus.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono font-medium text-[12px]">
                    ¥{item.mentorshipBonus.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono text-on-surface-variant text-[12px]">
                    ¥{item.equityDividend.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-on-surface text-[13px]">
                    ¥{item.grossAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-right font-mono text-error font-medium text-[12px]">
                    -¥{item.taxWithheld.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-mono font-extrabold text-secondary text-[13px]">
                    ¥{item.netPay.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedPartner(item)}
                      className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-primary text-[12px] font-bold transition-all shadow-xs cursor-pointer"
                    >
                      对账凭证
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-[12px] pt-1 border-t border-surface-container">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
            <span>全部发放数据经农业银行银企专网对接校验，支持 T+0 直连落地</span>
          </div>
          <div className="font-mono text-on-surface">
            审核校验批次码: <strong className="text-primary font-bold">AMO-202404-0982</strong>
          </div>
        </div>
      </section>

      {/* Itemized Partner Settlement Breakdown Modal */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[24px]">
                  account_balance_wallet
                </span>
                <h3 className="text-[17px] font-bold text-on-surface">阿米巴合伙人佣金明细账单</h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setSelectedPartner(null)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-[13px]">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
                <div>
                  <div className="text-[18px] font-bold text-primary">
                    {selectedPartner.partnerName}
                  </div>
                  <div className="text-tertiary text-[12px] font-bold mt-0.5">
                    {selectedPartner.partnerLevel}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-on-surface-variant text-[11px] block">
                    实发净额 (已代扣税)
                  </span>
                  <span className="text-[22px] font-extrabold text-secondary font-mono">
                    ¥{selectedPartner.netPay.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-surface-container rounded-xl bg-surface-container-low p-3.5 text-[12px] border border-surface-container">
                <div className="flex justify-between py-2">
                  <span className="text-on-surface-variant">
                    1. 上门飞防/植保作业提成 (按亩核算)
                  </span>
                  <span className="font-mono font-medium text-on-surface">
                    ¥{selectedPartner.serviceFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-on-surface-variant">2. 溯源处方药剂销售利润分红</span>
                  <span className="font-mono font-bold text-primary">
                    ¥{selectedPartner.prescriptionBonus.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-on-surface-variant">
                    3. 徒弟裂变技术指导奖金 (网格团队)
                  </span>
                  <span className="font-mono font-medium text-on-surface">
                    ¥{selectedPartner.mentorshipBonus.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-on-surface-variant">4. 阿米巴年终资本股权分红预提</span>
                  <span className="font-mono font-medium text-on-surface">
                    ¥{selectedPartner.equityDividend.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 font-bold text-on-surface border-t border-surface-container">
                  <span>应发佣金总计</span>
                  <span className="font-mono text-tertiary text-[14px]">
                    ¥{selectedPartner.grossAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 text-error font-medium">
                  <span>企业依法代扣个人劳务经营所得税 (3%)</span>
                  <span className="font-mono">-¥{selectedPartner.taxWithheld.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container flex items-center gap-2 text-on-surface-variant text-[12px]">
                <span className="material-symbols-outlined text-secondary text-[20px]">lock</span>
                <span>结算由中国农业银行托管专户发放，电子完税凭证将自动推送到合伙人端App。</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-surface-container pt-3">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px] font-medium"
                onClick={() => setSelectedPartner(null)}
              >
                关闭
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary text-[13px] font-bold shadow-xs active:scale-95"
                onClick={() => handleSingleSettleClick(selectedPartner)}
              >
                发起单人即时打款
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Report Export Modal */}
      {showTaxExportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowTaxExportModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                <h3 className="text-[16px] font-bold">阿米巴经营所得税代扣代缴清册</h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setShowTaxExportModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-3 space-y-3 text-[13px] text-on-surface">
              <p className="text-on-surface-variant">
                依据《中华人民共和国个人所得税法》关于生产经营与劳务报酬规定，系统已自动完成自然人税号校验：
              </p>
              <div className="p-3 rounded-lg bg-surface-container space-y-1.5 text-[12px] font-mono">
                <div className="flex justify-between">
                  <span>申报所属期:</span>
                  <span className="font-bold">2024年10月</span>
                </div>
                <div className="flex justify-between">
                  <span>申报纳税人总数:</span>
                  <span className="font-bold">42 人 (全量实名认证)</span>
                </div>
                <div className="flex justify-between">
                  <span>应发所得总额:</span>
                  <span className="font-bold">¥184,520.00</span>
                </div>
                <div className="flex justify-between">
                  <span>代扣代缴税金总额:</span>
                  <span className="font-bold text-error">¥5,535.60</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-surface-container pt-3">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-[13px]"
                onClick={() => setShowTaxExportModal(false)}
              >
                取消
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-[13px] font-bold shadow-xs"
                onClick={() => {
                  onShowToast(
                    '《阿米巴合伙人月度完税申报明细表 (国税标准格式).xlsx》已导出成功！',
                    'success',
                  );
                  setShowTaxExportModal(false);
                }}
              >
                确认导出申报表
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amoeba Bonus Breakdown Matrix Modal */}
      {showMatrixRuleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowMatrixRuleModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-surface-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">summarize</span>
                <h3 className="text-[16px] font-bold">阿米巴四级分红联动利润矩阵</h3>
              </div>
              <button
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant"
                onClick={() => setShowMatrixRuleModal(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="p-3 bg-surface-container-low rounded-xl space-y-2 border border-surface-container">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-on-surface">1. 上门服务提成 (按亩作业提成)</span>
                  <span className="font-bold text-primary font-mono">占比 45%</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-on-surface">2. 溯源处方药剂利润分成</span>
                  <span className="font-bold text-secondary font-mono">占比 35%</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-on-surface">3. 徒弟裂变技术指导奖金</span>
                  <span className="font-bold text-tertiary font-mono">占比 12%</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-bold text-on-surface">4. 年终阿米巴资本股权池预提</span>
                  <span className="font-bold text-on-surface font-mono">占比 8%</span>
                </div>
              </div>
              <p className="text-[12px] text-on-surface-variant">
                经由中国农业银行财资专网校验，每一笔佣金结算均附带电子防伪水印签名与完税账单。
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className="px-5 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-bold"
                onClick={() => setShowMatrixRuleModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
