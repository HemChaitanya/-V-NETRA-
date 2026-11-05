import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { StatsStrip } from './components/StatsStrip.tsx';
import { CitizenReportPortal } from './components/CitizenReportPortal.tsx';
import { AiTriageEngine } from './components/AiTriageEngine.tsx';
import { SectionEngineerGisDashboard } from './components/SectionEngineerGisDashboard.tsx';
import { AboutScreen } from './components/AboutScreen.tsx';
import { PWAInstallBanner } from './components/PWAInstallBanner.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { INITIAL_SAMPLE_TICKETS } from './data/initialTickets.ts';
import { HazardTicket, Language, TicketStatus } from './types.ts';

const STORAGE_KEY_TICKETS = 'v_netra_hazard_tickets_v1';
const STORAGE_KEY_LANG = 'v_netra_selected_language_v1';

export default function App() {
  // Load initial tickets from localStorage or pre-load the 10 required sample records
  const [tickets, setTickets] = useState<HazardTicket[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TICKETS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored tickets, resetting to initial sample:', e);
    }
    return INITIAL_SAMPLE_TICKETS;
  });

  // Language state (en / te)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LANG);
      if (stored === 'en' || stored === 'te') return stored;
    } catch (e) {
      // fallback
    }
    return 'en';
  });

  // Current Screen / Tab
  const [currentTab, setCurrentTab] = useState<'citizen' | 'triage' | 'gis' | 'about'>('citizen');
  const [gisSelectedTicketId, setGisSelectedTicketId] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.warn('Could not save tickets to localStorage', e);
    }
  }, [tickets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  }, [lang]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add new ticket from Citizen Portal
  const handleTicketCreated = (newTicket: HazardTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Report ${newTicket.id} registered: ${newTicket.priority} detected!`);
  };

  // Update Ticket Status
  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    showToast(`Ticket #${ticketId} status updated to ${newStatus}`);
  };

  // Clear data and restore sample records
  const handleClearData = () => {
    const confirmClear = window.confirm(
      'Reset all data back to APSEB initial sample records?'
    );
    if (confirmClear) {
      setTickets(INITIAL_SAMPLE_TICKETS);
      localStorage.removeItem(STORAGE_KEY_TICKETS);
      showToast('All custom data cleared. Reset to 10 initial sample records.');
    }
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const p1Count = tickets.filter((t) => t.priority === 'P1 Critical').length;
  const duplicateMergedTotal = tickets.reduce(
    (acc, t) => acc + (t.spatialClustering?.mergedTicketCount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-400 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs sm:text-sm font-mono flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onToggleLang={handleToggleLang}
        onClearData={handleClearData}
        p1Count={p1Count}
      />

      {/* Emergency PWA Pre-Caching & Installation Banner */}
      <PWAInstallBanner />

      {/* Offline Mode Indicator */}
      <OfflineIndicator />

      {/* KPI Stats Strip */}
      <StatsStrip
        lang={lang}
        p1Count={p1Count}
        totalTickets={tickets.length}
        duplicatesMerged={duplicateMergedTotal}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'citizen' && (
          <CitizenReportPortal
            lang={lang}
            onTicketCreated={handleTicketCreated}
            onNavigateToGis={() => setCurrentTab('gis')}
            existingTickets={tickets}
          />
        )}

        {currentTab === 'triage' && (
          <AiTriageEngine
            tickets={tickets}
            lang={lang}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onNavigateToCitizen={() => setCurrentTab('citizen')}
            onNavigateToGis={(ticketId) => {
              setGisSelectedTicketId(ticketId);
              setCurrentTab('gis');
            }}
          />
        )}

        {currentTab === 'gis' && (
          <SectionEngineerGisDashboard
            tickets={tickets}
            selectedTicketId={gisSelectedTicketId}
            lang={lang}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onNavigateToCitizen={() => setCurrentTab('citizen')}
          />
        )}

        {currentTab === 'about' && (
          <AboutScreen
            lang={lang}
            onNavigateToCitizen={() => setCurrentTab('citizen')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500 font-mono space-y-2">
        <p>
          V-Netra Utility Emergency Platform • APSEB / APEPDCL Visakhapatnam Operational Sector
        </p>
        <p className="text-[11px] text-slate-400">
          Developed by Team VOID404.exe • B2G Substation SaaS Model • ₹5,000 / substation / mo
        </p>
      </footer>
    </div>
  );
}
