import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  DollarSign, 
  Users, 
  Calendar, 
  MapPin, 
  Tag, 
  CheckCircle2, 
  Clock, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { Gathering, GatheringCategory } from '../types';

interface HostEventModalProps {
  onClose: () => void;
  onEventCreated: (event: Gathering, paidBoost: boolean) => void;
  platformTakeRate: number;
  boostFee: number;
  onOpenAiGenerator: () => void;
  currency?: 'PKR' | 'USD';
}

export const HostEventModal: React.FC<HostEventModalProps> = ({
  onClose,
  onEventCreated,
  platformTakeRate,
  boostFee,
  onOpenAiGenerator,
  currency = 'PKR',
}) => {
  const currencySymbol = currency === 'PKR' ? 'Rs. ' : '$';
  const effectiveBoost = currency === 'PKR' ? 2500 : (boostFee || 19);

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GatheringCategory>('Dining & Supper Clubs');
  const [price, setPrice] = useState(currency === 'PKR' ? 3500 : 45);
  const [capacity, setCapacity] = useState(10);
  const [date, setDate] = useState('Next Saturday, 7:30 PM');
  const [city, setCity] = useState('Karachi');
  const [neighborhood, setNeighborhood] = useState('DHA Phase 6');
  const [venueName, setVenueName] = useState('The Veranda Lounge');
  const [venueVibe, setVenueVibe] = useState('Intimate Courtyard & Chai Vibe');
  const [hostName, setHostName] = useState('Hamza Tariq');
  const [hostTitle, setHostTitle] = useState('Founder & Community Curator');
  const [enableBoost, setEnableBoost] = useState(true);
  const [icebreaker1, setIcebreaker1] = useState('What is one bold venture idea you are building in Pakistan?');
  const [icebreaker2, setIcebreaker2] = useState('What has been your best tea-time breakthrough this year?');

  const grossProjected = price * capacity;
  const platformRevenueCut = grossProjected * (platformTakeRate / 100);
  const hostNetPayout = grossProjected - platformRevenueCut;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGathering: Gathering = {
      id: `gath-${Date.now().toString(36)}`,
      title: title || 'Curated Community Supper & Storytelling',
      tagline: tagline || 'Intimate gathering of passionate locals and creators.',
      description: description || 'Join us for a carefully crafted in-person experience focused on meaningful conversation, great food, and lasting bonds.',
      category,
      host: {
        id: `host-${Date.now().toString(36)}`,
        name: hostName || 'Community Host',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        title: hostTitle,
        bio: 'Passionate organizer creating thoughtful spaces for real human connections.',
        rating: 5.0,
        reviewCount: 1,
        verified: true,
        totalEventsHosted: 1,
        earningsToDate: 0,
      },
      date: date || 'Saturday, 7:00 PM',
      time: '7:00 PM - 9:30 PM',
      duration: '2.5 hours',
      city,
      neighborhood,
      venueName,
      venueVibe,
      price: Number(price),
      vipPrice: Math.round(Number(price) * 0.85),
      maxCapacity: Number(capacity),
      bookedCount: 0,
      image: category === 'Dining & Supper Clubs' 
        ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'
        : category === 'Creative Workshops'
        ? 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80'
        : 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
      tags: ['New Gathering', category.split(' ')[0], 'Small Group'],
      includedItems: [
        'Curated beverage & light bites',
        'Structured conversational icebreakers',
        'Direct contact roster & follow-up thread',
      ],
      agenda: [
        { time: '7:00 PM', title: 'Arrival & Welcome Toast', description: 'Meet the host and find your seat partner.' },
        { time: '7:45 PM', title: 'Main Experience & Guided Prompts', description: 'Deep dive into collaborative discussion.' },
        { time: '9:00 PM', title: 'Connection Wrap & Next Steps', description: 'Exchange contacts and celebrate the evening.' },
      ],
      icebreakers: [icebreaker1, icebreaker2].filter(Boolean),
      attendees: [],
      isFeatured: enableBoost,
    };

    onEventCreated(newGathering, enableBoost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-host-gathering"
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
              Organizer Launchpad
            </span>
            <h3 className="font-display font-bold text-lg text-white">
              Host a Paid Gathering
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-host-open-ai"
              type="button"
              onClick={onOpenAiGenerator}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Idea Helper</span>
            </button>
            <button
              id="btn-close-host-modal"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Revenue Split Calculator Box */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Live Revenue &amp; Platform Commission Calculator
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                Platform Take: {platformTakeRate}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-emerald-200/60 text-xs">
              <div>
                <span className="text-gray-500 block text-[11px]">Gross Ticket Volume</span>
                <span className="font-display font-bold text-base text-gray-900">{currencySymbol}{grossProjected.toLocaleString()}</span>
              </div>
              <div className="border-x border-emerald-200/60">
                <span className="text-emerald-700 block text-[11px] font-medium">Platform Earns (You)</span>
                <span className="font-display font-bold text-base text-emerald-800 font-mono">+{currencySymbol}{platformRevenueCut.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Host Net Payout</span>
                <span className="font-display font-bold text-base text-gray-900">{currencySymbol}{hostNetPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          {/* Event Basics */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">1. Gathering Concept</h4>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Gathering Title</label>
              <input
                id="input-host-title"
                type="text"
                required
                placeholder="e.g. Rooftop Agnolotti & Founder Mastermind"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tagline (One sentence hook)</label>
              <input
                id="input-host-tagline"
                type="text"
                required
                placeholder="e.g. 8 curated minds, hand-rolled pasta, and honest startup talks."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="input-host-desc"
                rows={3}
                placeholder="What will guests experience? What is the food or activity flow?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="select-host-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GatheringCategory)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
                >
                  <option value="Dining & Supper Clubs">Dining &amp; Supper Clubs</option>
                  <option value="Tech & Founders">Tech &amp; Founders</option>
                  <option value="Creative Workshops">Creative Workshops</option>
                  <option value="Outdoors & Active">Outdoors &amp; Active</option>
                  <option value="Mindfulness & Health">Mindfulness &amp; Health</option>
                  <option value="Social & Mixers">Social &amp; Mixers</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Venue Vibe</label>
                <input
                  id="input-host-vibe"
                  type="text"
                  placeholder="e.g. Intimate Amber Glow & Vinyl"
                  value={venueVibe}
                  onChange={(e) => setVenueVibe(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Pricing and Capacity */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">2. Pricing &amp; Seating Capacity</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Ticket Price ({currencySymbol} per guest)</label>
                <input
                  id="input-host-price"
                  type="number"
                  min={1}
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 font-bold"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Total Capacity (Guests)</label>
                <input
                  id="input-host-capacity"
                  type="number"
                  min={4}
                  max={60}
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Location and Logistics */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">3. Date &amp; Location</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">City (Pakistan)</label>
                <select
                  id="select-host-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 font-medium"
                >
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Multan">Multan</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Neighborhood / Area</label>
                <input
                  id="input-host-neighborhood"
                  type="text"
                  placeholder="e.g. DHA Phase 6 / Gulberg / F-7"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Date &amp; Time</label>
                <input
                  id="input-host-date"
                  type="text"
                  placeholder="e.g. Next Saturday, 7:30 PM"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Featured Boost Upsell for Platform Revenue */}
          <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="checkbox-host-boost"
                type="checkbox"
                checked={enableBoost}
                onChange={(e) => setEnableBoost(e.target.checked)}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Feature &amp; Boost Gathering at Top of Feed ({currencySymbol}{effectiveBoost.toLocaleString()})</span>
                </div>
                <p className="text-indigo-800 text-[11px] mt-0.5">
                  Guarantees 3x more views, featured badge, and inclusion in our weekly member newsletter blast.
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  100% Platform Listing Fee ({currencySymbol}{effectiveBoost.toLocaleString()}) goes directly to your bank account!
                </span>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="btn-publish-gathering"
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Publish Gathering &amp; Open Live Ticket Sales</span>
              {enableBoost && <span className="text-xs font-normal opacity-90">(+{currencySymbol}{effectiveBoost.toLocaleString()} Boost)</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
