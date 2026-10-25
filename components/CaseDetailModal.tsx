"use client";

import React, { useState } from "react";
import { X, ExternalLink, Copy, Check, Scale, Bookmark, Clock } from "lucide-react";

interface CaseDetailModalProps {
  selectedCase: any | null;
  onClose: () => void;
}

export function CaseDetailModal({ selectedCase, onClose }: CaseDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!selectedCase) return null;

  const handleCopyCitation = () => {
    if (selectedCase.citation) {
      navigator.clipboard.writeText(`${selectedCase.case_name}, ${selectedCase.citation}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        id="case-modal-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#0d1424] border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                {selectedCase.precedent_status || "AUTHORITATIVE DOCKET"}
              </span>
              <span className="text-xs text-slate-400">
                {selectedCase.court || "Federal / State Appellate"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {selectedCase.case_name}
            </h2>
            <p className="text-sm font-mono text-cyan-400">{selectedCase.citation}</p>
          </div>

          <button
            id="btn-close-case-modal"
            data-testid="btn-close-case-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 min-h-[44px] min-w-[44px] flex items-center justify-center transition border border-slate-700/60"
          >
            <X className="w-5 h-5 text-amber-400" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Jurisdiction</span>
            <span className="text-slate-200 font-semibold">{selectedCase.jurisdiction || "Federal"}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Date Decided</span>
            <span className="text-slate-200 font-mono">{selectedCase.date_decided || "Recorded"}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Author / Judge</span>
            <span className="text-slate-200">{selectedCase.author_judge || "Per Curiam"}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Docket / Index</span>
            <span className="text-slate-200 font-mono">{selectedCase.docket_number || "Civil Action"}</span>
          </div>
        </div>

        {/* Core Holding */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-cyan-400" /> Core Legal Holding
          </h3>
          <p className="text-sm text-slate-200 bg-slate-900/90 p-4 rounded-xl border border-slate-800 leading-relaxed font-serif">
            "{selectedCase.key_holding}"
          </p>
        </div>

        {/* Substantive Analysis */}
        {selectedCase.substantive_analysis && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Substantive Doctrine & Context
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedCase.substantive_analysis}
            </p>
          </div>
        )}

        {/* Citable Spans & Pinpoint Coordinates */}
        {selectedCase.citable_spans && selectedCase.citable_spans.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" /> Grounded Pinpoint Citations
            </h3>
            <div className="space-y-2">
              {selectedCase.citable_spans.map((span: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-emerald-400 font-mono font-medium">
                    <span>Pinpoint: {span.pinpoint}</span>
                    <span className="text-slate-500 text-[10px]">ID: {span.span_id}</span>
                  </div>
                  <p className="text-slate-300 font-serif italic">"{span.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source Receipt and Actions */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Retrieved: {selectedCase.retrieved_at ? new Date(selectedCase.retrieved_at).toLocaleString() : "Live"}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              id="btn-copy-citation"
              data-testid="btn-copy-citation"
              onClick={handleCopyCitation}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-2 border border-slate-700 min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Citation Copied" : "Copy Bluebook Citation"}</span>
            </button>

            {selectedCase.source_url && (
              <a
                id="btn-external-courtlistener"
                data-testid="btn-external-courtlistener"
                href={selectedCase.source_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 min-h-[44px]"
              >
                <span>CourtListener Docket</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
