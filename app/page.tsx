'use client';

import React, { useState } from 'react';
import authoritativeCases from '../data/authoritative_cases.json';
import clinicalMatters from '../data/clinical_matters.json';
import contractClauses from '../data/contract_clauses.json';

import { Header } from '../components/Header';
import { MobileDrawer } from '../components/MobileDrawer';
import { BottomNav } from '../components/BottomNav';
import { CaseDetailModal } from '../components/CaseDetailModal';
import { CaseResearchStudio } from '../components/CaseResearchStudio';
import { ClinicalDemandStudio } from '../components/ClinicalDemandStudio';
import { AuditorRadar } from '../components/AuditorRadar';
import { HarveyVerifier } from '../components/HarveyVerifier';
import JudicexMcpWorkbench from '../components/JudicexMcpWorkbench';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'research' | 'clinical' | 'auditor' | 'verifier' | 'mcp'>('research');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<any | null>(null);

  const casesCount = authoritativeCases.length;
  const mattersCount = clinicalMatters.length;
  const clausesCount = contractClauses.length;

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
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
        {/* Dynamic Studio Switcher */}
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
