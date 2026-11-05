import React from 'react';
import {
  ShieldAlert,
  Zap,
  Users,
  Building2,
  MapPin,
  ExternalLink,
  Target,
  Clock,
  Activity,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../data/translations.ts';

interface AboutScreenProps {
  lang: Language;
  onNavigateToCitizen: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  lang,
  onNavigateToCitizen,
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Badge & Pitch Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
          <Code2 className="w-3.5 h-3.5" />
          <span>DEVELOPED BY TEAM VOID404.exe | VISAKHAPATNAM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          V-Netra (వి-నేత్ర)
        </h1>

        <p className="text-base sm:text-lg text-amber-300 font-medium">
          &ldquo;During cyclones, live power lines snap but APSEB engineers are buried in frantic phone calls. V-Netra uses computer vision to instantly verify citizen hazard photos and map real-time P1 repair priorities for utility crews.&rdquo;
        </p>

        {/* Prominent Action Button */}
        <div className="pt-2 max-w-xl mx-auto">
          <button
            onClick={onNavigateToCitizen}
            className="w-full bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl shadow-red-900/30 border border-amber-400/50 transition-transform active:scale-95"
          >
            <Zap className="w-4 h-4 fill-amber-300" />
            <span>{t.mainActionBtn}</span>
          </button>
        </div>
      </div>

      {/* Required 2-3 Stat Cards with Citations */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold text-center">
          Ground Reality &amp; Verified Official Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-slate-900/90 border border-red-500/40 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-red-400">
                <span className="font-bold">FATALITY RISK</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="text-3xl font-black text-white font-mono">10,000+</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Over 10,000 electrocution deaths occur annually in India, with high spikes during coastal monsoon &amp; cyclone surges.
              </p>
            </div>
            <a
              href="https://ncrb.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-mono pt-2 border-t border-slate-800"
            >
              <span>Source: National Crime Records Bureau (NCRB)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span className="font-bold">GRID DISRUPTION</span>
                <Activity className="w-4 h-4" />
              </div>
              <p className="text-3xl font-black text-white font-mono">Thousands</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cyclones in coastal AP uproot thousands of poles requiring intensive manual triage and feeder isolation.
              </p>
            </div>
            <a
              href="https://www.apeasternpower.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-mono pt-2 border-t border-slate-800"
            >
              <span>Source: APEPDCL Operational Reports</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                <span className="font-bold">HELPLINE BOTTLENECK</span>
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-3xl font-black text-white font-mono">1912 Jams</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Civic helplines face massive call jams during storm events, burying life-threatening snapped wire reports under generic blackout calls.
              </p>
            </div>
            <a
              href="https://www.gvmc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-mono pt-2 border-t border-slate-800"
            >
              <span>Source: GVMC Disaster Management</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Problem & Solution Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2.5 text-red-400 font-mono text-sm font-bold">
            <span className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <span>THE CRITICAL PROBLEM</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Citizens in Visakhapatnam face severe electrocution hazards from unverified, storm-damaged electrical lines because local APSEB section offices lack automated, visual triage tools to filter life-threatening hazards from generic power-cut complaints.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            During storms like Hudhud and Titli, local Section Engineers at MVP Colony, Gajuwaka, and Siripuram receive thousands of concurrent telephone complaints. Without photos, an engineer cannot distinguish an entire 11kV conductor live on a flooded street from a mere blown fuse in a home.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2.5 text-emerald-400 font-mono text-sm font-bold">
            <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <span>OUR COMPUTER-VISION SOLUTION</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            For APSEB Section Engineers who struggle to prioritize emergency repairs during storm events, V-Netra is an AI-powered visual hazard triage platform that uses computer vision to instantly verify citizen-uploaded photos of structural grid damage and map crew dispatch priorities.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unlike legacy helpline phone queues (1912), we eliminate manual call overload by validating visual hazard severity and automatically escalating unaddressed life-threat tickets.
          </p>
        </div>
      </div>

      {/* Pre-Installed / Bookmarked as an Emergency PWA */}
      <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex items-center space-x-2.5 text-amber-400 font-mono text-sm font-bold">
          <span className="p-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </span>
          <span>1. PRE-INSTALLED / BOOKMARKED AS AN EMERGENCY PWA</span>
        </div>
        <h3 className="text-xl font-black text-white">
          Cyclone Season Pre-Caching Architecture
        </h3>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          <strong>Pre-Caching:</strong> When APEPDCL and GVMC launch V-Netra ahead of cyclone season, they broadcast the web link via government SMS alerts, WhatsApp channels, and local news.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Once a citizen opens the link just once on a sunny day or before the storm hits, the app&apos;s code, icons, and interface get permanently saved (cached) on their phone browser.
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 font-mono text-xs sm:text-sm text-amber-300 space-y-1">
          <p className="font-bold flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Zero-Data Offline Execution Guaranteed</span>
          </p>
          <p className="text-slate-300 font-sans text-xs">
            Even if they close the browser and lose all internet later during severe cyclone surges, clicking the V-Netra bookmark or icon on their phone home screen opens the app instantly—<strong>zero internet required to load the screen</strong>.
          </p>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl">
        <h3 className="text-lg font-black text-amber-400 font-mono uppercase tracking-wide">
          What Makes V-Netra Different?
        </h3>
        <p className="text-base sm:text-lg text-white font-semibold leading-relaxed">
          &ldquo;None of them combine citizen visual photo intake with AI computer-vision verification to auto-prioritize life-threatening grid failures for utility dispatchers.&rdquo;
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-amber-400 block mb-1">Instant Photo Verification</strong>
            Extracts snapped conductors, sheared poles, and transformer dielectric fire with bounding box accuracy.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-amber-400 block mb-1">Spatial Deduplication</strong>
            Clusters 10+ calls in a 50m radius into 1 master ticket, preventing duplicated lineman dispatches.
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <strong className="text-amber-400 block mb-1">SCADA Feeder Tie-In</strong>
            Allows 1-click 11kV feeder isolation command before sending repair crews into flooded zones.
          </div>
        </div>
      </div>

      {/* Business Model & Target Users */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold">
            <Users className="w-4 h-4" />
            <span>PRIMARY USERS</span>
          </div>
          <p className="text-slate-300">
            APSEB Section Engineers &amp; Local Substation Supervisors (MVP Colony &amp; Gajuwaka Divisions)
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Building2 className="w-4 h-4" />
            <span>WHO PAYS LATER</span>
          </div>
          <p className="text-slate-300">
            APEPDCL via B2G Substation SaaS License (Recurring Subscription) at ₹5,000 / substation / month (₹60,000 / year).
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-blue-400 font-bold">
            <MapPin className="w-4 h-4" />
            <span>OPERATIONAL SECTOR</span>
          </div>
          <p className="text-slate-300">
            Visakhapatnam, Andhra Pradesh, India (Substations: MVP 33/11kV, Gajuwaka 132/33kV Grid, Siripuram).
          </p>
        </div>
      </div>

      {/* Team VOID404.exe Footer */}
      <div className="text-center text-xs text-slate-500 font-mono pt-4 border-t border-slate-800">
        V-Netra Utility Emergency Platform • Built by Team VOID404.exe • Visakhapatnam, Andhra Pradesh
      </div>
    </div>
  );
};
