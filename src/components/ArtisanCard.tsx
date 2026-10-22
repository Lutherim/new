import React from 'react';
import { Artisan } from '../types';
import { 
  StarIcon, 
  MapPinIcon, 
  BadgeCheckIcon, 
  CalendarIcon, 
  ArrowRightIcon 
} from '../icons';

interface ArtisanCardProps {
  artisan: Artisan;
  onSelect: (artisan: Artisan) => void;
  onRequestQuote: (artisan: Artisan) => void;
}

export const ArtisanCard: React.FC<ArtisanCardProps> = ({
  artisan,
  onSelect,
  onRequestQuote
}) => {
  return (
    <div 
      className="group bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/30 dark:border-[#78866B]/40 hover:border-[#D97736] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Round Avatar + Name + Trade */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative shrink-0 cursor-pointer" onClick={() => onSelect(artisan)}>
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#78866B]/30 dark:border-[#78866B]/40 group-hover:border-[#D97736] p-0.5 transition-colors"
            />
            {artisan.online && (
              <span 
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#0891B2] border-2 border-white dark:border-[#231F1D]"
                title="Active now"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 
                onClick={() => onSelect(artisan)}
                className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB] group-hover:text-[#D97736] transition-colors cursor-pointer truncate"
              >
                {artisan.name}
              </h3>
              {artisan.verified && (
                <span title="Verified Artisan">
                  <BadgeCheckIcon className="w-4 h-4 text-[#0891B2] shrink-0" />
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-[#78866B] dark:text-[#A3B19F] truncate">
              {artisan.trade}
            </p>

            <div className="flex items-center gap-2 mt-1 text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
              <div className="flex items-center gap-1 text-[#D97736] font-bold">
                <StarIcon className="w-3.5 h-3.5 fill-[#D97736]" />
                <span>{artisan.rating.toFixed(2)}</span>
              </div>
              <span className="text-[#78866B]">·</span>
              <span className="text-[11px]">({artisan.reviewCount} reviews)</span>
              <span className="text-[#78866B]">·</span>
              <div className="flex items-center gap-0.5 text-[11px] text-[#5A4E4D] dark:text-[#C4BDB5]">
                <MapPinIcon className="w-3 h-3 text-[#78866B] dark:text-[#A3B19F]" />
                <span className="truncate">{artisan.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Short Bio Snippet */}
        <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] line-clamp-2 mb-3 leading-relaxed">
          {artisan.bio}
        </p>

        {/* Specialties Tags (Unboxed / quiet text metadata per design constitution) */}
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-3 text-[11px] text-[#78866B] dark:text-[#A3B19F]">
          {artisan.specialties.slice(0, 2).map((spec, i) => (
            <React.Fragment key={spec}>
              <span className="text-[#5A4E4D] dark:text-[#C4BDB5] font-medium">{spec}</span>
              {i < 1 && <span className="text-[#78866B]/50">·</span>}
            </React.Fragment>
          ))}
          {artisan.specialties.length > 2 && (
            <span className="text-[#0891B2] font-semibold">+{artisan.specialties.length - 2} more</span>
          )}
        </div>
      </div>

      {/* Footer: Starting/Hourly rates + Action Buttons */}
      <div className="pt-3 border-t border-[#78866B]/20 dark:border-[#78866B]/30 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-[#78866B] dark:text-[#A3B19F]">
            Estimated Rate
          </span>
          <div className="text-xs font-bold text-[#3B2F2F] dark:text-[#F5F2EB] tabular-nums">
            From {artisan.currency}{artisan.startingPrice} <span className="text-[11px] font-normal text-[#5A4E4D] dark:text-[#A3B19F]">({artisan.currency}{artisan.hourlyRate}/hr)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelect(artisan)}
            className="px-2.5 py-1.5 text-xs font-medium text-[#3B2F2F] dark:text-[#F5F2EB] hover:bg-[#F5F2EB] dark:hover:bg-[#2B2522] rounded-lg border border-[#78866B]/30 dark:border-[#78866B]/40 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => onRequestQuote(artisan)}
            className="px-3 py-1.5 text-xs font-bold text-[#FBF9F5] bg-[#D97736] hover:bg-[#C86D3B] rounded-lg shadow-xs transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <CalendarIcon className="w-3 h-3" />
            <span>Book Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
