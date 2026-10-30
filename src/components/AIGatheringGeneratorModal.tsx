import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  DollarSign, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  RotateCw,
  Lightbulb,
  Zap
} from 'lucide-react';
import { Gathering, GatheringCategory } from '../types';

interface AIGatheringGeneratorModalProps {
  onClose: () => void;
  onLaunchGathering: (gathering: Gathering) => void;
  defaultCity: string;
  platformTakeRate: number;
}

export const AIGatheringGeneratorModal: React.FC<AIGatheringGeneratorModalProps> = ({
  onClose,
  onLaunchGathering,
  defaultCity,
  platformTakeRate,
}) => {
  const [city, setCity] = useState(defaultCity);
  const [category, setCategory] = useState<GatheringCategory>('Dining & Supper Clubs');
  const [vibe, setVibe] = useState('Intimate, high-trust, and deeply conversational');
  const [targetAudience, setTargetAudience] = useState('Startup founders, designers, and curious creators');
  const [priceRange, setPriceRange] = useState('$50 - $95');
  const [loading, setLoading] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState<any | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-gathering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city,
          category,
          vibe,
          targetAudience,
          priceRange,
        }),
      });

      const data = await res.json();
      if (data.gathering) {
        setGeneratedIdea(data.gathering);
      }
    } catch (err) {
      console.error('Error generating gathering:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAndLaunch = () => {
    if (!generatedIdea) return;

    const newGathering: Gathering = {
      id: `gath-ai-${Date.now().toString(36)}`,
      title: generatedIdea.title || 'Curated AI Mastermind Dinner',
      tagline: generatedIdea.tagline || 'Intimate gathering of passionate minds over dinner.',
      description: generatedIdea.monetizationTips 
        ? `${generatedIdea.tagline} Designed specifically for high engagement and meaningful connection. ${generatedIdea.monetizationTips}`
        : generatedIdea.tagline,
      category: category,
      host: {
        id: `host-${Date.now().toString(36)}`,
        name: 'Curator Collective',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        title: 'Platform Curated Experience',
        bio: 'Engineered with optimal attendee sizing and conversation prompts.',
        rating: 5.0,
        reviewCount: 12,
        verified: true,
        totalEventsHosted: 8,
        earningsToDate: 4200,
      },
      date: 'Next Thursday, 7:00 PM',
      time: '7:00 PM - 9:30 PM',
      duration: '2.5 hours',
      city,
      neighborhood: 'Downtown / Central',
      venueName: generatedIdea.venueType || 'The Private Loft',
      venueVibe: generatedIdea.vibe || vibe,
      price: Number(generatedIdea.suggestedTicketPrice) || 65,
      vipPrice: Math.round((Number(generatedIdea.suggestedTicketPrice) || 65) * 0.85),
      maxCapacity: Number(generatedIdea.maxAttendees) || 10,
      bookedCount: 2, // starts with a couple of early reservations
      image: category === 'Dining & Supper Clubs'
        ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'
        : category === 'Creative Workshops'
        ? 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80'
        : category === 'Outdoors & Active'
        ? 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80'
        : 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
      tags: ['AI-Crafted', category.split(' ')[0], 'High-Yield'],
      includedItems: [
        'Curated menu & artisan drinks',
        'Structured conversational icebreaker cards',
        'Direct connection dossier & group thread',
      ],
      agenda: (generatedIdea.agenda || []).map((line: string, i: number) => ({
        time: line.split(':')[0] || `Step ${i + 1}`,
        title: line.split(':')[1] || line,
        description: 'Guided community interaction moment.',
      })),
      icebreakers: generatedIdea.icebreakers || [
        'What project is taking up 80% of your brain right now?',
        'What is one contrarian lesson you learned this year?',
      ],
      attendees: [],
      isFeatured: true,
      isPlatformExclusive: false,
    };

    onLaunchGathering(newGathering);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-ai-idea-generator"
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                AI Gathering &amp; Monetization Architect
              </h3>
              <p className="text-xs text-purple-200">
                Design viral group experiences with high ticket margins powered by Gemini
              </p>
            </div>
          </div>
          <button
            id="btn-close-ai-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Target City</label>
              <input
                id="ai-input-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Category</label>
              <select
                id="ai-select-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as GatheringCategory)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
              >
                <option value="Dining & Supper Clubs">Dining &amp; Supper Clubs</option>
                <option value="Tech & Founders">Tech &amp; Founders</option>
                <option value="Creative Workshops">Creative Workshops</option>
                <option value="Outdoors & Active">Outdoors &amp; Active</option>
                <option value="Mindfulness & Health">Mindfulness &amp; Health</option>
                <option value="Social & Mixers">Social &amp; Mixers</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Target Audience</label>
              <input
                id="ai-input-audience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Founders, designers, solo travelers"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Price Point Target</label>
              <input
                id="ai-input-price-range"
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="e.g. $45 - $85 per guest"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
              />
            </div>
          </div>

          <div>
            <button
              id="btn-ai-generate-concept"
              type="button"
              disabled={loading}
              onClick={handleGenerate}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Architecting Gathering Concept with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate High-Yield Gathering Concept</span>
                </>
              )}
            </button>
          </div>

          {/* Result Preview Box */}
          {generatedIdea && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 space-y-4 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                    Generated Concept
                  </span>
                  <h4 className="font-display font-bold text-lg text-purple-950 mt-1">
                    {generatedIdea.title}
                  </h4>
                  <p className="text-xs text-purple-900 mt-0.5 leading-relaxed">
                    {generatedIdea.tagline}
                  </p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-purple-200 text-center text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">Ticket Price</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">${generatedIdea.suggestedTicketPrice}</span>
                </div>
                <div className="border-x border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Max Guests</span>
                  <span className="font-bold text-gray-900 font-mono text-sm">{generatedIdea.maxAttendees}</span>
                </div>
                <div>
                  <span className="text-emerald-700 block text-[10px] font-semibold">Your Cut ({platformTakeRate}%)</span>
                  <span className="font-bold text-emerald-800 font-mono text-sm">
                    +${((generatedIdea.suggestedTicketPrice * generatedIdea.maxAttendees) * (platformTakeRate / 100)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Agenda & Icebreakers */}
              {generatedIdea.icebreakers && generatedIdea.icebreakers.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-purple-950 block mb-1">
                    Icebreaker Sparks
                  </span>
                  <ul className="text-xs text-purple-900 space-y-1 pl-1">
                    {generatedIdea.icebreakers.map((ib: string, i: number) => (
                      <li key={i} className="italic">&bull; &ldquo;{ib}&rdquo;</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Monetization Tip */}
              {generatedIdea.monetizationTips && (
                <div className="bg-white/80 p-3 rounded-xl border border-purple-200/80 text-xs text-purple-950 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Growth Tip:</strong> {generatedIdea.monetizationTips}</span>
                </div>
              )}

              {/* Accept Button */}
              <button
                id="btn-launch-ai-gathering"
                onClick={handleAcceptAndLaunch}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Launch This Gathering to Explore Feed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
