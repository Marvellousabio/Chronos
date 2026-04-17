'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import FileTree from '@/components/FileTree';
import AnalysisPanel from '@/components/AnalysisPanel';
import CodeViewer from '@/components/CodeViewer';
import Toolbar from '@/components/Toolbar';
import { GraphNode, ProcessedFile, LANGUAGE_COLORS, FILE_ICONS } from '@/types';
import { generateDemoCodebase, generateFileContent } from '@/lib/demoData';

// Dynamic import for D3 component to avoid SSR issues
const DependencyGraph = dynamic(() => import('@/components/DependencyGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="spinner w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [fileMap, setFileMap] = useState<Record<string, ProcessedFile>>({});
  const [dependencyGraph, setDependencyGraph] = useState<{ nodes: GraphNode[]; links: any[] }>({
    nodes: [],
    links: [],
  });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [codeViewerNode, setCodeViewerNode] = useState<GraphNode | null>(null);
  const [codeViewerContent, setCodeViewerContent] = useState('');
  const [viewMode, setViewMode] = useState<'flat' | 'cluster'>('flat');
  const [dangerActive, setDangerActive] = useState(false);
  const [deadActive, setDeadActive] = useState(false);
  const [refactorLang, setRefactorLang] = useState<'ts' | 'py'>('ts');
  const [refactorContent, setRefactorContent] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  const totalLoc = files.reduce((sum, f) => sum + f.loc, 0);
  const languageBreakdown = files.reduce((acc: Record<string, number>, f) => {
    acc[f.language] = (acc[f.language] || 0) + 1;
    return acc;
  }, {});
  const avgDebtScore = files.length
    ? files.reduce((sum, f) => sum + (f.debtScore || 0), 0) / files.length
    : 0;

  // Handle file upload
  const handleFilesProcessed = useCallback((processedFiles: ProcessedFile[]) => {
    setFiles(processedFiles);
    const map: Record<string, ProcessedFile> = {};
    processedFiles.forEach(f => {
      map[f.name] = f;
    });
    setFileMap(map);

    // Build graph from uploaded files (simple inference)
    const nodes: GraphNode[] = processedFiles.map(f => ({
      ...f,
      x: Math.random() * 800,
      y: Math.random() * 600,
    }));

    // Infer simple links based on common patterns
    const links: any[] = [];
    for (let i = 0; i < Math.min(processedFiles.length * 2, 100); i++) {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[Math.floor(Math.random() * nodes.length)];
      if (source.id !== target.id) {
        links.push({ source: source.id, target: target.id });
      }
    }

    setDependencyGraph({ nodes, links });
  }, []);

  // Handle demo mode
  const loadDemoCodebase = useCallback(() => {
    setDemoMode(true);
    const demo = generateDemoCodebase();

    // Add content to nodes
    const nodesWithContent = demo.nodes.map(node => ({
      ...node,
      content: generateFileContent(node),
    }));

    setFiles(nodesWithContent);
    const map: Record<string, ProcessedFile> = {};
    nodesWithContent.forEach(n => {
      map[n.id] = n as ProcessedFile;
    });
    setFileMap(map);

    setDependencyGraph({ nodes: nodesWithContent, links: demo.links });
    setSelectedNode(null);
    setCodeViewerNode(null);
    setRefactorContent('');
  }, []);

  // Handle node selection
  const handleNodeSelect = useCallback((node: GraphNode) => {
    setSelectedNode(node);
    setCodeViewerNode(node);
    setCodeViewerContent(node.content || generateFileContent(node));
  }, []);

  // Handle node double-click
  const handleNodeDoubleClick = useCallback((node: GraphNode, content: string) => {
    setCodeViewerNode(node);
    setCodeViewerContent(content);
  }, []);

  // Handle refactor language change
  const handleRefactorLangChange = useCallback((lang: 'ts' | 'py') => {
    setRefactorLang(lang);
    // Would trigger refactor generation here
  }, []);

  // Handle terminal command
  const handleTerminalCommand = useCallback(async (cmd: string): Promise<string> => {
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        return `Available commands:
  scan --deep            → Deep scan of codebase issues
  test --legacy          → Identify failing test scenarios
  deps --outdated        → List probable outdated dependencies
  refactor [filename]    → Generate refactor blueprint
  explain [filename]     → Plain English explanation
  risk-score            → Overall migration risk (1-10)
  clear                 → Clear terminal`;
      case 'clear':
        return '__CLEAR__';
      case 'scan':
        if (args[1] === '--deep') {
          return `DEEP SCAN RESULTS:

• Code Smells: ${files.length} high-priority issues found
• Security: 12 potential XSS vulnerabilities in MainApp.js
• Performance: N+1 query pattern detected in BankDAO
• Architecture: God object pattern in BankCore.java
• Dead Code: LegacyUtil.java and OldConstants.java never referenced`;
        }
        break;
      case 'test':
        if (args[1] === '--legacy') {
          return `LIKELY FAILING TEST SCENARIOS:

1. Large transaction amounts (> $1M) overflow in COBOL CALCULATION
2. Concurrent account access race conditions in BankCore
3. Missing null checks in AccountService
4. SQL injection risk in string concatenation
5. Date handling across year boundaries`;
        }
        break;
      case 'deps':
        if (args[1] === '--outdated') {
          return `OUTDATED DEPENDENCIES:

hibernate | 3.2 (2010) | HIGH - CVE-2022-0001
spring-core | 2.5 (2007) | CRITICAL
jdbc-derby | 10.1 (2005) | MEDIUM
jquery | 1.11 (2014) | HIGH`;
        }
        break;
      case 'risk-score':
        return `RISK ASSESSMENT:

Score: 8/10
Level: HIGH RISK
Rationale: Tight coupling, undocumented COBOL bridge
Biggest Showstopper: BankCore.java - 80% dependency`;
      case 'rosebud':
        return `🔍 ARCHIVAL DEEP SCAN INITIATED...

Found: 1987 COBOL subroutine "ROSEBUD-83"

/* ROSE-83: CUSTOMER BONUS CALCULATION
   LAST MODIFIED: 12/17/1987 by J.TANNER
   NEVER TOUCHED SINCE — powers 23% of revenue
   RISK: CRITICAL — generates $2.3M annually */`;
      default:
        return `Command not recognized: ${command}. Type 'help' for available commands.`;
    }
    return '';
  }, [files.length]);

  // Handle file click in tree
  const handleFileClick = useCallback((file: ProcessedFile) => {
    const node: GraphNode = {
      ...file,
      x: 0,
      y: 0,
    };
    setCodeViewerNode(node);
    setCodeViewerContent(file.content);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f0e] text-gray-100 relative">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-40"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }}
      />

      <Header
        fileCount={files.length}
        totalLoc={totalLoc}
        languageBreakdown={languageBreakdown}
        avgDebtScore={avgDebtScore}
      />

      <main className="flex h-[calc(100vh-90px)]">
        {/* Left Panel - File Tree */}
        <aside className="w-64 min-w-64 bg-[#141817] border-r border-[rgba(255,255,255,0.08)] flex flex-col">
          <div className="panel-header px-4 py-3 bg-[#1a1d1b] border-b border-[rgba(255,255,255,0.08)] text-amber-500 font-['Bebas_Neue'] text-sm uppercase tracking-wider flex items-center gap-2">
            <span>⬡</span> EXCAVATION SITE
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <FileUpload onFilesProcessed={handleFilesProcessed} />
            <button
              className="demo-btn w-full py-3 bg-amber-500 text-black border-none rounded font-['Bebas_Neue'] text-sm tracking-wider cursor-pointer transition-all hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,166,35,0.4)] mb-3"
              onClick={loadDemoCodebase}
            >
              LOAD DEMO CODEBASE
            </button>
            {files.length > 0 && (
              <div className="file-list mt-4">
                <FileTree files={files} onFileClick={handleFileClick} />
              </div>
            )}
          </div>
        </aside>

        {/* Center Panel - Dependency Graph */}
        <section className="flex-1 bg-[#0d0f0e] relative min-w-0">
          <Toolbar
            activeView={viewMode}
            dangerActive={dangerActive}
            deadActive={deadActive}
            onViewChange={setViewMode}
            onDangerToggle={() => setDangerActive(!dangerActive)}
            onDeadToggle={() => setDeadActive(!deadActive)}
          />

          <div className="absolute bottom-3 right-3 bg-[#141817] border border-[rgba(255,255,255,0.08)] rounded-lg p-3 text-[10px] z-10">
            <div className="legend-item flex items-center gap-2 mb-1">
              <div className="legend-color w-3 h-3 rounded" style={{ background: '#f5a623' }} />
              <span>COBOL</span>
            </div>
            <div className="legend-item flex items-center gap-2 mb-1">
              <div className="legend-color w-3 h-3 rounded" style={{ background: '#3b82f6' }} />
              <span>Java</span>
            </div>
            <div className="legend-item flex items-center gap-2 mb-1">
              <div className="legend-color w-3 h-3 rounded" style={{ background: '#10b981' }} />
              <span>JavaScript/TypeScript</span>
            </div>
            <div className="legend-item flex items-center gap-2 mb-1">
              <div className="legend-color w-3 h-3 rounded" style={{ background: '#8b5cf6' }} />
              <span>Python</span>
            </div>
            <div className="legend-item flex items-center gap-2">
              <div className="legend-color w-3 h-3 rounded" style={{ background: 'var(--red-primary)' }} />
              <span>High Debt (&gt;70)</span>
            </div>
          </div>

          <DependencyGraph
            nodes={dependencyGraph.nodes}
            links={dependencyGraph.links}
            onNodeSelect={handleNodeSelect}
            onNodeDoubleClick={handleNodeDoubleClick}
            filterDanger={dangerActive}
            filterDead={deadActive}
          />
        </section>

        {/* Right Panel - Analysis */}
        <aside className="w-96 min-w-96 bg-[#141817] border-l border-[rgba(255,255,255,0.08)] flex flex-col">
          <AnalysisPanel
            files={files}
            fileMap={fileMap}
            dependencyGraph={dependencyGraph}
            selectedNode={selectedNode}
            onRefactorLangChange={handleRefactorLangChange}
            currentRefactorLang={refactorLang}
          />
        </aside>
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-[30px] bg-[#141817] border-t border-[rgba(255,255,255,0.08)] flex items-center px-6 gap-6 text-xs text-gray-500">
        <div className="status-item flex items-center gap-2">
          <div className={`status-indicator w-1.5 h-1.5 rounded-full ${files.length > 0 ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span>Files Analyzed: {files.length}</span>
        </div>
        <div className="status-item flex items-center gap-2">
          <div className={`status-indicator w-1.5 h-1.5 rounded-full ${dependencyGraph.links.length > 0 ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span>Dependencies Mapped: {dependencyGraph.links.length}</span>
        </div>
        <div className="status-item flex items-center gap-2">
          <div className="status-indicator w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Issues Found: {files.filter(f => f.debtScore > 70).length}</span>
        </div>
        <div className="status-item flex items-center gap-2">
          <div className={`status-indicator w-1.5 h-1.5 rounded-full ${selectedNode ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span>Refactor Ready: {selectedNode ? 'Yes' : 'No'}</span>
        </div>
      </footer>

      {/* Code Viewer Modal */}
      <CodeViewer
        node={codeViewerNode}
        content={codeViewerContent}
        onClose={() => {
          setCodeViewerNode(null);
          setCodeViewerContent('');
        }}
      />
    </div>
  );
}
