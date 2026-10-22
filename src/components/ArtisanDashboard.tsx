import React, { useState } from 'react';
import { BookingRequest, User } from '../types';
import { 
  CheckCircleIcon, 
  CloseIcon, 
  MessageSquareIcon, 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  DollarSignIcon,
  MapPinIcon,
  UserIcon,
  BriefcaseIcon
} from '../icons';

export interface LocationCustomer {
  name: string;
  email: string;
  phone: string;
  location: string;
  requestCount: number;
  recentTrade: string;
}

interface ArtisanDashboardProps {
  currentUser: User;
  directBookings: BookingRequest[];
  locationBookings: BookingRequest[];
  locationCustomers: LocationCustomer[];
  onUpdateStatus: (bookingId: string, status: BookingRequest['status']) => void;
  onOpenChatWithCustomer: (customerId: string) => void;
}

export const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({
  currentUser,
  directBookings,
  locationBookings,
  locationCustomers,
  onUpdateStatus,
  onOpenChatWithCustomer
}) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'locationInquiries' | 'locationCustomers'>('direct');

  const pendingCount = directBookings.filter(b => b.status === 'pending').length;
  const acceptedCount = directBookings.filter(b => b.status === 'accepted').length;
  const totalPipelineValue = directBookings.reduce((sum, b) => sum + b.estimatedPrice, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-[#F5F2EB] dark:bg-[#231F1D] rounded-3xl p-6 sm:p-8 border border-[#78866B]/25 dark:border-[#78866B]/35 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78866B] dark:text-[#A3B19F]">
              Artisan Workshop Lead Portal
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0891B2] text-white">
              Online & Accepting Quotes
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#78866B]/20 text-[#3B2F2F] dark:text-[#F5F2EB] flex items-center gap-1">
              <MapPinIcon className="w-3 h-3 text-[#D97736]" />
              {currentUser.location}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
            {currentUser.name}’s Inbound Requests & Local Leads
          </h1>
          <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] mt-1">
            Review incoming project briefs, send custom quotations, and discover customers in {currentUser.location}.
          </p>
        </div>

        {/* Quick Stats Strip */}
        <div className="flex items-center gap-4 bg-[#FBF9F5] dark:bg-[#1C1816] p-4 rounded-2xl border border-[#78866B]/20 dark:border-[#78866B]/35 shrink-0 transition-colors flex-wrap">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#78866B] dark:text-[#A3B19F]">Direct Leads</div>
            <div className="text-xl font-bold text-[#D97736] tabular-nums">{pendingCount}</div>
          </div>
          <div className="h-8 w-px bg-[#78866B]/20 dark:bg-[#78866B]/35" />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#78866B] dark:text-[#A3B19F]">Active Jobs</div>
            <div className="text-xl font-bold text-[#0891B2] dark:text-[#22D3EE] tabular-nums">{acceptedCount}</div>
          </div>
          <div className="h-8 w-px bg-[#78866B]/20 dark:bg-[#78866B]/35" />
          <div>
            <div className="text-[10px] uppercase font-bold text-[#78866B] dark:text-[#A3B19F]">In {currentUser.location}</div>
            <div className="text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB] tabular-nums">{locationBookings.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-[#78866B]/20 dark:border-[#78866B]/30 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('direct')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'direct'
              ? 'bg-[#3B2F2F] text-[#FBF9F5] dark:bg-[#D97736] dark:text-[#FBF9F5] shadow-xs'
              : 'text-[#5A4E4D] dark:text-[#C4BDB5] hover:bg-[#F5F2EB] dark:hover:bg-[#231F1D]'
          }`}
        >
          <span>Requested Me Directly</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/20 text-white">
            {directBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('locationInquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'locationInquiries'
              ? 'bg-[#3B2F2F] text-[#FBF9F5] dark:bg-[#D97736] dark:text-[#FBF9F5] shadow-xs'
              : 'text-[#5A4E4D] dark:text-[#C4BDB5] hover:bg-[#F5F2EB] dark:hover:bg-[#231F1D]'
          }`}
        >
          <MapPinIcon className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
          <span>Customer Inquiries in {currentUser.location}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#0891B2] text-white">
            {locationBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('locationCustomers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'locationCustomers'
              ? 'bg-[#3B2F2F] text-[#FBF9F5] dark:bg-[#D97736] dark:text-[#FBF9F5] shadow-xs'
              : 'text-[#5A4E4D] dark:text-[#C4BDB5] hover:bg-[#F5F2EB] dark:hover:bg-[#231F1D]'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Local Customers ({locationCustomers.length})</span>
        </button>
      </div>

      {/* TAB 1: DIRECT CUSTOMER REQUESTS */}
      {activeTab === 'direct' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
              Direct Inquiries For Your Workshop ({directBookings.length})
            </h2>
            <span className="text-xs text-[#78866B] dark:text-[#A3B19F]">
              Clients who picked you directly
            </span>
          </div>

          {directBookings.length === 0 ? (
            <div className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/25 dark:border-[#78866B]/35 rounded-2xl p-12 text-center space-y-3 transition-colors">
              <ShieldCheckIcon className="w-10 h-10 text-[#78866B] dark:text-[#A3B19F] mx-auto opacity-50" />
              <h3 className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                No direct customer inquiries right now
              </h3>
              <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] max-w-sm mx-auto">
                Check the "Customer Inquiries in {currentUser.location}" tab to discover nearby homeowners looking for craftsmen!
              </p>
              <button
                onClick={() => setActiveTab('locationInquiries')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#0891B2] text-white text-xs font-bold"
              >
                View Nearby Inquiries in {currentUser.location}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {directBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-2xl p-6 shadow-xs hover:border-[#78866B] dark:hover:border-[#78866B] transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#78866B]/15 dark:border-[#78866B]/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                          {booking.customerName}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
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

                      <p className="text-xs font-semibold text-[#78866B] dark:text-[#A3B19F] mt-0.5">
                        Service: <span className="text-[#3B2F2F] dark:text-[#F5F2EB]">{booking.serviceType}</span>
                        {booking.customerLocation && (
                          <span className="ml-2 px-2 py-0.5 rounded text-[11px] bg-[#78866B]/15 text-[#3B2F2F] dark:text-[#F5F2EB]">
                            📍 {booking.customerLocation}
                          </span>
                        )}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-xs text-[#5A4E4D] dark:text-[#C4BDB5] flex-wrap">
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                          {booking.customerPhone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MailIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                          {booking.customerEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                          Target: {booking.preferredDate}
                        </span>
                      </div>
                    </div>

                    {/* Estimated Price */}
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-[#78866B] dark:text-[#A3B19F]">
                        Initial Estimate
                      </span>
                      <div className="text-2xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB] tabular-nums">
                        R{booking.estimatedPrice}
                      </div>
                    </div>
                  </div>

                  {/* Job Scope Body */}
                  <div className="py-4">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-[#78866B] dark:text-[#A3B19F] mb-1">
                      Job Scope & Client Requirements
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5A4E4D] dark:text-[#C4BDB5] leading-relaxed bg-[#F5F2EB] dark:bg-[#2B2522] p-3 rounded-xl border border-[#78866B]/15 dark:border-[#78866B]/30">
                      "{booking.description}"
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-[#78866B] dark:text-[#A3B19F]">
                      Received: {new Date(booking.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenChatWithCustomer(booking.customerId)}
                        className="px-3.5 py-1.5 rounded-xl border border-[#78866B]/40 dark:border-[#78866B]/50 hover:bg-[#F5F2EB] dark:hover:bg-[#2B2522] text-xs font-bold text-[#3B2F2F] dark:text-[#F5F2EB] transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquareIcon className="w-3.5 h-3.5 text-[#78866B] dark:text-[#A3B19F]" />
                        <span>Message Client</span>
                      </button>

                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'declined')}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'accepted')}
                            className="px-4 py-1.5 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            <span>Accept Request</span>
                          </button>
                        </>
                      )}

                      {booking.status === 'accepted' && (
                        <button
                          onClick={() => onUpdateStatus(booking.id, 'completed')}
                          className="px-4 py-1.5 rounded-xl bg-[#0891B2] hover:bg-[#06B6D4] text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          <span>Mark Job Completed</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INQUIRIES FROM CUSTOMERS IN ARTISAN'S LOCATION */}
      {activeTab === 'locationInquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                Customer Requests in {currentUser.location} ({locationBookings.length})
              </h2>
              <p className="text-xs text-[#78866B] dark:text-[#A3B19F]">
                Homeowners in your immediate city seeking artisan trade services
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] border border-[#0891B2]/20">
              📍 {currentUser.location} Open Leads
            </span>
          </div>

          {locationBookings.length === 0 ? (
            <div className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/25 dark:border-[#78866B]/35 rounded-2xl p-12 text-center space-y-3 transition-colors">
              <MapPinIcon className="w-10 h-10 text-[#78866B] dark:text-[#A3B19F] mx-auto opacity-50" />
              <h3 className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                No other customer inquiries in {currentUser.location} at this moment
              </h3>
              <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] max-w-sm mx-auto">
                As local homeowners in {currentUser.location} request quotes, they will appear here instantly for you to bid and quote.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locationBookings.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/30 dark:border-[#78866B]/40 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0891B2] dark:text-[#22D3EE]">
                          {inquiry.trade}
                        </span>
                        <h3 className="font-display text-base font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                          {inquiry.serviceType}
                        </h3>
                        <p className="text-xs font-semibold text-[#78866B] dark:text-[#A3B19F]">
                          Client: {inquiry.customerName} · 📍 {inquiry.customerLocation || currentUser.location}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-[#78866B] dark:text-[#A3B19F]">
                          Budget Est.
                        </span>
                        <div className="text-lg font-bold text-[#3B2F2F] dark:text-[#F5F2EB] tabular-nums">
                          R{inquiry.estimatedPrice}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] line-clamp-3 leading-relaxed bg-[#F5F2EB] dark:bg-[#2B2522] p-3 rounded-xl mb-3 border border-[#78866B]/15 dark:border-[#78866B]/30">
                      "{inquiry.description}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#5A4E4D] dark:text-[#C4BDB5] flex-wrap">
                      <span className="flex items-center gap-1">
                        <PhoneIcon className="w-3 h-3 text-[#78866B] dark:text-[#A3B19F]" />
                        {inquiry.customerPhone}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3 text-[#78866B] dark:text-[#A3B19F]" />
                        Needed by {inquiry.preferredDate}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#78866B]/15 dark:border-[#78866B]/30 flex items-center justify-between">
                    <span className="text-[10px] text-[#78866B] dark:text-[#A3B19F]">
                      Requested for: {inquiry.artisanName}
                    </span>
                    <button
                      onClick={() => onOpenChatWithCustomer(inquiry.customerId)}
                      className="px-3 py-1.5 rounded-xl bg-[#D97736] hover:bg-[#C86D3B] text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquareIcon className="w-3.5 h-3.5" />
                      <span>Contact Customer</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOMERS IN ARTISAN'S LOCATION */}
      {activeTab === 'locationCustomers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                Active Homeowners & Clients in {currentUser.location} ({locationCustomers.length})
              </h2>
              <p className="text-xs text-[#78866B] dark:text-[#A3B19F]">
                Verified community members actively requesting trade work in your vicinity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locationCustomers.map((cust, idx) => (
              <div
                key={idx}
                className="bg-[#FBF9F5] dark:bg-[#231F1D] border border-[#78866B]/25 dark:border-[#78866B]/35 rounded-2xl p-5 shadow-xs space-y-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] flex items-center justify-center font-bold font-display text-sm">
                    {cust.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#3B2F2F] dark:text-[#F5F2EB]">
                      {cust.name}
                    </h4>
                    <span className="text-[11px] text-[#78866B] dark:text-[#A3B19F] flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3 text-[#D97736]" />
                      {cust.location}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#5A4E4D] dark:text-[#C4BDB5] space-y-1 bg-[#F5F2EB] dark:bg-[#2B2522] p-2.5 rounded-xl border border-[#78866B]/15 dark:border-[#78866B]/30">
                  <div className="flex items-center justify-between">
                    <span>Recent Trade:</span>
                    <strong className="text-[#3B2F2F] dark:text-[#F5F2EB]">{cust.recentTrade}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Inquiries submitted:</span>
                    <strong className="text-[#D97736] tabular-nums">{cust.requestCount}</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#78866B] dark:text-[#A3B19F] truncate max-w-[140px]">
                    {cust.phone}
                  </span>
                  <button
                    onClick={() => onOpenChatWithCustomer(`cust-${cust.email}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#3B2F2F] dark:bg-[#D97736] text-white font-bold text-xs flex items-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <MessageSquareIcon className="w-3 h-3" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

