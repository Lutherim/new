import React, { useState } from 'react';
import { Artisan, Review, User } from '../types';
import { 
  StarIcon, 
  MapPinIcon, 
  BadgeCheckIcon, 
  ShieldCheckIcon, 
  BriefcaseIcon, 
  GraduationCapIcon, 
  AwardIcon, 
  CalendarIcon, 
  MessageSquareIcon, 
  PhoneIcon, 
  MailIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  ThumbsUpIcon,
  PlusIcon
} from '../icons';

interface ArtisanProfileProps {
  artisan: Artisan;
  reviews: Review[];
  currentUser: User | null;
  onBack: () => void;
  onRequestQuote: () => void;
  onOpenChat: () => void;
  onAddReview: (review: { rating: number; projectType: string; comment: string }) => void;
}

export const ArtisanProfile: React.FC<ArtisanProfileProps> = ({
  artisan,
  reviews,
  currentUser,
  onBack,
  onRequestQuote,
  onOpenChat,
  onAddReview
}) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'credentials' | 'reviews'>('portfolio');
  const [portfolioFilter, setPortfolioFilter] = useState<'all' | 'new' | 'past'>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewProjectType, setReviewProjectType] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const filteredPortfolio = artisan.portfolio.filter(item => {
    if (portfolioFilter === 'all') return true;
    return item.category === portfolioFilter;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewProjectType.trim() || !reviewComment.trim()) return;

    onAddReview({
      rating: reviewRating,
      projectType: reviewProjectType,
      comment: reviewComment
    });

    setReviewProjectType('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Back Navigation */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB] mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to search results</span>
      </button>

      {/* Hero Header Card */}
      <div className="bg-[#FBF9F5] dark:bg-[#231F1D] rounded-3xl border border-[#78866B]/25 dark:border-[#78866B]/35 overflow-hidden shadow-xs mb-8 transition-colors">
        {/* Cover Photo */}
        <div className="h-48 sm:h-64 w-full relative bg-stone-300 dark:bg-stone-800">
          <img
            src={artisan.coverImage}
            alt={`${artisan.name}'s craft`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FBF9F5]/90 dark:bg-[#1C1816]/90 backdrop-blur-md text-[#3B2F2F] dark:text-[#F5F2EB] border border-[#78866B]/20 dark:border-[#78866B]/40">
              {artisan.trade}
            </span>
            {artisan.online && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0891B2] text-white flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Active Now
              </span>
            )}
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#FBF9F5] dark:border-[#231F1D] shadow-md bg-stone-100 dark:bg-stone-800"
                />
                {artisan.verified && (
                  <span 
                    className="absolute bottom-2 right-2 p-1.5 rounded-full bg-[#0891B2] text-white shadow-sm"
                    title="Verified Artisan"
                  >
                    <BadgeCheckIcon className="w-5 h-5" />
                  </span>
                )}
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                    {artisan.name}
                  </h1>
                </div>
                <p className="text-sm font-semibold text-[#78866B] dark:text-[#A3B19F]">
                  {artisan.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#5A4E4D] dark:text-[#C4BDB5] flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-[#D97736]">
                    <StarIcon className="w-4 h-4 fill-[#D97736]" />
                    {artisan.rating.toFixed(2)}
                  </span>
                  <span>·</span>
                  <span>{artisan.reviewCount} verified reviews</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                    {artisan.location}
                  </span>
                  <span>·</span>
                  <span>{artisan.yearsOfExperience} years experience</span>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={onOpenChat}
                className="px-4 py-2.5 rounded-xl border border-[#78866B]/40 dark:border-[#78866B]/50 hover:bg-[#F5F2EB] dark:hover:bg-[#2B2522] text-xs font-bold text-[#3B2F2F] dark:text-[#F5F2EB] transition-colors flex items-center gap-1.5"
              >
                <MessageSquareIcon className="w-4 h-4 text-[#78866B] dark:text-[#A3B19F]" />
                <span>Message</span>
              </button>
              <button
                onClick={onRequestQuote}
                className="px-5 py-2.5 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] text-xs font-bold text-[#FBF9F5] shadow-sm transition-colors flex items-center gap-1.5 active:scale-95"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Request Custom Quote</span>
              </button>
            </div>
          </div>

          {/* Badges strip */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#78866B]/20 dark:border-[#78866B]/30">
            {artisan.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#78866B]/15 dark:bg-[#78866B]/25 text-[#3B2F2F] dark:text-[#F5F2EB] border border-[#78866B]/20 dark:border-[#78866B]/30"
              >
                <ShieldCheckIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Details Left, Rate/Booking Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Tabs & Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bio Overview */}
          <div className="bg-[#FBF9F5] dark:bg-[#231F1D] rounded-2xl border border-[#78866B]/25 dark:border-[#78866B]/35 p-6 shadow-xs transition-colors">
            <h2 className="font-display text-lg font-bold text-[#3B2F2F] dark:text-[#F5F2EB] mb-3">
              Craftsmanship & Philosophy
            </h2>
            <p className="text-sm text-[#5A4E4D] dark:text-[#C4BDB5] leading-relaxed mb-4">
              {artisan.bio}
            </p>

            <h3 className="text-xs uppercase font-bold tracking-wider text-[#78866B] dark:text-[#A3B19F] mb-2">
              Key Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {artisan.specialties.map(spec => (
                <span
                  key={spec}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-[#F5F2EB] dark:bg-[#2B2522] text-[#3B2F2F] dark:text-[#F5F2EB] border border-[#78866B]/20 dark:border-[#78866B]/30"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-[#78866B]/20 dark:border-[#78866B]/30 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'portfolio'
                  ? 'bg-[#3B2F2F] text-[#FBF9F5] dark:bg-[#D97736] dark:text-[#FBF9F5]'
                  : 'text-[#5A4E4D] dark:text-[#C4BDB5] hover:bg-[#F5F2EB] dark:hover:bg-[#231F1D]'
              }`}
            >
              Work Showcase ({artisan.portfolio.length})
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'credentials'
                  ? 'bg-[#3B2F2F] text-[#FBF9F5] dark:bg-[#D97736] dark:text-[#FBF9F5]'
                  : 'text-[#5A4E4D] dark:text-[#C4BDB5] hover:bg-[#F5F2EB] dark:hover:bg-[#231F1D]'
              }`}
            >
              Experience & Education ({artisan.educationExperience.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-[#3B2F2F] text-[#FBF9F5] dark:bg-[#D97736] dark:text-[#FBF9F5]'
                  : 'text-[#5A4E4D] dark:text-[#C4BDB5] hover:bg-[#F5F2EB] dark:hover:bg-[#231F1D]'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* TAB 1: WORK SHOWCASE (Past vs New Work) */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              {/* Category sub-filter */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#78866B] dark:text-[#A3B19F]">
                  Filter by timeline:
                </span>
                <div className="flex items-center gap-1 bg-[#F5F2EB] dark:bg-[#231F1D] p-1 rounded-xl border border-[#78866B]/30">
                  <button
                    onClick={() => setPortfolioFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      portfolioFilter === 'all'
                        ? 'bg-[#FBF9F5] text-[#3B2F2F] dark:bg-[#3B2F2F] dark:text-[#FBF9F5] shadow-xs'
                        : 'text-[#5A4E4D] dark:text-[#C4BDB5]'
                    }`}
                  >
                    All Work
                  </button>
                  <button
                    onClick={() => setPortfolioFilter('new')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      portfolioFilter === 'new'
                        ? 'bg-[#0891B2] text-white shadow-xs'
                        : 'text-[#5A4E4D] dark:text-[#C4BDB5]'
                    }`}
                  >
                    Recent Projects
                  </button>
                  <button
                    onClick={() => setPortfolioFilter('past')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      portfolioFilter === 'past'
                        ? 'bg-[#78866B] text-white shadow-xs'
                        : 'text-[#5A4E4D] dark:text-[#C4BDB5]'
                    }`}
                  >
                    Past Heritage Work
                  </button>
                </div>
              </div>

              {/* Portfolio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FBF9F5] dark:bg-[#231F1D] rounded-2xl border border-[#78866B]/25 dark:border-[#78866B]/35 overflow-hidden shadow-xs hover:border-[#D97736] dark:hover:border-[#D97736] transition-all group"
                  >
                    <div className="h-44 w-full relative bg-stone-200 dark:bg-stone-800 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.category === 'new' 
                          ? 'bg-[#0891B2] text-white' 
                          : 'bg-[#78866B] text-white'
                      }`}>
                        {item.category === 'new' ? 'New Work' : 'Past Work'}
                      </span>
                    </div>

                    <div className="p-4">
                      <h4 className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] leading-relaxed mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-[#78866B] dark:text-[#A3B19F] pt-2 border-t border-[#78866B]/15 dark:border-[#78866B]/30">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {item.completedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {item.duration}
                        </span>
                      </div>

                      {item.clientFeedback && (
                        <div className="mt-2.5 p-2 rounded-lg bg-[#F5F2EB] dark:bg-[#2B2522] text-[11px] italic text-[#5A4E4D] dark:text-[#C4BDB5]">
                          "{item.clientFeedback}"
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CREDENTIALS & EXPERIENCE */}
          {activeTab === 'credentials' && (
            <div className="bg-[#FBF9F5] dark:bg-[#231F1D] rounded-2xl border border-[#78866B]/25 dark:border-[#78866B]/35 p-6 space-y-6 transition-colors">
              <div>
                <h3 className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB] mb-4 flex items-center gap-2">
                  <GraduationCapIcon className="w-5 h-5 text-[#0891B2]" />
                  Trade Certifications & Education
                </h3>
                <div className="space-y-4 border-l-2 border-[#78866B]/30 dark:border-[#78866B]/40 pl-4 ml-2">
                  {artisan.educationExperience.map((item) => (
                    <div key={item.id} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#D97736] border-2 border-white dark:border-[#231F1D]" />
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                          {item.title}
                        </h4>
                        <span className="text-xs font-semibold text-[#78866B] dark:text-[#A3B19F] tabular-nums">
                          {item.year}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#78866B] dark:text-[#A3B19F] mb-1">
                        {item.institutionOrCompany}
                      </p>
                      <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFIED REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Header with Add Review Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                    Verified Customer Feedback
                  </h3>
                  <p className="text-xs text-[#78866B] dark:text-[#A3B19F]">
                    Based on {reviews.length} authentic service completions
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#78866B]/15 hover:bg-[#78866B]/25 dark:bg-[#78866B]/25 dark:hover:bg-[#78866B]/35 border border-[#78866B]/30 text-xs font-bold text-[#3B2F2F] dark:text-[#F5F2EB] transition-colors flex items-center gap-1.5"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Leave a Review</span>
                </button>
              </div>

              {/* Add Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-[#F5F2EB] dark:bg-[#231F1D] rounded-2xl border border-[#78866B]/40 p-5 space-y-4 transition-colors"
                >
                  <h4 className="font-display text-sm font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                    Write a Review for {artisan.name}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                        Rating (1 to 5 Stars)
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="p-1 focus:outline-none"
                          >
                            <StarIcon
                              className={`w-6 h-6 ${
                                star <= reviewRating
                                  ? 'fill-[#D97736] text-[#D97736]'
                                  : 'text-stone-300 dark:text-stone-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                        Project / Work Type
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Custom Dining Table, Geyser Repair"
                        value={reviewProjectType}
                        onChange={(e) => setReviewProjectType(e.target.value)}
                        className="w-full bg-[#FBF9F5] dark:bg-[#1C1816] border border-[#78866B]/30 rounded-lg px-3 py-1.5 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] focus:outline-none focus:border-[#D97736]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                      Detailed Feedback
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the craftsmanship, timeliness, and outcome..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-[#FBF9F5] dark:bg-[#1C1816] border border-[#78866B]/30 rounded-lg p-2.5 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] focus:outline-none focus:border-[#D97736]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#5A4E4D] dark:text-[#C4BDB5] hover:bg-stone-200 dark:hover:bg-[#2B2522]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#D97736] hover:bg-[#C86D3B] text-xs font-bold text-[#FBF9F5] shadow-xs"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}

              {/* Review Items */}
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#FBF9F5] dark:bg-[#231F1D] rounded-2xl border border-[#78866B]/25 dark:border-[#78866B]/35 p-4 space-y-2 shadow-xs transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.customerAvatar}
                          alt={rev.customerName}
                          className="w-10 h-10 rounded-full object-cover border border-[#78866B]/20"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                            {rev.customerName}
                          </h4>
                          <span className="text-[11px] text-[#78866B] dark:text-[#A3B19F]">
                            {rev.projectType}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[#D97736] font-bold text-xs">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <StarIcon key={i} className="w-3.5 h-3.5 fill-[#D97736]" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] leading-relaxed pt-1">
                      {rev.comment}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#78866B] dark:text-[#A3B19F] pt-2 border-t border-[#78866B]/15 dark:border-[#78866B]/30">
                      <span className="flex items-center gap-1 text-[#0891B2] font-semibold">
                        <CheckCircleIcon className="w-3 h-3" />
                        Verified Service
                      </span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Pricing & Direct Booking Card */}
        <div className="space-y-6">
          <div className="bg-[#FBF9F5] dark:bg-[#231F1D] rounded-3xl border-2 border-[#78866B]/30 dark:border-[#78866B]/40 p-6 shadow-sm sticky top-24 transition-colors">
            
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#78866B] dark:text-[#A3B19F]">
              Standard Pricing & Estimates
            </span>
            
            <div className="my-3">
              <div className="text-3xl font-display font-bold text-[#3B2F2F] dark:text-[#F5F2EB] tabular-nums">
                From {artisan.currency}{artisan.startingPrice}
              </div>
              <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] mt-0.5">
                Standard hourly rate: <strong className="text-[#3B2F2F] dark:text-[#F5F2EB]">{artisan.currency}{artisan.hourlyRate} / hour</strong>
              </p>
            </div>

            <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] leading-relaxed mb-6">
              Final quotes vary by job dimensions, timber or materials selection, and installation complexities. Request a transparent breakdown below.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#78866B]/15 dark:border-[#78866B]/30">
                <span className="text-[#5A4E4D] dark:text-[#C4BDB5]">Initial Consultation</span>
                <span className="font-semibold text-[#3B2F2F] dark:text-[#F5F2EB]">Complimentary</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#78866B]/15 dark:border-[#78866B]/30">
                <span className="text-[#5A4E4D] dark:text-[#C4BDB5]">Call-out Fee</span>
                <span className="font-semibold text-[#3B2F2F] dark:text-[#F5F2EB]">{artisan.currency}200 (Waived if hired)</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-[#78866B]/15 dark:border-[#78866B]/30">
                <span className="text-[#5A4E4D] dark:text-[#C4BDB5]">Warranty on Labor</span>
                <span className="font-semibold text-[#0891B2]">12 Months Guaranteed</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={onRequestQuote}
                className="w-full py-3 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] text-xs sm:text-sm font-bold text-[#FBF9F5] shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Book Service / Request Quote</span>
              </button>

              <button
                onClick={onOpenChat}
                className="w-full py-2.5 rounded-xl border border-[#78866B]/40 dark:border-[#78866B]/50 hover:bg-[#F5F2EB] dark:hover:bg-[#2B2522] text-xs font-bold text-[#3B2F2F] dark:text-[#F5F2EB] transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquareIcon className="w-4 h-4 text-[#78866B] dark:text-[#A3B19F]" />
                <span>Chat with {artisan.name.split(' ')[0]}</span>
              </button>
            </div>

            {/* Direct Contacts */}
            <div className="mt-6 pt-4 border-t border-[#78866B]/20 dark:border-[#78866B]/30 space-y-2 text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                <span>{artisan.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                <span className="truncate">{artisan.contactEmail}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
