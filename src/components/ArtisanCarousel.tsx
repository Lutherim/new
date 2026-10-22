import React, { useState, useEffect, useRef } from 'react';
import { Artisan } from '../types';
import { StarIcon, BadgeCheckIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from '../icons';

interface ArtisanCarouselProps {
  artisans: Artisan[];
  onSelectArtisan: (artisan: Artisan) => void;
}

export const ArtisanCarousel: React.FC<ArtisanCarouselProps> = ({
  artisans,
  onSelectArtisan
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-shift to the left every 2 seconds (2000ms)
  useEffect(() => {
    if (isPaused || artisans.length === 0) return;

    intervalRef.current = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % artisans.length);
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, artisans.length]);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % artisans.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + artisans.length) % artisans.length);
  };

  if (!artisans || artisans.length === 0) return null;

  // Render a slice of artisans or wrap around
  const visibleArtisans = [
    artisans[startIndex % artisans.length],
    artisans[(startIndex + 1) % artisans.length],
    artisans[(startIndex + 2) % artisans.length]
  ];

  return (
    <div 
      className="relative w-full py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header ticker row */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#78866B]">
            Featured Master Artisans
          </span>
          <span className="w-2 h-2 rounded-full bg-[#0891B2] animate-pulse" title="Shifting every 2s" />
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full bg-[#F5F2EB] dark:bg-[#2B2522] hover:bg-[#EAE4D7] dark:hover:bg-[#362F2C] text-[#3B2F2F] dark:text-[#F5F2EB] border border-[#78866B]/30 dark:border-[#78866B]/40 transition-colors"
            aria-label="Previous artisan"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-full bg-[#F5F2EB] dark:bg-[#2B2522] hover:bg-[#EAE4D7] dark:hover:bg-[#362F2C] text-[#3B2F2F] dark:text-[#F5F2EB] border border-[#78866B]/30 dark:border-[#78866B]/40 transition-colors"
            aria-label="Next artisan"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cards Row - Shifts smoothly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500">
        {visibleArtisans.map((artisan, idx) => {
          if (!artisan) return null;
          return (
            <div
              key={`${artisan.id}-${idx}`}
              onClick={() => onSelectArtisan(artisan)}
              className="group cursor-pointer bg-[#FBF9F5]/90 dark:bg-[#231F1D]/90 backdrop-blur-md border border-[#78866B]/30 dark:border-[#78866B]/40 hover:border-[#D97736] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-4"
            >
              {/* Round Picture on the Left */}
              <div className="relative shrink-0">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-2 border-[#D97736]/40 p-0.5 shadow-sm group-hover:scale-105 transition-transform"
                />
                {artisan.online && (
                  <span 
                    className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#0891B2] border-2 border-[#FBF9F5] dark:border-[#231F1D] rounded-full" 
                    title="Online Now"
                  />
                )}
              </div>

              {/* Name, Trade & Reviews on the Right */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB] truncate group-hover:text-[#D97736] transition-colors">
                    {artisan.name}
                  </h3>
                  {artisan.verified && (
                    <span title="Verified Artisan">
                      <BadgeCheckIcon className="w-4 h-4 text-[#0891B2] shrink-0" />
                    </span>
                  )}
                </div>

                {/* Trade & Location */}
                <p className="text-xs font-medium text-[#78866B] dark:text-[#A3B19F] truncate mb-1.5">
                  {artisan.trade}
                </p>

                {/* Reviews and Rating */}
                <div className="flex items-center gap-2 text-xs text-[#5A4E4D] dark:text-[#C4BDB5] mb-2">
                  <div className="flex items-center gap-0.5 text-[#D97736] font-bold">
                    <StarIcon className="w-3.5 h-3.5 fill-[#D97736]" />
                    <span>{artisan.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[#78866B]">·</span>
                  <span className="text-[11px] text-[#5A4E4D] dark:text-[#C4BDB5]">({artisan.reviewCount} reviews)</span>
                  <span className="text-[#78866B]">·</span>
                  <span className="text-[11px] text-[#5A4E4D] dark:text-[#C4BDB5] flex items-center gap-0.5">
                    <MapPinIcon className="w-3 h-3 text-[#78866B] dark:text-[#A3B19F]" />
                    {artisan.location}
                  </span>
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-1 border-t border-[#78866B]/15 dark:border-[#78866B]/30">
                  <div className="text-[11px]">
                    <span className="text-[#5A4E4D] dark:text-[#A3B19F]">From </span>
                    <span className="font-bold text-[#3B2F2F] dark:text-[#F5F2EB] tabular-nums">
                      {artisan.currency}{artisan.startingPrice}
                    </span>
                    <span className="text-[#78866B] dark:text-[#A3B19F]"> / {artisan.currency}{artisan.hourlyRate}hr</span>
                  </div>
                  <span className="text-xs font-semibold text-[#D97736] group-hover:translate-x-0.5 transition-transform">
                    Profile →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Dots Indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {artisans.map((_, i) => (
          <button
            key={i}
            onClick={() => setStartIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === startIndex % artisans.length
                ? 'w-6 bg-[#D97736]'
                : 'w-1.5 bg-[#78866B]/30 hover:bg-[#78866B]/60'
            }`}
            aria-label={`Jump to artisan ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
