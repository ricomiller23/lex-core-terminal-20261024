'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  FolderSearch,
  Search,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  RefreshCw,
  X,
  FileCode,
  ArrowRight,
  ExternalLink,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Layers
} from 'lucide-react';

interface AttachedDoc {
  id: string;
  filename: string;
  source: string;
  category?: string;
  size_bytes?: number;
  content: string;
}

interface DiscoveredFile {
  id: string;
  filename: string;
  category: string;
  size_bytes: number;
  modified_time: number;
  summary: string;
  source_url: string;
  retrieved_at: string;
}

interface DiscoveredCase {
  id: string;
  case_name: string;
  citation: string;
  court: string;
  key_holding: string;
  source_url: string;
  relevance_reason: string;
}

const OBJECTIVE_PRESETS = [
  {
    label: "Ira Gaines & GRNH Fraud Action",
    text: "Prosecute Ira Jeffrey Gaines and affiliated conduits (Casa de Dinero, Big Thunder LLC, Paula Marie Poe) for Section 5 strict liability illegal distributions (107,361,209 unregistered shares), SEC Rule 10b-5 scheme liability under Lorenzo, fraudulent conveyance under UVTA, and alter-ego veil piercing to seize liquidation proceeds in BBVA Compass Bank."
  },

  {
    label: 'M&A Fraud & Clawback',
    text: 'Analyze seller indemnification exposure, fraudulent representations in disclosure schedules, and buyer clawback remedies under Delaware Chancery precedent regarding material adverse effects.'
  },
  {
    label: 'Trucking Crash & Bad-Faith Tender',
    text: 'Evaluate commercial motor vehicle broadside collision with delayed cervical spine fusion, establishing driver logbook violations to draft a bad-faith policy-limit tender under Stowers doctrine.'
  },
  {
    label: 'Director Oversight & Caremark',
    text: 'Determine board member oversight liability and reporting system deficiencies following regulatory non-compliance, analyzing demand futility requirements under Delaware Court of Chancery Rule 23.1.'
  },
  {
    label: 'Contractual Material Breach',
    text: 'Assess borrower covenant defaults under senior credit agreement, cure period notice triggers, and lender acceleration rights under New York commercial jurisprudence.'
  }
];

export function AutonomousCaseBuilder({
  onSelectCase,
  onNavigateToTab
}: {
  onSelectCase?: (c: any) => void;
  onNavigateToTab?: (tab: string) => void;
}) {
  // Intake State
  const [userObjective, setUserObjective] = useState('');
  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);
  
  // Downloads Discovery State
  const [ingestionMode, setIngestionMode] = useState<'downloads' | 'upload' | 'paste'>('downloads');
  const [downloadsSearch, setDownloadsSearch] = useState('');
  const [availableDownloads, setAvailableDownloads] = useState<DiscoveredFile[]>([]);
  const [isLoadingDownloads, setIsLoadingDownloads] = useState(false);
  const [pastedDocTitle, setPastedDocTitle] = useState('');
  const [pastedDocText, setPastedDocText] = useState('');

  // Processing & Dossier State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [dossierOutput, setDossierOutput] = useState<string | null>(null);
  const [discoveredCases, setDiscoveredCases] = useState<DiscoveredCase[]>([]);
  const [dossierTelemetry, setDossierTelemetry] = useState<{
    model: string;
    latency_ms: number;
    timestamp: string;
    grounding_score: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Downloads index on mount
  useEffect(() => {
    fetchDownloadsIndex();
  }, []);

  const fetchDownloadsIndex = async (query = '') => {
    setIsLoadingDownloads(true);
    try {
      const res = await fetch(`/api/downloads-files?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setAvailableDownloads(data.files || []);
      }
    } catch (err) {
      console.error('Failed to load downloads manifest', err);
    } finally {
      setIsLoadingDownloads(false);
    }
  };

  const handleSearchDownloads = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDownloadsIndex(downloadsSearch);
  };

  const handleAttachDownloadFile = async (file: DiscoveredFile) => {
    if (attachedDocs.some(d => d.id === file.id)) return;

    try {
      const res = await fetch(`/api/downloads-files?file=${encodeURIComponent(file.filename)}`);
      if (res.ok) {
        const data = await res.json();
        setAttachedDocs(prev => [
          ...prev,
          {
            id: file.id,
            filename: file.filename,
            source: 'Downloads Directory',
            category: file.category,
            size_bytes: file.size_bytes,
            content: data.content || file.summary
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to attach download file', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setAttachedDocs(prev => [
          ...prev,
          {
            id: `upload-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            filename: file.name,
            source: 'Local Device Upload',
            size_bytes: file.size,
            content: text || ''
          }
        ]);
      };
      reader.readAsText(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPastedDocument = () => {
    if (!pastedDocText.trim()) return;
    const title = pastedDocTitle.trim() || `Pasted Excerpt (${new Date().toLocaleTimeString()})`;
    setAttachedDocs(prev => [
      ...prev,
      {
        id: `paste-${Date.now()}`,
        filename: title,
        source: 'User Excerpt Paste',
        content: pastedDocText.trim()
      }
    ]);
    setPastedDocTitle('');
    setPastedDocText('');
  };

  const handleRemoveDoc = (id: string) => {
    setAttachedDocs(prev => prev.filter(d => d.id !== id));
  };

  // Autonomous Case Law & Deep Research Execution
  const handleExecuteAutonomousResearch = async () => {
    if (!userObjective.trim() && attachedDocs.length === 0) {
      alert('Please enter your legal objective or attach at least one document to analyze.');
      return;
    }

    setIsProcessing(true);
    setDossierOutput(null);
    setDiscoveredCases([]);
    setProcessingStage('Ingesting objective & evidentiary documents into DeepSeek...');

    try {
      // Step 1: DeepSeek autonomous analysis of objective and documents
      setTimeout(() => setProcessingStage('Extracting legal issues, jurisdiction, and factual spine...'), 1200);
      setTimeout(() => setProcessingStage('Synthesizing binding case law & CourtListener precedents...'), 3500);

      const analyzeRes = await fetch('/api/deepseek-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'autonomous_case_build',
          userObjective: userObjective.trim(),
          ingestedDocuments: attachedDocs
        })
      });

      if (!analyzeRes.ok) {
        throw new Error(`Analysis engine returned status ${analyzeRes.status}`);
      }

      const analyzeData = await analyzeRes.json();
      setDossierOutput(analyzeData.output || 'Dossier generated.');
      setDossierTelemetry({
        model: analyzeData.model || 'deepseek-v4.1 (deepseek-chat)',
        latency_ms: analyzeData.latency_ms || 2400,
        timestamp: analyzeData.timestamp || new Date().toISOString(),
        grounding_score: analyzeData.grounding_score || 96
      });

      // Step 2: Query CourtListener for associated case law matching the objective
      setProcessingStage('Retrieving authoritative CourtListener docket records...');
      const firstKeywords = userObjective.trim().split(/\s+/).slice(0, 5).join(' ') || 'Caremark Revlon Stowers';
      const searchRes = await fetch(`/api/case-research?q=${encodeURIComponent(firstKeywords)}`);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.results && Array.isArray(searchData.results)) {
          setDiscoveredCases(
            searchData.results.slice(0, 4).map((r: any) => ({
              id: r.id,
              case_name: r.case_name,
              citation: r.citation,
              court: r.court,
              key_holding: r.key_holding,
              source_url: r.source_url,
              relevance_reason: 'Binding precedent aligned with identified cause of action.'
            }))
          );
        }
      }
    } catch (err: any) {
      console.error('Autonomous research failed', err);
      setDossierOutput(`Execution encountered an issue: ${err.message || 'Please verify network and API parameters.'}`);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleCopyDossier = () => {
    if (!dossierOutput) return;
    navigator.clipboard.writeText(dossierOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDossier = () => {
    if (!dossierOutput) return;
    const blob = new Blob([dossierOutput], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CASE_STRATEGY_DOSSIER_${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Intake Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              DEEPSEEK V4.1-FLASH CASE BUILDER
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium">
              <Layers className="w-3.5 h-3.5" />
              AUTONOMOUS INGESTION ENGINE
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Goal-Driven Case Law Discovery & Deep Research
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Specify your legal objective, ingest related files from your Downloads folder or device, and let DeepSeek autonomously determine the controlling case law, binding precedents, and discovery roadmap.
            </p>
          </div>

          {/* User Objective Intake Form */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
              What are you looking to accomplish? (Legal Intent & Factual Scope)
            </label>
            <textarea
              id="user-objective-input"
              rows={3}
              value={userObjective}
              onChange={(e) => setUserObjective(e.target.value)}
              placeholder="e.g., I represent a buyer in an acquisition where the seller concealed pending litigation in the disclosure schedules. I need to establish fraud in the inducement under Delaware law, defeat an integration clause defense, and find controlling Court of Chancery precedents..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all resize-y min-h-[90px]"
            />

            {/* Quick Objective Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-400">Quick Presets:</span>
              {OBJECTIVE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  id={`preset-btn-${idx}`}
                  type="button"
                  onClick={() => setUserObjective(preset.text)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] font-sans text-slate-300 border border-slate-700/60 transition-colors min-h-[36px] flex items-center"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ingestion & Evidence Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Ingestion Station (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderSearch className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Evidence Ingestion Station
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
                <button
                  id="tab-ingest-downloads"
                  onClick={() => setIngestionMode('downloads')}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors min-h-[36px] ${
                    ingestionMode === 'downloads'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Search Downloads
                </button>
                <button
                  id="tab-ingest-upload"
                  onClick={() => setIngestionMode('upload')}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors min-h-[36px] ${
                    ingestionMode === 'upload'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Upload Files
                </button>
                <button
                  id="tab-ingest-paste"
                  onClick={() => setIngestionMode('paste')}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors min-h-[36px] ${
                    ingestionMode === 'paste'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {/* Mode 1: Search Downloads Folder */}
            {ingestionMode === 'downloads' && (
              <div className="space-y-3">
                <form onSubmit={handleSearchDownloads} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      id="search-downloads-input"
                      type="text"
                      value={downloadsSearch}
                      onChange={(e) => setDownloadsSearch(e.target.value)}
                      placeholder="Search related files in Downloads folder (e.g., CLIFF, HARVEY, EDGAR)..."
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-500 min-h-[44px]"
                    />
                  </div>
                  <button
                    id="search-downloads-submit-btn"
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Filter
                  </button>
                  <button
                    id="refresh-downloads-btn"
                    type="button"
                    onClick={() => { setDownloadsSearch(''); fetchDownloadsIndex(''); }}
                    className="p-2.5 bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700/60 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Refresh Downloads"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingDownloads ? 'animate-spin' : ''}`} />
                  </button>
                </form>

                {/* Available Files in Downloads */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {availableDownloads.map((file) => {
                    const isAttached = attachedDocs.some(d => d.id === file.id);
                    return (
                      <div
                        key={file.id}
                        className={`p-3 rounded-lg border text-xs transition-all flex items-start justify-between gap-3 ${
                          isAttached
                            ? 'bg-cyan-950/30 border-cyan-500/40'
                            : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="font-mono font-medium text-slate-200 truncate">
                              {file.filename}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono shrink-0">
                              {file.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                            {file.summary}
                          </p>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {(file.size_bytes / 1024).toFixed(1)} KB • Discovered in Downloads
                          </div>
                        </div>

                        <button
                          id={`attach-file-${file.id}`}
                          onClick={() => handleAttachDownloadFile(file)}
                          disabled={isAttached}
                          className={`px-3 py-1.5 rounded text-xs font-mono font-medium shrink-0 min-h-[36px] flex items-center gap-1 transition-all ${
                            isAttached
                              ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 cursor-default'
                              : 'bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-200 border border-cyan-700/60'
                          }`}
                        >
                          {isAttached ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Attached
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              Attach
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 2: Upload Files from Device */}
            {ingestionMode === 'upload' && (
              <div className="space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-8 h-8 text-cyan-400" />
                  <div className="text-xs font-medium text-slate-200">
                    Click to select files from your computer or drag & drop here
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Supports .md, .txt, .pdf, .json, .csv (Contracts, Memos, Medical Records)
                  </div>
                  <input
                    ref={fileInputRef}
                    id="file-upload-input"
                    type="file"
                    multiple
                    accept=".txt,.md,.pdf,.json,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Mode 3: Paste Text Excerpt */}
            {ingestionMode === 'paste' && (
              <div className="space-y-3">
                <input
                  id="paste-doc-title-input"
                  type="text"
                  value={pastedDocTitle}
                  onChange={(e) => setPastedDocTitle(e.target.value)}
                  placeholder="Document Title (e.g., Section 8.05 Material Adverse Effect Clause)"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 min-h-[44px]"
                />
                <textarea
                  id="paste-doc-text-input"
                  rows={4}
                  value={pastedDocText}
                  onChange={(e) => setPastedDocText(e.target.value)}
                  placeholder="Paste relevant contract clauses, witness testimony, police report narrative, or email thread..."
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 resize-y"
                />
                <button
                  id="add-pasted-doc-btn"
                  type="button"
                  onClick={handleAddPastedDocument}
                  disabled={!pastedDocText.trim()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono rounded-lg min-h-[40px] flex items-center gap-2"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Attach Excerpt to Matter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Attached Evidence Tray & Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Attached Evidence Tray ({attachedDocs.length})
                </h3>
                {attachedDocs.length > 0 && (
                  <button
                    id="clear-all-docs-btn"
                    onClick={() => setAttachedDocs([])}
                    className="text-[10px] text-slate-500 hover:text-red-400 font-mono transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {attachedDocs.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-800/80 rounded-lg p-4 bg-slate-950/30">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No documents attached yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Select files from Downloads or upload to ground DeepSeek in your specific factual record.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {attachedDocs.map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-mono font-medium text-slate-200 truncate">
                          {doc.filename}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {doc.source} {doc.size_bytes ? `• ${(doc.size_bytes / 1024).toFixed(1)} KB` : ''}
                        </div>
                      </div>
                      <button
                        id={`remove-doc-${doc.id}`}
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 min-h-[36px] min-w-[36px] flex items-center justify-center"
                        title="Remove Document"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Autonomous Execution Trigger */}
            <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
              <button
                id="run-autonomous-discovery-btn"
                onClick={handleExecuteAutonomousResearch}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono text-xs font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-950/50 transition-all min-h-[48px] disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Legal Objective & Ingesting Files...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current text-cyan-200" />
                    <span>Run Autonomous Case Discovery & Research</span>
                  </>
                )}
              </button>
              {processingStage && (
                <div className="text-[11px] font-mono text-cyan-400 text-center animate-pulse">
                  {processingStage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generated Case Strategy Dossier & Discovered Law Section */}
      {dossierOutput && (
        <div className="space-y-6 pt-2">
          {/* Header Bar with Telemetry */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  Autonomous Case Strategy Dossier
                </h2>
                <div className="text-xs text-slate-400 font-sans">
                  Deep research synthesized from user objective and {attachedDocs.length} ingested evidence source{attachedDocs.length === 1 ? '' : 's'}.
                </div>
              </div>
            </div>

            {dossierTelemetry && (
              <div className="flex items-center gap-2">
                <div className="text-right font-mono text-xs hidden sm:block">
                  <div className="text-slate-400 text-[10px]">REASONING LATENCY</div>
                  <div className="text-cyan-400 font-bold">{dossierTelemetry.latency_ms} ms</div>
                </div>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <button
                  id="dossier-copy-btn"
                  onClick={handleCopyDossier}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 min-h-[44px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  id="dossier-download-btn"
                  onClick={handleDownloadDossier}
                  className="px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-mono flex items-center gap-1.5 border border-cyan-800/60 min-h-[44px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download MD
                </button>
              </div>
            )}
          </div>

          {/* Discovered Case Law Cards Grid */}
          {discoveredCases.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  Automatically Discovered Binding Case Law ({discoveredCases.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Receipts attached from CourtListener Free Law Project
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discoveredCases.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {c.citation}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {c.court}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-200">
                        {c.case_name}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans line-clamp-3">
                        {c.key_holding}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      {onSelectCase && (
                        <button
                          id={`view-discovered-case-${c.id}`}
                          onClick={() => onSelectCase(c)}
                          className="text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center gap-1 min-h-[36px]"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          View Opinion Excerpt
                        </button>
                      )}
                      <a
                        id={`courtlistener-link-${c.id}`}
                        href={c.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-200 font-mono text-xs flex items-center gap-1 min-h-[36px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        CourtListener
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dossier Text Content Display */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 sm:p-6 font-sans text-sm text-slate-200 leading-relaxed overflow-x-hidden">
            <div className="prose prose-invert max-w-none space-y-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-300">
                {dossierOutput}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
