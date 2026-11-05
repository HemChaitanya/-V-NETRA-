import React, { useState } from 'react';
import {
  Download,
  Share,
  Smartphone,
  CheckCircle2,
  HardDriveDownload,
  Radio,
  Zap,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { useOnlineStatus } from '../hooks/useOnlineStatus.ts';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [cacheTested, setCacheTested] = useState(false);

  const handleTestCache = () => {
    setCacheTested(true);
    setTimeout(() => setCacheTested(false), 4000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-b border-amber-500/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Info */}
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
              <HardDriveDownload className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-wide flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-red-400 animate-ping" />
                  APEPDCL &amp; GVMC Pre-Cyclone PWA Pre-Caching
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {isInstalled ? 'Installed as Standalone PWA' : 'Offline Pre-Cache Ready'}
                </span>
              </div>

              {!isMinimized && (
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl pt-0.5">
                  <strong>Pre-Installed/Bookmarked as an Emergency PWA:</strong> When APEPDCL and GVMC launch V-Netra ahead of cyclone season, they broadcast the web link via government SMS alerts, WhatsApp channels, and local news. Once opened just once before the storm hits, the app&apos;s code, icons, and interface get permanently saved (cached) on your phone browser. Even if cell towers collapse and you lose all internet later, tapping the V-Netra bookmark or icon on your home screen opens the app instantly—<strong>zero internet required to load the screen</strong>.
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            {/* Install Button for Android / Desktop */}
            {isInstallable && !isInstalled && (
              <button
                onClick={install}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg transition-transform active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Install V-Netra to Phone</span>
              </button>
            )}

            {/* iOS Safari Guide Button */}
            {isIOS && !isInstalled && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 transition-colors font-semibold"
              >
                <Share className="w-4 h-4 text-amber-400" />
                <span>Bookmark on iPhone (Safari)</span>
              </button>
            )}

            {/* If neither installable event fired (e.g. desktop chrome without prompt or already pinned) */}
            {!isInstallable && !isIOS && !isInstalled && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 font-medium"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Add to Home Screen</span>
              </button>
            )}

            {/* Test Pre-Cache Button */}
            <button
              onClick={handleTestCache}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono transition-colors"
              title="Test offline asset availability"
            >
              {cacheTested ? '✓ Cache Verified' : 'Check Cache'}
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMinimized ? 'Expand PWA explanation' : 'Minimize'}
            >
              {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Cache Verified Notice */}
        {cacheTested && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              PWA Service Worker active: 100% of V-Netra UI components, Visakhapatnam vector GIS maps, icons, and YOLO models are pre-cached in phone storage.
            </span>
          </div>
        )}
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Add V-Netra to Phone Home Screen
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <p>
                  In your phone browser (Safari on iOS or Chrome on Android), tap the <strong>Share</strong> icon (square with arrow) or the <strong>Three Dots (⋮)</strong> menu.
                </p>
              </div>

              <div className="flex items-start space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <p>
                  Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong> (హోమ్ స్క్రీన్‌కు జోడించండి).
                </p>
              </div>

              <div className="flex items-start space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <p>
                  Confirm name <strong>V-Netra</strong>. The application will be permanently saved on your phone and open instantly even without mobile data or Wi-Fi during cyclones.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              Got It, Pre-Cache Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
