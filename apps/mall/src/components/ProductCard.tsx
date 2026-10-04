import React, { useState } from 'react';
import { MallProduct } from '@hnhall/shared';
import { Wrench, Calculator } from 'lucide-react';

interface ProductCardProps {
  product: MallProduct;
  onAddToCart: (product: MallProduct) => void;
  onBookService: (product: MallProduct) => void;
  onOpenDetail: (product: MallProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBookService,
  onOpenDetail,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="bg-white rounded-xl p-3 shadow-xs border border-[#e2eae2] flex flex-col gap-2.5 transition-all hover:border-[#004425]/30">
      <div className="flex gap-2.5">
        {/* MallProduct Image */}
        <div
          onClick={() => onOpenDetail(product)}
          className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#edf6ee] border border-[#bfc9bf]/40 cursor-pointer group"
        >
          {!imgError && product.image ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-[#e7f0e8] flex flex-col items-center justify-center text-[#004425]">
              <Wrench className="w-7 h-7 text-[#004425]" />
              <span className="text-[9px] text-[#404941] mt-0.5">原厂配件</span>
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <span
              className={`absolute top-1 left-1 text-white text-[9px] font-bold px-1 py-0.5 rounded leading-none shadow-xs ${
                product.badgeColor || 'bg-[#006d40]'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div onClick={() => onOpenDetail(product)} className="cursor-pointer">
            <h3 className="font-bold text-[13px] text-[#151d19] leading-snug truncate hover:text-[#004425]">
              {product.name}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-1">
              {product.tags.map((tag, idx) => {
                let tagClass = 'bg-[#e7f0e8] text-[#404941]';
                if (tag.includes('溯源') || tag.includes('飞防原浆')) {
                  tagClass = 'bg-[#006d40]/10 text-[#006d40] font-semibold';
                } else if (tag.includes('官方正品') || tag.includes('防倒伏')) {
                  tagClass = 'bg-[#004425]/10 text-[#004425] font-semibold';
                }
                return (
                  <span key={idx} className={`text-[10px] px-1 py-0.5 rounded ${tagClass}`}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* License & Batch */}
          <div className="text-[10px] text-[#707971] flex items-center gap-1.5 mt-1 font-mono truncate">
            <span>证号: {product.licenseNo}</span>
            <span>|</span>
            <span>批次: {product.batchNo}</span>
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between pt-1.5 border-t border-[#e7f0e8]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[#ba1a1a] font-extrabold text-[15px]">
            ¥{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-[#707971] line-through text-[11px]">
              ¥{product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.highlightText ? (
            <span className="text-[10px] text-[#006d40] font-medium bg-[#006d40]/10 px-1 py-0.5 rounded">
              {product.highlightText}
            </span>
          ) : (
            <span className="text-[10px] text-[#707971] ml-1">{product.soldCount}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenDetail(product)}
            className="text-[11px] text-[#707971] hover:text-[#004425] p-1 flex items-center"
            title="算用量/查说明"
          >
            <Calculator className="w-3.5 h-3.5" />
          </button>

          {product.canBookService ? (
            <>
              <button
                onClick={() => onBookService(product)}
                className="text-[11px] font-semibold text-[#004425] bg-[#004425]/10 hover:bg-[#004425]/15 px-2 py-1 rounded-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                预约上门施用
              </button>
              <button
                onClick={() => onAddToCart(product)}
                className="bg-[#004425] hover:bg-[#135d38] text-white font-bold text-[11px] px-2.5 py-1 rounded-lg active:scale-95 transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                立即购买
              </button>
            </>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-[#004425] hover:bg-[#135d38] text-white font-bold text-[11px] px-3 py-1 rounded-lg active:scale-95 transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              加入清单
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
