import React from 'react';
import { Home, CalendarCheck, ShieldCheck, User, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  cartCount,
  onOpenCart,
}) => {
  return (
    <nav className="flex-shrink-0 w-full bg-white/95 backdrop-blur-md border-t border-[#e2eae2] z-40 px-3 pb-3 pt-1.5 relative">
      <div className="flex items-center justify-around">
        {/* Tab 1: 首页 */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            currentTab === 'home'
              ? 'text-[#004425] font-bold'
              : 'text-[#404941] hover:text-[#004425]'
          }`}
        >
          <Home className="w-[21px] h-[21px]" />
          <span className="text-[10px] font-medium mt-0.5">首页</span>
        </button>

        {/* Tab 2: 上门预约 */}
        <button
          onClick={() => onTabChange('doorstep')}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            currentTab === 'doorstep'
              ? 'text-[#004425] font-bold'
              : 'text-[#404941] hover:text-[#004425]'
          }`}
        >
          <CalendarCheck className="w-[21px] h-[21px]" />
          <span className="text-[10px] font-medium mt-0.5">上门预约</span>
        </button>

        {/* Tab 3: 溯源商城 (Default / Core) */}
        <button
          onClick={() => onTabChange('mall')}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer relative ${
            currentTab === 'mall'
              ? 'text-[#004425] font-bold'
              : 'text-[#404941] hover:text-[#004425]'
          }`}
        >
          <ShieldCheck className="w-[22px] h-[22px]" />
          <span className="text-[10px] mt-0.5">溯源商城</span>
          {/* Active dot indicator */}
          <span className="w-1.5 h-1.5 bg-[#004425] rounded-full absolute -top-0.5 right-2"></span>
        </button>

        {/* Tab 4: 我的 */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center py-0.5 transition-colors cursor-pointer ${
            currentTab === 'profile'
              ? 'text-[#004425] font-bold'
              : 'text-[#404941] hover:text-[#004425]'
          }`}
        >
          <User className="w-[21px] h-[21px]" />
          <span className="text-[10px] font-medium mt-0.5">我的</span>
        </button>
      </div>

      {/* Floating Cart Trigger if items exist */}
      {cartCount > 0 && (
        <button
          onClick={onOpenCart}
          className="absolute -top-5 right-4 bg-[#ba1a1a] text-white p-2.5 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all animate-bounce cursor-pointer z-50"
          title="查看采购清单"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-white text-[#ba1a1a] text-[10px] font-extrabold w-4 h-4 rounded-full border border-[#ba1a1a] flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}
    </nav>
  );
};
