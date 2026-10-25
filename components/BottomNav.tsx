"use client";

import React from "react";
import { Search, HeartPulse, ShieldAlert, FileCode2, TerminalSquare } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: "research", label: "Research", icon: Search },
    { id: "clinical", label: "Clinical", icon: HeartPulse },
    { id: "auditor", label: "Auditor", icon: ShieldAlert },
    { id: "verifier", label: "4-Gate", icon: FileCode2 },
    { id: "mcp", label: "MCP", icon: TerminalSquare },
  ];

  return (
    <nav
      id="mobile-bottom-bar"
      data-testid="mobile-bottom-bar"
      className="md:hidden fixed bottom-0 inset-x-0 bg-[#0d1424]/95 backdrop-blur-lg border-t border-slate-800 z-40 px-2 py-1 flex items-center justify-around"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`bottom-nav-${tab.id}`}
            data-testid={`bottom-nav-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition min-h-[44px] min-w-[56px] ${
              isActive ? "text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
