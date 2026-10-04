import React from 'react';
import { CATEGORIES } from '../data/mockData.ts';

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <section className="overflow-x-auto no-scrollbar -mx-3.5 px-3.5 flex items-center gap-1.5 pt-0.5 pb-1">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        const count = categoryCounts[category] ?? 0;

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`font-semibold text-[12px] px-3 py-1.5 rounded-full flex-shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
              isActive
                ? 'bg-[#004425] text-white shadow-xs'
                : 'bg-white text-[#151d19] border border-[#bfc9bf]/40 hover:bg-[#edf6ee]'
            }`}
          >
            <span>{category}</span>
            {count > 0 && (
              <span
                className={`text-[10px] px-1 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'text-[#707971]'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </section>
  );
};
