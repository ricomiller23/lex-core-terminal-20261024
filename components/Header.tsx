"use client";

import React from "react";
import { Scale, ExternalLink, Menu, X, Shield, Cpu } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  casesCount: number;
  mattersCount: number;
}

export function Header({
  activeTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  casesCount,
  mattersCount,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-[#0a0f1d]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 sticky top-0 z-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          id="mobile-hamburger-btn"
          data-testid="mobile-hamburger-btn"
          aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 min-h-[44px] min-w-[44px] flex items-center justify-center transition border border-slate-700/60"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                LEX<span className="text-cyan-400">CORE</span>
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hidden sm:inline-block">
                DeepSeek V4.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Unified Legal Intelligence & Case Law Research Engine
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">Cases Sourced:</span>
          <span className="font-mono font-semibold text-emerald-400">{casesCount}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Active Matters:</span>
          <span className="font-mono font-semibold text-cyan-400">{mattersCount}</span>
        </div>

        <a
          id="btn-github-link"
          data-testid="btn-github-link"
          href="https://github.com/ricomiller23"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 text-xs rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5 border border-slate-700/80 min-h-[44px]"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">GitHub</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
}
