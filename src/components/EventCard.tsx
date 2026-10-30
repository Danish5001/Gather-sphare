import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import { Gathering } from '../types';

interface EventCardProps {
  gathering: Gathering;
  onSelect: (gathering: Gathering) => void;
  platformTakeRate: number;
  currency?: 'PKR' | 'USD';
}

export const EventCard: React.FC<EventCardProps> = ({
  gathering,
  onSelect,
  platformTakeRate,
  currency = 'PKR',
}) => {
  const currencySymbol = currency === 'PKR' ? 'Rs. ' : '$';
  const spotsLeft = gathering.maxCapacity - gathering.bookedCount;
  const isSoldOut = spotsLeft <= 0;
  const isUrgent = spotsLeft > 0 && spotsLeft <= 3;
  
  // Platform owner revenue per ticket calculation
  const fixedTake = currency === 'PKR' ? 350 : 2.50;
  const platformRevenuePerTicket = (gathering.price * (platformTakeRate / 100)) + fixedTake;

  return (
    <div 
      id={`card-gathering-${gathering.id}`}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      {/* Top Image & Floating Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={gathering.image}
          alt={gathering.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur text-gray-900 shadow-sm">
            {gathering.category}
          </span>

          {gathering.isPlatformExclusive ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-200" />
              <span>Flagship (100% Margin)</span>
            </span>
          ) : gathering.isFeatured ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Featured Host</span>
            </span>
          ) : null}
        </div>

        {/* Bottom Details on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-white/90 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium truncate">{gathering.neighborhood}, {gathering.city}</span>
            <span className="opacity-60">•</span>
            <span className="truncate opacity-80">{gathering.venueVibe}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{gathering.date}</span>
              <span className="opacity-60">•</span>
              <span>{gathering.time.split('-')[0]}</span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-display text-white">{currencySymbol}{gathering.price.toLocaleString()}</span>
              <span className="text-[11px] text-white/80 font-normal"> / seat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {gathering.title}
          </h3>
          <p className="mt-1 text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {gathering.tagline}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {gathering.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Host & Attendee status */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={gathering.host.avatar}
                alt={gathering.host.name}
                className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-gray-900 truncate">
                    {gathering.host.name}
                  </span>
                  {gathering.host.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{gathering.host.rating}</span>
                  <span>({gathering.host.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Capacity / Seats Left */}
            <div className="text-right shrink-0">
              <div className="flex items-center justify-end gap-1 text-xs font-medium">
                <Users className="w-3.5 h-3.5 text-gray-500" />
                <span className={isUrgent ? 'text-amber-600 font-bold' : isSoldOut ? 'text-rose-600 font-bold' : 'text-gray-700'}>
                  {isSoldOut ? 'Sold Out' : `${spotsLeft} left`}
                </span>
                <span className="text-gray-400 text-[11px]">/ {gathering.maxCapacity}</span>
              </div>
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1 ml-auto">
                <div 
                  className={`h-full rounded-full ${isSoldOut ? 'bg-rose-500' : isUrgent ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${(gathering.bookedCount / gathering.maxCapacity) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Platform Cut Highlight (Showing owner money-making capability) */}
          <div className="flex items-center justify-between bg-emerald-50/70 px-2.5 py-1.5 rounded-lg text-[11px] border border-emerald-100">
            <span className="text-emerald-900 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-600" />
              <span>Platform Take on Booking:</span>
            </span>
            <span className="font-bold font-mono text-emerald-800">
              +{currencySymbol}{platformRevenuePerTicket.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Action Button */}
          <button
            id={`btn-view-gathering-${gathering.id}`}
            onClick={() => onSelect(gathering)}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2 group/btn"
          >
            <span>{isSoldOut ? 'View Waitlist & Details' : 'Join Table / Reserve Seat'}</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
