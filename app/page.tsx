'use client';

import React, { useState, useEffect } from 'react';
import authoritativeCases from '../data/authoritative_cases.json';
import clinicalMatters from '../data/clinical_matters.json';
import contractClauses from '../data/contract_clauses.json';

import { Header } from '../components/Header';
import { MobileDrawer } from '../components/MobileDrawer';
import { BottomNav } from '../components/BottomNav';
import { CaseDetailModal } from '../components/CaseDetailModal';
import { AutonomousCaseBuilder } from '../components/AutonomousCaseBuilder';
import { GrnhConcurrentBridge } from '../components/GrnhConcurrentBridge';
import { CaseResearchStudio } from '../components/CaseResearchStudio';
import { ClinicalDemandStudio } from '../components/ClinicalDemandStudio';
import { AuditorRadar } from '../components/AuditorRadar';
import { HarveyVerifier } from '../components/HarveyVerifier';
import JudicexMcpWorkbench from '../components/JudicexMcpWorkbench';

import { Sparkles, Activity, Search, HeartPulse, ShieldAlert, FileCode2, TerminalSquare } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'builder' | 'grnh' | 'research' | 'clinical' | 'auditor' | 'verifier' | 'mcp'>('builder');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<any | null>(null);
  const [isCompanionMode, setIsCompanionMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('companion') === '1' || params.get('tab') === 'grnh') {
        setActiveTab('grnh');
        setIsCompanionMode(true);
      }

      try {
        const channel = new BroadcastChannel('grnh_lexcore_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'ANALYZE_TARGET') {
            setActiveTab('grnh');
          }
        };
        return () => channel.close();
      } catch {
        // Ignored
      }
    }
  }, []);

  const casesCount = authoritativeCases.length;
  const mattersCount = clinicalMatters.length;

  const studios = [
    { id: 'builder', label: 'Case Builder & Ingest', icon: Sparkles, badge: 'Downloads & AI' },
    { id: 'grnh', label: 'GRNH Forensics Bridge', icon: Activity, badge: 'Concurrent' },
    { id: 'research', label: 'Case Law Research', icon: Search, badge: 'CourtListener' },
    { id: 'clinical', label: 'Clinical & Demands', icon: HeartPulse, badge: 'EveOS Atlas' },
    { id: 'auditor', label: 'Nightly Diligence', icon: ShieldAlert, badge: 'Gap Radar' },
    { id: 'verifier', label: '4-Gate Verifier', icon: FileCode2, badge: 'Redlines' },
    { id: 'mcp', label: 'MCP Workbench', icon: TerminalSquare, badge: 'Fail-Closed' },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Companion Mode Quick Bar */}
      {isCompanionMode && (
        <div className="bg-gradient-to-r from-cyan-950/90 to-slate-950/90 border-b border-cyan-500/40 px-4 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LEXCORE AI DATA & LAW ANALYZER &bull; CONCURRENT COMPANION MODE</span>
          </div>
          <a
            href="https://grnh-forensics.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white underline flex items-center gap-1"
          >
            Connected to grnh-forensics.vercel.app ↗
          </a>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        casesCount={casesCount}
        mattersCount={mattersCount}
      />

      {/* Slide-over drawer for mobile/tablet */}
      <MobileDrawer
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
        {/* Desktop Studio Switcher Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md overflow-x-auto">
          {studios.map((s) => {
            const Icon = s.icon;
            const isActive = activeTab === s.id;
            return (
              <button
                key={s.id}
                id={`desktop-tab-${s.id}`}
                onClick={() => setActiveTab(s.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap min-h-[44px] ${
                  isActive
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{s.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50' : 'bg-slate-800/80 text-slate-500'
                }`}>
                  {s.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Studio Views */}
        {activeTab === 'builder' && (
          <section id="studio-case-builder" aria-label="Autonomous Case Builder">
            <AutonomousCaseBuilder
              onSelectCase={(caseItem) => setSelectedCaseForModal(caseItem)}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
            />
          </section>
        )}

        {activeTab === 'grnh' && (
          <section id="studio-grnh-bridge" aria-label="GRNH Forensics Concurrent Bridge">
            <GrnhConcurrentBridge
              onSelectCase={(caseItem) => setSelectedCaseForModal(caseItem)}
            />
          </section>
        )}

        {activeTab === 'research' && (
          <section id="studio-case-research" aria-label="Case Research Studio">
            <CaseResearchStudio
              cases={authoritativeCases}
              onSelectCase={(caseItem) => setSelectedCaseForModal(caseItem)}
            />
          </section>
        )}

        {activeTab === 'clinical' && (
          <section id="studio-clinical-demands" aria-label="Clinical Demand Studio">
            <ClinicalDemandStudio matters={clinicalMatters} />
          </section>
        )}

        {activeTab === 'auditor' && (
          <section id="studio-nightly-auditor" aria-label="Nightly Diligence Studio">
            <AuditorRadar matters={clinicalMatters} />
          </section>
        )}

        {activeTab === 'verifier' && (
          <section id="studio-harvey-verifier" aria-label="Contract Verification Studio">
            <HarveyVerifier clauses={contractClauses} />
          </section>
        )}

        {activeTab === 'mcp' && (
          <section id="studio-judicex-mcp" aria-label="Judicex MCP Studio">
            <JudicexMcpWorkbench />
          </section>
        )}
      </main>

      {/* Full Case Detail Modal */}
      <CaseDetailModal
        selectedCase={selectedCaseForModal}
        onClose={() => setSelectedCaseForModal(null)}
      />

      {/* Sticky Mobile Bottom Navigation (Phone Viewport) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
      />
    </div>
  );
}
