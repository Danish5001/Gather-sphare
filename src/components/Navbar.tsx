import React from 'react';
import { 
  Compass, 
  Ticket, 
  PlusCircle, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  MapPin,
  ShieldCheck,
  Landmark,
  CreditCard,
  QrCode
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'explore' | 'tickets' | 'host' | 'revenue';
  setCurrentTab: (tab: 'explore' | 'tickets' | 'host' | 'revenue') => void;
  ticketCount: number;
  netOwnerProfit: number;
  availableCashBalance?: number;
  onOpenAiGenerator: () => void;
  onOpenPayoutModal: (tab?: 'withdraw' | 'connect_bank' | 'schedule' | 'history' | 'gateways') => void;
  onOpenTillModal?: (subTab?: 'send_till' | 'direct_transfer' | 'bank_qr' | 'bank_diagnostic') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  currency?: 'PKR' | 'USD';
  onToggleCurrency?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  ticketCount,
  netOwnerProfit,
  availableCashBalance = 0,
  onOpenAiGenerator,
  onOpenPayoutModal,
  onOpenTillModal,
  selectedCity,
  setSelectedCity,
  currency = 'PKR',
  onToggleCurrency,
}) => {
  const currencySymbol = currency === 'PKR' ? 'Rs. ' : '$';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      {/* Top Banner with Real Pakistan Gateway & Live Status */}
      <div className="bg-emerald-950 text-white text-xs py-1.5 px-4 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE REAL MODE
            </span>
            <span className="text-emerald-100 hidden sm:inline">
              Pakistan Payment Rail: <strong>Raast (SBP) &bull; JazzCash &bull; Easypaisa &bull; 1LINK</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency Switcher */}
            {onToggleCurrency && (
              <button
                id="btn-nav-currency-toggle"
                onClick={onToggleCurrency}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600 transition-colors cursor-pointer"
                title="Toggle between Pakistani Rupees (PKR) and USD"
              >
                <span>Currency:</span>
                <span className="text-white underline">{currency}</span>
              </button>
            )}

            <button
              id="btn-nav-connect-bank-banner"
              onClick={() => onOpenPayoutModal('connect_bank')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-500/50 transition-colors cursor-pointer"
              title="Connect Pakistani Bank IBAN (Meezan, HBL, etc.) or Raast ID"
            >
              <Landmark className="w-3 h-3 text-emerald-300" />
              <span>Pakistani Bank &amp; Raast</span>
            </button>

            {onOpenTillModal && (
              <button
                id="btn-nav-bank-qr-till"
                onClick={() => onOpenTillModal('bank_qr')}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-300 transition-colors cursor-pointer shadow-xs"
                title="View Danish Mehmood Bank QR Code and Send All Payments"
              >
                <QrCode className="w-3 h-3 text-amber-950" />
                <span>Bank QR &amp; Till</span>
              </button>
            )}

            <button
              id="btn-nav-balance-cashout"
              onClick={() => onOpenPayoutModal('withdraw')}
              className="flex items-center gap-1 font-mono text-emerald-200 text-xs hover:text-white transition-colors cursor-pointer"
              title="Click to withdraw funds to your Pakistani bank account"
            >
              <span className="text-emerald-300 hidden md:inline">Owner Balance:</span>
              <span className="font-bold text-white bg-emerald-800/90 hover:bg-emerald-700 px-2 py-0.5 rounded border border-emerald-700 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-emerald-400" />
                {currencySymbol}{availableCashBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & City Picker */}
          <div className="flex items-center gap-4">
            <button
              id="brand-logo-btn"
              onClick={() => setCurrentTab('explore')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg tracking-tight text-gray-900">GatherSphere</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Live Pakistan
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 -mt-0.5">Experiences &amp; Raast / JazzCash Gateways</p>
              </div>
            </button>

            {/* City Dropdown with Pakistani & Global Hubs */}
            <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-gray-200 text-xs text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <select
                id="select-city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent font-medium text-gray-800 cursor-pointer focus:outline-none hover:text-emerald-700"
              >
                <optgroup label="Pakistan">
                  <option value="Karachi">Karachi, Sindh</option>
                  <option value="Lahore">Lahore, Punjab</option>
                  <option value="Islamabad">Islamabad, Federal</option>
                  <option value="Rawalpindi">Rawalpindi, Punjab</option>
                  <option value="Faisalabad">Faisalabad, Punjab</option>
                  <option value="Peshawar">Peshawar, KPK</option>
                  <option value="Multan">Multan, Punjab</option>
                </optgroup>
                <optgroup label="International">
                  <option value="Dubai">Dubai, UAE</option>
                  <option value="London">London, UK</option>
                  <option value="New York">New York, NY</option>
                  <option value="San Francisco">San Francisco, CA</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-tab-explore"
              onClick={() => setCurrentTab('explore')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'explore'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Explore Gatherings</span>
            </button>

            <button
              id="nav-tab-tickets"
              onClick={() => setCurrentTab('tickets')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'tickets'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Ticket className="w-4 h-4 text-teal-600" />
              <span>My Passes</span>
              {ticketCount > 0 && (
                <span className="w-5 h-5 text-[11px] font-bold bg-emerald-600 text-white rounded-full flex items-center justify-center">
                  {ticketCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-host"
              onClick={() => setCurrentTab('host')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'host'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Host a Gathering</span>
              <span className="sm:hidden">Host</span>
            </button>

            <button
              id="nav-tab-revenue"
              onClick={() => setCurrentTab('revenue')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                currentTab === 'revenue'
                  ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Owner HQ</span>
              <span className="hidden lg:inline text-xs font-normal opacity-90">
                ({currencySymbol}{netOwnerProfit.toLocaleString('en-US', { maximumFractionDigits: 0 })})
              </span>
            </button>

            <button
              id="btn-nav-bank-payouts"
              onClick={() => onOpenPayoutModal('connect_bank')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-sm cursor-pointer"
              title="Connect your bank account to receive automated direct deposits"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Bank &amp; Payouts</span>
              <span className="sm:hidden">Bank</span>
            </button>

            <button
              id="btn-ai-generator-modal"
              onClick={onOpenAiGenerator}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm transition-all ml-1"
              title="Generate new viral event concepts with Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
              <span>AI Idea Spark</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
