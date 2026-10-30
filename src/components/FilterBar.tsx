import React from 'react';
import { Search, SlidersHorizontal, Users, Sparkles } from 'lucide-react';
import { GatheringCategory } from '../types';

interface FilterBarProps {
  categories: GatheringCategory[];
  selectedCategory: GatheringCategory;
  onSelectCategory: (category: GatheringCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceFilter: 'all' | 'under50' | '50plus';
  setPriceFilter: (filter: 'all' | 'under50' | '50plus') => void;
  onlySpotsLeft: boolean;
  setOnlySpotsLeft: (value: boolean) => void;
  totalEventsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  priceFilter,
  setPriceFilter,
  onlySpotsLeft,
  setOnlySpotsLeft,
  totalEventsCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Search and Secondary Toggles */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="input-search-gatherings"
            type="text"
            placeholder="Search by topic, dish, activity, or host (e.g. pasta, AI, hiking, ceramics)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs">
            <span className="text-gray-500 px-2 font-medium">Price:</span>
            <button
              id="filter-price-all"
              onClick={() => setPriceFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                priceFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              id="filter-price-under50"
              onClick={() => setPriceFilter('under50')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                priceFilter === 'under50' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              &lt; $50
            </button>
            <button
              id="filter-price-50plus"
              onClick={() => setPriceFilter('50plus')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                priceFilter === '50plus' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              $50+
            </button>
          </div>

          <button
            id="toggle-spots-left"
            onClick={() => setOnlySpotsLeft(!onlySpotsLeft)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              onlySpotsLeft
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Spots Available</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`cat-pill-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
