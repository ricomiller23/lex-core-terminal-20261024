"use client";

import React, { useState } from "react";
import { HeartPulse, FileText, DollarSign, Calendar, Copy, Check, Download, AlertTriangle, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

interface ClinicalDemandStudioProps {
  matters: any[];
}

export function ClinicalDemandStudio({ matters }: ClinicalDemandStudioProps) {
  const [selectedMatterIndex, setSelectedMatterIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDemand, setGeneratedDemand] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const matter = matters[selectedMatterIndex] || matters[0];

  const handleGenerateDemand = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/deepseek-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: "demand_generate",
          prompt: `Draft a formal, adjuster-grade time-limited policy-limit demand letter on behalf of Claimant for ${matter.case_title}.
Rigorously ground the liability narrative in ${matter.liability_profile}.
Incorporate the full clinical timeline, ICD-10 codes, and CPT procedures.
Itemize economic damages: Billed ${matter.economic_damages_summary.total_billed_medical}, Allowed ${matter.economic_damages_summary.total_allowed_or_paid}, and Liens ${matter.economic_damages_summary.asserted_hospital_lien}.
Trigger the ${matter.demand_recommendation.demand_type} under ${matter.demand_recommendation.statutory_authority}.
Set strict response deadline of ${matter.demand_recommendation.response_deadline_days} days.`,
          context: matter,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedDemand(data.output || "Demand package generated.");
      }
    } catch (err) {
      console.error("Demand generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedDemand) {
      navigator.clipboard.writeText(generatedDemand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!generatedDemand) return;
    const blob = new Blob([generatedDemand], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DEMAND_PACKAGE_${matter.matter_number}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-900 border border-emerald-500/20 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-emerald-400" /> Atlas Clinical & Demand Package Studio
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Clinical Ingestion, Medical Coding & Policy-Limit Demands
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
            Reverse-engineered from EveOS. Automatically parses medical encounter streams, normalizes ICD-10 diagnoses and CPT procedures, models Medicare allowables, and compiles bad-faith policy-limit tenders.
          </p>
        </div>

        {/* Matter Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Select Active Matter:</span>
          {matters.map((m, idx) => (
            <button
              key={m.id}
              id={`btn-select-matter-${idx}`}
              data-testid={`btn-select-matter-${idx}`}
              onClick={() => {
                setSelectedMatterIndex(idx);
                setGeneratedDemand(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border min-h-[44px] ${
                selectedMatterIndex === idx
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                  : "bg-slate-900/80 border-slate-700/80 text-slate-400 hover:text-white"
              }`}
            >
              {m.case_title.split("—")[0].trim()} ({m.matter_number})
            </button>
          ))}
        </div>
      </div>

      {/* Active Matter Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Liability & Damages */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Claim Profile & Venue
            </h3>
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-400 block">Case Number:</span>
                <span className="text-white font-mono font-semibold">{matter.matter_number}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Venue & Court:</span>
                <span className="text-slate-200">{matter.venue}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Liability Facts:</span>
                <p className="text-slate-300 mt-1 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 font-sans">
                  {matter.liability_profile}
                </p>
              </div>
            </div>
          </div>

          {/* Economic Damages Ledger */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-cyan-400" /> Economic Damages Ledger
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Total Billed Medical:</span>
                <span className="text-white font-bold font-mono">{matter.economic_damages_summary.total_billed_medical}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Total Allowed / Paid:</span>
                <span className="text-emerald-400 font-semibold font-mono">{matter.economic_damages_summary.total_allowed_or_paid}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Medicare RBRVS Allowable:</span>
                <span className="text-cyan-400 font-mono">{matter.economic_damages_summary.total_medicare_allowable}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Asserted Statutory Lien:</span>
                <span className="text-amber-400 font-mono">{matter.economic_damages_summary.asserted_hospital_lien}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Lost Earnings:</span>
                <span className="text-slate-200 font-mono">{matter.economic_damages_summary.lost_wages_asserted}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Clinical Timeline & Demand Generator */}
        <div className="lg:col-span-2 space-y-5">
          {/* Clinical Spine Timeline */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" /> Atlas Clinical Spine Timeline
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {matter.clinical_timeline.length} Encounters Structured
              </span>
            </div>

            <div className="space-y-3">
              {matter.clinical_timeline.map((enc: any) => (
                <div
                  key={enc.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-semibold">
                        {enc.encounter_type}
                      </span>
                      <span className="text-slate-300 font-bold">{enc.provider}</span>
                    </div>
                    <span className="text-slate-400 font-mono">{enc.date}</span>
                  </div>

                  <p className="text-slate-300">{enc.notes}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                    <div>
                      <span className="text-slate-400 font-medium block">Diagnoses (ICD-10):</span>
                      <div className="space-y-1 mt-1">
                        {enc.diagnoses.map((d: any, i: number) => (
                          <div key={i} className="text-emerald-400 font-mono text-[11px]">
                            • <strong className="text-white">{d.code}</strong> — {d.desc}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium block">Procedures (CPT / RVU):</span>
                      <div className="space-y-1 mt-1">
                        {enc.procedures.map((p: any, i: number) => (
                          <div key={i} className="text-cyan-400 font-mono text-[11px]">
                            • <strong className="text-white">{p.code}</strong> — {p.desc} (${p.billed.toLocaleString()})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy-Limit Demand Trigger */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1b2a] to-slate-900 border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {matter.demand_recommendation.demand_type}
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  Target Policy Limit Tender: {matter.demand_recommendation.policy_limit_target}
                </h4>
              </div>
              <button
                id="btn-generate-demand"
                data-testid="btn-generate-demand"
                onClick={handleGenerateDemand}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/25 min-h-[44px] disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGenerating ? "Synthesizing Tender..." : "Generate Demand Package"}</span>
              </button>
            </div>

            {/* Generated Demand Output */}
            {generatedDemand && (
              <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" /> Demand Package Compiled via DeepSeek V4.1-Flash
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-copy-demand"
                      data-testid="btn-copy-demand"
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 border border-slate-700 min-h-[44px]"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Demand"}</span>
                    </button>
                    <button
                      id="btn-download-demand"
                      data-testid="btn-download-demand"
                      onClick={handleDownload}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Markdown</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/95 border border-slate-800 font-serif text-xs text-slate-200 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-line">
                  {generatedDemand}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
