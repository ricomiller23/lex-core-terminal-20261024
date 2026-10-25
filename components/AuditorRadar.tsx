"use client";

import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, Clock, RefreshCw, Loader2, ArrowRight } from "lucide-react";

interface AuditorRadarProps {
  matters: any[];
}

export function AuditorRadar({ matters }: AuditorRadarProps) {
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [auditResults, setAuditResults] = useState<any[] | null>(null);

  const handleRunAudit = async () => {
    setIsRunningAudit(true);
    try {
      const res = await fetch("/api/auditor-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const data = await res.json();
        setAuditResults(data.findings || []);
      }
    } catch (err) {
      console.error("Audit failed:", err);
    } finally {
      setIsRunningAudit(false);
    }
  };

  const displayList = auditResults || matters.map((m) => {
    const solTime = new Date(m.statute_of_limitations_date).getTime();
    const days = Math.max(0, Math.ceil((solTime - Date.now()) / (1000 * 60 * 60 * 24)));
    return {
      matter_id: m.id,
      case_title: m.case_title,
      matter_number: m.matter_number,
      days_to_sol: days,
      sol_status: days < 90 ? "CRITICAL (UNDER 90 DAYS)" : days < 180 ? "HIGH ATTENTION" : "STABLE DOCKET",
      gaps_detected: m.treatment_gaps.length,
      treatment_gaps: m.treatment_gaps,
      demand: m.demand_recommendation,
    };
  });

  return (
    <div className="space-y-6">
      {/* Radar Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#1a1528] to-slate-900 border border-amber-500/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> EveOS Nightly Diligence & Auditor Daemon
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Statute of Limitations & Treatment Gap Radar
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-1">
              Performs autonomous pathway-conditioned survival analysis across active matter timelines. Identifies treatment lapses, pre-explains gaps with documentary evidence, and enforces strict SOL deadlines.
            </p>
          </div>

          <button
            id="btn-run-nightly-sweep"
            data-testid="btn-run-nightly-sweep"
            onClick={handleRunAudit}
            disabled={isRunningAudit}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 min-h-[44px] disabled:opacity-50 self-start sm:self-auto"
          >
            {isRunningAudit ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            <span>{isRunningAudit ? "Executing Sweep..." : "Run Nightly Audit Sweep"}</span>
          </button>
        </div>
      </div>

      {/* Matter Findings Cards */}
      <div className="space-y-4">
        {displayList.map((item) => (
          <div
            key={item.matter_id}
            id={`card-audit-${item.matter_id}`}
            data-testid={`card-audit-${item.matter_id}`}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{item.matter_number}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{item.case_title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{item.days_to_sol} Days to SOL</span>
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    item.days_to_sol < 90
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  }`}
                >
                  {item.sol_status}
                </span>
              </div>
            </div>

            {/* Treatment Gap Analysis */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pathway-Conditioned Treatment Gap Analysis:
              </h4>

              {item.treatment_gaps && item.treatment_gaps.length > 0 ? (
                item.treatment_gaps.map((gap: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/30 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Lapse Detected: {gap.days} Days ({gap.start_date} to {gap.end_date})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px]">
                        STATUS: PRE-EXPLAINED DEFENSE ASSET
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed font-sans">
                      <strong className="text-slate-200">Documentary Explanation:</strong> {gap.evidence_explanation}
                    </p>

                    <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row justify-between text-[11px] text-slate-400 gap-1">
                      <span>Source: <strong className="text-slate-300">{gap.pre_explanation_source}</strong></span>
                      <span className="text-cyan-400">Strategy: {gap.mitigation_strategy}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>No unmitigated treatment gaps detected across active treatment timeline. Continuous care established.</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
