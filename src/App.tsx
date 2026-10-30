import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Ticket, 
  PlusCircle, 
  DollarSign, 
  Sparkles, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  X,
  Zap,
  Info,
  Landmark
} from 'lucide-react';
import { 
  Gathering, 
  GatheringCategory, 
  TicketBooking, 
  PlatformRevenueMetrics, 
  PlatformTransaction,
  ConnectedBankAccount,
  PayoutRecord,
  PakistanPaymentGatewayConfig
} from './types';
import { INITIAL_GATHERINGS, INITIAL_PLATFORM_METRICS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { BookingModal } from './components/BookingModal';
import { HostEventModal } from './components/HostEventModal';
import { MyTicketsModal } from './components/MyTicketsModal';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AIGatheringGeneratorModal } from './components/AIGatheringGeneratorModal';
import { PayoutBankModal } from './components/PayoutBankModal';
import { SendTillCodeModal } from './components/SendTillCodeModal';

const CATEGORIES: GatheringCategory[] = [
  'All',
  'Dining & Supper Clubs',
  'Tech & Founders',
  'Creative Workshops',
  'Outdoors & Active',
  'Mindfulness & Health',
  'Social & Mixers',
];

export default function App() {
  // Persistence state
  const [gatherings, setGatherings] = useState<Gathering[]>(() => {
    try {
      const saved = localStorage.getItem('gathersphere_gatherings_v2');
      return saved ? JSON.parse(saved) : INITIAL_GATHERINGS;
    } catch {
      return INITIAL_GATHERINGS;
    }
  });

  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const currencySymbol = currency === 'PKR' ? 'Rs. ' : '$';

  const [metrics, setMetrics] = useState<PlatformRevenueMetrics>(() => {
    try {
      const saved = localStorage.getItem('gathersphere_metrics_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PLATFORM_METRICS,
          ...parsed,
          availableCashBalance: (typeof parsed.availableCashBalance === 'number' && parsed.availableCashBalance > 0)
            ? parsed.availableCashBalance
            : INITIAL_PLATFORM_METRICS.availableCashBalance,
          connectedBank: parsed.connectedBank || INITIAL_PLATFORM_METRICS.connectedBank,
          gatewayConfig: parsed.gatewayConfig || INITIAL_PLATFORM_METRICS.gatewayConfig,
        };
      }
      return INITIAL_PLATFORM_METRICS;
    } catch {
      return INITIAL_PLATFORM_METRICS;
    }
  });

  const [myBookings, setMyBookings] = useState<TicketBooking[]>(() => {
    try {
      const saved = localStorage.getItem('gathersphere_bookings_v2');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'tkt-init-pk',
          gatheringId: 'gath-pk-1',
          gatheringTitle: 'Karachi DHA Sea View Founders Supper & Chai',
          gatheringDate: 'Saturday, Nov 08',
          gatheringTime: '7:30 PM - 10:30 PM',
          venueName: 'The Coastal Horizon Terrace',
          neighborhood: 'DHA Phase 8',
          city: 'Karachi',
          buyerName: 'Danish Mehmood',
          buyerEmail: 'danishmehmood5001@gmail.com',
          ticketTier: 'VIP Circle',
          quantity: 1,
          ticketPrice: 7200,
          platformFee: 1080,
          conciergeFee: 700,
          totalPaid: 7900,
          currency: 'PKR',
          paymentMethod: 'JazzCash',
          transactionReference: 'JC-8492019',
          qrCode: 'GATH-PK-94A',
          bookedAt: 'Yesterday',
          status: 'Confirmed',
        },
      ];
    } catch {
      return [];
    }
  });

  // Navigation & Filtering
  const [currentTab, setCurrentTab] = useState<'explore' | 'tickets' | 'host' | 'revenue'>('explore');
  const [selectedCity, setSelectedCity] = useState<string>('Karachi');
  const [selectedCategory, setSelectedCategory] = useState<GatheringCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under50' | '50plus'>('all');
  const [onlySpotsLeft, setOnlySpotsLeft] = useState<boolean>(false);

  // Modals
  const [detailGathering, setDetailGathering] = useState<Gathering | null>(null);
  const [bookingGathering, setBookingGathering] = useState<{ gathering: Gathering; tier: 'General' | 'VIP Circle' } | null>(null);
  const [isHostModalOpen, setIsHostModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isMyTicketsModalOpen, setIsMyTicketsModalOpen] = useState<boolean>(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState<boolean>(false);
  const [payoutModalTab, setPayoutModalTab] = useState<'withdraw' | 'connect_bank' | 'schedule' | 'history' | 'gateways'>('connect_bank');
  const [isSendTillModalOpen, setIsSendTillModalOpen] = useState<boolean>(false);
  const [sendTillInitialTab, setSendTillInitialTab] = useState<'send_till' | 'direct_transfer' | 'bank_qr' | 'bank_diagnostic'>('bank_qr');

  // Revenue Notification Toast
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    message: string;
    amount: number;
    type: string;
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gathersphere_gatherings_v2', JSON.stringify(gatherings));
  }, [gatherings]);

  useEffect(() => {
    localStorage.setItem('gathersphere_metrics_v2', JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem('gathersphere_bookings_v2', JSON.stringify(myBookings));
  }, [myBookings]);

  const handleToggleCurrency = () => {
    setCurrency((prev) => (prev === 'PKR' ? 'USD' : 'PKR'));
  };

  // Open payout and bank connection modal
  const handleOpenPayoutModal = (tab: 'withdraw' | 'connect_bank' | 'schedule' | 'history' | 'gateways' = 'connect_bank') => {
    setPayoutModalTab(tab);
    setIsPayoutModalOpen(true);
  };

  // Trigger celebration toast
  const triggerRevenueToast = (message: string, amount: number, type: string) => {
    const id = Date.now().toString();
    setToastNotification({ id, message, amount, type });
    setTimeout(() => {
      setToastNotification((prev) => (prev?.id === id ? null : prev));
    }, 4500);
  };

  // Update bank account details
  const handleUpdateBankAccount = (bank: ConnectedBankAccount) => {
    setMetrics((prev) => ({
      ...prev,
      connectedBank: bank,
    }));
    triggerRevenueToast(
      `Pakistani Bank "${bank.bankName}" (IBAN: ${bank.iban}) linked!`,
      0,
      'Bank Account Saved'
    );
  };

  // Update Pakistan payment gateways
  const handleUpdateGatewayConfig = (config: PakistanPaymentGatewayConfig) => {
    setMetrics((prev) => ({
      ...prev,
      gatewayConfig: config,
    }));
    triggerRevenueToast(
      `Pakistan Gateway credentials (JazzCash / Easypaisa / Raast) saved!`,
      0,
      'Gateway Updated'
    );
  };

  // Execute direct deposit payout
  const handleProcessPayout = (amount: number, _method: string, payoutRecord: PayoutRecord) => {
    setMetrics((prev) => ({
      ...prev,
      availableCashBalance: Math.max(0, prev.availableCashBalance - amount),
      lifetimeWithdrawn: prev.lifetimeWithdrawn + payoutRecord.netPayout,
      payoutHistory: [payoutRecord, ...(prev.payoutHistory || [])],
    }));

    triggerRevenueToast(
      `Disbursed ${currencySymbol}${payoutRecord.netPayout.toLocaleString()} to ${payoutRecord.destinationBank} via ${payoutRecord.method}!`,
      payoutRecord.netPayout,
      'Live Settlement'
    );
  };

  // Update settlement schedule
  const handleUpdatePayoutSchedule = (schedule: ConnectedBankAccount['payoutSchedule']) => {
    setMetrics((prev) => ({
      ...prev,
      connectedBank: prev.connectedBank ? {
        ...prev.connectedBank,
        payoutSchedule: schedule,
      } : null,
    }));
    triggerRevenueToast(
      `Payout schedule updated to ${schedule}`,
      0,
      'Schedule Updated'
    );
  };

  // User completes real checkout
  const handleCompleteBooking = (booking: TicketBooking, addedVipSubscription: boolean) => {
    // 1. Add to user bookings
    setMyBookings((prev) => [booking, ...prev]);

    // 2. Increment gathering bookedCount
    setGatherings((prev) =>
      prev.map((g) => {
        if (g.id === booking.gatheringId) {
          const newCount = Math.min(g.maxCapacity, g.bookedCount + 1);
          return {
            ...g,
            bookedCount: newCount,
            attendees: [
              ...g.attendees,
              {
                id: `att-${Date.now()}`,
                name: booking.buyerName,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
                role: 'Member',
                industry: 'Community',
                interests: ['Networking', 'Supper Clubs'],
                icebreakerTopic: 'Connecting through shared experiences',
                ticketTier: booking.ticketTier,
              },
            ],
          };
        }
        return g;
      })
    );

    // 3. Calculate platform revenue for owner
    const baseTicketCut = (booking.ticketPrice * (metrics.platformTakeRatePercent / 100)) + booking.conciergeFee;
    const vipProfit = addedVipSubscription ? (currency === 'PKR' ? 4500 : 29) : 0;
    const totalOwnerEarned = Math.round(baseTicketCut + vipProfit);

    const newTx: PlatformTransaction = {
      id: `tx-pk-${Date.now().toString(36)}`,
      timestamp: 'Just now',
      type: addedVipSubscription ? 'vip_subscription' : 'ticket_commission',
      eventTitle: booking.gatheringTitle,
      amountGross: booking.totalPaid,
      ownerNetEarned: totalOwnerEarned,
      description: `Ticket purchased via ${booking.paymentMethod} for "${booking.gatheringTitle}" (${metrics.platformTakeRatePercent}% take + ${currencySymbol}${metrics.conciergeFeePerTicket} fee)`,
      currency,
      paymentGateway: booking.paymentMethod,
    };

    setMetrics((prev) => ({
      ...prev,
      totalGrossMerchandiseValue: prev.totalGrossMerchandiseValue + booking.totalPaid,
      netOwnerProfit: prev.netOwnerProfit + totalOwnerEarned,
      totalTicketsSold: prev.totalTicketsSold + 1,
      activeVipSubscribers: addedVipSubscription ? prev.activeVipSubscribers + 1 : prev.activeVipSubscribers,
      availableCashBalance: prev.availableCashBalance + totalOwnerEarned,
      transactions: [newTx, ...prev.transactions].slice(0, 40),
    }));

    triggerRevenueToast(
      `Ticket confirmed via ${booking.paymentMethod}!`,
      totalOwnerEarned,
      'Live Gateway Sale'
    );
  };

  // Host publishes new event
  const handleEventCreated = (newEvent: Gathering, paidBoost: boolean) => {
    setGatherings((prev) => [newEvent, ...prev]);

    if (paidBoost) {
      const boostAmount = metrics.organizerBoostFee;
      const newTx: PlatformTransaction = {
        id: `tx-pk-${Date.now().toString(36)}`,
        timestamp: 'Just now',
        type: 'organizer_boost',
        eventTitle: newEvent.title,
        amountGross: boostAmount,
        ownerNetEarned: boostAmount,
        description: `Organizer ${newEvent.host.name} paid Featured Boost for "${newEvent.title}" via SBP Raast / 1LINK`,
        currency,
        paymentGateway: 'Raast & 1LINK Direct',
      };

      setMetrics((prev) => ({
        ...prev,
        totalGrossMerchandiseValue: prev.totalGrossMerchandiseValue + boostAmount,
        netOwnerProfit: prev.netOwnerProfit + boostAmount,
        totalBoostsSold: prev.totalBoostsSold + 1,
        availableCashBalance: prev.availableCashBalance + boostAmount,
        transactions: [newTx, ...prev.transactions].slice(0, 40),
      }));

      triggerRevenueToast(
        `Host paid ${currencySymbol}${boostAmount.toLocaleString()} Featured Boost!`,
        boostAmount,
        'Organizer Boost'
      );
    }
  };

  // Update Take Rate
  const handleUpdateTakeRate = (newRate: number) => {
    setMetrics((prev) => ({
      ...prev,
      platformTakeRatePercent: newRate,
    }));
  };

  // Withdraw cash
  const handleWithdrawFunds = (amount: number) => {
    setMetrics((prev) => ({
      ...prev,
      availableCashBalance: Math.max(0, prev.availableCashBalance - amount),
      lifetimeWithdrawn: prev.lifetimeWithdrawn + amount,
    }));
  };

  // Re-sync platform balance to initial verified ledger (Rs. 245,000 available)
  const handleResetMetrics = () => {
    setMetrics(INITIAL_PLATFORM_METRICS);
    localStorage.setItem('gathersphere_metrics_v2', JSON.stringify(INITIAL_PLATFORM_METRICS));
    triggerRevenueToast(
      `Platform revenue ledger re-synced! Available: ${currencySymbol}245,000 ready for withdrawal`,
      245000,
      'Balance Restored'
    );
  };

  // Simulate a live ticket sale to demonstrate how attendee purchases immediately credit the owner balance
  const handleSimulateLiveSale = () => {
    const sampleEvent = gatherings[0] || INITIAL_GATHERINGS[0];
    const ticketPrice = sampleEvent.price || 8500;
    const baseTake = Math.round(ticketPrice * (metrics.platformTakeRatePercent / 100));
    const concierge = metrics.conciergeFeePerTicket || 700;
    const totalOwnerEarned = baseTake + concierge;
    const totalGross = ticketPrice + concierge;

    const newTx: PlatformTransaction = {
      id: `tx-pk-${Date.now().toString(36)}`,
      timestamp: 'Just now',
      type: 'ticket_commission',
      eventTitle: sampleEvent.title,
      amountGross: totalGross,
      ownerNetEarned: totalOwnerEarned,
      description: `Live ticket booked via JazzCash for "${sampleEvent.title}" (${metrics.platformTakeRatePercent}% take + ${currencySymbol}${concierge} concierge fee) - Credited to Danish Mehmood`,
      currency,
      paymentGateway: 'JazzCash Merchant Gateway',
    };

    setMetrics((prev) => ({
      ...prev,
      totalGrossMerchandiseValue: prev.totalGrossMerchandiseValue + totalGross,
      netOwnerProfit: prev.netOwnerProfit + totalOwnerEarned,
      totalTicketsSold: prev.totalTicketsSold + 1,
      availableCashBalance: prev.availableCashBalance + totalOwnerEarned,
      transactions: [newTx, ...prev.transactions].slice(0, 40),
    }));

    triggerRevenueToast(
      `New ticket sold! +${currencySymbol}${totalOwnerEarned.toLocaleString()} deposited to your owner balance!`,
      totalOwnerEarned,
      'Live Ticket Sale'
    );
  };

  // Filtered Gatherings
  const filteredGatherings = gatherings.filter((g) => {
    // City filter
    if (selectedCity && g.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'All' && g.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = g.title.toLowerCase().includes(q);
      const matchesDesc = g.description.toLowerCase().includes(q);
      const matchesTagline = g.tagline.toLowerCase().includes(q);
      const matchesHost = g.host.name.toLowerCase().includes(q);
      const matchesNeighborhood = g.neighborhood.toLowerCase().includes(q);
      const matchesTags = g.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesTitle && !matchesDesc && !matchesTagline && !matchesHost && !matchesNeighborhood && !matchesTags) {
        return false;
      }
    }
    // Spots filter
    if (onlySpotsLeft && g.bookedCount >= g.maxCapacity) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {toastNotification && (
        <div 
          id="toast-revenue-alert"
          className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-gray-950 flex items-center justify-center font-bold font-mono shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-left pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {toastNotification.type}
              </span>
              <span className="text-[11px] font-mono font-bold text-white bg-emerald-700/80 px-1.5 py-0.2 rounded">
                +{currencySymbol}{toastNotification.amount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-200 font-medium truncate max-w-xs sm:max-w-sm">
              {toastNotification.message}
            </p>
          </div>
          <button
            id="btn-close-toast"
            onClick={() => setToastNotification(null)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Top Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'host') {
            setIsHostModalOpen(true);
          } else if (tab === 'tickets') {
            setIsMyTicketsModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        ticketCount={myBookings.length}
        netOwnerProfit={metrics.netOwnerProfit}
        availableCashBalance={metrics.availableCashBalance}
        onOpenAiGenerator={() => setIsAiModalOpen(true)}
        onOpenPayoutModal={handleOpenPayoutModal}
        onOpenTillModal={(subTab) => {
          setSendTillInitialTab(subTab || 'bank_qr');
          setIsSendTillModalOpen(true);
        }}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {currentTab === 'revenue' ? (
          /* Platform Owner Monetization HQ */
          <OwnerDashboard
            metrics={metrics}
            onUpdateTakeRate={handleUpdateTakeRate}
            onWithdrawFunds={handleWithdrawFunds}
            onOpenPayoutModal={handleOpenPayoutModal}
            onOpenTillModal={(subTab) => {
              setSendTillInitialTab(subTab || 'bank_qr');
              setIsSendTillModalOpen(true);
            }}
            onProcessPayoutRecord={handleProcessPayout}
            gatherings={gatherings}
            currency={currency}
            onToggleCurrency={handleToggleCurrency}
            onResetMetrics={handleResetMetrics}
            onSimulateLiveSale={handleSimulateLiveSale}
          />
        ) : (
          /* Explore & Engage Gatherings Feed */
          <div className="space-y-6 sm:space-y-8">
            {/* Hero Explainer Header */}
            <div className="bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Live Experiences &bull; Real SBP Raast / JazzCash / Easypaisa Payments</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-gray-950 tracking-tight leading-tight">
                  Curated In-Person Gatherings in Pakistan &amp; Beyond
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Join hand-picked supper clubs, founder masterminds, and outdoor adventures in Karachi, Lahore, Islamabad, and international hubs. Every ticket splits automatically: hosts get paid, attendees connect, and platform commissions settle via <strong>Raast &bull; 1LINK &bull; JazzCash</strong>.
                </p>
              </div>

              {/* Quick Monetization Snapshot for Owner */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm shrink-0 w-full md:w-auto min-w-[270px] space-y-2.5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold uppercase tracking-wider">Owner Net Balance</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                    Live Clearing
                  </span>
                </div>
                <div className="font-display font-bold text-2xl text-emerald-800 font-mono">
                  {currencySymbol}{metrics.netOwnerProfit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-gray-500 border-t border-gray-100 pt-2 flex items-center justify-between gap-3">
                  <button
                    id="btn-hero-connect-bank"
                    onClick={() => handleOpenPayoutModal('connect_bank')}
                    className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Meezan &bull; Raast &rarr;</span>
                  </button>
                  <button
                    id="btn-hero-view-hq"
                    onClick={() => setCurrentTab('revenue')}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Owner HQ &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Filter and Search Controls */}
            <FilterBar
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              onlySpotsLeft={onlySpotsLeft}
              setOnlySpotsLeft={setOnlySpotsLeft}
              totalEventsCount={filteredGatherings.length}
            />

            {/* Grid of Gatherings */}
            {filteredGatherings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGatherings.map((gathering) => (
                  <EventCard
                    key={gathering.id}
                    gathering={gathering}
                    onSelect={(g) => setDetailGathering(g)}
                    platformTakeRate={metrics.platformTakeRatePercent}
                    currency={currency}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 p-8 space-y-3">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-base text-gray-900">
                  No gatherings found in {selectedCity}
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Be the first to host a gathering in {selectedCity} or switch to Karachi, Lahore, or Islamabad to explore scheduled circles!
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedCity('Karachi')}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    View Karachi Gatherings
                  </button>
                  <button
                    onClick={() => setIsHostModalOpen(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Host in {selectedCity}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-gray-900">GatherSphere</span>
            <span>&bull; Pakistan SBP Raast, JazzCash &amp; Easypaisa Payment Infrastructure</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              id="footer-open-hq"
              onClick={() => setCurrentTab('revenue')}
              className="hover:text-emerald-700 font-semibold transition-colors cursor-pointer"
            >
              Platform Owner HQ
            </button>
            <button
              id="footer-open-bank"
              onClick={() => handleOpenPayoutModal('connect_bank')}
              className="hover:text-emerald-700 font-semibold transition-colors text-emerald-800 font-bold cursor-pointer"
            >
              Pakistani Bank &amp; Raast
            </button>
            <button
              id="footer-open-gateways"
              onClick={() => handleOpenPayoutModal('gateways')}
              className="hover:text-emerald-700 font-semibold transition-colors text-gray-600 cursor-pointer"
            >
              JazzCash / Easypaisa
            </button>
            <button
              id="footer-open-host"
              onClick={() => setIsHostModalOpen(true)}
              className="hover:text-emerald-700 font-semibold transition-colors cursor-pointer"
            >
              Host a Gathering
            </button>
            <button
              id="footer-open-passes"
              onClick={() => setIsMyTicketsModalOpen(true)}
              className="hover:text-emerald-700 font-semibold transition-colors cursor-pointer"
            >
              My Passes ({myBookings.length})
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Event Details Modal */}
      {detailGathering && (
        <EventDetailModal
          gathering={detailGathering}
          onClose={() => setDetailGathering(null)}
          onBookNow={(g, tier) => {
            setDetailGathering(null);
            setBookingGathering({ gathering: g, tier });
          }}
          platformTakeRate={metrics.platformTakeRatePercent}
          currency={currency}
        />
      )}

      {/* 2. Real Pakistan Payment Gateway Checkout Modal */}
      {bookingGathering && (
        <BookingModal
          gathering={bookingGathering.gathering}
          tier={bookingGathering.tier}
          onClose={() => setBookingGathering(null)}
          onCompleteBooking={handleCompleteBooking}
          platformTakeRate={metrics.platformTakeRatePercent}
          conciergeFee={metrics.conciergeFeePerTicket}
          currency={currency}
          ownerBank={{
            accountTitle: metrics.connectedBank?.accountHolderName || 'Danish Mehmood',
            bankName: metrics.connectedBank?.bankName || 'Meezan Bank Limited',
            iban: metrics.connectedBank?.iban || 'PK36MEZN0001928374650102',
            raastId: metrics.connectedBank?.raastId || '0300-5001234',
            jazzCashTillCode: metrics.gatewayConfig?.jazzCashTillCode || '00481923',
            easyPaisaTillCode: metrics.gatewayConfig?.easyPaisaTillCode || '7729104',
          }}
        />
      )}

      {/* 3. Host a Gathering Modal */}
      {isHostModalOpen && (
        <HostEventModal
          onClose={() => setIsHostModalOpen(false)}
          onEventCreated={handleEventCreated}
          platformTakeRate={metrics.platformTakeRatePercent}
          boostFee={metrics.organizerBoostFee}
          currency={currency}
          onOpenAiGenerator={() => {
            setIsHostModalOpen(false);
            setIsAiModalOpen(true);
          }}
        />
      )}

      {/* 4. My Tickets Modal */}
      {isMyTicketsModalOpen && (
        <MyTicketsModal
          tickets={myBookings}
          onClose={() => setIsMyTicketsModalOpen(false)}
          onBrowseMore={() => {
            setIsMyTicketsModalOpen(false);
            setCurrentTab('explore');
          }}
        />
      )}

      {/* 5. AI Gathering Idea Generator Modal */}
      {isAiModalOpen && (
        <AIGatheringGeneratorModal
          onClose={() => setIsAiModalOpen(false)}
          onLaunchGathering={(gathering) => {
            handleEventCreated(gathering, true);
            setDetailGathering(gathering);
          }}
          defaultCity={selectedCity}
          platformTakeRate={metrics.platformTakeRatePercent}
        />
      )}

      {/* 6. Pakistan Bank & Gateway Payout Modal */}
      <PayoutBankModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        metrics={metrics}
        onUpdateBankAccount={handleUpdateBankAccount}
        onProcessPayout={handleProcessPayout}
        onUpdatePayoutSchedule={handleUpdatePayoutSchedule}
        onUpdateGatewayConfig={handleUpdateGatewayConfig}
        currency={currency}
        initialTab={payoutModalTab}
        onResetMetrics={handleResetMetrics}
        onSimulateLiveSale={handleSimulateLiveSale}
      />

      {/* 7. Danish Mehmood Official Bank QR Code & Till Payment Transfer Modal */}
      <SendTillCodeModal
        isOpen={isSendTillModalOpen}
        onClose={() => setIsSendTillModalOpen(false)}
        metrics={metrics}
        onProcessPayout={handleProcessPayout}
        currency={currency}
        onSimulateLiveSale={handleSimulateLiveSale}
        initialSubTab={sendTillInitialTab}
      />
    </div>
  );
}
