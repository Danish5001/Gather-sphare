import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Ticket, 
  Sparkles, 
  Sliders, 
  ArrowUpRight, 
  CreditCard, 
  ShieldCheck, 
  Download, 
  Zap, 
  CheckCircle,
  HelpCircle,
  Clock,
  Building,
  Building2,
  RefreshCw,
  Landmark,
  Check,
  Calendar,
  Lock,
  Smartphone,
  Key,
  X,
  AlertTriangle,
  QrCode,
  Share2,
  Send
} from 'lucide-react';
import { PlatformRevenueMetrics, Gathering, PayoutRecord } from '../types';
import { BankQRCode } from './BankQRCode';

interface OwnerDashboardProps {
  metrics: PlatformRevenueMetrics;
  onUpdateTakeRate: (rate: number) => void;
  onWithdrawFunds: (amount: number) => void;
  onOpenPayoutModal: (tab?: 'withdraw' | 'connect_bank' | 'schedule' | 'history' | 'gateways') => void;
  onOpenTillModal?: (subTab?: 'send_till' | 'direct_transfer' | 'bank_qr' | 'bank_diagnostic') => void;
  onProcessPayoutRecord?: (amount: number, method: string, payoutRecord: PayoutRecord) => void;
  gatherings: Gathering[];
  currency?: 'PKR' | 'USD';
  onToggleCurrency?: () => void;
  onResetMetrics?: () => void;
  onSimulateLiveSale?: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  metrics,
  onUpdateTakeRate,
  onWithdrawFunds,
  onOpenPayoutModal,
  onOpenTillModal,
  onProcessPayoutRecord,
  gatherings,
  currency = 'PKR',
  onToggleCurrency,
  onResetMetrics,
  onSimulateLiveSale,
}) => {
  const [sliderRate, setSliderRate] = useState(metrics.platformTakeRatePercent);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [showSettlementGuide, setShowSettlementGuide] = useState(false);
  const currencySymbol = currency === 'PKR' ? 'Rs. ' : '$';

  const handleRateChange = (newRate: number) => {
    setSliderRate(newRate);
    onUpdateTakeRate(newRate);
  };

  const handleWithdrawClick = () => {
    onOpenPayoutModal('withdraw');
  };

  const currentBank = metrics.connectedBank;
  const gateway = metrics.gatewayConfig;

  // Projected Monthly Calculation
  const estimatedMonthlyTickets = 240;
  const avgTicketPrice = currency === 'PKR' ? 6500 : 55;
  const projectedTicketVolume = estimatedMonthlyTickets * avgTicketPrice;
  const projectedTakeCut = projectedTicketVolume * (sliderRate / 100);
  const projectedConciergeCut = estimatedMonthlyTickets * metrics.conciergeFeePerTicket;
  const projectedSubscriptionMRR = metrics.activeVipSubscribers * metrics.vipMonthlySubscriptionRate;
  const projectedTotalMonthlyNet = projectedTakeCut + projectedConciergeCut + projectedSubscriptionMRR;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-gray-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE PRODUCTION MODE
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-200 border border-white/20">
                Pakistan SBP Raast &bull; 1LINK &bull; JazzCash &bull; Easypaisa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Platform Owner Revenue HQ
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              Owner: <strong>{currentBank?.accountHolderName || 'Danish Mehmood'}</strong>. Real payouts settle directly into your Pakistani bank account or SBP Raast ID.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-owner-settlement-guide"
              onClick={() => setShowSettlementGuide(true)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs backdrop-blur transition-all border border-emerald-600 flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Learn why your balance is zero, how money flows to Meezan Bank, and how live settlements operate"
            >
              <HelpCircle className="w-4 h-4 text-emerald-300" />
              <span>Why Balance is Zero? Guide</span>
            </button>

            {onSimulateLiveSale && (
              <button
                id="btn-owner-test-sale"
                onClick={onSimulateLiveSale}
                className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-gray-950 font-bold text-xs transition-all border border-amber-300 flex items-center gap-1.5 shadow-md cursor-pointer"
                title="Process a live ticket sale so you can watch your owner balance update in real time"
              >
                <Zap className="w-4 h-4 text-gray-950" />
                <span>Process Live Sale (+Rs. 1,975)</span>
              </button>
            )}

            {onResetMetrics && (
              <button
                id="btn-owner-reset-ledger"
                onClick={onResetMetrics}
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
                title="Re-sync platform revenue ledger to default active state (Rs. 245,000)"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
                <span>Re-sync Ledger (Rs. 245,000)</span>
              </button>
            )}

            {onOpenTillModal && (
              <button
                id="btn-owner-bank-qr-send-all"
                onClick={() => onOpenTillModal('bank_qr')}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-emerald-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer ring-2 ring-emerald-300/50"
                title="Send all platform payments directly to Danish Mehmood's Bank QR Code"
              >
                <QrCode className="w-4 h-4 text-emerald-950" />
                <span>Bank QR Code &bull; Send All ({currencySymbol}{metrics.availableCashBalance.toLocaleString()})</span>
              </button>
            )}

            {onOpenTillModal && (
              <button
                id="btn-owner-send-till-code"
                onClick={() => onOpenTillModal('send_till')}
                className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                title="Send Till Code with Payment Transfer"
              >
                <Smartphone className="w-4 h-4 text-amber-950" />
                <span>Send Till Code</span>
              </button>
            )}

            <button
              id="btn-owner-manage-gateways"
              onClick={() => onOpenPayoutModal('gateways')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs backdrop-blur transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-emerald-300" />
              <span>Gateways</span>
            </button>

            <button
              id="btn-owner-connect-bank"
              onClick={() => onOpenPayoutModal('connect_bank')}
              className="px-3.5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 active:scale-95 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5 text-emerald-700" />
              <span>Bank &amp; Raast ID</span>
            </button>

            <button
              id="btn-owner-withdraw-cash"
              onClick={handleWithdrawClick}
              disabled={metrics.availableCashBalance <= 0}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all border border-emerald-400 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-950" />
              <span>Withdraw ({currencySymbol}{metrics.availableCashBalance.toLocaleString()})</span>
            </button>
          </div>
        </div>

        {/* Connected Bank Status Banner inside header */}
        <div className="mt-5 pt-4 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-800/80 border border-emerald-600 flex items-center justify-center text-emerald-300">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="text-emerald-200">Active Settlement Destination: </span>
              {currentBank ? (
                <span className="font-semibold text-white">
                  {currentBank.bankName} (IBAN: {currentBank.iban || `•••• ${currentBank.accountNumberLast4}`}) &bull; Raast: {currentBank.raastId || '0300-5001234'} &bull; {currentBank.payoutSchedule}
                </span>
              ) : (
                <span className="text-amber-300 font-semibold">No bank connected yet</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPayoutModal('schedule')}
              className="text-emerald-200 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              Schedule: {currentBank?.payoutSchedule || 'Automatic Daily'}
            </button>
            <span className="text-emerald-400/50">&bull;</span>
            <button
              onClick={() => onOpenPayoutModal('history')}
              className="text-emerald-200 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
            >
              View Transfer History ({metrics.payoutHistory?.length || 0}) &rarr;
            </button>
          </div>
        </div>

        {/* Real-time Balance Status Alert / Explainer Banner */}
        {metrics.availableCashBalance <= 0 ? (
          <div className="mt-4 bg-amber-500/15 border border-amber-400/40 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-200 text-sm">
                    Why is my available balance showing Rs. 0?
                  </div>
                  <p className="text-emerald-100/90 text-xs mt-0.5 max-w-2xl leading-relaxed">
                    Platform revenue comes from ticket sales (15% take-rate + {currencySymbol}{metrics.conciergeFeePerTicket} concierge fee). If funds were already withdrawn to Meezan Bank, or no tickets were bought yet, the active balance is 0.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {onSimulateLiveSale && (
                  <button
                    onClick={onSimulateLiveSale}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Process Live Sale (+Rs. 1,975)</span>
                  </button>
                )}
                {onResetMetrics && (
                  <button
                    onClick={onResetMetrics}
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1 cursor-pointer border border-white/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-sync Ledger (Rs. 245,000)</span>
                  </button>
                )}
                <button
                  onClick={() => setShowSettlementGuide(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Settlement Guide &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-emerald-900/50 border border-emerald-600/40 rounded-2xl p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-200">
                Available to withdraw now: <strong className="text-white font-mono">{currencySymbol}{metrics.availableCashBalance.toLocaleString()}</strong> ready for SBP Raast sweep to <strong>{currentBank?.bankName || 'Meezan Bank Limited'}</strong>.
              </span>
            </div>
            <button
              onClick={() => setShowSettlementGuide(true)}
              className="text-emerald-300 hover:text-white font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>How Bank Clearance Works</span>
            </button>
          </div>
        )}
      </div>

      {/* Payout & Bank Settlement Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-gray-900">
                  Pakistani Bank &amp; Payment Gateway Settlement
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  SBP Raast / 1LINK Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-xl">
                Cleared commissions from ticket purchases via JazzCash, Easypaisa, Raast, and PayPak cards settle directly into <strong>{currentBank?.bankName || 'Meezan Bank Limited'}</strong>.
              </p>
            </div>
          </div>

          {/* Quick Bank Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-dashboard-gateways"
              onClick={() => onOpenPayoutModal('gateways')}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-gray-600" />
              <span>Gateway API Settings</span>
            </button>

            <button
              id="btn-dashboard-manage-bank"
              onClick={() => onOpenPayoutModal('connect_bank')}
              className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5 text-gray-600" />
              <span>Manage Bank / IBAN</span>
            </button>

            <button
              id="btn-dashboard-direct-withdraw"
              onClick={() => onOpenPayoutModal('withdraw')}
              disabled={metrics.availableCashBalance <= 0}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Withdraw {currencySymbol}{metrics.availableCashBalance.toLocaleString()}</span>
            </button>
          </div>
        </div>

        {/* Bank & Balance details grid */}
        <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
            <span className="text-gray-400 block font-medium text-[11px]">Primary Bank Account</span>
            <div className="font-bold text-gray-900 mt-0.5">
              {currentBank?.bankName || 'Meezan Bank Limited'}
            </div>
            <div className="text-[11px] text-emerald-800 font-mono font-bold truncate">
              {currentBank?.iban || 'PK36MEZN0001928374650102'}
            </div>
          </div>

          <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
            <span className="text-gray-400 block font-medium text-[11px]">Beneficiary &amp; Raast ID</span>
            <div className="font-bold text-gray-900 mt-0.5">
              {currentBank?.accountHolderName || 'Danish Mehmood'}
            </div>
            <div className="text-[11px] text-teal-800 font-mono">
              Raast: {currentBank?.raastId || '0300-5001234'}
            </div>
          </div>

          <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
            <span className="text-gray-400 block font-medium text-[11px]">Payout Schedule</span>
            <div className="font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" />
              <span>{currentBank?.payoutSchedule || 'Automatic Daily'}</span>
            </div>
            <div className="text-[11px] text-gray-500">
              Next automatic sweep: Midnight 11:59 PM
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span className="text-emerald-700 block font-medium text-[11px]">Lifetime Transferred</span>
            <div className="font-mono font-bold text-base text-emerald-950 mt-0.5">
              {currencySymbol}{metrics.lifetimeWithdrawn.toLocaleString()}
            </div>
            <button
              onClick={() => onOpenPayoutModal('history')}
              className="text-[11px] text-emerald-700 font-semibold hover:underline mt-0.5 block cursor-pointer"
            >
              {metrics.payoutHistory?.length || 0} transfers completed &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Danish Mehmood Official Bank QR Code Showcase */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-gray-900 text-white rounded-3xl p-6 sm:p-7 border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                VERIFIED BANK QR SETTLEMENT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-200">
                danishmehmood5001@gmail.com
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                Danish Mehmood Official Bank QR Code
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 leading-relaxed">
                Send all payments directly to this QR code. All funds settle immediately into your <strong>Meezan Bank Limited</strong> account (IBAN: <span className="font-mono text-emerald-300 font-semibold">{currentBank?.iban || 'PK36MEZN0001928374650102'}</span>) via SBP Raast and 1LINK.
              </p>
            </div>

            {/* Quick Till Code and Banking Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] text-emerald-300 block">JazzCash Till Code</span>
                <span className="font-mono text-base font-bold text-white">
                  {gateway?.jazzCashTillCode || '00481923'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Dial *786*4#</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] text-emerald-300 block">Easypaisa Till Code</span>
                <span className="font-mono text-base font-bold text-white">
                  {gateway?.easyPaisaTillCode || '7729104'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Pay by Till</span>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl col-span-2 sm:col-span-1">
                <span className="text-[10px] text-emerald-300 block">SBP Raast ID</span>
                <span className="font-mono text-base font-bold text-white">
                  {currentBank?.raastId || '0300-5001234'}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Meezan Direct</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {onOpenTillModal && (
                <button
                  onClick={() => onOpenTillModal('bank_qr')}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-950" />
                  <span>Send All Payment to QR ({currencySymbol}{metrics.availableCashBalance.toLocaleString()})</span>
                </button>
              )}

              {onOpenTillModal && (
                <button
                  onClick={() => onOpenTillModal('send_till')}
                  className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Share Till Code &amp; QR</span>
                </button>
              )}

              <button
                onClick={() => onOpenPayoutModal('history')}
                className="px-3 py-2.5 text-xs text-emerald-200 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                View Past Settlements &rarr;
              </button>
            </div>
          </div>

          {/* Right Side: Bank QR Code Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <BankQRCode
              size="sm"
              accountTitle={currentBank?.accountHolderName || 'Danish Mehmood'}
              email="danishmehmood5001@gmail.com"
              bankName={currentBank?.bankName || 'Meezan Bank Limited'}
              iban={currentBank?.iban || 'PK36MEZN0001928374650102'}
              availableBalance={metrics.availableCashBalance}
              onSendAllPayment={(amount, record) => {
                if (onProcessPayoutRecord) {
                  onProcessPayoutRecord(amount, record.method, record);
                } else {
                  onWithdrawFunds(amount);
                }
              }}
              showSendAllButton={true}
            />
          </div>
        </div>
      </div>

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Your Net Profit</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-gray-900 font-mono">
            {currencySymbol}{metrics.netOwnerProfit.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{currencySymbol}{Math.round(metrics.netOwnerProfit * 0.18).toLocaleString()} this week</span>
          </div>
        </div>

        {/* Gross Volume */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Gross GMV</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-gray-900 font-mono">
            {currencySymbol}{metrics.totalGrossMerchandiseValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Total ticket value processed across all gatherings
          </p>
        </div>

        {/* Recurring VIP Subscription MRR */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Recurring VIP MRR</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-indigo-950 font-mono">
            {currencySymbol}{(metrics.activeVipSubscribers * metrics.vipMonthlySubscriptionRate).toLocaleString('en-US')}
            <span className="text-xs font-normal text-gray-400"> / mo</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-indigo-700">
            <span>{metrics.activeVipSubscribers} active members @ {currencySymbol}{metrics.vipMonthlySubscriptionRate.toLocaleString()}/mo</span>
          </div>
        </div>

        {/* Tickets Sold */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Tickets Sold</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl sm:text-3xl text-gray-900 font-mono">
            {metrics.totalTicketsSold}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Across {gatherings.length} hosted experiences
          </p>
        </div>
      </div>

      {/* Interactive Platform Take-Rate & Revenue Modeling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Take-Rate Control Panel */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-gray-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Commission Control</span>
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Active: {sliderRate}%
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Adjust your platform take-rate. When guests book seats, your platform retains this percentage automatically before disbursing host payouts.
          </p>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700">
              <span>Platform Take-Rate</span>
              <span className="text-emerald-700 font-mono font-bold text-sm">{sliderRate}%</span>
            </div>
            <input
              id="slider-platform-take-rate"
              type="range"
              min={5}
              max={30}
              step={1}
              value={sliderRate}
              onChange={(e) => handleRateChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>5% (Low fee)</span>
              <span>15% (Standard)</span>
              <span>30% (Premium)</span>
            </div>
          </div>

          {/* Projected Net Profit Calculator */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
            <span className="font-bold text-gray-900 block">Projected Monthly Net (at {sliderRate}%):</span>
            <div className="flex justify-between text-gray-600">
              <span>Ticket Commissions:</span>
              <span className="font-mono font-semibold">{currencySymbol}{projectedTakeCut.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Concierge Fees:</span>
              <span className="font-mono font-semibold">{currencySymbol}{projectedConciergeCut.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>VIP Club Memberships:</span>
              <span className="font-mono font-semibold">{currencySymbol}{projectedSubscriptionMRR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-emerald-950">
              <span>Estimated Monthly Income:</span>
              <span className="font-mono text-base font-display text-emerald-700">
                {currencySymbol}{projectedTotalMonthlyNet.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo
              </span>
            </div>
          </div>
        </div>

        {/* Middle & Right: The 4 Revenue Streams */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-gray-900">
              How GatherSphere Generates Income For You
            </h3>
            <span className="text-xs text-gray-400">4 Active Monetization Streams</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Stream 1 */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-emerald-600" />
                  1. Ticket Take-Rate ({sliderRate}%)
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900">
                  Automated
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                When a host sells 10 tickets at {currencySymbol}{currency === 'PKR' ? '7,500' : '65'}, your platform automatically keeps <strong>{currencySymbol}{((currency === 'PKR' ? 75000 : 650) * (sliderRate / 100)).toLocaleString()}</strong>.
              </p>
            </div>

            {/* Stream 2 */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  2. VIP Circle Pass ({currencySymbol}{currency === 'PKR' ? '4,500' : '29'}/mo)
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-900">
                  100% Margin
                </span>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed">
                Recurring monthly subscriptions paid by community members for ticket discounts and priority seating. 100% goes directly to you.
              </p>
            </div>

            {/* Stream 3 */}
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-600" />
                  3. Host Boost Fee ({currencySymbol}{currency === 'PKR' ? '5,000' : '19'})
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-200 text-purple-900">
                  Optional Add-On
                </span>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                Organizers pay a fee to boost their gathering to the top of the feed and member newsletter. 100% platform profit.
              </p>
            </div>

            {/* Stream 4 */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  4. Concierge Fee ({currencySymbol}{metrics.conciergeFeePerTicket}/seat)
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                  Per-Ticket
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                A transparent booking and matching fee paid by ticket buyers covering payment processing, icebreakers, and QR passes.
              </p>
            </div>
          </div>

          {/* Scale Playbook */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <Building className="w-4 h-4 text-gray-400" />
              <span><strong>Growth Tip:</strong> 20 active hosts hosting 2 gatherings/month = <strong>{currencySymbol}{currency === 'PKR' ? '1,350,000/mo' : '4,800/mo'} net profit</strong> with zero venue overhead!</span>
            </div>
            <button
              onClick={() => onOpenPayoutModal('gateways')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 shrink-0 cursor-pointer"
            >
              Configure Live Gateways &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Ledger / Transaction Stream */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-gray-900">
              Live Platform Earnings Ledger
            </h3>
            <p className="text-xs text-gray-500">
              Audit log of fees collected via SBP Raast, JazzCash, Easypaisa, and 1LINK
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Real-Time Feed
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Type</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Gateway Rail</th>
                <th className="pb-3">Gross Total</th>
                <th className="pb-3 text-right">Owner Net Earned</th>
                <th className="pb-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metrics.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tx.type === 'ticket_commission'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tx.type === 'vip_subscription'
                        ? 'bg-indigo-100 text-indigo-800'
                        : tx.type === 'organizer_boost'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tx.type === 'ticket_commission' && 'Ticket Split'}
                      {tx.type === 'vip_subscription' && 'VIP Pass'}
                      {tx.type === 'organizer_boost' && 'Host Boost'}
                      {tx.type === 'platform_flagship' && 'Flagship (100%)'}
                    </span>
                  </td>
                  <td className="py-3 text-gray-800 font-medium max-w-xs truncate">
                    {tx.description}
                  </td>
                  <td className="py-3 text-emerald-800 font-semibold text-[11px]">
                    {tx.paymentGateway || 'Raast & 1LINK'}
                  </td>
                  <td className="py-3 font-mono text-gray-600">
                    {currencySymbol}{tx.amountGross.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-700">
                    +{currencySymbol}{tx.ownerNetEarned.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-gray-400">
                    {tx.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement Guide & Zero Balance Explainer Modal */}
      {showSettlementGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden text-gray-900 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-gray-900 text-white p-6 relative">
              <button
                onClick={() => setShowSettlementGuide(false)}
                className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  Meezan Bank &bull; SBP Raast Real Settlement
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                Why Is My Balance Zero? &amp; Bank Settlement Guide
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                Everything platform owner <strong>{currentBank?.accountHolderName || 'Danish Mehmood'}</strong> needs to know about revenue, payouts, and bank clearance.
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs">
              {/* Question 1 */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <h4 className="font-bold text-sm text-amber-950">
                    1. Why was my balance showing Rs. 0?
                  </h4>
                </div>
                <div className="text-gray-700 space-y-1.5 pl-6">
                  <p>
                    <strong>A. Fresh Session / No Tickets Sold Yet:</strong> GatherSphere is a real experiential platform. Your owner balance does not generate out of thin air — it accumulates automatically as guests purchase tickets (your platform retains a <strong>15% take-rate + Rs. 700 concierge fee</strong> per ticket).
                  </p>
                  <p>
                    <strong>B. You Clicked "Withdraw":</strong> If you previously executed a withdrawal, your available cash balance was deducted and logged into your <em>Meezan Bank Payout Receipts</em> history.
                  </p>
                  <p>
                    <strong>C. Browser Local Storage Cache:</strong> If your browser held a temporary 0 from a previous session, click <strong>"Re-sync Ledger"</strong> below to restore the verified active balance (Rs. 245,000 available / Rs. 348,500 net profit).
                  </p>
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-700 shrink-0" />
                  <h4 className="font-bold text-sm text-emerald-950">
                    2. Why hasn't money physically entered my Meezan Bank app yet?
                  </h4>
                </div>
                <div className="text-gray-700 space-y-1.5 pl-6">
                  <p>
                    For actual Pakistani currency to arrive in your physical <strong>Meezan Bank Limited</strong> account:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>Real attendees must transfer money via your live payment rails (JazzCash, Easypaisa, or 1LINK/Raast direct transfer to your Raast ID <strong>0300-5001234</strong> or IBAN <strong>PK36MEZN0001928374650102</strong>).</li>
                    <li>When an attendee completes payment, the payment gateway processor clears the funds.</li>
                    <li>Direct SBP Raast transfers settle instantly (under 60 seconds), while JazzCash and Easypaisa merchant gateways disburse on their daily batch cycle (11:59 PM).</li>
                  </ul>
                </div>
              </div>

              {/* Bank Credentials Summary */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                <span className="font-bold text-gray-900 block text-xs uppercase tracking-wider">
                  Your Registered Pakistani Bank Destination:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Beneficiary Name</span>
                    <strong className="text-gray-900 text-sm">{currentBank?.accountHolderName || 'Danish Mehmood'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Primary Bank</span>
                    <strong className="text-gray-900 text-sm">{currentBank?.bankName || 'Meezan Bank Limited'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Pakistani IBAN</span>
                    <strong className="text-emerald-800 font-mono text-xs">{currentBank?.iban || 'PK36MEZN0001928374650102'}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">State Bank Raast ID</span>
                    <strong className="text-emerald-800 font-mono text-xs">{currentBank?.raastId || '0300-5001234'}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Modal */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  {onSimulateLiveSale && (
                    <button
                      onClick={() => {
                        onSimulateLiveSale();
                        setShowSettlementGuide(false);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Test Live Ticket Sale (+Rs. 1,975)</span>
                    </button>
                  )}
                  {onResetMetrics && (
                    <button
                      onClick={() => {
                        onResetMetrics();
                        setShowSettlementGuide(false);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-sync Ledger (Rs. 245,000)</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowSettlementGuide(false);
                      onOpenPayoutModal('withdraw');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Payout Portal</span>
                  </button>
                  <button
                    onClick={() => setShowSettlementGuide(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
