import React from 'react';
import {
  FileCheck,
  PhoneCall,
  Award,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface ProfileTabProps {
  onOpenGuide: () => void;
  onCallService: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ onOpenGuide, onCallService }) => {
  return (
    <div className="space-y-3.5 pb-4 text-[#151d19]">
      {/* Profile Header */}
      <section className="bg-gradient-to-br from-[#004425] via-[#00502c] to-[#135d38] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-[20px] text-white flex-shrink-0">
            李
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[17px] font-extrabold truncate">李建平</h2>
              <span className="bg-[#8ef5b5] text-[#007243] text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                五星认证大户
              </span>
            </div>
            <p className="text-[11px] text-white/80 mt-0.5">长沙县安沙水稻农机农艺专业合作社</p>
            <p className="text-[10px] text-[#8ef5b5] font-mono mt-0.5">
              示范田块：380 亩 · 绑定安沙直营站 (HN-CS-004)
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div>
            <div className="text-white/70">累计购药验真</div>
            <div className="font-extrabold text-[15px] text-[#8ef5b5] mt-0.5">46 批次</div>
          </div>
          <div>
            <div className="text-white/70">飞防作业服务</div>
            <div className="font-extrabold text-[15px] text-white mt-0.5">1,240 亩次</div>
          </div>
          <div>
            <div className="text-white/70">节约药剂成本</div>
            <div className="font-extrabold text-[15px] text-amber-300 mt-0.5">18.5%</div>
          </div>
        </div>
      </section>

      {/* Electronic Ledger Section (国家要求的电子台账) */}
      <section className="bg-white rounded-xl p-3.5 border border-[#e2eae2] shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-[#006d40]" />
            <h3 className="font-bold text-[13px] text-[#004425]">已验真农资电子监管台账</h3>
          </div>
          <span className="text-[10px] bg-[#006d40]/10 text-[#006d40] px-1.5 py-0.5 rounded font-medium">
            合规留痕中
          </span>
        </div>
        <p className="text-[11px] text-[#404941] mb-2 leading-relaxed">
          根据《农药管理条例》，所有在自营商城核验与采购的农药自动同步至农业农村部进销存云台账，供质检核查无忧。
        </p>

        <div className="space-y-2 text-[11px]">
          <div className="p-2.5 bg-[#f3fcf3] rounded-lg border border-[#e2eae2] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#151d19]">华农植保·75%肟菌·戊唑醇悬浮剂</div>
              <div className="text-[10px] text-[#707971] font-mono mt-0.5">
                追溯码: 1020210892090124883901 · 批次: 20240901HN
              </div>
            </div>
            <span className="text-[10px] text-[#006d40] font-bold">正品验真通过</span>
          </div>

          <div className="p-2.5 bg-[#f3fcf3] rounded-lg border border-[#e2eae2] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#151d19]">极飞特约·氯虫苯甲酰胺 200g/L 浓悬浮剂</div>
              <div className="text-[10px] text-[#707971] font-mono mt-0.5">
                追溯码: 1020180431081524771234 · 批次: 20240815HN
              </div>
            </div>
            <span className="text-[10px] text-[#006d40] font-bold">正品验真通过</span>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Badges */}
      <section className="bg-white rounded-xl p-3.5 border border-[#e2eae2] shadow-xs space-y-2">
        <h3 className="font-bold text-[13px] text-[#004425] flex items-center gap-1.5 mb-2">
          <Award className="w-4 h-4 text-[#006d40]" />
          <span>实体站自营商城服务承诺</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-[#edf6ee] border border-[#bfc9bf]/50">
            <div className="font-bold text-[#004425]">一品一码 假一赔十</div>
            <p className="text-[#404941] text-[10px] mt-0.5">直连国家电子追溯总库，绝无假冒串货</p>
          </div>
          <div className="p-2 rounded-lg bg-[#edf6ee] border border-[#bfc9bf]/50">
            <div className="font-bold text-[#004425]">48小时田间复诊</div>
            <p className="text-[#404941] text-[10px] mt-0.5">
              持证农艺师全程跟进，防效不及免费补防
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#edf6ee] border border-[#bfc9bf]/50">
            <div className="font-bold text-[#004425]">实体服务站直发</div>
            <p className="text-[#404941] text-[10px] mt-0.5">
              最快30分钟直送田头，恒温库位品质保真
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#edf6ee] border border-[#bfc9bf]/50">
            <div className="font-bold text-[#004425]">满¥200赠配方服务</div>
            <p className="text-[#404941] text-[10px] mt-0.5">测土定肥科学开方，减药控害增产高产</p>
          </div>
        </div>
      </section>

      {/* Quick Links & Service Center */}
      <section className="bg-white rounded-xl border border-[#e2eae2] shadow-xs divide-y divide-[#e2eae2] text-[12px]">
        <button
          onClick={onOpenGuide}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-[#f3fcf3] transition-colors"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#006d40]" />
            <span className="font-medium">国家农药电子追溯码辨伪指南</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#707971]" />
        </button>

        <button
          onClick={onCallService}
          className="w-full p-3 flex items-center justify-between text-left hover:bg-[#f3fcf3] transition-colors"
        >
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#006d40]" />
            <span className="font-medium">联系安沙站站长及值班农艺师 (24H)</span>
          </div>
          <span className="text-[11px] text-[#006d40] font-mono">0731-86208912</span>
        </button>
      </section>
    </div>
  );
};
