import React from 'react';
import { 
  LayersIcon, 
  HammerIcon, 
  WrenchIcon, 
  ZapIcon, 
  PaintbrushIcon, 
  HardHatIcon, 
  BriefcaseIcon 
} from '../icons';
import { TradeCategory } from '../types';

interface TradeFilterProps {
  categories: TradeCategory[];
  selectedTrade: string;
  onSelectTrade: (tradeId: string) => void;
}

export const TradeFilter: React.FC<TradeFilterProps> = ({
  categories,
  selectedTrade,
  onSelectTrade
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HammerIcon': return <HammerIcon className="w-4 h-4" />;
      case 'WrenchIcon': return <WrenchIcon className="w-4 h-4" />;
      case 'ZapIcon': return <ZapIcon className="w-4 h-4" />;
      case 'PaintbrushIcon': return <PaintbrushIcon className="w-4 h-4" />;
      case 'HardHatIcon': return <HardHatIcon className="w-4 h-4" />;
      case 'BriefcaseIcon': return <BriefcaseIcon className="w-4 h-4" />;
      default: return <LayersIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full py-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedTrade === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectTrade(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                isActive
                  ? 'bg-[#3B2F2F] dark:bg-[#D97736] text-[#FBF9F5] border-[#3B2F2F] dark:border-[#D97736] shadow-sm'
                  : 'bg-[#F5F2EB] dark:bg-[#2B2522] text-[#5A4E4D] dark:text-[#C4BDB5] border-[#78866B]/30 dark:border-[#78866B]/40 hover:border-[#78866B] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB]'
              }`}
            >
              <span className={isActive ? 'text-[#0891B2] dark:text-white' : 'text-[#78866B] dark:text-[#A3B19F]'}>
                {getIcon(cat.iconName)}
              </span>
              <span>{cat.name}</span>
              <span 
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#78866B]/30 text-white' : 'bg-white/80 dark:bg-[#1C1816]/80 text-[#78866B] dark:text-[#A3B19F]'
                }`}
              >
                {cat.artisanCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
