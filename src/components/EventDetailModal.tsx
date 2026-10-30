import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  DollarSign, 
  Share2,
  ChevronRight
} from 'lucide-react';
import { Gathering } from '../types';

interface EventDetailModalProps {
  gathering: Gathering;
  onClose: () => void;
  onBookNow: (gathering: Gathering, tier: 'General' | 'VIP Circle') => void;
  platformTakeRate: number;
  currency?: 'PKR' | 'USD';
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  gathering,
  onClose,
  onBookNow,
  platformTakeRate,
  currency = 'PKR',
}) => {
  const currencySymbol = currency === 'PKR' ? 'Rs. ' : '$';
  const [selectedTier, setSelectedTier] = useState<'General' | 'VIP Circle'>('General');
  const [copied, setCopied] = useState(false);

  const spotsLeft = gathering.maxCapacity - gathering.bookedCount;
  const isSoldOut = spotsLeft <= 0;

  const currentPrice = selectedTier === 'General' ? gathering.price : gathering.vipPrice;
  const fixedConcierge = currency === 'PKR' ? 350 : 2.50;
  const platformRevenue = (currentPrice * (platformTakeRate / 100)) + fixedConcierge;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-event-detail"
        className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Image with Floating Action Buttons */}
        <div className="relative h-64 sm:h-72 w-full bg-gray-900 shrink-0">
          <img
            src={gathering.image}
            alt={gathering.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Bar Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur text-gray-900 shadow-md">
              {gathering.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                id="btn-share-gathering"
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center transition-colors"
                title="Share event link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                id="btn-close-detail-modal"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            {copied && (
              <span className="inline-block mb-2 px-2.5 py-0.5 rounded text-xs bg-emerald-500 text-white font-medium">
                Link copied to clipboard!
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-bold font-display leading-tight">
              {gathering.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 mt-1 line-clamp-1">
              {gathering.tagline}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Date</span>
                <span className="font-semibold text-gray-800">{gathering.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Time</span>
                <span className="font-semibold text-gray-800">{gathering.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Location</span>
                <span className="font-semibold text-gray-800 truncate block">{gathering.neighborhood}, {gathering.city}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Table Size</span>
                <span className="font-semibold text-gray-800">{spotsLeft} of {gathering.maxCapacity} seats left</span>
              </div>
            </div>
          </div>

          {/* About Gathering */}
          <div>
            <h3 className="font-display font-bold text-base text-gray-900 mb-2">About this Gathering</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {gathering.description}
            </p>
          </div>

          {/* The Host Profile */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={gathering.host.avatar}
                alt={gathering.host.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-gray-900">{gathering.host.name}</h4>
                  {gathering.host.verified && (
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Host
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{gathering.host.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <strong>{gathering.host.rating}</strong> ({gathering.host.reviewCount} reviews)
                  </span>
                  <span>•</span>
                  <span>{gathering.host.totalEventsHosted} events curated</span>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 w-full sm:w-auto">
              <span className="text-[11px] text-gray-400 block">Host Community Rep</span>
              <span className="text-xs font-semibold text-emerald-700">Top 5% Rated</span>
            </div>
          </div>

          {/* Agenda Timeline */}
          <div>
            <h3 className="font-display font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
              <span>Experience Flow &amp; Agenda</span>
              <span className="text-xs font-normal text-gray-500">({gathering.duration})</span>
            </h3>
            <div className="space-y-3 pl-2 border-l-2 border-emerald-200 ml-2">
              {gathering.agenda.map((item, idx) => (
                <div key={idx} className="relative pl-4 group">
                  <div className="absolute -left-[1.3rem] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  <span className="text-xs font-bold text-emerald-800 font-mono">{item.time}</span>
                  <h5 className="text-xs font-semibold text-gray-900">{item.title}</h5>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Icebreaker of the Night */}
          <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2 text-indigo-950 font-bold text-xs">
              <MessageCircle className="w-4 h-4 text-indigo-600" />
              <span>Table Icebreaker Sparks (No Small Talk)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-indigo-900">
              {gathering.icebreakers.map((q, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">&ldquo;</span>
                  <span className="italic">{q}&rdquo;</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="font-display font-bold text-base text-gray-900 mb-2">What is Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {gathering.includedItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmed Attendees */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
                <span>Who&apos;s Joining the Table</span>
                <span className="text-xs font-normal text-gray-500">
                  ({gathering.attendees.length} confirmed profiles)
                </span>
              </h3>
            </div>

            {gathering.attendees.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gathering.attendees.map((att) => (
                  <div 
                    key={att.id}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3"
                  >
                    <img
                      src={att.avatar}
                      alt={att.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-gray-900 truncate">{att.name}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white text-gray-600 border border-gray-200 shrink-0">
                          {att.ticketTier}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 truncate">{att.role} • {att.industry}</p>
                      <p className="text-[11px] text-emerald-800 italic mt-1 line-clamp-1">
                        Ask about: {att.icebreakerTopic}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-xs text-gray-500">
                Be the first to claim a seat at this table and set the group vibe!
              </div>
            )}
          </div>

          {/* Platform Owner Monetization Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">Platform Monetization Split</span>
                <span className="text-emerald-800 text-[11px]">
                  When booked, host receives {currencySymbol}{(currentPrice * ((100 - platformTakeRate) / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })} and your platform receives <strong>{currencySymbol}{platformRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>.
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-200/80 text-emerald-900 font-mono font-bold shrink-0">
              +{platformTakeRate}% fee
            </span>
          </div>
        </div>

        {/* Sticky Bottom Booking Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tier Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="tier-btn-general"
              onClick={() => setSelectedTier('General')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedTier === 'General'
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              General Seat ({currencySymbol}{gathering.price.toLocaleString()})
            </button>
            <button
              id="tier-btn-vip"
              onClick={() => setSelectedTier('VIP Circle')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                selectedTier === 'VIP Circle'
                  ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                  : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP Pass ({currencySymbol}{gathering.vipPrice.toLocaleString()})</span>
            </button>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-gray-500 block">Total Due</span>
              <span className="font-display text-xl font-bold text-gray-900">{currencySymbol}{currentPrice.toLocaleString()}</span>
            </div>

            <button
              id="btn-modal-reserve-seat"
              disabled={isSoldOut}
              onClick={() => onBookNow(gathering, selectedTier)}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                isSoldOut
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-600/30'
              }`}
            >
              <span>{isSoldOut ? 'Sold Out' : `Reserve Seat • ${currencySymbol}${currentPrice.toLocaleString()}`}</span>
              {!isSoldOut && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
