import React from 'react';
import { BookingRequest, User, Artisan } from '../types';
import { CalendarIcon, MessageSquareIcon, CheckCircleIcon, ClockIcon, ArrowRightIcon, MapPinIcon, StarIcon, ShieldCheckIcon } from '../icons';

interface CustomerDashboardProps {
  currentUser: User;
  bookings: BookingRequest[];
  localArtisans: Artisan[];
  onBrowseArtisans: () => void;
  onOpenChatWithArtisan: (artisanId: string) => void;
  onSelectArtisan: (artisan: Artisan) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  bookings,
  localArtisans,
  onBrowseArtisans,
  onOpenChatWithArtisan,
  onSelectArtisan
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-[#F5F2EB] dark:bg-[#231F1D] rounded-3xl p-6 sm:p-8 border border-[#78866B]/25 dark:border-[#78866B]/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78866B] dark:text-[#A3B19F]">
              Customer Portal
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] flex items-center gap-1 border border-[#0891B2]/20">
              <MapPinIcon className="w-3 h-3 text-[#D97736]" />
              Your City: {currentUser.location}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] mt-1">
            Track your ongoing quote requests, consultations, and verified artisans based right in {currentUser.location}.
          </p>
        </div>

        <button
          onClick={onBrowseArtisans}
          className="px-5 py-2.5 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] text-xs font-bold text-[#FBF9F5] shadow-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <span>Find More {currentUser.location} Artisans</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Bookings & Quotes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
            My Service Requests & Quotes ({bookings.length})
          </h2>
          <span className="text-xs text-[#78866B] dark:text-[#A3B19F]">
            Real-time status updates
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/25 dark:border-[#78866B]/35 rounded-2xl p-10 text-center space-y-3 transition-colors">
            <CalendarIcon className="w-10 h-10 text-[#78866B] dark:text-[#A3B19F] mx-auto opacity-50" />
            <h3 className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
              No active quote requests yet
            </h3>
            <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] max-w-sm mx-auto">
              Browse master tradespeople in {currentUser.location} below, view their past work galleries, and request an estimate.
            </p>
            <button
              onClick={onBrowseArtisans}
              className="mt-2 px-4 py-2 rounded-xl bg-[#D97736] text-xs font-bold text-white shadow-xs"
            >
              Browse Artisans in {currentUser.location}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/25 dark:border-[#78866B]/35 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                        {booking.artisanName}
                      </h3>
                      <p className="text-xs font-semibold text-[#78866B] dark:text-[#A3B19F]">
                        {booking.trade} · {booking.serviceType}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        booking.status === 'accepted'
                          ? 'bg-[#0891B2]/15 text-[#0891B2] dark:bg-[#0891B2]/25 dark:text-[#22D3EE]'
                          : booking.status === 'declined'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-[#D97736]/15 text-[#D97736] dark:bg-[#D97736]/25 dark:text-[#FB923C]'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] line-clamp-2 mb-4 leading-relaxed bg-[#F5F2EB] dark:bg-[#2B2522] p-2.5 rounded-xl">
                    "{booking.description}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#78866B]/15 dark:border-[#78866B]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#5A4E4D] dark:text-[#C4BDB5]">
                    <ClockIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                    <span>Target Date: <strong className="text-[#3B2F2F] dark:text-[#F5F2EB]">{booking.preferredDate}</strong></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#3B2F2F] dark:text-[#F5F2EB] tabular-nums">
                      R{booking.estimatedPrice}
                    </span>
                    <button
                      onClick={() => onOpenChatWithArtisan(booking.artisanId)}
                      className="px-2.5 py-1 rounded-lg bg-[#F5F2EB] dark:bg-[#2B2522] hover:bg-stone-200 dark:hover:bg-[#38312D] border border-[#78866B]/30 text-xs font-semibold text-[#3B2F2F] dark:text-[#F5F2EB] flex items-center gap-1 transition-colors"
                    >
                      <MessageSquareIcon className="w-3 h-3 text-[#78866B] dark:text-[#A3B19F]" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Artisans In Your Location Section */}
      <div className="space-y-4 pt-4 border-t border-[#78866B]/20 dark:border-[#78866B]/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB] flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-[#D97736]" />
              <span>Verified Artisans in {currentUser.location} ({localArtisans.length})</span>
            </h2>
            <p className="text-xs text-[#78866B] dark:text-[#A3B19F]">
              Top-rated craftspeople available for bookings in your neighborhood
            </p>
          </div>
          <button
            onClick={onBrowseArtisans}
            className="text-xs font-bold text-[#D97736] hover:underline"
          >
            Explore All →
          </button>
        </div>

        {localArtisans.length === 0 ? (
          <div className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/25 dark:border-[#78866B]/35 rounded-2xl p-8 text-center space-y-2">
            <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
              No artisans directly registered in {currentUser.location} yet. You can expand your search to all South African locations.
            </p>
            <button
              onClick={onBrowseArtisans}
              className="px-4 py-1.5 rounded-xl bg-[#78866B] text-white text-xs font-bold"
            >
              Browse All South Africa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {localArtisans.map((artisan) => (
              <div
                key={artisan.id}
                onClick={() => onSelectArtisan(artisan)}
                className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/25 dark:border-[#78866B]/35 rounded-2xl p-4 shadow-xs hover:border-[#D97736] dark:hover:border-[#D97736] cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={artisan.avatar}
                      alt={artisan.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#78866B]/20"
                    />
                    <div>
                      <h4 className="font-display text-sm font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                        {artisan.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#78866B] dark:text-[#A3B19F]">
                        {artisan.trade}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[#D97736] font-bold">
                        <StarIcon className="w-3.5 h-3.5 fill-[#D97736]" />
                        <span>{artisan.rating.toFixed(1)}</span>
                        <span className="text-[11px] text-[#78866B] font-normal">({artisan.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] line-clamp-2 leading-relaxed mb-3">
                    {artisan.bio}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#78866B]/15 dark:border-[#78866B]/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#78866B] block">Starts at</span>
                    <strong className="text-sm font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                      {artisan.currency}{artisan.startingPrice}
                    </strong>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArtisan(artisan);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#D97736] hover:bg-[#C86D3B] text-white text-xs font-bold transition-colors"
                  >
                    View & Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
