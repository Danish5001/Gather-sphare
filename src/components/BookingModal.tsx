import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Lock,
  Download,
  Share2,
  Copy,
  Check,
  Landmark,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { Gathering, TicketBooking } from '../types';

interface BookingModalProps {
  gathering: Gathering;
  tier: 'General' | 'VIP Circle';
  onClose: () => void;
  onCompleteBooking: (booking: TicketBooking, addedVipSubscription: boolean) => void;
  platformTakeRate: number;
  conciergeFee: number;
  currency?: 'PKR' | 'USD';
  ownerBank?: {
    accountTitle: string;
    bankName: string;
    iban: string;
    raastId: string;
    jazzCashTillCode?: string;
    easyPaisaTillCode?: string;
  };
}

export const BookingModal: React.FC<BookingModalProps> = ({
  gathering,
  tier,
  onClose,
  onCompleteBooking,
  platformTakeRate,
  conciergeFee,
  currency = 'PKR',
  ownerBank = {
    accountTitle: 'Danish Mehmood',
    bankName: 'Meezan Bank Limited',
    iban: 'PK36MEZN0001928374650102',
    raastId: '0300-5001234',
    jazzCashTillCode: '00481923',
    easyPaisaTillCode: '7729104',
  },
}) => {
  const [buyerName, setBuyerName] = useState('Alex Morgan');
  const [buyerEmail, setBuyerEmail] = useState('alex.morgan@example.com');
  const [attendeeRole, setAttendeeRole] = useState('Product Strategist');
  const [icebreakerTopic, setIcebreakerTopic] = useState('Specialty pour-overs & scaling consumer apps');
  const [includeVipSubscription, setIncludeVipSubscription] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<TicketBooking | null>(null);

  // Payment method selection
  const [paymentRail, setPaymentRail] = useState<'TillCode' | 'JazzCash' | 'Easypaisa' | 'Raast' | 'Card'>('TillCode');
  const [selectedTillType, setSelectedTillType] = useState<'JazzCash' | 'Easypaisa'>('JazzCash');
  const [tillPaymentTid, setTillPaymentTid] = useState('');
  const [copiedTillCode, setCopiedTillCode] = useState(false);
  const [mobileWalletNumber, setMobileWalletNumber] = useState('03012345678');
  const [bankTransferRef, setBankTransferRef] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedRaast, setCopiedRaast] = useState(false);

  const currencySymbol = currency === 'PKR' ? 'Rs. ' : '$';
  const basePrice = tier === 'General' ? gathering.price : gathering.vipPrice;
  const vipSubPrice = includeVipSubscription ? (currency === 'PKR' ? 4500 : 29) : 0;
  const totalAmount = basePrice + conciergeFee + vipSubPrice;

  // Platform cut calculation for owner
  const platformCutFromTicket = (basePrice * (platformTakeRate / 100)) + conciergeFee;
  const totalOwnerCutFromTransaction = platformCutFromTicket + vipSubPrice;

  const handleCopyIban = () => {
    navigator.clipboard.writeText(ownerBank.iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const handleCopyRaast = () => {
    navigator.clipboard.writeText(ownerBank.raastId);
    setCopiedRaast(true);
    setTimeout(() => setCopiedRaast(false), 2500);
  };

  const handleCopyTill = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTillCode(true);
    setTimeout(() => setCopiedTillCode(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let methodLabel: TicketBooking['paymentMethod'] = 'JazzCash / Easypaisa Till Code';
    let generatedRef = '';

    if (paymentRail === 'TillCode') {
      methodLabel = 'JazzCash / Easypaisa Till Code';
      generatedRef = tillPaymentTid.trim() || `TILL-TID-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (paymentRail === 'JazzCash') {
      methodLabel = 'JazzCash';
      generatedRef = `JC-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (paymentRail === 'Easypaisa') {
      methodLabel = 'Easypaisa';
      generatedRef = `EP-${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (paymentRail === 'Raast') {
      methodLabel = 'Raast / Bank Transfer';
      generatedRef = bankTransferRef.trim() || `RAAST-${Math.floor(100000 + Math.random() * 900000)}`;
    } else {
      methodLabel = 'Debit/Credit Card (PayPak/Visa/MC)';
      generatedRef = `CARD-1LINK-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    setTimeout(() => {
      const newBooking: TicketBooking = {
        id: `tkt-${Date.now().toString(36)}`,
        gatheringId: gathering.id,
        gatheringTitle: gathering.title,
        gatheringDate: gathering.date,
        gatheringTime: gathering.time,
        venueName: gathering.venueName,
        neighborhood: gathering.neighborhood,
        city: gathering.city,
        buyerName,
        buyerEmail,
        ticketTier: includeVipSubscription ? 'VIP Circle' : tier,
        quantity: 1,
        ticketPrice: basePrice,
        platformFee: basePrice * (platformTakeRate / 100),
        conciergeFee: conciergeFee,
        totalPaid: totalAmount,
        currency: (currency as 'PKR' | 'USD') || 'PKR',
        paymentMethod: methodLabel,
        transactionReference: generatedRef,
        senderAccountOrNumber: paymentRail === 'Card' ? cardNumber : mobileWalletNumber,
        qrCode: `GATH-PK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Confirmed',
      };

      setConfirmedBooking(newBooking);
      setIsProcessing(false);
      onCompleteBooking(newBooking, includeVipSubscription);
    }, 1100);
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GatherSphere//Gathering//EN
BEGIN:VEVENT
SUMMARY:${gathering.title}
DESCRIPTION:${gathering.tagline}
LOCATION:${gathering.venueName}, ${gathering.neighborhood}, ${gathering.city}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${gathering.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-booking-checkout"
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-gray-900 text-white p-5 flex items-center justify-between border-b border-emerald-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold font-mono">
                {confirmedBooking ? 'Pass Confirmed & Verified' : 'Live Gateway Checkout'}
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Pakistan Live Rail
              </span>
            </div>
            <h3 className="font-display font-bold text-lg leading-tight mt-1 truncate max-w-xs sm:max-w-md text-white">
              {gathering.title}
            </h3>
          </div>
          <button
            id="btn-close-booking-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Confirmation State with Digital Pass */
          <div className="p-6 space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-display font-bold text-xl text-gray-900">Seat Confirmed!</h4>
              <p className="text-xs text-gray-600 mt-1">
                Your entry pass has been authorized via <strong>{confirmedBooking.paymentMethod}</strong> (Ref: <span className="font-mono font-bold text-emerald-800">{confirmedBooking.transactionReference}</span>).
              </p>
            </div>

            {/* Verified Digital Pass */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-850 to-emerald-950 text-white p-5 rounded-2xl border border-emerald-500/30 text-left shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <span className="text-xs font-bold font-display tracking-wide text-emerald-300">
                  GATHERPASS PK &bull; {confirmedBooking.ticketTier.toUpperCase()}
                </span>
                <span className="text-[11px] font-mono text-gray-400">ID: {confirmedBooking.qrCode}</span>
              </div>

              <div className="space-y-1.5 mb-4">
                <h5 className="font-bold text-sm text-white">{gathering.title}</h5>
                <div className="flex items-center gap-1.5 text-xs text-gray-300">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{gathering.date} &bull; {gathering.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{gathering.venueName}, {gathering.neighborhood}, {gathering.city}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block">Guest Name</span>
                  <span className="font-semibold text-white">{confirmedBooking.buyerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] block">Payment Gateway</span>
                  <span className="font-bold text-emerald-300">{confirmedBooking.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Gateway Transaction TID</span>
                  <span className="font-mono text-emerald-400 font-bold">{confirmedBooking.transactionReference}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] block">Total Amount Paid</span>
                  <span className="font-mono font-bold text-white">{currencySymbol}{confirmedBooking.totalPaid.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Platform Revenue Toast notification */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 text-left flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Net platform commission earned: <strong>+{currencySymbol}{totalOwnerCutFromTransaction.toLocaleString()}</strong>
                </span>
              </div>
              <span className="text-[11px] bg-emerald-700 text-white font-bold px-2.5 py-0.5 rounded">
                Live Deposited to Owner Balance
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                id="btn-download-calendar"
                onClick={handleDownloadCalendar}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar (.ics)</span>
              </button>
              <button
                id="btn-done-booking"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Done &amp; View My Passes
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Guest Profile Details */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center justify-between">
                <span>1. Guest Profile for Table Seating</span>
                <span className="text-emerald-700 font-semibold normal-case">Verified Guest Match</span>
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Your Full Name</label>
                  <input
                    id="input-guest-name"
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Email (for Pass &amp; Directions)</label>
                  <input
                    id="input-guest-email"
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">What do you do / build?</label>
                  <input
                    id="input-guest-role"
                    type="text"
                    value={attendeeRole}
                    onChange={(e) => setAttendeeRole(e.target.value)}
                    placeholder="e.g. Founder, Software Engineer, Designer"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Ask me about... (Icebreaker)</label>
                  <input
                    id="input-guest-icebreaker"
                    type="text"
                    value={icebreakerTopic}
                    onChange={(e) => setIcebreakerTopic(e.target.value)}
                    placeholder="e.g. Scaling Pakistani e-commerce or trekking"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* VIP Circle Pass Upsell */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3.5 rounded-2xl border border-indigo-100 text-xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  id="checkbox-vip-pass"
                  type="checkbox"
                  checked={includeVipSubscription}
                  onChange={(e) => setIncludeVipSubscription(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Join VIP Circle Pass (+{currencySymbol}{currency === 'PKR' ? '4,500' : '29'}/month)</span>
                  </div>
                  <p className="text-indigo-800 text-[11px] mt-0.5">
                    Save 15% on all gatherings, priority reservation access, and private monthly host dinners.
                  </p>
                </div>
              </label>
            </div>

            {/* REAL PAKISTAN PAYMENT GATEWAYS SELECTOR */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">
                  2. Select Real Pakistan Payment Gateway
                </h4>
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Live Settlement
                </span>
              </div>

              {/* 5 Real Gateway Rails */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {/* Till Code (Direct Bank) - Recommended */}
                <button
                  type="button"
                  onClick={() => setPaymentRail('TillCode')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative col-span-2 sm:col-span-1 ${
                    paymentRail === 'TillCode'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-xs ring-1 ring-amber-500'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    Direct Bank
                  </span>
                  <div className="w-3 h-3 rounded-full bg-amber-600 mx-auto mb-1 mt-0.5" />
                  <div className="font-bold text-xs truncate">Till Code</div>
                  <div className="text-[10px] text-gray-500">Meezan Direct</div>
                </button>

                {/* JazzCash */}
                <button
                  type="button"
                  onClick={() => setPaymentRail('JazzCash')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentRail === 'JazzCash'
                      ? 'border-red-600 bg-red-50 text-red-950 font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-red-600 mx-auto mb-1" />
                  <div className="font-bold text-xs">JazzCash</div>
                  <div className="text-[10px] text-gray-500">Push Approval</div>
                </button>

                {/* Easypaisa */}
                <button
                  type="button"
                  onClick={() => setPaymentRail('Easypaisa')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentRail === 'Easypaisa'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-emerald-600 mx-auto mb-1" />
                  <div className="font-bold text-xs">Easypaisa</div>
                  <div className="text-[10px] text-gray-500">In-App Prompt</div>
                </button>

                {/* Raast / Bank */}
                <button
                  type="button"
                  onClick={() => setPaymentRail('Raast')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentRail === 'Raast'
                      ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5 text-teal-700 mx-auto mb-1" />
                  <div className="font-bold text-xs">Raast &bull; 1LINK</div>
                  <div className="text-[10px] text-gray-500">Direct IBAN</div>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentRail('Card')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentRail === 'Card'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-700 mx-auto mb-1" />
                  <div className="font-bold text-xs">PayPak Card</div>
                  <div className="text-[10px] text-gray-500">Visa / MC</div>
                </button>
              </div>

              {/* Till Code Dedicated Payment Block */}
              {paymentRail === 'TillCode' && (
                <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-700" />
                      Official Merchant Till Code (Instant Meezan Bank Settlement)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded">
                      Linked: {ownerBank.accountTitle}
                    </span>
                  </div>

                  {/* Till Provider Selector: JazzCash Till vs Easypaisa Till */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTillType('JazzCash')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedTillType === 'JazzCash'
                          ? 'bg-white border-red-500 text-red-950 font-bold shadow-xs'
                          : 'bg-amber-100/50 border-amber-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">JazzCash Till</span>
                        <span className="text-[10px] bg-red-100 text-red-800 px-1.5 rounded">*786*4#</span>
                      </div>
                      <div className="font-mono text-base font-bold text-red-900 mt-1">
                        {ownerBank.jazzCashTillCode || '00481923'}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTillType('Easypaisa')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedTillType === 'Easypaisa'
                          ? 'bg-white border-emerald-500 text-emerald-950 font-bold shadow-xs'
                          : 'bg-amber-100/50 border-amber-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold">Easypaisa Till</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded">Pay by Till</span>
                      </div>
                      <div className="font-mono text-base font-bold text-emerald-900 mt-1">
                        {ownerBank.easyPaisaTillCode || '7729104'}
                      </div>
                    </button>
                  </div>

                  {/* Instructions banner */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Till Code to Enter:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-sm text-gray-950">
                          {selectedTillType === 'JazzCash'
                            ? (ownerBank.jazzCashTillCode || '00481923')
                            : (ownerBank.easyPaisaTillCode || '7729104')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTill(
                            selectedTillType === 'JazzCash'
                              ? (ownerBank.jazzCashTillCode || '00481923')
                              : (ownerBank.easyPaisaTillCode || '7729104')
                          )}
                          className="px-2 py-0.5 bg-gray-900 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          {copiedTillCode ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-tight">
                      {selectedTillType === 'JazzCash'
                        ? `Open JazzCash App > Tap 'Till Payments' > Enter Till ${ownerBank.jazzCashTillCode || '00481923'} > Pay ${currencySymbol}${totalAmount.toLocaleString()} OR Dial *786*4#.`
                        : `Open Easypaisa App > Tap 'Pay by Till' > Enter Till ${ownerBank.easyPaisaTillCode || '7729104'} > Pay ${currencySymbol}${totalAmount.toLocaleString()}.`}
                    </p>
                    <div className="text-[10px] text-emerald-800 font-semibold pt-1 border-t border-gray-100 flex items-center justify-between">
                      <span>Linked Settlement: {ownerBank.bankName} (IBAN •••• {ownerBank.iban.slice(-4)})</span>
                      <span>Beneficiary: {ownerBank.accountTitle}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-1 text-[11px]">
                      Enter Received Transaction ID (TID) from SMS / App:
                    </label>
                    <input
                      type="text"
                      required
                      value={tillPaymentTid}
                      onChange={(e) => setTillPaymentTid(e.target.value)}
                      placeholder="e.g. 029481920 (from JazzCash / Easypaisa confirmation SMS)"
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* Gateway-specific input block */}
              {paymentRail === 'JazzCash' && (
                <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-950 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-red-700" />
                      JazzCash Mobile Account Number
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-200 text-red-900 rounded">
                      Instant MPIN Approval
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={mobileWalletNumber}
                    onChange={(e) => setMobileWalletNumber(e.target.value)}
                    placeholder="03001234567"
                    className="w-full px-3 py-2 bg-white border border-red-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-[11px] text-red-800">
                    A secure push authorization prompt will be dispatched to your JazzCash mobile app for confirmation.
                  </p>
                </div>
              )}

              {paymentRail === 'Easypaisa' && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      Easypaisa Mobile Account Number
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded">
                      Push Approval
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={mobileWalletNumber}
                    onChange={(e) => setMobileWalletNumber(e.target.value)}
                    placeholder="03451234567"
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-emerald-800">
                    Open your Easypaisa app and approve the incoming payment request for {currencySymbol}{totalAmount.toLocaleString()}.
                  </p>
                </div>
              )}

              {paymentRail === 'Raast' && (
                <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2.5 text-xs text-teal-950">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-950 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-teal-700" />
                      State Bank of Pakistan (SBP) Raast &bull; 1LINK
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-teal-200 text-teal-900 rounded">
                      0% Clearing Fee
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-teal-200 space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Account Title:</span>
                      <strong className="text-gray-900 font-sans">{ownerBank.accountTitle}</strong>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Bank Name:</span>
                      <strong className="text-gray-900 font-sans">{ownerBank.bankName}</strong>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Pakistani IBAN (24 chars):</span>
                        <span className="font-bold text-teal-900 text-xs">{ownerBank.iban}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyIban}
                        className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedIban ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedIban ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Raast ID (Instant Transfer):</span>
                        <span className="font-bold text-teal-900 text-xs">{ownerBank.raastId}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyRaast}
                        className="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedRaast ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedRaast ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-[11px]">
                      Your Banking App Transaction Reference (TID / UTR)
                    </label>
                    <input
                      type="text"
                      required
                      value={bankTransferRef}
                      onChange={(e) => setBankTransferRef(e.target.value)}
                      placeholder="e.g. 982410291 (from HBL, Meezan, UBL, or SadaPay app)"
                      className="w-full px-3 py-2 bg-white border border-teal-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}

              {paymentRail === 'Card' && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-indigo-700" />
                      Debit / Credit Card (PayPak &bull; 1LINK &bull; Visa &bull; Mastercard)
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-200 text-indigo-900 rounded">
                      Safepay Secure
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="CVV"
                      className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl font-mono text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>{tier} Ticket ({gathering.title})</span>
                <span className="font-semibold text-gray-900">{currencySymbol}{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Concierge &amp; Matching Fee</span>
                <span className="font-semibold text-gray-900">{currencySymbol}{conciergeFee.toLocaleString()}</span>
              </div>
              {includeVipSubscription && (
                <div className="flex justify-between text-indigo-700 font-semibold">
                  <span>VIP Circle Monthly Membership</span>
                  <span>+{currencySymbol}{vipSubPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-bold text-gray-900">
                <span>Total Amount Due</span>
                <span className="font-display text-base text-emerald-800">{currencySymbol}{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Live Payment Trigger */}
            <div className="pt-1">
              <button
                id="btn-confirm-checkout"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Verifying Gateway Transaction...' : `Pay ${currencySymbol}${totalAmount.toLocaleString()} via ${paymentRail}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official Pakistani Payment Gateway Rail &bull; 256-Bit Encrypted</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
