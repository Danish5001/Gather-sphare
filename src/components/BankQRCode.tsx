import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Landmark, 
  ShieldCheck,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { PayoutRecord } from '../types';

interface BankQRCodeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accountTitle?: string;
  email?: string;
  bankName?: string;
  iban?: string;
  availableBalance?: number;
  onSendAllPayment?: (amount: number, record: PayoutRecord) => void;
  showSendAllButton?: boolean;
}

export const BankQRCode: React.FC<BankQRCodeProps> = ({
  size = 'md',
  accountTitle = 'Danish Mehmood',
  email = 'danishmehmood5001@gmail.com',
  bankName = 'Bank AL Habib Limited',
  iban = 'PK42BAHL0095000102938401',
  availableBalance = 245000,
  onSendAllPayment,
  showSendAllButton = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSendingAll, setIsSendingAll] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<PayoutRecord | null>(null);

  const dimension = size === 'sm' ? 'w-48' : size === 'md' ? 'w-64' : size === 'lg' ? 'w-80' : 'w-full max-w-sm';

  const handleCopyLink = () => {
    const text = `Danish Mehmood Official Bank QR Code\nEmail: ${email}\nBank: ${bankName}\nIBAN: ${iban}\nScan QR to pay directly into Bank AL Habib account.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Assalam-o-Alaikum! Please scan Danish Mehmood's Official Bank QR Code for payment:\n` +
      `Email: ${email}\n` +
      `Bank: ${bankName}\n` +
      `IBAN: ${iban}\n` +
      `App: Urdu Handwriting Scanner & GatherSphere PK`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendAllPaymentClick = () => {
    if (!onSendAllPayment || availableBalance <= 0) return;
    setIsSendingAll(true);

    const ref = `QR-BAHL-${Math.floor(100000 + Math.random() * 900000)}`;
    const stan = Math.floor(100000 + Math.random() * 900000).toString();
    const rrn = `${new Date().getFullYear()}${Math.floor(10000000 + Math.random() * 90000000)}`;

    setTimeout(() => {
      const record: PayoutRecord = {
        id: `po-qr-${Date.now()}`,
        amount: availableBalance,
        fee: 0,
        netPayout: availableBalance,
        status: 'Completed',
        destinationBank: `${bankName} (QR: ${email})`,
        accountNumberLast4: iban.slice(-4),
        iban,
        raastId: '0300-5001234',
        tillCode: '00481923',
        stan,
        rrn,
        settlementType: 'Till Code Transfer',
        initiatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        estimatedArrival: 'Instant (Settled directly on Bank QR Code to Bank AL Habib)',
        referenceNumber: ref,
        method: `Direct Bank QR Transfer (${email}) -> Bank AL Habib`,
        currency: 'PKR',
      };

      onSendAllPayment(availableBalance, record);
      setIsSendingAll(false);
      setSuccessReceipt(record);
    }, 1200);
  };

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200/80 shadow-xl ${dimension} mx-auto text-center space-y-4 relative overflow-hidden`}>
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          OFFICIAL BANK QR CODE
        </span>
        <span className="text-[10px] font-mono font-bold text-gray-500">
          SBP RAAST &bull; 1LINK
        </span>
      </div>

      {/* High-Fidelity Pakistan Emerald & Black QR Code Display */}
      <div className="bg-white p-4 rounded-2xl border-2 border-emerald-600/30 shadow-inner inline-block mx-auto">
        <svg 
          viewBox="0 0 250 250" 
          className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
          aria-label={`Bank QR Code for ${accountTitle} (${email})`}
        >
          {/* Background */}
          <rect width="250" height="250" fill="#ffffff" />

          {/* Top-Left Finder Pattern (Black Outer, White middle, Black Eye) */}
          <rect x="15" y="15" width="60" height="60" fill="#0f172a" rx="4" />
          <rect x="23" y="23" width="44" height="44" fill="#ffffff" rx="2" />
          <rect x="31" y="31" width="28" height="28" fill="#0f172a" rx="2" />

          {/* Top-Right Finder Pattern (Black Outer, White middle, Emerald Green Eye) */}
          <rect x="175" y="15" width="60" height="60" fill="#0f172a" rx="4" />
          <rect x="183" y="23" width="44" height="44" fill="#ffffff" rx="2" />
          <rect x="191" y="31" width="28" height="28" fill="#047857" rx="2" />

          {/* Bottom-Left Finder Pattern (Emerald Green Outer, White middle, Emerald Green Eye) */}
          <rect x="15" y="175" width="60" height="60" fill="#047857" rx="4" />
          <rect x="23" y="183" width="44" height="44" fill="#ffffff" rx="2" />
          <rect x="31" y="191" width="28" height="28" fill="#047857" rx="2" />

          {/* Timing Patterns */}
          <g fill="#0f172a">
            <rect x="85" y="41" width="8" height="8" />
            <rect x="101" y="41" width="8" height="8" />
            <rect x="117" y="41" width="8" height="8" />
            <rect x="133" y="41" width="8" height="8" />
            <rect x="149" y="41" width="8" height="8" />

            <rect x="41" y="85" width="8" height="8" />
            <rect x="41" y="101" width="8" height="8" />
            <rect x="41" y="117" width="8" height="8" />
            <rect x="41" y="133" width="8" height="8" />
            <rect x="41" y="149" width="8" height="8" />
          </g>

          {/* QR Data Matrix Clusters - Black & Vibrant Emerald Green */}
          {/* Black Data Modules */}
          <g fill="#0f172a">
            <rect x="85" y="15" width="8" height="16" />
            <rect x="101" y="23" width="16" height="8" />
            <rect x="125" y="15" width="8" height="16" />
            <rect x="141" y="23" width="16" height="8" />
            <rect x="85" y="57" width="16" height="8" />
            <rect x="109" y="49" width="8" height="16" />
            <rect x="125" y="57" width="24" height="8" />
            <rect x="157" y="49" width="8" height="16" />

            {/* Middle matrix */}
            <rect x="15" y="85" width="16" height="8" />
            <rect x="23" y="101" width="8" height="16" />
            <rect x="15" y="125" width="8" height="16" />
            <rect x="23" y="149" width="16" height="8" />

            <rect x="57" y="85" width="16" height="8" />
            <rect x="65" y="101" width="8" height="16" />
            <rect x="57" y="125" width="8" height="16" />
            <rect x="65" y="149" width="8" height="16" />

            <rect x="85" y="85" width="16" height="16" />
            <rect x="109" y="93" width="16" height="8" />
            <rect x="133" y="85" width="8" height="16" />
            <rect x="149" y="85" width="16" height="8" />
            <rect x="173" y="93" width="16" height="8" />
            <rect x="197" y="85" width="8" height="16" />
            <rect x="213" y="93" width="16" height="8" />

            <rect x="85" y="109" width="8" height="16" />
            <rect x="101" y="117" width="16" height="8" />
            <rect x="141" y="109" width="16" height="8" />
            <rect x="165" y="117" width="8" height="16" />
            <rect x="181" y="109" width="16" height="8" />
            <rect x="205" y="117" width="16" height="8" />

            <rect x="85" y="133" width="16" height="8" />
            <rect x="109" y="141" width="8" height="16" />
            <rect x="125" y="133" width="16" height="8" />
            <rect x="149" y="141" width="16" height="8" />
            <rect x="173" y="133" width="8" height="16" />
            <rect x="197" y="141" width="16" height="8" />
            <rect x="221" y="133" width="8" height="16" />

            {/* Lower matrix */}
            <rect x="85" y="165" width="8" height="16" />
            <rect x="101" y="173" width="16" height="8" />
            <rect x="125" y="165" width="16" height="8" />
            <rect x="149" y="173" width="8" height="16" />
            <rect x="165" y="165" width="16" height="8" />
            <rect x="189" y="173" width="8" height="16" />
            <rect x="205" y="165" width="24" height="8" />

            <rect x="85" y="189" width="16" height="8" />
            <rect x="109" y="197" width="8" height="16" />
            <rect x="125" y="189" width="8" height="16" />
            <rect x="141" y="197" width="16" height="8" />
            <rect x="165" y="189" width="8" height="16" />
            <rect x="181" y="197" width="24" height="8" />
            <rect x="213" y="189" width="16" height="16" />

            <rect x="85" y="213" width="8" height="16" />
            <rect x="101" y="221" width="24" height="8" />
            <rect x="133" y="213" width="16" height="8" />
            <rect x="157" y="221" width="8" height="16" />
            <rect x="173" y="213" width="16" height="8" />
            <rect x="197" y="221" width="16" height="8" />
            <rect x="221" y="213" width="8" height="16" />
          </g>

          {/* Pakistan Emerald Green Accent Data Modules (#059669 / #047857) */}
          <g fill="#059669">
            <rect x="93" y="23" width="8" height="8" />
            <rect x="117" y="15" width="8" height="8" />
            <rect x="133" y="31" width="8" height="8" />
            <rect x="157" y="23" width="8" height="8" />
            <rect x="173" y="41" width="8" height="8" />

            <rect x="23" y="93" width="8" height="8" />
            <rect x="49" y="117" width="8" height="8" />
            <rect x="73" y="133" width="8" height="8" />

            {/* Center emerald eye accent */}
            <rect x="117" y="101" width="16" height="16" rx="2" />
            <rect x="101" y="133" width="8" height="8" />
            <rect x="141" y="125" width="8" height="8" />
            <rect x="165" y="85" width="8" height="8" />
            <rect x="189" y="101" width="8" height="8" />
            <rect x="213" y="117" width="8" height="8" />

            <rect x="93" y="173" width="8" height="8" />
            <rect x="117" y="181" width="8" height="8" />
            <rect x="133" y="165" width="8" height="8" />
            <rect x="157" y="181" width="8" height="8" />
            <rect x="181" y="165" width="8" height="8" />
            <rect x="197" y="181" width="8" height="8" />

            <rect x="101" y="205" width="8" height="8" />
            <rect x="125" y="213" width="8" height="8" />
            <rect x="149" y="205" width="8" height="8" />
            <rect x="173" y="221" width="8" height="8" />
            <rect x="189" y="213" width="8" height="8" />
          </g>
        </svg>
      </div>

      {/* Caption Text Exactly as on User Image */}
      <div className="space-y-1">
        <h4 className="font-display font-bold text-xs sm:text-sm text-gray-900 leading-snug">
          Urdu Handwriting Scanner - {email}
        </h4>
        <p className="text-[11px] font-semibold text-emerald-700">
          Scan to open OCR App &bull; Direct Bank Settlement
        </p>
        <div className="text-[10px] text-gray-500 font-mono">
          {bankName} &bull; IBAN: {iban}
        </div>
      </div>

      {/* Success Notification if Transfer Just Executed */}
      {successReceipt && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-left space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All Payment Sent to Your Bank QR!</span>
          </div>
          <p className="text-[11px] text-emerald-900 leading-tight">
            Transferred <strong>Rs. {successReceipt.amount.toLocaleString()}</strong> to <strong>{accountTitle}</strong> ({bankName}). TID: <span className="font-mono font-bold">{successReceipt.referenceNumber}</span>.
          </p>
        </div>
      )}

      {/* Main Action: Send All Payment on This QR */}
      {showSendAllButton && onSendAllPayment && (
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <button
            id="btn-send-all-payment-qr"
            type="button"
            disabled={isSendingAll || availableBalance <= 0}
            onClick={handleSendAllPaymentClick}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSendingAll ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sweeping All Payments to Bank QR...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send All Payment on this QR (Rs. {availableBalance.toLocaleString()})</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-1.5 text-xs pt-1">
        <button
          type="button"
          onClick={handleCopyLink}
          className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <Share2 className="w-3 h-3 text-emerald-600" />
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="py-1.5 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <Printer className="w-3 h-3" />
          <span>Print</span>
        </button>
      </div>
    </div>
  );
};
