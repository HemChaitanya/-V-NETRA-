import React from 'react';
import { Target, Zap, Clock, Users, ShieldAlert, Cpu } from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../data/translations.ts';

interface StatsStripProps {
  lang: Language;
  p1Count: number;
  totalTickets: number;
  duplicatesMerged: number;
}

export const StatsStrip: React.FC<StatsStripProps> = ({
  lang,
  p1Count,
  totalTickets,
  duplicatesMerged,
}) => {
  const t = translations[lang];

  return (
    <div className="w-full bg-[#111827] border-y border-amber-500/20 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Core KPI metrics strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 flex items-center space-x-3 shadow-md">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {t.statAccuracy}
              </p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  96.4%
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">YOLOv8 CV</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-red-500/30 rounded-xl p-3 flex items-center space-x-3 shadow-md">
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {t.statIsolationTime}
              </p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-black text-red-400 font-mono">
                  &lt; 4.2s
                </span>
                <span className="text-[10px] text-red-300 font-semibold">Instant Triage</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 flex items-center space-x-3 shadow-md">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {t.statEngineers}
              </p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">
                  142
                </span>
                <span className="text-[10px] text-slate-400 font-medium">MVP & Gajuwaka</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 flex items-center space-x-3 shadow-md">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                1912 Helpline Calls Saved
              </p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {duplicatesMerged + 38}
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold">Deduplicated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
