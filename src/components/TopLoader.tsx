import React from 'react';

interface TopLoaderProps {
  isLoading: boolean;
}

export const TopLoader: React.FC<TopLoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-stone-200/50 overflow-hidden pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-[#D97736] via-[#C86D3B] to-[#0891B2] w-full transition-all duration-300 ease-out origin-left yt-loader-shimmer"
        style={{
          boxShadow: '0 0 10px rgba(217, 119, 54, 0.7)'
        }}
      />
    </div>
  );
};
