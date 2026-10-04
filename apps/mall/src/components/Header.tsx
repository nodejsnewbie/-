import React from 'react';
import { Search, ScanLine, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onOpenScan }) => {
  return (
    <header className="flex-shrink-0 w-full bg-[#f3fcf3]/95 backdrop-blur-md z-30 border-b border-[#e2eae2] pt-2 pb-2.5 px-3.5">
      {/* iOS Mock Status Bar */}
      <div className="flex items-center justify-between text-[13px] font-semibold text-[#151d19] mb-2 px-1">
        <span className="font-mono">09:41</span>
        <div className="flex items-center gap-1.5 text-[#151d19]">
          {/* Signal */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M2 17h3v4H2v-4zm5-4h3v8H7v-8zm5-4h3v12h-3V9zm5-4h3v16h-3V5zm5-4h2v20h-2V1z" />
          </svg>
          {/* Wifi */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.78 0 7.22 1.48 9.77 3.92L12 19.34 2.23 11.42C4.78 8.98 8.22 7.5 12 7.5z" />
          </svg>
          {/* Battery */}
          <div className="w-5 h-2.5 border border-current rounded-xs p-[1px] flex items-center">
            <div className="w-full h-full bg-current rounded-[1px]"></div>
          </div>
        </div>
      </div>

      {/* Title & Official Certification Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-[19px] leading-tight text-[#004425] tracking-tight">
              农资自营商城
            </h1>
            <span className="inline-flex items-center gap-0.5 bg-[#004425]/10 text-[#004425] border border-[#004425]/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
              <ShieldCheck className="w-3 h-3 text-[#004425]" />
              官方直营
            </span>
          </div>
          <p className="text-[11px] text-[#404941] truncate mt-0.5">
            一品一码 · 假一赔十 · 实体站直供
          </p>
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
          <span className="bg-[#e2eae2] text-[#404941] text-[10px] px-2 py-0.5 rounded border border-[#bfc9bf]/60 font-mono">
            农药经湘20240018
          </span>
          <span className="text-[10px] text-[#006d40] font-medium mt-0.5 flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#006d40] mr-1 animate-pulse"></span>
            已联国家追溯库
          </span>
        </div>
      </div>

      {/* Search Bar with Barcode Scan */}
      <div className="flex items-center gap-2 bg-white border border-[#bfc9bf]/70 rounded-xl px-2.5 py-1.5 shadow-xs focus-within:border-[#004425] focus-within:ring-1 focus-within:ring-[#004425] transition-all">
        <Search className="w-4 h-4 text-[#707971] flex-shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-transparent text-[12px] text-[#151d19] placeholder:text-[#707971]/80 focus:outline-none min-w-0 py-0.5"
          placeholder="搜索水稻/柑橘专用药剂、品牌或登记证号"
          type="text"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="text-[11px] text-[#707971] hover:text-[#151d19] px-1"
          >
            ✕
          </button>
        )}
        <button
          onClick={onOpenScan}
          className="flex items-center text-[#004425] hover:text-[#135d38] px-1 active:scale-90 transition-transform"
          title="扫码检索"
        >
          <ScanLine className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
