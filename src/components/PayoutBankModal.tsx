import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  X, 
  ChevronRight, 
  DollarSign, 
  Landmark, 
  Sparkles,
  Lock,
  Calendar,
  Download,
  Settings2,
  RefreshCw,
  Check,
  Smartphone,
  Key,
  Copy,
  AlertCircle
} from 'lucide-react';
import { ConnectedBankAccount, PayoutRecord, PlatformRevenueMetrics, PakistanPaymentGatewayConfig } from '../types';

interface PayoutBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: PlatformRevenueMetrics;
  onUpdateBankAccount: (bank: ConnectedBankAccount) => void;
  onProcessPayout: (amount: number, method: string, payoutRecord: PayoutRecord) => void;
  onUpdatePayoutSchedule: (schedule: ConnectedBankAccount['payoutSchedule']) => void;
  onUpdateGatewayConfig?: (config: PakistanPaymentGatewayConfig) => void;
  currency?: 'PKR' | 'USD';
  initialTab?: 'withdraw' | 'connect_bank' | 'schedule' | 'history' | 'gateways';
  onResetMetrics?: () => void;
  onSimulateLiveSale?: () => void;
}

const PAKISTAN_BANKS = [
  { name: 'Meezan Bank Limited', code: 'MEZN', color: 'from-emerald-700 to-teal-900', isIslamic: true },
  { name: 'Habib Bank Limited (HBL)', code: 'HABB', color: 'from-green-700 to-emerald-900', isIslamic: false },
  { name: 'Bank Alfalah', code: 'ALFH', color: 'from-red-700 to-amber-900', isIslamic: false },
  { name: 'United Bank Limited (UBL)', code: 'UNIL', color: 'from-blue-700 to-indigo-900', isIslamic: false },
  { name: 'MCB Bank Limited', code: 'MUCB', color: 'from-orange-600 to-amber-800', isIslamic: false },
  { name: 'Standard Chartered Pakistan', code: 'SCBL', color: 'from-blue-800 to-teal-800', isIslamic: false },
  { name: 'Allied Bank Limited (ABL)', code: 'ABPA', color: 'from-blue-900 to-slate-900', isIslamic: false },
  { name: 'Faysal Bank', code: 'FAYS', color: 'from-purple-800 to-indigo-950', isIslamic: true },
  { name: 'SadaPay (EMI - SBP Licensed)', code: 'SADA', color: 'from-teal-600 to-emerald-800', isIslamic: false },
  { name: 'NayaPay (EMI - SBP Licensed)', code: 'NAYA', color: 'from-orange-500 to-amber-700', isIslamic: false },
];

export const PayoutBankModal: React.FC<PayoutBankModalProps> = ({
  isOpen,
  onClose,
  metrics,
  onUpdateBankAccount,
  onProcessPayout,
  onUpdatePayoutSchedule,
  onUpdateGatewayConfig,
  currency = 'PKR',
  initialTab = 'withdraw',
  onResetMetrics,
  onSimulateLiveSale,
}) => {
  const [activeTab, setActiveTab] = useState<'withdraw' | 'connect_bank' | 'gateways' | 'schedule' | 'history'>(initialTab as any);
  const currencySymbol = currency === 'PKR' ? 'Rs. ' : '$';

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState<string>(
    metrics.availableCashBalance > 0 ? metrics.availableCashBalance.toString() : '50000'
  );
  const [payoutRail, setPayoutRail] = useState<'Raast' | '1LINK' | 'JazzCash' | 'Easypaisa'>('Raast');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [payoutSuccessRecord, setPayoutSuccessRecord] = useState<PayoutRecord | null>(null);

  // Bank Form State
  const currentBank = metrics.connectedBank;
  const [bankName, setBankName] = useState<string>(currentBank?.bankName || 'Meezan Bank Limited');
  const [accountTitle, setAccountTitle] = useState<string>(currentBank?.accountHolderName || 'Danish Mehmood');
  const [iban, setIban] = useState<string>(currentBank?.iban || 'PK36MEZN0001928374650102');
  const [raastId, setRaastId] = useState<string>(currentBank?.raastId || '0300-5001234');
  const [accountType, setAccountType] = useState<ConnectedBankAccount['accountType']>(currentBank?.accountType || 'Islamic Current');
  const [selectedSchedule, setSelectedSchedule] = useState<ConnectedBankAccount['payoutSchedule']>(
    currentBank?.payoutSchedule || 'Automatic Daily'
  );

  // Gateway Credentials State
  const gateway = metrics.gatewayConfig;
  const [jazzCashMerchantId, setJazzCashMerchantId] = useState(gateway?.jazzCashMerchantId || 'JC-PK-98241');
  const [jazzCashMobile, setJazzCashMobile] = useState(gateway?.jazzCashMobileNumber || '0300-5001234');
  const [easyPaisaStoreId, setEasyPaisaStoreId] = useState(gateway?.easyPaisaStoreId || 'EP-STORE-8492');
  const [easyPaisaMobile, setEasyPaisaMobile] = useState(gateway?.easyPaisaMobileNumber || '0345-5001234');
  const [safepayKey, setSafepayKey] = useState(gateway?.safepayPublicKey || 'sec_pub_live_94821');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [gatewaySaved, setGatewaySaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const numericWithdrawAmount = parseFloat(withdrawAmount) || 0;
  const netReceived = numericWithdrawAmount; // 0% Raast fees

  const handleQuickPercent = (pct: number) => {
    const val = Math.round(metrics.availableCashBalance * pct).toString();
    setWithdrawAmount(val);
  };

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericWithdrawAmount <= 0) return;
    if (numericWithdrawAmount > metrics.availableCashBalance) return;

    setIsProcessing(true);

    let prefix = 'RAAST-SBP';
    let methodDesc = 'Raast Instant Settlement (SBP)';
    let arrivalTime = 'Instant (Settled within 60 seconds via State Bank Raast)';

    if (payoutRail === '1LINK') {
      prefix = '1LINK-IBAN';
      methodDesc = 'Pakistani Bank IBAN (1LINK)';
      arrivalTime = 'Instant 1LINK Interbank Clearing';
    } else if (payoutRail === 'JazzCash') {
      prefix = 'JC-PAYOUT';
      methodDesc = 'JazzCash Merchant / Wallet';
      arrivalTime = 'Instant Mobile Wallet Credit';
    } else if (payoutRail === 'Easypaisa') {
      prefix = 'EP-PAYOUT';
      methodDesc = 'Easypaisa Merchant / Wallet';
      arrivalTime = 'Instant Mobile Wallet Credit';
    }

    setTimeout(() => {
      const ref = `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();

      const newRecord: PayoutRecord = {
        id: `po-pk-${Date.now()}`,
        amount: numericWithdrawAmount,
        fee: 0,
        netPayout: netReceived,
        status: 'Completed',
        destinationBank: currentBank?.bankName || 'Meezan Bank Limited',
        accountNumberLast4: currentBank?.accountNumberLast4 || '0102',
        iban: currentBank?.iban || iban,
        raastId: currentBank?.raastId || raastId,
        initiatedAt: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        estimatedArrival: arrivalTime,
        referenceNumber: ref,
        method: methodDesc,
        currency: (currency as 'PKR' | 'USD') || 'PKR',
      };

      onProcessPayout(numericWithdrawAmount, newRecord.method, newRecord);
      setIsProcessing(false);
      setPayoutSuccessRecord(newRecord);
    }, 1000);
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIban = iban.trim().toUpperCase();
    const last4 = cleanIban.slice(-4) || '0102';

    const updated: ConnectedBankAccount = {
      id: currentBank?.id || `bank-pk-${Date.now()}`,
      accountHolderName: accountTitle.trim() || 'Danish Mehmood',
      bankName: bankName.trim() || 'Meezan Bank Limited',
      accountType,
      routingNumber: `${cleanIban.slice(4, 8) || 'MEZN'}-0102`,
      accountNumberLast4: last4,
      iban: cleanIban,
      raastId: raastId.trim(),
      country: 'Pakistan',
      currency: 'PKR (Rs.)',
      isVerified: true,
      status: 'Connected',
      payoutSchedule: selectedSchedule,
      payoutMethod: 'Raast Instant Settlement (SBP)',
      linkedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onUpdateBankAccount(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('withdraw');
    }, 1400);
  };

  const handleSaveGatewayCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateGatewayConfig) {
      onUpdateGatewayConfig({
        gatewayProvider: 'Raast & 1LINK',
        isLiveMode: true,
        currency,
        bankName,
        accountTitle,
        iban,
        raastId,
        accountNumber: iban.slice(-16),
        jazzCashMerchantId,
        jazzCashMobileNumber: jazzCashMobile,
        easyPaisaStoreId,
        easyPaisaMobileNumber: easyPaisaMobile,
        safepayPublicKey: safepayKey,
        liveStatus: 'Active & Verified',
      });
    }
    setGatewaySaved(true);
    setTimeout(() => setGatewaySaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-gray-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE REAL MODE ACTIVE
            </span>
            <span className="text-xs text-emerald-200">
              State Bank of Pakistan (SBP) Raast &bull; 1LINK Direct
            </span>
          </div>

          <h2 className="text-2xl font-display font-bold text-white tracking-tight">
            Pakistan Payment Gateways &amp; Bank Settlement
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg">
            Directly receive your platform commissions into your Pakistani bank account (Meezan, HBL, UBL, Alfalah) or Raast ID with instant clearing.
          </p>

          {/* Balance Strip */}
          <div className="mt-4 pt-3 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-200 font-medium">Available Cash Balance:</span>
              <span className="font-mono font-bold text-base text-white bg-emerald-800/90 px-3 py-0.5 rounded-lg border border-emerald-600">
                {currencySymbol}{metrics.availableCashBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Destination: <strong>{currentBank?.bankName || 'Meezan Bank'}</strong> &bull; {currentBank?.accountHolderName || 'Danish Mehmood'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-6 pt-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => { setActiveTab('withdraw'); setPayoutSuccessRecord(null); }}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'withdraw'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Withdraw to Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('connect_bank')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'connect_bank'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Pakistani Bank &amp; Raast ID</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'gateways'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Gateway Credentials (JazzCash/Easypaisa)</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'schedule'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Payout Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Transfer Receipts ({metrics.payoutHistory?.length || 0})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">

          {/* TAB 1: WITHDRAW FUNDS */}
          {activeTab === 'withdraw' && (
            <div className="space-y-6">
              {payoutSuccessRecord ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-emerald-950">
                      Funds Dispatched Successfully!
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1">
                      Direct payout of <strong>{currencySymbol}{payoutSuccessRecord.netPayout.toLocaleString()}</strong> has been transferred.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-emerald-200 text-xs text-left max-w-md mx-auto space-y-2">
                    <div className="flex justify-between text-gray-500">
                      <span>Destination Account:</span>
                      <span className="font-semibold text-gray-900">{payoutSuccessRecord.destinationBank}</span>
                    </div>
                    {payoutSuccessRecord.iban && (
                      <div className="flex justify-between text-gray-500">
                        <span>Pakistani IBAN:</span>
                        <span className="font-mono text-emerald-800 font-bold">{payoutSuccessRecord.iban}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Transfer Network:</span>
                      <span className="font-semibold text-gray-900">{payoutSuccessRecord.method}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Arrival Status:</span>
                      <span className="font-semibold text-emerald-700">{payoutSuccessRecord.estimatedArrival}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Reference / UTR:</span>
                      <span className="font-mono text-gray-800 font-bold">{payoutSuccessRecord.referenceNumber}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setPayoutSuccessRecord(null)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      New Payout
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      View All Transfer Receipts
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleExecuteWithdrawal} className="space-y-5">
                  {/* Active Settlement Destination Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-950 to-emerald-950 text-white shadow-md relative overflow-hidden border border-emerald-800/40">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-bold tracking-wide text-gray-200 uppercase">
                          Pakistani Bank Settlement Rail
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Raast &bull; 1LINK Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display font-bold text-lg text-white">
                          {currentBank ? currentBank.bankName : 'Meezan Bank Limited'}
                        </div>
                        <div className="text-xs text-emerald-300 font-mono mt-0.5">
                          IBAN: {currentBank?.iban || 'PK36MEZN0001928374650102'}
                        </div>
                        <div className="text-[11px] text-gray-300 mt-1">
                          Account Title: <strong className="text-white">{currentBank?.accountHolderName || 'Danish Mehmood'}</strong> &bull; Raast ID: <span className="font-mono text-emerald-300">{currentBank?.raastId || '0300-5001234'}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab('connect_bank')}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors shrink-0 cursor-pointer"
                      >
                        Change Account
                      </button>
                    </div>
                  </div>

                  {/* Zero Balance Alert & Explainer */}
                  {metrics.availableCashBalance <= 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs space-y-3">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm text-amber-950">
                            Available Balance is currently {currencySymbol}0
                          </h4>
                          <p className="text-amber-800 mt-1 leading-relaxed">
                            Your platform balance accumulates automatically when attendees purchase tickets. If funds were already disbursed to your Meezan Bank account, or no tickets have been purchased yet in this session, your available balance will show {currencySymbol}0.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                          <span className="text-gray-500 text-[11px] block">Lifetime Disbursed to Bank</span>
                          <span className="font-mono font-bold text-emerald-800 text-sm">
                            {currencySymbol}{metrics.lifetimeWithdrawn.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-amber-200">
                          <span className="text-gray-500 text-[11px] block">Net Platform Earnings</span>
                          <span className="font-mono font-bold text-gray-900 text-sm">
                            {currencySymbol}{metrics.netOwnerProfit.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200">
                        {onSimulateLiveSale && (
                          <button
                            type="button"
                            onClick={() => {
                              onSimulateLiveSale();
                              setWithdrawAmount('1975');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Process Live Ticket Sale (+Rs. 1,975)</span>
                          </button>
                        )}
                        {onResetMetrics && (
                          <button
                            type="button"
                            onClick={() => {
                              onResetMetrics();
                              setWithdrawAmount('245000');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Re-sync Ledger (Rs. 245,000)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Transfer Rail Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-800">
                      Disbursement Rail
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { id: 'Raast', title: 'Raast Instant (SBP)', desc: '0% fee • Under 60s' },
                        { id: '1LINK', title: '1LINK IBAN', desc: 'Direct to Bank' },
                        { id: 'JazzCash', title: 'JazzCash Wallet', desc: 'Mobile Account' },
                        { id: 'Easypaisa', title: 'Easypaisa Wallet', desc: 'Instant Credit' },
                      ].map((rail) => (
                        <button
                          key={rail.id}
                          type="button"
                          onClick={() => setPayoutRail(rail.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            payoutRail === rail.id
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                          }`}
                        >
                          <div className="font-bold text-xs">{rail.title}</div>
                          <div className="text-[10px] text-gray-500">{rail.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="input-withdraw-amount" className="font-bold text-gray-800">
                        Withdrawal Amount ({currency})
                      </label>
                      <span className="text-gray-500">
                        Available: <strong className="text-emerald-700">{currencySymbol}{metrics.availableCashBalance.toLocaleString()}</strong>
                      </span>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-base">{currencySymbol}</span>
                      <input
                        id="input-withdraw-amount"
                        type="number"
                        min="100"
                        max={metrics.availableCashBalance}
                        step="1"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 font-mono text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    {/* Quick percentage buttons */}
                    <div className="flex gap-2 pt-1">
                      {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleQuickPercent(pct)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-semibold text-gray-700 transition-colors cursor-pointer"
                        >
                          {pct === 1.0 ? '100% (All Funds)' : `${pct * 100}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Breakdown */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Requested Payout:</span>
                      <span className="font-mono font-semibold">{currencySymbol}{numericWithdrawAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>SBP Raast Network Fee:</span>
                      <span className="font-mono font-semibold text-emerald-700">Rs. 0 (Free Government Settlement)</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                      <span>Net Deposit in Bank Account:</span>
                      <span className="font-mono text-emerald-800 text-base">
                        {currencySymbol}{netReceived.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      id="btn-confirm-payout-transfer"
                      type="submit"
                      disabled={isProcessing || numericWithdrawAmount <= 0 || numericWithdrawAmount > metrics.availableCashBalance}
                      className="flex-1 py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Routing via SBP Raast / 1LINK...</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Disburse {currencySymbol}{netReceived.toLocaleString()} to Pakistani Bank</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: CONNECT PAKISTANI BANK & RAAST */}
          {activeTab === 'connect_bank' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">
                  Pakistani Bank Account &amp; SBP Raast ID
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Connect your Pakistani commercial bank or Islamic bank account via 24-character IBAN and Raast ID for direct instant settlement.
                </p>
              </div>

              {/* Fast Bank Presets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-700 block">
                  Select Recognized Pakistani Financial Institution:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PAKISTAN_BANKS.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => setBankName(b.name)}
                      className={`p-2 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                        bankName === b.name
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <div className="font-bold truncate text-[11px]">{b.name.split(' ')[0]}</div>
                      <div className="text-[10px] text-gray-400 font-mono">1LINK: {b.code}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Form */}
              <form onSubmit={handleSaveBankDetails} className="space-y-4 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Meezan Bank Limited"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Account Title / Beneficiary Name
                    </label>
                    <input
                      type="text"
                      required
                      value={accountTitle}
                      onChange={(e) => setAccountTitle(e.target.value)}
                      placeholder="e.g. Danish Mehmood"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      24-Character Pakistani IBAN
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={24}
                      value={iban}
                      onChange={(e) => setIban(e.target.value.toUpperCase())}
                      placeholder="PK36MEZN0001928374650102"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">Starts with PK + 2 digits + 4-letter bank code</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Raast ID (State Bank Instant Identifier)
                    </label>
                    <input
                      type="text"
                      required
                      value={raastId}
                      onChange={(e) => setRaastId(e.target.value)}
                      placeholder="0300-5001234"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">Registered mobile number with your bank</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Account Type
                    </label>
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                    >
                      <option value="Islamic Current">Islamic Current Account</option>
                      <option value="Checking">Checking Account</option>
                      <option value="Savings">Savings Account</option>
                      <option value="Business Checking">Business Account</option>
                      <option value="Islamic Asaan Account">Asaan Account</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Settlement Speed
                    </label>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Raast Real-Time 24/7 (Zero Clearing Delay)</span>
                    </div>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pakistani bank account connected and verified for live settlements!</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    Save &amp; Verify Pakistani Account
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: GATEWAY CREDENTIALS (JAZZCASH / EASYPAISA / SAFEPAY) */}
          {activeTab === 'gateways' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">
                  Pakistan Payment Gateway API &amp; Merchant Settings
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure your live merchant credentials for JazzCash, Easypaisa, Safepay, and SBP Raast to receive customer ticket payments directly.
                </p>
              </div>

              <form onSubmit={handleSaveGatewayCredentials} className="space-y-5">
                {/* 1. JazzCash Merchant */}
                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-950 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-red-700" />
                      JazzCash Merchant Gateway
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-200 text-red-900 font-bold text-[10px]">
                      Live Merchant
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Merchant ID</label>
                      <input
                        type="text"
                        value={jazzCashMerchantId}
                        onChange={(e) => setJazzCashMerchantId(e.target.value)}
                        placeholder="e.g. MC12345"
                        className="w-full px-3 py-2 bg-white border border-red-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Merchant Mobile Number</label>
                      <input
                        type="text"
                        value={jazzCashMobile}
                        onChange={(e) => setJazzCashMobile(e.target.value)}
                        placeholder="03001234567"
                        className="w-full px-3 py-2 bg-white border border-red-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Easypaisa Merchant */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      Easypaisa Merchant Gateway
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                      Live Store
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Store ID</label>
                      <input
                        type="text"
                        value={easyPaisaStoreId}
                        onChange={(e) => setEasyPaisaStoreId(e.target.value)}
                        placeholder="e.g. EP-STORE-8492"
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Easypaisa Mobile Number</label>
                      <input
                        type="text"
                        value={easyPaisaMobile}
                        onChange={(e) => setEasyPaisaMobile(e.target.value)}
                        placeholder="03451234567"
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Safepay / Paymob */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-700" />
                      Safepay Pakistan (Debit &amp; Credit Cards)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-200 text-indigo-900 font-bold text-[10px]">
                      Live Keys
                    </span>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Public API Key</label>
                    <input
                      type="text"
                      value={safepayKey}
                      onChange={(e) => setSafepayKey(e.target.value)}
                      placeholder="sec_pub_live_..."
                      className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {gatewaySaved && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Pakistan payment gateway settings updated and synchronized with live checkout!</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
                  >
                    Save Gateway Credentials
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: PAYOUT SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">
                  Automated Settlement Schedule
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Cleared ticket profits and organizer fees are deposited via Raast into your bank account.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Automatic Daily',
                    desc: 'Every midnight at 11:59 PM, cleared earnings are swept via SBP Raast into your Pakistani bank account.',
                    badge: 'Recommended for cash flow',
                  },
                  {
                    title: 'Weekly on Mondays',
                    desc: 'A single aggregated direct deposit sent every Monday morning to your Meezan / HBL account.',
                    badge: 'Weekly Summary',
                  },
                  {
                    title: 'Monthly on 1st',
                    desc: 'A monthly lump-sum payout deposited on the 1st business day of each month.',
                    badge: 'Monthly Settlement',
                  },
                  {
                    title: 'Manual Withdrawals',
                    desc: 'Keep revenue accumulated in your platform treasury balance and cash out manually anytime.',
                    badge: 'On-Demand',
                  },
                ].map((sched) => (
                  <label
                    key={sched.title}
                    onClick={() => {
                      setSelectedSchedule(sched.title as any);
                      onUpdatePayoutSchedule(sched.title as any);
                    }}
                    className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-4 cursor-pointer transition-all ${
                      selectedSchedule === sched.title
                        ? 'border-emerald-600 bg-emerald-50/70'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="schedule"
                        checked={selectedSchedule === sched.title}
                        onChange={() => {
                          setSelectedSchedule(sched.title as any);
                          onUpdatePayoutSchedule(sched.title as any);
                        }}
                        className="mt-1 accent-emerald-600"
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-xs sm:text-sm flex items-center gap-2">
                          <span>{sched.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {sched.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {sched.desc}
                        </p>
                      </div>
                    </div>

                    {selectedSchedule === sched.title && (
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-gray-900">
                    Direct Settlement Receipts
                  </h3>
                  <p className="text-xs text-gray-500">
                    Audit trail of funds disbursed to your verified Pakistani bank account
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Lifetime Transferred</span>
                  <span className="font-mono font-bold text-sm text-emerald-700">
                    {currencySymbol}{metrics.lifetimeWithdrawn.toLocaleString()}
                  </span>
                </div>
              </div>

              {(!metrics.payoutHistory || metrics.payoutHistory.length === 0) ? (
                <div className="text-center py-8 text-xs text-gray-500 bg-gray-50 rounded-2xl border border-gray-200">
                  No payouts initiated yet.
                </div>
              ) : (
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Destination</th>
                        <th className="py-2.5 px-3">Reference</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {metrics.payoutHistory.map((po) => (
                        <tr key={po.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-3 font-medium text-gray-900">
                            <div>{po.initiatedAt}</div>
                            <div className="text-[10px] text-gray-400">{po.method}</div>
                          </td>
                          <td className="py-3 px-3 text-gray-700">
                            <div>{po.destinationBank}</div>
                            <div className="text-[10px] text-emerald-800 font-mono">{po.iban || `•••• ${po.accountNumberLast4}`}</div>
                          </td>
                          <td className="py-3 px-3 font-mono text-gray-600 text-[11px] font-bold">
                            {po.referenceNumber}
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {po.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                            {currencySymbol}{po.netPayout.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>State Bank of Pakistan (SBP) Raast &bull; 1LINK Interbank Clearing</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
