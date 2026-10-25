"use client";

import React from "react";
import { Search, HeartPulse, ShieldAlert, FileCode2, TerminalSquare, X } from "lucide-react";

interface MobileDrawerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ activeTab, setActiveTab, isOpen, onClose }: MobileDrawerProps) {
  if (!isOpen) return null;

  const navItems = [
    { id: "research", label: "Deep Case Law Studio", icon: Search, badge: "CourtListener" },
    { id: "clinical", label: "Atlas Clinical & Demands", icon: HeartPulse, badge: "EveOS Engine" },
    { id: "auditor", label: "Nightly Auditor & Gaps", icon: ShieldAlert, badge: "Diligence" },
    { id: "verifier", label: "Harvey 4-Gate Verifier", icon: FileCode2, badge: "Redlines" },
    { id: "mcp", label: "Judicex MCP Workbench", icon: TerminalSquare, badge: "Fail-Closed" },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        id="mobile-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#0d1424] border-r border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Navigation</h2>
              <p className="text-xs text-slate-400">Select operational studio</p>
            </div>
            <button
              id="btn-close-drawer"
              data-testid="btn-close-drawer"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5 text-amber-400" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`drawer-nav-${item.id}`}
                  data-testid={`drawer-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition min-h-[44px] ${
                    isActive
                      ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                      : "text-slate-300 hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-4 text-xs text-slate-500">
          <p>LEX-CORE Unified Engine v1.0</p>
          <p className="text-[11px] text-slate-400 mt-1">Grounding: CourtListener + DeepSeek</p>
        </div>
      </div>
    </div>
  );
}
