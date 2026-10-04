import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  HeartHandshake,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { CartItem } from '@hnhall/shared';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isEligibleForFreeRecipe = totalAmount >= 200;
  const gap = Math.max(0, 200 - totalAmount);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in text-[#151d19]">
      <div className="w-full max-w-[430px] max-h-[88vh] bg-white rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="p-3.5 bg-[#004425] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[15px]">农资采购清单</h3>
            <span className="bg-[#8ef5b5] text-[#007243] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} 件商品
            </span>
          </div>
          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-white/80 hover:text-white flex items-center gap-0.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清空</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white active:scale-95 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Recipe Service Banner */}
        <div className="bg-[#edf6ee] border-b border-[#e2eae2] p-2.5 px-3.5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <HeartHandshake className="w-4 h-4 text-[#7d4200] flex-shrink-0" />
            {isEligibleForFreeRecipe ? (
              <span className="text-[#006d40] font-bold truncate">
                已达标！免费赠送高级农艺师上门指导配方服务！
              </span>
            ) : (
              <span className="text-[#404941] truncate">
                购满 ¥200 赠配方服务，还差{' '}
                <strong className="text-[#ba1a1a]">¥{gap.toFixed(2)}</strong>
              </span>
            )}
          </div>
          <span className="text-[10px] bg-[#7d4200] text-[#ffb477] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
            官方特约
          </span>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-[#707971]">
              <p className="text-[14px]">采购清单还是空的</p>
              <p className="text-[11px] text-[#707971]/80 mt-1">
                去选购所需的水稻药剂、叶面肥或配件吧
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl p-2.5 border border-[#e2eae2] flex gap-2.5 items-center shadow-xs"
              >
                <div className="w-14 h-14 rounded-lg bg-[#edf6ee] overflow-hidden flex-shrink-0 border border-[#bfc9bf]/40">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#004425] text-xs">
                      配件
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[12px] text-[#151d19] truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[10px] text-[#707971] truncate font-mono">
                    {item.product.spec} · 证号: {item.product.licenseNo}
                  </div>
                  <div className="text-[13px] font-extrabold text-[#ba1a1a] mt-0.5">
                    ¥{item.product.price.toFixed(2)}
                  </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-1.5 bg-[#edf6ee] rounded-lg p-1 border border-[#bfc9bf]/40">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="w-6 h-6 rounded bg-white flex items-center justify-center text-[#151d19] hover:bg-[#e2eae2] active:scale-95 text-xs font-bold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-[12px] font-bold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="w-6 h-6 rounded bg-white flex items-center justify-center text-[#151d19] hover:bg-[#e2eae2] active:scale-95 text-xs font-bold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fulfillment Station Note */}
        <div className="p-2.5 px-3.5 bg-[#f3fcf3] border-t border-[#e2eae2] flex items-center justify-between text-[11px] text-[#404941]">
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#006d40]" />
            <span>自营配送：长沙县安沙直供站闪送 (最快30分钟直达田边)</span>
          </div>
          <span className="text-[#006d40] font-bold">免配送费</span>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#e2eae2] bg-white flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#707971]">合计应付 (含实体仓检)</div>
            <div className="text-[18px] font-extrabold text-[#ba1a1a]">
              ¥{totalAmount.toFixed(2)}
            </div>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={onCheckout}
            className="bg-[#004425] hover:bg-[#135d38] disabled:opacity-50 text-white font-bold text-[13px] py-2.5 px-6 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>一键闪送下单</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
