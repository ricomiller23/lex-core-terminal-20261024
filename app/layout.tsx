import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LexCore AI | Legal Intelligence Operating Terminal',
  description: 'Unified AI Legal Operating System synthesizing CourtListener case research, EveOS clinical ingestion, Harvey 4-gate verification, and Judicex Model Context Protocol tools.',
  keywords: ['legaltech', 'case research', 'CourtListener', 'EveOS', 'Harvey AI', 'Judicex MCP', 'DeepSeek'],
  authors: [{ name: 'DeepSeek & LexCore Architect' }]
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070a13'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070a13] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
