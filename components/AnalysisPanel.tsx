'use client';

import { useState, useEffect } from 'react';
import { AnalysisTab, GraphNode, ProcessedFile } from '@/types';

interface AnalysisPanelProps {
  files: ProcessedFile[];
  fileMap: Record<string, ProcessedFile>;
  dependencyGraph: { nodes: GraphNode[]; links: any[] };
  selectedNode: GraphNode | null;
  onRefactorLangChange: (lang: 'ts' | 'py') => void;
  currentRefactorLang: 'ts' | 'py';
}

export default function AnalysisPanel({
  files,
  fileMap,
  dependencyGraph,
  selectedNode,
  onRefactorLangChange,
  currentRefactorLang,
}: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('excavation');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Type \'help\' for available commands']);
  const [excavationReport, setExcavationReport] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [refactorContent, setRefactorContent] = useState<string>('');
  const [showRefactorSelector, setShowRefactorSelector] = useState(false);

  // Auto-run excavation on first load if files exist
  useEffect(() => {
    if (files.length > 0 && !excavationReport) {
      handleExcavation();
    }
  }, [files.length]);

  const handleExcavation = async () => {
    if (!excavationReport) {
      setIsAnalyzing(true);
      // In real app, this would call the API
      setTimeout(() => {
        setExcavationReport({
          executiveSummary: ' legacy banking system with 47 files, mixing COBOL and Java. Core banking operations rely on a monolithic BankCore class.',
          businessDomain: 'Financial Services - Retail Banking',
          architecturePattern: 'Monolithic layered architecture with tight coupling between presentation, business, and data layers. Significant legacy COBOL integration via JNI bridge.',
          criticalFiles: [
            'BankCore.java (1250 LOC, debt: 95) - Central singleton with global state',
            'AccountManager.java (890 LOC, debt: 82) - High coupling to BankCore',
            'TransactionProcessor.java (743 LOC, debt: 78) - Transaction orchestration',
            'INTERFACE.cobol (920 LOC, debt: 88) - COBOL integration layer',
            'BankDAO.java (680 LOC, debt: 72) - Direct database access'
          ],
          debtScore: 72,
          riskAssessment: 'High risk: modifications to BankCore cascade to 80% of files. COBOL bridge is undocumented. Data model tightly coupled to legacy schema.'
        });
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const handleDepsAnalysis = async () => {
    // Analyze circular deps, god files, dead code
    const cycles = findCircularDependencies();
    const godFiles = findGodFiles();
    const deadCode = findDeadCode();

    setDepsAnalysis({ cycles, godFiles, deadCode });
  };

  const findCircularDependencies = () => {
    const adj: Record<string, string[]> = {};
    dependencyGraph.nodes.forEach(n => adj[n.id] = []);
    dependencyGraph.links.forEach(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      adj[sid]?.push(tid);
    });

    const cycles: string[] = [];
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (node: string, path: string[]) => {
      if (stack.has(node)) {
        cycles.push([...path, node].join(' → '));
        return;
      }
      if (visited.has(node)) return;
      visited.add(node);
      stack.add(node);
      (adj[node] || []).forEach(neighbor => dfs(neighbor, [...path, node]));
      stack.delete(node);
    };

    dependencyGraph.nodes.forEach(n => dfs(n.id, []));
    return cycles.slice(0, 5);
  };

  const findGodFiles = () => {
    const inDegree: Record<string, number> = {};
    dependencyGraph.nodes.forEach(n => inDegree[n.id] = 0);
    dependencyGraph.links.forEach(l => {
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      inDegree[tid] = (inDegree[tid] || 0) + 1;
    });

    const threshold = dependencyGraph.nodes.length * 0.3;
    return Object.entries(inDegree)
      .filter(([, count]) => count >= threshold)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => `${id} (${count} incoming deps)`);
  };

  const findDeadCode = () => {
    const outDegree: Record<string, number> = {};
    dependencyGraph.nodes.forEach(n => outDegree[n.id] = 0);
    dependencyGraph.links.forEach(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      outDegree[sid] = (outDegree[sid] || 0) + 1;
    });

    return Object.entries(outDegree)
      .filter(([, count]) => count === 0)
      .slice(0, 5)
      .map(([id]) => id);
  };

  const [depsAnalysis, setDepsAnalysis] = useState<any>(null);

  const handleTerminalCommand = async (cmd: string) => {
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();

    switch (command) {
      case 'help':
        return 'Available commands:\n  scan --deep            → Deep scan of codebase issues\n  test --legacy          → Identify failing test scenarios\n  deps --outdated        → List probable outdated dependencies\n  refactor [filename]    → Generate refactor blueprint\n  explain [filename]     → Plain English explanation\n  risk-score            → Overall migration risk (1-10)\n  clear                 → Clear terminal';
      case 'clear':
        setTerminalOutput([]);
        return '';
      case 'scan':
        if (args[1] === '--deep') {
          return 'DEEP SCAN RESULTS:\n\n• Code Smells: 47 high-priority issues found\n• Security: 12 potential XSS vulnerabilities in MainApp.js\n• Performance: N+1 query pattern detected in BankDAO (queries.sql)\n• Architecture: God object pattern in BankCore.java\n• Dead Code: LegacyUtil.java and OldConstants.java never referenced';
        }
        break;
      case 'test':
        if (args[1] === '--legacy') {
          return 'LIKELY FAILING TEST SCENARIOS:\n\n1. Large transaction amounts (> $1M) overflow in COBOL CALCULATION\n2. Concurrent account access race conditions in BankCore\n3. Missing null checks in AccountService\n4. SQL injection risk in queries.sql (string concatenation)\n5. Date handling across year boundaries (December 31 → January 1)';
        }
        break;
      case 'deps':
        if (args[1] === '--outdated') {
          return 'OUTDATED DEPENDENCIES:\n\nhibernate | 3.2 (2010) | HIGH - CVE-2022-0001\nspring-core | 2.5 (2007) | CRITICAL - No security patches\njdbc-derby | 10.1 (2005) | MEDIUM - End of life\njquery | 1.11 (2014) | HIGH - XSS vulnerabilities';
        }
        break;
      case 'risk-score':
        return 'RISK ASSESSMENT:\n\nScore: 8/10\nLevel: HIGH RISK\nRationale: Tight coupling, undocumented COBOL interface, god objects\nBiggest Showstopper: BankCore.java - 80% of code depends on it';
        break;
      case 'refactor':
        if (args[1] && selectedNode) {
          return `REFACTORING BLUEPRINT FOR ${selectedNode.id}:\n\n[GENERATE REFACTOR TAB FOR DETAILS]`;
        }
        break;
      case 'explain':
        if (args[1]) {
          return `[EXPLANATION WOULD APPEAR HERE]`;
        }
        break;
      case 'rosebud':
        return '🔍 ARCHIVAL DEEP SCAN INITIATED...\n\nFound: 1987 COBOL subroutine "ROSEBUD-83" in /legacy/src/\n\n/* ROSE-83: CUSTOMER BONUS CALCULATION\n   LAST MODIFIED: 12/17/1987 by J.TANNER\n   NEVER TOUCHED SINCE — powers 23% of annual revenue\n   RISK: CRITICAL — generates $2.3M in annual bonuses */';
      default:
        return `Command not recognized: ${command}. Type 'help' for available commands.`;
    }
    return '';
  };

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalOutput(prev => [...prev, `chronos@archaeologist:~$ ${cmd}`]);
    setTerminalInput('');

    const response = await handleTerminalCommand(cmd);
    if (response) {
      setTerminalOutput(prev => [...prev, response]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="analysis-tabs flex border-b border-[rgba(255,255,255,0.08)] bg-[#1a1d1b]">
        {(['excavation', 'deps', 'refactor', 'terminal'] as AnalysisTab[]).map((tab) => (
          <button
            key={tab}
            className={`tab-btn flex-1 bg-transparent border-none text-xs font-['Bebas_Neue'] tracking-wider uppercase cursor-pointer transition-all ${
              activeTab === tab
                ? 'text-amber-500 border-b-2 border-amber-500 bg-[rgba(245,166,35,0.1)]'
                : 'text-gray-500 hover:text-amber-500 hover:bg-[rgba(245,166,35,0.05)]'
            }`}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'deps' && !depsAnalysis) {
                handleDepsAnalysis();
              }
            }}
          >
            {tab === 'excavation' ? 'EXCAVATION REPORT' :
             tab === 'deps' ? 'DEPENDENCY MAP' :
             tab === 'refactor' ? 'REFACTOR BLUEPRINT' : 'TERMINAL'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'excavation' && (
          <div>
            {isAnalyzing ? (
              <div className="analysis-loading flex items-center gap-3 p-5 text-amber-500">
                <div className="spinner w-5 h-5 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                <span>CHRONOS ANALYZING...</span>
              </div>
            ) : excavationReport ? (
              <div className="space-y-6">
                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    Executive Summary
                  </div>
                  <div className="section-content text-base leading-relaxed text-gray-300">
                    {excavationReport.executiveSummary}
                  </div>
                </div>

                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    Business Domain
                  </div>
                  <div className="section-content text-base text-gray-300">
                    {excavationReport.businessDomain}
                  </div>
                </div>

                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    Architecture Pattern
                  </div>
                  <div className="section-content text-base text-gray-300">
                    {excavationReport.architecturePattern}
                  </div>
                </div>

                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    Top 5 Critical Files
                  </div>
                  <div className="section-content">
                    {excavationReport.criticalFiles.map((file: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <span className="text-amber-500">▸</span>
                        <span className="text-gray-300">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    Tech Debt Score
                  </div>
                  <div className="section-content">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-5xl font-bold" style={{ color: getDebtColor(excavationReport.debtScore) }}>
                        {excavationReport.debtScore}
                      </div>
                      <div className="text-2xl text-gray-500">/ 100</div>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 via-amber-500 to-red-500 transition-all duration-1000"
                        style={{ width: `${excavationReport.debtScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    Risk Assessment
                  </div>
                  <div className="section-content text-gray-300">
                    {excavationReport.riskAssessment}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state flex flex-col items-center justify-center py-20 text-center">
                <div className="empty-state-icon text-6xl opacity-30 mb-4">⬡</div>
                <div className="text-xl text-gray-400 mb-2">No analysis yet</div>
                <div className="text-sm text-gray-600">Upload a codebase to begin archaeological analysis</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'deps' && (
          <div>
            {depsAnalysis ? (
              <div className="space-y-6">
                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    Circular Dependencies ({depsAnalysis.cycles.length})
                  </div>
                  <div className="section-content">
                    {depsAnalysis.cycles.length > 0 ? (
                      depsAnalysis.cycles.map((cycle: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 mb-2">
                          <span className="text-red-500">⚠</span>
                          <code className="text-sm text-gray-300">{cycle}</code>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No circular dependencies detected</div>
                    )}
                  </div>
                </div>

                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    God Files ({depsAnalysis.godFiles.length})
                  </div>
                  <div className="section-content">
                    {depsAnalysis.godFiles.map((file: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <span className="text-amber-500">⬡</span>
                        <span className="text-gray-300">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="report-section">
                  <div className="section-title text-amber-500 font-['Bebas_Neue'] text-lg uppercase tracking-wider mb-3 border-b border-[rgba(245,166,35,0.2)] pb-1">
                    Dead Code Candidates ({depsAnalysis.deadCode.length})
                  </div>
                  <div className="section-content">
                    {depsAnalysis.deadCode.map((file: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 mb-2">
                        <span className="text-gray-500">○</span>
                        <span className="text-gray-300">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state flex flex-col items-center justify-center py-20 text-center">
                <div className="empty-state-icon text-6xl opacity-30 mb-4">⬡</div>
                <div className="text-xl text-gray-400">Dependency analysis pending</div>
                <div className="text-sm text-gray-600 mt-2">Run excavation to identify issues</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'refactor' && (
          <div>
            {selectedNode ? (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="text-lg text-amber-500 font-semibold">{selectedNode.id}</div>
                  <div className="text-sm text-gray-400">({selectedNode.language}, {selectedNode.loc} LOC)</div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 mb-2">TARGET LANGUAGE</label>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded text-sm transition-colors ${
                        currentRefactorLang === 'ts'
                          ? 'bg-amber-500 text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        onRefactorLangChange('ts');
                        setShowRefactorSelector(true);
                      }}
                    >
                      TypeScript
                    </button>
                    <button
                      className={`px-4 py-2 rounded text-sm transition-colors ${
                        currentRefactorLang === 'py'
                          ? 'bg-amber-500 text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        onRefactorLangChange('py');
                        setShowRefactorSelector(true);
                      }}
                    >
                      Python
                    </button>
                  </div>
                </div>

                {refactorContent ? (
                  <div className="refactor-content text-sm leading-relaxed whitespace-pre-wrap text-gray-300 bg-gray-900 p-4 rounded-lg border border-gray-800">
                    {refactorContent}
                  </div>
                ) : (
                  <div className="analysis-loading flex items-center gap-3 p-5 text-amber-500">
                    <div className="spinner w-5 h-5 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                    <span>GENERATING REFACTOR BLUEPRINT...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state flex flex-col items-center justify-center py-20 text-center">
                <div className="empty-state-icon text-6xl opacity-30 mb-4">⬡</div>
                <div className="text-xl text-gray-400">No file selected</div>
                <div className="text-sm text-gray-600 mt-2">
                  Click a node in the dependency graph to generate a refactor blueprint
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'terminal' && (
          <div>
            <form onSubmit={handleTerminalSubmit} className="mb-3 flex gap-2">
              <span className="terminal-prompt text-green-400 font-semibold pt-2">
                chronos@archaeologist:~$
              </span>
              <input
                type="text"
                className="terminal-input flex-1 bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 font-mono text-sm rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Type command... (try: help, scan --deep, risk-score)"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                autoComplete="off"
              />
            </form>

            <div className="terminal-output bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm leading-relaxed min-h-[300px] max-h-[500px] overflow-y-auto">
              {terminalOutput.map((line, i) => (
                <div key={i} className="mb-1">
                  {line.startsWith('chronos@') ? (
                    <div>
                      <span className="text-green-400 font-semibold">{line.split(' ')[0]}</span>
                      <span className="text-gray-300">{line.substring(line.indexOf('$') + 2)}</span>
                    </div>
                  ) : (
                    <div className="text-gray-300 whitespace-pre-wrap">{line}</div>
                  )}
                </div>
              ))}
              {terminalInput && (
                <div className="flex">
                  <span className="terminal-prompt text-green-400 font-semibold mr-2">
                    chronos@archaeologist:~$
                  </span>
                  <span className="text-gray-300">{terminalInput}</span>
                  <span className="cursor ml-1 w-2 h-4 bg-amber-500 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getDebtColor(score: number): string {
  if (score > 70) return '#ef4444';
  if (score > 40) return '#f5a623';
  return '#4ade80';
}
