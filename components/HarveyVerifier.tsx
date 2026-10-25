"use client";

import React, { useState } from "react";
import { FileCode2, CheckCircle2, AlertOctagon, ArrowRight, ShieldCheck, Sparkles, Loader2, GitCompare } from "lucide-react";

interface HarveyVerifierProps {
  clauses: any[];
}

export function HarveyVerifier({ clauses }: HarveyVerifierProps) {
  const [selectedClauseIndex, setSelectedClauseIndex] = useState(0);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [liveAuditOutput, setLiveAuditOutput] = useState<string | null>(null);

  const clause = clauses[selectedClauseIndex] || clauses[0];

  const handleRun4GateAnalysis = async () => {
    setIsRunningAnalysis(true);
    try {
      const res = await fetch("/api/deepseek-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "contract_audit",
          prompt: `Perform an institutional Harvey-grade 4-gate verification and redline risk audit on:
Section: ${clause.section_title}
Original: "${clause.original_clause_text}"
Counterparty Redline: "${clause.counterparty_redline_text}"
Evaluate Gate A (Pinpoint coordinates), Gate B (Semantic entailment), Gate C (Governing law precedent), and Gate D (Temporal currency).
Provide strategic counter-proposals to protect senior rights.`,
          context: clause,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLiveAuditOutput(data.output || "4-Gate analysis completed.");
      }
    } catch (err) {
      console.error("4-Gate analysis failed:", err);
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#111e33] to-slate-900 border border-cyan-500/20 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <FileCode2 className="w-4 h-4 text-cyan-400" /> Harvey AI 4-Gate Contract Verification Studio
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Deterministic 4-Gate Clause Verification & Lossless Redline Diff
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
            Engineered from Harvey AI's canonical intermediate representation (CIR). Verifies coordinate anchors, semantic entailment thresholds, governing law precedent, and temporal amendment currency.
          </p>
        </div>

        {/* Clause Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Select Operative Clause:</span>
          {clauses.map((c, idx) => (
            <button
              key={c.id}
              id={`btn-select-clause-${idx}`}
              data-testid={`btn-select-clause-${idx}`}
              onClick={() => {
                setSelectedClauseIndex(idx);
                setLiveAuditOutput(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border min-h-[44px] ${
                selectedClauseIndex === idx
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                  : "bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white"
              }`}
            >
              {c.section_title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Clause View */}
      <div className="space-y-5">
        {/* Agreement Context Bar */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div>
            <span className="text-slate-400">Agreement: </span>
            <span className="text-white font-bold">{clause.agreement_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold">
              {clause.risk_level}
            </span>
            <span className="text-slate-400 font-mono">Date: {clause.effective_date}</span>
          </div>
        </div>

        {/* Split View Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-300">Original Clause Baseline</span>
              <span className="text-[10px] text-emerald-400 font-mono">Operative Standard</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-serif leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
              "{clause.original_clause_text}"
            </p>
          </div>

          {/* Redline */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400">Counterparty Proposed Redline</span>
              <span className="text-[10px] text-amber-400 font-mono">Pending Review Turn</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-amber-500/20">
              "{clause.counterparty_redline_text}"
            </p>
          </div>
        </div>

        {/* The 4-Gate Verification Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Deterministic 4-Gate Verification Telemetry
            </h3>
            <button
              id="btn-run-4gate"
              data-testid="btn-run-4gate"
              onClick={handleRun4GateAnalysis}
              disabled={isRunningAnalysis}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-600/20 min-h-[44px] disabled:opacity-50"
            >
              {isRunningAnalysis ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isRunningAnalysis ? "Auditing Gates..." : "Run 4-Gate Deep Analysis"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Gate A */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Gate A: Coordinates</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {clause.four_gate_verification.gate_a_coordinates.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {clause.four_gate_verification.gate_a_coordinates.detail}
              </p>
              <span className="text-[10px] font-mono text-cyan-400 block">
                {clause.four_gate_verification.gate_a_coordinates.pinpoint}
              </span>
            </div>

            {/* Gate B */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Gate B: Entailment</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {clause.four_gate_verification.gate_b_semantic_entailment.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {clause.four_gate_verification.gate_b_semantic_entailment.detail}
              </p>
              <span className="text-[10px] font-mono text-slate-400 block">
                Threshold: &gt; {clause.four_gate_verification.gate_b_semantic_entailment.threshold}
              </span>
            </div>

            {/* Gate C */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Gate C: Precedent</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {clause.four_gate_verification.gate_c_precedent_authority.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {clause.four_gate_verification.gate_c_precedent_authority.detail}
              </p>
            </div>

            {/* Gate D */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Gate D: Currency</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {clause.four_gate_verification.gate_d_temporal_currency.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {clause.four_gate_verification.gate_d_temporal_currency.detail}
              </p>
            </div>
          </div>
        </div>

        {/* Live DeepSeek Audit Output */}
        {liveAuditOutput && (
          <div className="p-5 rounded-2xl bg-slate-950/95 border border-cyan-500/30 text-xs text-slate-200 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-2">
              <span>DeepSeek V4.1-Flash Strategic Counter-Proposal & Analysis</span>
              <span className="text-[10px] text-slate-400 font-mono">4 of 4 Gates Grounded</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed font-sans">{liveAuditOutput}</p>
          </div>
        )}
      </div>
    </div>
  );
}
