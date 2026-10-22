import React, { useState } from 'react';
import { Artisan, User } from '../types';
import { CloseIcon, CalendarIcon, CheckCircleIcon, DollarSignIcon } from '../icons';

interface BookingModalProps {
  artisan: Artisan;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (bookingData: {
    serviceType: string;
    preferredDate: string;
    description: string;
    estimatedPrice: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerLocation: string;
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  artisan,
  currentUser,
  onClose,
  onSubmit
}) => {
  const [serviceType, setServiceType] = useState(artisan.specialties[0] || 'Custom Consultation');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+27 ');
  const [customerLocation, setCustomerLocation] = useState(currentUser?.location || artisan.location || 'Johannesburg');
  const [submitted, setSubmitted] = useState(false);

  // Auto-calculated estimate: Starting price + hourly rate * hours
  const calculatedEstimate = artisan.startingPrice + (artisan.hourlyRate * (estimatedHours - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !customerName.trim() || !customerEmail.trim()) return;

    onSubmit({
      serviceType,
      preferredDate,
      description,
      estimatedPrice: calculatedEstimate,
      customerName,
      customerEmail,
      customerPhone,
      customerLocation
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/30 dark:border-[#78866B]/45 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto transition-colors">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#78866B] dark:text-[#A3B19F] hover:text-[#3B2F2F] dark:hover:text-[#F5F2EB] hover:bg-[#F5F2EB] dark:hover:bg-[#2B2522] transition-colors"
          aria-label="Close modal"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#0891B2]/15 dark:bg-[#0891B2]/25 text-[#0891B2] dark:text-[#22D3EE] mx-auto flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
              Quote Request Sent!
            </h3>
            <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] max-w-xs mx-auto">
              {artisan.name} has been notified and will reply via SkillFinder Messages with a confirmed appointment time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78866B] dark:text-[#A3B19F]">
                Direct Quote & Consultation
              </span>
              <h3 className="font-display text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                Book with {artisan.name}
              </h3>
              <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5]">
                {artisan.trade} · {artisan.location}
              </p>
            </div>

            {/* Service & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  Required Service
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#3B2F2F] dark:text-[#F5F2EB] focus:outline-none focus:border-[#D97736]"
                >
                  {artisan.specialties.map(spec => (
                    <option key={spec} value={spec} className="dark:bg-[#1C1816]">{spec}</option>
                  ))}
                  <option value="General Inspection" className="dark:bg-[#1C1816]">General Inspection / Repair</option>
                  <option value="Custom Project" className="dark:bg-[#1C1816]">Custom Project Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs font-medium text-[#3B2F2F] dark:text-[#F5F2EB] focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            {/* Project Scope & Hours slider */}
            <div className="bg-[#F5F2EB] dark:bg-[#2B2522] rounded-2xl p-3 border border-[#78866B]/20 dark:border-[#78866B]/35 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#3B2F2F] dark:text-[#F5F2EB]">
                <span>Estimated Job Duration</span>
                <span className="text-[#D97736] font-bold tabular-nums">~{estimatedHours} hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full accent-[#D97736] cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-[#5A4E4D] dark:text-[#C4BDB5] pt-1 border-t border-[#78866B]/15 dark:border-[#78866B]/30">
                <span>Estimated Quote:</span>
                <span className="font-bold text-[#3B2F2F] dark:text-[#F5F2EB] tabular-nums text-sm">
                  {artisan.currency}{calculatedEstimate}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                Job Description & Scope
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide dimensions, materials, problems, or any special requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl p-3 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]"
              />
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+27 82 000 0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4E4D] dark:text-[#C4BDB5] mb-1">
                  Job Site / Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johannesburg, Sandton, Cape Town"
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  className="w-full bg-[#F5F2EB] dark:bg-[#1C1816] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-xl px-3 py-2 text-xs text-[#3B2F2F] dark:text-[#F5F2EB] placeholder-[#5A4E4D]/60 dark:placeholder-[#C4BDB5]/50 focus:outline-none focus:border-[#D97736]"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] text-xs font-bold text-[#FBF9F5] shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Submit Quote Request (Estimated {artisan.currency}{calculatedEstimate})</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
