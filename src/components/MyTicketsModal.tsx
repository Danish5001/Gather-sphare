import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  QrCode, 
  Download, 
  Share2, 
  MessageSquare, 
  Ticket,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { TicketBooking } from '../types';

interface MyTicketsModalProps {
  tickets: TicketBooking[];
  onClose: () => void;
  onBrowseMore: () => void;
}

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  tickets,
  onClose,
  onBrowseMore,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    tickets.length > 0 ? tickets[0].id : ''
  );

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleDownloadIcs = (ticket: TicketBooking) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GatherSphere//Gathering//EN
BEGIN:VEVENT
SUMMARY:${ticket.gatheringTitle}
LOCATION:${ticket.venueName}, ${ticket.neighborhood}, ${ticket.city}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pass_${ticket.qrCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="modal-my-tickets"
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gray-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                My Gathering Passes &amp; QR Tickets
              </h3>
              <p className="text-xs text-gray-400">
                {tickets.length} confirmed {tickets.length === 1 ? 'gathering' : 'gatherings'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-my-tickets"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {tickets.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Ticket className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-gray-800">No active passes yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Join an intimate supper club, founder mastermind, or weekend workshop to get your first pass.
              </p>
              <button
                id="btn-empty-tickets-browse"
                onClick={onBrowseMore}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                Browse Gatherings
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ticket Selector if multiple */}
              {tickets.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {tickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                        activeTicket.id === t.id
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {t.gatheringTitle.substring(0, 24)}...
                    </button>
                  ))}
                </div>
              )}

              {/* Active Ticket Pass Card */}
              {activeTicket && (
                <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-base tracking-wide text-white">GATHERPASS</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 uppercase">
                        {activeTicket.ticketTier}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      Pass #{activeTicket.qrCode}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xl font-bold font-display text-white">
                      {activeTicket.gatheringTitle}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{activeTicket.gatheringDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{activeTicket.gatheringTime}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{activeTicket.venueName} &bull; {activeTicket.neighborhood}, {activeTicket.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR & Guest Details */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-mono">Guest Holder</span>
                      <span className="font-semibold text-sm text-white">{activeTicket.buyerName}</span>
                      <span className="text-xs text-gray-400 block">{activeTicket.buyerEmail}</span>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                      <div className="w-12 h-12 bg-white text-gray-900 rounded-lg p-1 flex items-center justify-center">
                        <QrCode className="w-10 h-10" />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 block uppercase font-mono">Check-in Code</span>
                        <span className="font-mono font-bold text-sm text-emerald-300 tracking-wider">
                          {activeTicket.qrCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {activeTicket && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    id="btn-download-pass-calendar"
                    onClick={() => handleDownloadIcs(activeTicket)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Calendar Invite (.ics)</span>
                  </button>

                  <button
                    id="btn-browse-more-passes"
                    onClick={onBrowseMore}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Discover More Gatherings</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
