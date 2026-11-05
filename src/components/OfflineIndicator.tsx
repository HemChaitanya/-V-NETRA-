import React from 'react';
import { WifiOff, ShieldCheck, Zap } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-start gap-3 rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-2 border-amber-500/80 p-4 text-white shadow-2xl backdrop-blur-lg animate-pulse">
      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 border border-amber-500/30">
        <WifiOff className="w-5 h-5 text-amber-400" />
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-black text-amber-300 uppercase tracking-wide">
            OFFLINE EMERGENCY PWA MODE
          </span>
          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-mono border border-emerald-500/30">
            Pre-Cached
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Zero internet active. V-Netra is executing entirely from your phone&apos;s pre-cached service worker. All triage and GIS map views remain 100% operational.
        </p>
      </div>
    </div>
  );
};
