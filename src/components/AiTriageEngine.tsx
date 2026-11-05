import React, { useState } from 'react';
import {
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Filter,
  Eye,
  Zap,
  ArrowRight,
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Flame,
} from 'lucide-react';
import { HazardTicket, Language, PriorityLevel, TicketStatus } from '../types.ts';
import { translations } from '../data/translations.ts';

interface AiTriageEngineProps {
  tickets: HazardTicket[];
  lang: Language;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onNavigateToCitizen: () => void;
  onNavigateToGis: (ticketId?: string) => void;
}

export const AiTriageEngine: React.FC<AiTriageEngineProps> = ({
  tickets,
  lang,
  onUpdateTicketStatus,
  onNavigateToCitizen,
  onNavigateToGis,
}) => {
  const t = translations[lang];

  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTicket, setActiveTicket] = useState<HazardTicket | null>(tickets[0] || null);
  const [isSimulatingFeederTrip, setIsSimulatingFeederTrip] = useState<boolean>(false);
  const [feederTripSuccess, setFeederTripSuccess] = useState<boolean>(false);

  // Filtered tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesPriority =
      selectedPriority === 'ALL' || ticket.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === 'ALL' || ticket.status === selectedStatus;
    const matchesSearch =
      ticket.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.hazardType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesStatus && matchesSearch;
  });

  const p1Count = tickets.filter((t) => t.priority === 'P1 Critical').length;
  const duplicateMergedTotal = tickets.reduce(
    (acc, t) => acc + (t.spatialClustering?.mergedTicketCount || 0),
    0
  );

  const handleTripFeeder = () => {
    setIsSimulatingFeederTrip(true);
    setTimeout(() => {
      setIsSimulatingFeederTrip(false);
      setFeederTripSuccess(true);
      if (activeTicket) {
        onUpdateTicketStatus(activeTicket.id, 'Dispatched');
      }
      setTimeout(() => setFeederTripSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Main Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white font-mono tracking-tight">
              AI TRIAGE ENGINE &amp; SPATIAL QUEUE
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            YOLOv8 visual verification of snapped lines and spatial deduplication of citizen phone reports
          </p>
        </div>

        {/* Prominent Action Button */}
        <button
          onClick={onNavigateToCitizen}
          className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-900/20 border border-amber-400/40 transition-transform active:scale-95"
        >
          <Zap className="w-4 h-4 fill-amber-300" />
          <span>Upload New Hazard &amp; Dispatch Crew</span>
        </button>
      </div>

      {/* Cluster Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/90 border border-red-500/40 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase text-slate-400">P1 Life-Threat Queue</p>
            <p className="text-2xl font-black text-red-500 font-mono">{p1Count} Hazards</p>
          </div>
          <span className="p-2 rounded-lg bg-red-500/20 text-red-400 animate-pulse">
            <Flame className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase text-slate-400">Spatial Clustered Duplicates</p>
            <p className="text-2xl font-black text-amber-400 font-mono">{duplicateMergedTotal} Calls Merged</p>
          </div>
          <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Layers className="w-5 h-5" />
          </span>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono uppercase text-slate-400">Avg Computer Vision Latency</p>
            <p className="text-2xl font-black text-emerald-400 font-mono">1.84 sec</p>
          </div>
          <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority filter */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="ALL">All Priorities</option>
              <option value="P1 Critical">P1 Critical (Life-Threat)</option>
              <option value="P2 High">P2 High Priority</option>
              <option value="P3 Moderate">P3 Moderate</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-1 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-700 text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Pending">Pending</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search location, wire, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Main Two-Column View: Queue List on Left, Inspection Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Triage Queue Table / Cards */}
        <div className="lg:col-span-7 space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">{t.emptyStateTitle}</h3>
              <p className="text-xs text-slate-400">{t.emptyStateDesc}</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isSelected = activeTicket?.id === ticket.id;
              const isP1 = ticket.priority === 'P1 Critical';

              return (
                <div
                  key={ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-400 shadow-lg ring-1 ring-amber-400/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {/* Sample Badge */}
                        {ticket.isSample && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {t.sampleBadge}
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold text-slate-300">
                          {ticket.id}
                        </span>
                        <span className="text-xs text-slate-400">|</span>
                        <span className="text-xs font-semibold text-white">
                          {ticket.location}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                        {isP1 && (
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping inline-block" />
                        )}
                        <span>{ticket.hazardType}</span>
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{ticket.description}</p>
                    </div>

                    <div className="flex flex-col items-end space-y-1.5 shrink-0">
                      {/* Priority Badge */}
                      <span
                        className={`text-[11px] font-black font-mono px-2 py-0.5 rounded-full ${
                          ticket.priority === 'P1 Critical'
                            ? 'bg-red-600 text-white'
                            : ticket.priority === 'P2 High'
                            ? 'bg-amber-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {ticket.priority}
                      </span>

                      {/* Status */}
                      <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ticket.status === 'Verified'
                              ? 'bg-emerald-400'
                              : ticket.status === 'Dispatched'
                              ? 'bg-amber-400'
                              : ticket.status === 'Resolved'
                              ? 'bg-blue-400'
                              : 'bg-slate-400'
                          }`}
                        />
                        <span>{ticket.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Duplicate Cluster Strip */}
                  {ticket.spatialClustering && ticket.spatialClustering.mergedTicketCount > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400 font-mono">
                      <div className="flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>
                          {ticket.spatialClustering.mergedTicketCount} duplicate calls merged
                          (Radius: {ticket.spatialClustering.clusterRadiusMeters || 45}m)
                        </span>
                      </div>
                      <span className="text-slate-400">YOLO: {ticket.confidenceScore}%</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Visual Inspection & Dispatch Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 sticky top-24">
          {activeTicket ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    INSPECTION: {activeTicket.id}
                  </span>
                  {activeTicket.isSample && (
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                      Sample Record
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onNavigateToGis(activeTicket.id)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>Open GIS Map</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Bounding Box Visualizer Container */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>YOLOv8 Computer Vision Bounding Boxes</span>
                  <span className="text-emerald-400 font-bold">
                    Confidence: {activeTicket.confidenceScore}%
                  </span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-700 aspect-[16/10] flex items-center justify-center">
                  {/* Visual Representation Graphic */}
                  <svg
                    viewBox="0 0 400 250"
                    className="w-full h-full object-cover bg-slate-950"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="400" height="250" fill="#0f172a" />
                    {/* Road and power lines */}
                    <path d="M 0 200 L 400 200 L 400 250 L 0 250 Z" fill="#1e293b" />
                    <line x1="50" y1="40" x2="50" y2="210" stroke="#64748b" strokeWidth="8" />
                    <line x1="350" y1="40" x2="350" y2="210" stroke="#64748b" strokeWidth="8" />
                    {/* Wire snap representation */}
                    <path
                      d="M 50 70 Q 200 120 220 215"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3.5"
                      strokeDasharray="6 2"
                    />
                    <circle cx="220" cy="215" r="12" fill="#fbbf24" opacity="0.8" />
                    {/* Bounding box simulation in SVG */}
                    <rect
                      x="160"
                      y="140"
                      width="120"
                      height="85"
                      fill="rgba(239, 68, 68, 0.2)"
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                    <text x="165" y="155" fill="#ffffff" fontSize="10" fontFamily="monospace">
                      [snapped_wire: {activeTicket.confidenceScore}%]
                    </text>
                  </svg>

                  {/* Priority Watermark */}
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-black uppercase font-mono px-2 py-0.5 rounded shadow ${
                        activeTicket.priority === 'P1 Critical'
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {activeTicket.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Spatial Deduplication Explanation Card */}
              {activeTicket.spatialClustering && (
                <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{t.duplicateDetectedTitle}</span>
                    </span>
                    <span className="text-slate-400">
                      Radius: {activeTicket.spatialClustering.clusterRadiusMeters || 45}m
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {activeTicket.spatialClustering.summary}
                  </p>
                  {activeTicket.spatialClustering.duplicateReports && (
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Citizen Helpline Calls Merged into this Master Ticket:
                      </p>
                      {activeTicket.spatialClustering.duplicateReports.map((dup, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[11px] bg-slate-900 px-2 py-1 rounded text-slate-300 font-mono"
                        >
                          <span>{dup.citizenPhoneMasked}</span>
                          <span className="text-slate-400">{dup.locationNote}</span>
                          <span className="text-amber-400">{dup.reportedAt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Substation & Feeder Info */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SUBSTATION</span>
                  <span className="text-slate-200 font-bold">
                    {activeTicket.substationId || 'MVP 33/11kV Grid'}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FEEDER</span>
                  <span className="text-amber-400 font-bold">
                    {activeTicket.feederName || 'Feeder 03'}
                  </span>
                </div>
              </div>

              {/* Section Engineer Emergency Action Controls */}
              <div className="pt-2 space-y-2">
                {feederTripSuccess && (
                  <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 text-xs rounded-xl flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Feeder successfully TRIPPED via SCADA telemetry. Dispatched APSEB Crew Bravo-4.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleTripFeeder}
                    disabled={isSimulatingFeederTrip}
                    className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {isSimulatingFeederTrip ? 'Tripping...' : 'Trip 11kV Feeder'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateTicketStatus(activeTicket.id, 'Dispatched');
                      onNavigateToGis(activeTicket.id);
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch Crew</span>
                  </button>
                </div>

                {activeTicket.status !== 'Resolved' && (
                  <button
                    onClick={() => onUpdateTicketStatus(activeTicket.id, 'Resolved')}
                    className="w-full bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 font-semibold py-2 px-3 rounded-xl text-xs transition-colors border border-slate-700 hover:border-emerald-500/40"
                  >
                    Mark Grid Repair Completed
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a hazard ticket from the queue to inspect YOLO bounding boxes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
