export type GatheringCategory =
  | 'All'
  | 'Dining & Supper Clubs'
  | 'Tech & Founders'
  | 'Creative Workshops'
  | 'Outdoors & Active'
  | 'Mindfulness & Health'
  | 'Social & Mixers';

export interface Host {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  totalEventsHosted: number;
  earningsToDate: number;
}

export interface Attendee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  industry: string;
  interests: string[];
  icebreakerTopic: string;
  ticketTier: 'General' | 'VIP Circle';
}

export interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface Gathering {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: GatheringCategory;
  host: Host;
  date: string;
  time: string;
  duration: string;
  city: string;
  neighborhood: string;
  venueName: string;
  venueVibe: string;
  price: number;
  vipPrice: number;
  maxCapacity: number;
  bookedCount: number;
  image: string;
  tags: string[];
  includedItems: string[];
  agenda: AgendaItem[];
  icebreakers: string[];
  attendees: Attendee[];
  isFeatured?: boolean; // Boosted by organizer ($19 fee collected by platform)
  isPlatformExclusive?: boolean; // Hosted by platform owner (100% net revenue)
  tableGroupingAdvice?: string;
}

export interface TicketBooking {
  id: string;
  gatheringId: string;
  gatheringTitle: string;
  gatheringDate: string;
  gatheringTime: string;
  venueName: string;
  neighborhood: string;
  city: string;
  buyerName: string;
  buyerEmail: string;
  ticketTier: 'General' | 'VIP Circle';
  quantity: number;
  ticketPrice: number;
  platformFee: number;
  conciergeFee: number;
  totalPaid: number;
  currency: 'PKR' | 'USD';
  paymentMethod: 'JazzCash' | 'Easypaisa' | 'Raast / Bank Transfer' | 'Debit/Credit Card (PayPak/Visa/MC)' | 'JazzCash / Easypaisa Till Code';
  transactionReference: string;
  senderAccountOrNumber?: string;
  tillCode?: string;
  qrCode: string;
  bookedAt: string;
  status: 'Confirmed' | 'Checked In';
}

export interface PlatformTransaction {
  id: string;
  timestamp: string;
  type: 'ticket_commission' | 'vip_subscription' | 'organizer_boost' | 'concierge_fee' | 'platform_flagship';
  eventTitle?: string;
  amountGross: number;
  ownerNetEarned: number;
  description: string;
  currency?: 'PKR' | 'USD';
  paymentGateway?: string;
}

export interface PakistanPaymentGatewayConfig {
  gatewayProvider: 'Raast & 1LINK' | 'JazzCash Merchant' | 'Easypaisa Merchant' | 'Safepay' | 'Paymob Pakistan';
  isLiveMode: boolean; // Always true for real production mode
  currency: 'PKR' | 'USD';
  bankName: string;
  accountTitle: string;
  iban: string;
  raastId: string;
  accountNumber: string;
  branchCode?: string;
  jazzCashMerchantId?: string;
  jazzCashMobileNumber?: string;
  jazzCashTillCode?: string; // 6-to-8 digit Merchant Till (e.g. 00481923)
  jazzCashPassword?: string;
  easyPaisaStoreId?: string;
  easyPaisaMobileNumber?: string;
  easyPaisaTillCode?: string; // e.g. 7729104
  raastTillNumber?: string; // e.g. BAHL-RAAST-03005001234
  safepayPublicKey?: string;
  safepaySecretKey?: string;
  autoSettlementToBankALHabib?: boolean; // Direct real-time auto sweep into Danish Mehmood Bank AL Habib account
  bankSettlementStatus?: 'Directly Receiving' | 'Pending Routing' | 'Connected';
  liveStatus: 'Active & Verified' | 'Connected' | 'Pending Review';
}

export interface ConnectedBankAccount {
  id: string;
  accountHolderName: string;
  bankName: string;
  accountType: 'Checking' | 'Savings' | 'Business Checking' | 'Islamic Current' | 'Islamic Asaan Account';
  routingNumber: string;
  accountNumberLast4: string;
  iban?: string; // 24-character Pakistani IBAN
  raastId?: string; // Mobile number registered with SBP Raast
  tillCode?: string; // Merchant Till Code (00481923)
  easyPaisaTillCode?: string; // 7729104
  directBankReceiptVerified?: boolean;
  country: string;
  currency: string;
  isVerified: boolean;
  status: 'Connected' | 'Pending Verification' | 'Needs Attention';
  payoutSchedule: 'Automatic Daily' | 'Weekly on Mondays' | 'Monthly on 1st' | 'Manual Withdrawals';
  payoutMethod: 'Raast Instant Settlement (SBP)' | 'Pakistani Bank IBAN (1LINK)' | 'JazzCash Merchant / Wallet' | 'Easypaisa Merchant / Wallet' | 'ACH Direct Deposit' | 'Safepay Payout' | 'Direct Merchant Till Transfer';
  linkedDate: string;
}

export interface PayoutRecord {
  id: string;
  amount: number;
  status: 'Completed' | 'Processing' | 'In Transit';
  destinationBank: string;
  accountNumberLast4: string;
  iban?: string;
  raastId?: string;
  tillCode?: string;
  stan?: string; // Systems Trace Audit Number
  rrn?: string; // Retrieval Reference Number
  settlementType?: 'Till Code Transfer' | 'SBP Raast' | '1LINK IBFT';
  initiatedAt: string;
  estimatedArrival: string;
  referenceNumber: string;
  method: string;
  fee: number;
  netPayout: number;
  currency?: 'PKR' | 'USD';
}

export interface PlatformRevenueMetrics {
  totalGrossMerchandiseValue: number;
  netOwnerProfit: number;
  totalTicketsSold: number;
  activeVipSubscribers: number;
  vipMonthlySubscriptionRate: number;
  platformTakeRatePercent: number; // e.g. 15%
  conciergeFeePerTicket: number; // e.g. $2.50 or Rs. 700
  organizerBoostFee: number; // e.g. $19 or Rs. 5000
  totalBoostsSold: number;
  totalHostPayoutsProcessed: number;
  availableCashBalance: number;
  lifetimeWithdrawn: number;
  transactions: PlatformTransaction[];
  connectedBank?: ConnectedBankAccount | null;
  payoutHistory?: PayoutRecord[];
  gatewayConfig?: PakistanPaymentGatewayConfig;
  currency?: 'PKR' | 'USD';
  isLiveMode?: boolean;
}
