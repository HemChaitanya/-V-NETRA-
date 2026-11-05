import React, { useState } from 'react';
import {
  Zap,
  ShieldAlert,
  MapPin,
  Flame,
  Info,
  Menu,
  X,
  RotateCcw,
  Languages,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { Language } from '../types.ts';
import { translations } from '../data/translations.ts';

interface NavbarProps {
  currentTab: 'citizen' | 'triage' | 'gis' | 'about';
  onSelectTab: (tab: 'citizen' | 'triage' | 'gis' | 'about') => void;
  lang: Language;
  onToggleLang: () => void;
  onClearData: () => void;
  p1Count: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  onClearData,
  p1Count,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const handleNavClick = (tab: 'citizen' | 'triage' | 'gis' | 'about') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#111827] border-b border-amber-500/20 shadow-xl backdrop-blur-md">
      {/* Cyclone Alert Bar */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white text-xs py-1.5 px-4 font-mono font-semibold tracking-wide flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
          </span>
          <span className="uppercase text-[11px] bg-red-900/60 px-1.5 py-0.5 rounded border border-red-300/40">
            APSEB / APEPDCL
          </span>
          <span className="truncate">{t.alertBanner}</span>
        </div>
        <div className="flex items-center space-x-3 shrink-0 text-[11px]">
          <span className="hidden sm:inline-flex items-center text-yellow-200 bg-red-950/70 px-2 py-0.5 rounded border border-red-500/40">
            <AlertTriangle className="w-3 h-3 mr-1 text-red-400" />
            {p1Count} P1 Life-Threats Active
          </span>
          <span className="text-amber-300">Vizag Section 04</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('citizen')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-400/40">
              <Zap className="w-6 h-6 text-slate-950 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white font-mono">
                  V-NETRA
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                  APSEB
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wider uppercase font-medium">
                Visakhapatnam Storm Hazard Triage
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavClick('citizen')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                currentTab === 'citizen'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>{t.navCitizen}</span>
            </button>

            <button
              onClick={() => handleNavClick('triage')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 relative ${
                currentTab === 'triage'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-400" />
              <span>{t.navTriage}</span>
              {p1Count > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {p1Count}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('gis')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                currentTab === 'gis'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{t.navGis}</span>
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                currentTab === 'about'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4 text-amber-400" />
              <span>{t.navAbout}</span>
            </button>
          </nav>

          {/* Right actions: Lang & Clear */}
          <div className="flex items-center space-x-2">
            {/* Telugu / English Toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-semibold transition-colors"
              title="Toggle Telugu / English"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* Clear Data Button */}
            <button
              onClick={onClearData}
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/50 text-xs transition-colors"
              title="Reset records to default sample"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.clearData}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-amber-500/30 px-4 pt-3 pb-5 space-y-2 shadow-2xl">
          <button
            onClick={() => handleNavClick('citizen')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              currentTab === 'citizen'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>{t.navCitizen}</span>
          </button>

          <button
            onClick={() => handleNavClick('triage')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
              currentTab === 'triage'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-amber-400" />
              <span>{t.navTriage}</span>
            </div>
            {p1Count > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {p1Count} P1
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('gis')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              currentTab === 'gis'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>{t.navGis}</span>
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              currentTab === 'about'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Info className="w-5 h-5 text-amber-400" />
            <span>{t.navAbout}</span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={onClearData}
              className="text-xs text-red-400 flex items-center space-x-1.5 py-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.clearData}</span>
            </button>
            <span className="text-[11px] text-slate-400 font-mono">APSEB Vizag v1.0</span>
          </div>
        </div>
      )}
    </header>
  );
};
