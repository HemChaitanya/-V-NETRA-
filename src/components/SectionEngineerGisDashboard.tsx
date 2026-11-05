import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Truck,
  Zap,
  Radio,
  Layers,
  Flame,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Compass,
  ArrowRight,
  Shield,
  RefreshCw,
  PhoneCall,
  Clock,
  Filter,
} from 'lucide-react';
import { HazardTicket, Language, TicketStatus } from '../types.ts';
import { translations } from '../data/translations.ts';

interface SectionEngineerGisDashboardProps {
  tickets: HazardTicket[];
  selectedTicketId?: string;
  lang: Language;
  onUpdateTicketStatus: (ticketId: string, newStatus: TicketStatus) => void;
  onNavigateToCitizen: () => void;
}

// Substation GIS locations in Visakhapatnam
const SUBSTATIONS = [
  {
    id: 'sub-mvp',
    name: 'MVP Colony 33/11kV Substation',
    division: 'MVP Sector 3',
    lat: 17.741,
    lng: 83.334,
    x: 65, // percentage for SVG map projection
    y: 35,
    feedersActive: 8,
    trippedFeeders: 1,
    crewsStandby: 3,
  },
  {
    id: 'sub-gajuwaka',
    name: 'Gajuwaka 132/33kV Main Grid',
    division: 'Industrial Belt',
    lat: 17.688,
    lng: 83.208,
    x: 25,
    y: 75,
    feedersActive: 14,
    trippedFeeders: 2,
    crewsStandby: 4,
  },
  {
    id: 'sub-siripuram',
    name: 'Siripuram 33/11kV Substation',
    division: 'Central Vizag',
    lat: 17.722,
    lng: 83.314,
    x: 55,
    y: 52,
    feedersActive: 6,
    trippedFeeders: 0,
    crewsStandby: 2,
  },
];

// Available APSEB Emergency Repair Crews
const APSEB_CREWS = [
  {
    id: 'crew-bravo-4',
    name: 'APSEB Crew Bravo-4 (Hydraulic Crane)',
    vehicleNo: 'AP31-TV-4102',
    leadEngineer: 'S. K. Rao (AE Line Maintenance)',
    status: 'Available',
    baseSubstation: 'MVP Colony 33/11kV',
  },
  {
    id: 'crew-charlie-2',
    name: 'APSEB Emergency Squad Charlie-2',
    vehicleNo: 'AP31-EM-8821',
    leadEngineer: 'M. Venkat (Sub-Engineer)',
    status: 'Available',
    baseSubstation: 'Gajuwaka 132/33kV Grid',
  },
  {
    id: 'crew-lineman-1',
    name: 'Quick Response Lineman Squad 1',
    vehicleNo: 'AP31-LR-1204',
    leadEngineer: 'K. Prasad (Senior Lineman)',
    status: 'En-route',
    baseSubstation: 'Siripuram 33/11kV',
  },
];

export const SectionEngineerGisDashboard: React.FC<
  SectionEngineerGisDashboardProps
> = ({
  tickets,
  selectedTicketId,
  lang,
  onUpdateTicketStatus,
  onNavigateToCitizen,
}) => {
  const t = translations[lang];

  const [activeTicketId, setActiveTicketId] = useState<string>(
    selectedTicketId || (tickets.find((t) => t.priority === 'P1 Critical')?.id || tickets[0]?.id || '')
  );
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'P1' | 'P2' | 'P3'>('ALL');
  const [selectedCrewId, setSelectedCrewId] = useState<string>(APSEB_CREWS[0].id);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);

  const activeTicket = useMemo(
    () => tickets.find((t) => t.id === activeTicketId) || tickets[0],
    [tickets, activeTicketId]
  );

  // Map projection coordinates: Visakhapatnam bounding box
  // Lat: 17.65 to 17.85 | Lng: 83.18 to 83.38
  const projectCoordsToMap = (lat: number, lng: number) => {
    const minLat = 17.67;
    const maxLat = 17.83;
    const minLng = 83.19;
    const maxLng = 83.37;

    const x = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 100, 10), 90);
    // Invert Y because latitude increases northward (up)
    const y = Math.min(Math.max((1 - (lat - minLat) / (maxLat - minLat)) * 100, 10), 90);

    return { x, y };
  };

  const filteredTickets = useMemo(() => {
    if (priorityFilter === 'ALL') return tickets;
    if (priorityFilter === 'P1') return tickets.filter((t) => t.priority === 'P1 Critical');
    if (priorityFilter === 'P2') return tickets.filter((t) => t.priority === 'P2 High');
    return tickets.filter((t) => t.priority === 'P3 Moderate');
  }, [tickets, priorityFilter]);

  // Find nearest substation for routing polyline
  const nearestSubstation = useMemo(() => {
    if (!activeTicket) return SUBSTATIONS[0];
    let best = SUBSTATIONS[0];
    let minD = 9999;
    SUBSTATIONS.forEach((sub) => {
      const d = Math.hypot(sub.lat - activeTicket.lat, sub.lng - activeTicket.lng);
      if (d < minD) {
        minD = d;
        best = sub;
      }
    });
    return best;
  }, [activeTicket]);

  const activePos = activeTicket
    ? projectCoordsToMap(activeTicket.lat, activeTicket.lng)
    : { x: 50, y: 50 };

  // Dispatch Action
  const handleDispatchCrew = () => {
    if (!activeTicket) return;
    setIsDispatching(true);
    setDispatchFeedback(null);

    const crew = APSEB_CREWS.find((c) => c.id === selectedCrewId) || APSEB_CREWS[0];

    setTimeout(() => {
      onUpdateTicketStatus(activeTicket.id, 'Dispatched');
      setIsDispatching(false);
      setDispatchFeedback(
        `Dispatched ${crew.name} to ${activeTicket.location}. Telemetry ping sent to driver mobile.`
      );
      setTimeout(() => setDispatchFeedback(null), 5000);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Fast Dispatch CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Navigation className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white font-mono tracking-tight">
              SECTION ENGINEER GIS DISPATCH CONSOLE
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time Visakhapatnam grid overlay mapping P1 life-threatening hazards to nearest APSEB substations
          </p>
        </div>

        {/* Global Dispatch Button */}
        <button
          onClick={onNavigateToCitizen}
          className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-900/20 border border-amber-400/40 transition-transform active:scale-95"
        >
          <Zap className="w-4 h-4 fill-amber-300" />
          <span>Upload &amp; Dispatch Verified P1 Emergency Crew</span>
        </button>
      </div>

      {/* Map Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400 uppercase">Map Hazard Filter:</span>
          <button
            onClick={() => setPriorityFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              priorityFilter === 'ALL'
                ? 'bg-slate-700 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({tickets.length})
          </button>
          <button
            onClick={() => setPriorityFilter('P1')}
            className={`px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
              priorityFilter === 'P1'
                ? 'bg-red-600 text-white font-bold'
                : 'text-red-400 hover:text-red-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-block" />
            <span>P1 Life-Threats ({tickets.filter((t) => t.priority === 'P1 Critical').length})</span>
          </button>
          <button
            onClick={() => setPriorityFilter('P2')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              priorityFilter === 'P2'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            P2 High ({tickets.filter((t) => t.priority === 'P2 High').length})
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-blue-500 rounded-sm border border-white/40" />
            <span>33/11kV Substation</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-red-600 rounded-full border border-white" />
            <span>P1 Critical</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 bg-amber-500 rounded-full" />
            <span>P2 High</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Map & Dispatch Cockpit Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive GIS Map Canvas on Left (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Map Status Bar Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono space-y-1 shadow-lg pointer-events-none">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-bold">VISAKHAPATNAM GIS GRID V4.2</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sector: MVP Colony, Siripuram, Gajuwaka &amp; Beach Road
            </p>
          </div>

          {/* Bay of Bengal Watermark */}
          <div className="absolute bottom-6 right-6 z-10 pointer-events-none text-right">
            <span className="text-sky-500/30 text-2xl font-black font-mono tracking-widest uppercase">
              Bay of Bengal
            </span>
            <p className="text-[10px] text-sky-400/30 font-mono">Coastal Feeder Corridors</p>
          </div>

          {/* SVG Map Canvas with Real Vizag Landmarks */}
          <div className="w-full aspect-[16/10] sm:aspect-[16/11] relative select-none bg-slate-950 overflow-hidden">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              {/* Grid Lines */}
              <defs>
                <pattern
                  id="gis-grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="0.5"
                  />
                </pattern>
                <linearGradient id="oceanGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#082f49" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              <rect width="100" height="100" fill="url(#gis-grid)" />

              {/* Bay of Bengal Coastline polygon on right */}
              <path
                d="M 82 0 Q 75 40 78 70 Q 82 85 90 100 L 100 100 L 100 0 Z"
                fill="url(#oceanGrad)"
                stroke="#0284c7"
                strokeWidth="0.8"
                strokeDasharray="2 1"
              />

              {/* Major Highway NH-16 and Beach Road arteries */}
              {/* NH 16 Arterial Route */}
              <path
                d="M 15 90 Q 35 60 45 40 Q 55 20 65 0"
                fill="none"
                stroke="#334155"
                strokeWidth="2.5"
              />
              {/* Beach Road coastal artery */}
              <path
                d="M 50 65 Q 65 55 74 38 Q 78 20 80 0"
                fill="none"
                stroke="#475569"
                strokeWidth="1.8"
              />
              {/* MVP Double Road Link */}
              <path
                d="M 55 35 L 75 35"
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Dynamic Optimal Dispatch Route Polyline (Between nearest substation and active ticket) */}
              {activeTicket && (
                <>
                  <path
                    d={`M ${nearestSubstation.x} ${nearestSubstation.y} Q ${
                      (nearestSubstation.x + activePos.x) / 2
                    } ${(nearestSubstation.y + activePos.y) / 2 + 5} ${activePos.x} ${
                      activePos.y
                    }`}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.8"
                    strokeDasharray="2 1"
                    className="animate-pulse"
                  />
                  {/* Crew truck icon moving simulation along path */}
                  <circle
                    cx={(nearestSubstation.x + activePos.x) / 2}
                    cy={(nearestSubstation.y + activePos.y) / 2 + 2.5}
                    r="1.8"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                </>
              )}

              {/* Substation Base Stations */}
              {SUBSTATIONS.map((sub) => (
                <g key={sub.id}>
                  <rect
                    x={sub.x - 2.5}
                    y={sub.y - 2.5}
                    width="5"
                    height="5"
                    rx="1"
                    fill="#2563eb"
                    stroke="#93c5fd"
                    strokeWidth="0.6"
                  />
                  <text
                    x={sub.x}
                    y={sub.y + 4.5}
                    textAnchor="middle"
                    fill="#93c5fd"
                    fontSize="2.4"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {sub.division}
                  </text>
                </g>
              ))}
            </svg>

            {/* Interactive Hazard Marker Pins (HTML overlay for rich tooltip & pulse effects) */}
            {filteredTickets.map((ticket) => {
              const pos = projectCoordsToMap(ticket.lat, ticket.lng);
              const isSelected = activeTicket?.id === ticket.id;
              const isP1 = ticket.priority === 'P1 Critical';

              return (
                <div
                  key={ticket.id}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => setActiveTicketId(ticket.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  {/* P1 Life Threat Radar Pulse */}
                  {isP1 && (
                    <span className="absolute -inset-2 rounded-full bg-red-600 opacity-75 animate-ping pointer-events-none" />
                  )}

                  {/* Marker Pin */}
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-transform group-hover:scale-125 ${
                      isSelected
                        ? 'w-7 h-7 ring-4 ring-amber-400 z-30'
                        : 'w-5 h-5'
                    } ${
                      isP1
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                        : ticket.priority === 'P2 High'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {isP1 ? (
                      <Flame className="w-3.5 h-3.5" />
                    ) : (
                      <Zap className="w-3 h-3" />
                    )}
                  </div>

                  {/* Hover or Active Tooltip Label */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-slate-900/95 border border-slate-700 px-2 py-1 rounded shadow-xl text-[10px] font-mono pointer-events-none transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <span className="text-amber-400 font-bold">{ticket.location}</span>
                    <span className="text-slate-400 block">{ticket.hazardType}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Route Summary Bar */}
          {activeTicket && (
            <div className="bg-slate-900 border-t border-slate-800 p-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center space-x-2 text-amber-300">
                <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Optimal Dispatch Corridor:</strong> From {nearestSubstation.name} to {activeTicket.location} (Est. Distance: ~3.8 km | ETA: 7 mins)
                </span>
              </div>
              <span className="text-emerald-400 font-semibold self-start sm:self-auto">
                SCADA Feeder Status: Live / Auto-Trip Ready
              </span>
            </div>
          )}
        </div>

        {/* Dispatch Controls & Ticket Inspector on Right (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
          {activeTicket ? (
            <>
              {/* Header */}
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-black uppercase font-mono px-2 py-0.5 rounded-full ${
                      activeTicket.priority === 'P1 Critical'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {activeTicket.priority}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {activeTicket.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {activeTicket.location}
                </h3>
                <p className="text-xs text-amber-400 font-mono">
                  {activeTicket.hazardType}
                </p>
              </div>

              {/* Status Alert */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Triage Confidence:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {activeTicket.confidenceScore}% (YOLOv8)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Grid Feeder:</span>
                  <span className="text-amber-300 font-mono">
                    {activeTicket.feederName || 'MVP 11kV Feeder-03'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dispatch Status:</span>
                  <span
                    className={`font-bold font-mono ${
                      activeTicket.status === 'Dispatched'
                        ? 'text-amber-400'
                        : activeTicket.status === 'Verified'
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {activeTicket.status}
                  </span>
                </div>
              </div>

              {/* Duplicates Merged Notice */}
              {activeTicket.spatialClustering && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 font-mono">
                  <strong>Spatial Clustering:</strong> {activeTicket.spatialClustering.summary}
                </div>
              )}

              {/* Dispatch Action Form */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono block">
                  Select APSEB Emergency Repair Squad
                </label>
                <select
                  value={selectedCrewId}
                  onChange={(e) => setSelectedCrewId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {APSEB_CREWS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.vehicleNo})
                    </option>
                  ))}
                </select>

                {dispatchFeedback && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs">
                    {dispatchFeedback}
                  </div>
                )}

                <button
                  onClick={handleDispatchCrew}
                  disabled={isDispatching}
                  className="w-full bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isDispatching ? (
                    <span>Transmitting Dispatch Beacon...</span>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-amber-200" />
                      <span>Dispatch Selected Crew Now</span>
                    </>
                  )}
                </button>

                {/* Mark as Resolved button */}
                {activeTicket.status !== 'Resolved' && (
                  <button
                    onClick={() => onUpdateTicketStatus(activeTicket.id, 'Resolved')}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2 rounded-xl transition-colors"
                  >
                    Mark Incident Repaired &amp; Restored
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-500 text-center py-10">
              Click any hazard pin on the map to inspect details and dispatch emergency crews.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
