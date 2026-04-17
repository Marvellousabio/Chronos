'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ProcessedFile, GraphNode } from "@/types";

const DependencyGraph = dynamic(() => import("@/components/DependencyGraph"), {
  ssr: false,
});

export default function ScanPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<'upload' | 'processing' | 'analysis' | 'report'>('upload');
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: any[] }>({ nodes: [], links: [] });
  const [analysis, setAnalysis] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);
    
    setStep('processing');
    
    // Simulate processing
    const processed: ProcessedFile[] = [];
    for (const file of fileList) {
      const content = await file.text();
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      processed.push({
        id: file.name,
        name: file.name,
        content,
        language: detectLanguage(ext),
        lines: content.split('\n').length,
        loc: content.replace(/\s+/g, '').length,
        debtScore: estimateDebtScore(file.name, content),
      });
    }
    
    setFiles(processed);
    
    // Build graph
    const nodes: GraphNode[] = processed.map(f => ({
      ...f,
      x: Math.random() * 800,
      y: Math.random() * 600,
    }));
    
    // Create links (simplified)
    const links: any[] = [];
    for (let i = 0; i < Math.min(processed.length, 50); i++) {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const target = nodes[Math.floor(Math.random() * nodes.length)];
      if (source.id !== target.id) {
        links.push({ source: source.id, target: target.id });
      }
    }
    
    setGraphData({ nodes, links });
    setStep('analysis');
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        executiveSummary: `Codebase contains ${files.length} files across ${new Set(files.map(f => f.language)).size} languages. Total technical debt score: ${Math.round(files.reduce((a,b) => a + b.debtScore,0)/files.length)}/100.`,
        businessDomain: detectBusinessDomain(files),
        architecturePattern: detectArchitecture(files),
        criticalFiles: files.filter(f => f.debtScore > 70).slice(0, 5).map(f => `${f.name} (${f.language}, ${f.loc} LOC)`),
        debtScore: Math.round(files.reduce((a,b) => a + b.debtScore,0)/files.length),
        riskAssessment: 'Moderate risk detected. Key areas: tight coupling in core modules, missing tests, outdated dependencies.',
        circularDeps: ['ModuleA.java → ModuleB.java → ModuleC.java → ModuleA'],
        godFiles: files.filter(f => f.debtScore > 80).map(f => `${f.name} (${f.loc} LOC, ${f.debtScore} debt)`),
        deadCode: files.filter(f => f.debtScore < 20).map(f => f.name),
      });
      setStep('report');
    }, 3000);
  };

  const detectLanguage = (ext: string): string => {
    const map: Record<string, string> = {
      cobol: 'COBOL', cbl: 'COBOL', java: 'Java',
      js: 'JavaScript', ts: 'TypeScript', py: 'Python',
      c: 'C', cpp: 'C++', php: 'PHP', rb: 'Ruby',
      pl: 'Perl', vb: 'Visual Basic', bas: 'BASIC',
      asm: 'Assembly', sql: 'SQL', xml: 'XML',
    };
    return map[ext] || 'Text';
  };

  const estimateDebtScore = (filename: string, content: string): number => {
    let score = 20;
    if (filename.toLowerCase().includes('legacy')) score += 30;
    if (content.includes('FIXME') || content.includes('TODO')) score += 20;
    if (content.includes('System.out.println')) score += 15;
    if (content.includes('catch (Exception') && content.includes('{}')) score += 30;
    return Math.min(100, score + Math.random() * 20);
  };

  const detectBusinessDomain = (files: ProcessedFile[]): string => {
    const langs = new Set(files.map(f => f.language));
    if (langs.has('COBOL')) return 'Financial Services / Banking (Legacy Mainframe)';
    if (langs.has('Java') && files.length > 100) return 'Enterprise Business Applications';
    if (langs.has('PHP')) return 'Web Applications / Content Management';
    return 'Mixed Technology Stack';
  };

  const detectArchitecture = (files: ProcessedFile[]): string => {
    const largeFiles = files.filter(f => f.loc > 500);
    if (largeFiles.length > files.length * 0.3) return 'Monolithic - High coupling detected';
    if (files.some(f => f.language === 'COBOL')) return 'Hybrid Mainframe + Modern';
    return 'Layered Architecture';
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="spinner w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#111827]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">⬡</span>
                <span className="text-xl font-bold tracking-tight">CHRONOS</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
                <Link href="/repositories" className="text-gray-400 hover:text-white">Repositories</Link>
                <Link href="/scan" className="text-cyan-400">New Scan</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
                ← Back to Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-semibold">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Upload', 'Processing', 'Analysis', 'Report'].map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                  i + 1 <= ['upload','processing','analysis','report'].indexOf(step) + 1
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                <span className="ml-2 text-sm hidden sm:block">{label}</span>
                {i < 3 && <div className="w-16 h-0.5 bg-gray-800 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
              <div className="text-6xl mb-6">📦</div>
              <h2 className="text-2xl font-bold mb-4">Upload Your Codebase</h2>
              <p className="text-gray-400 mb-6">
                Select a ZIP archive or individual source files. Supports COBOL, Java, Python, C/C++, JavaScript, and more.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".zip,.cobol,.cbl,.java,.js,.ts,.py,.c,.cpp,.php,.rb,.pl,.vb,.bas,.asm,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Select Files
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Scanning Codebase</h2>
            <p className="text-gray-400">Analyzing files, detecting dependencies...</p>
          </div>
        )}

        {step === 'analysis' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Generating Intelligence Report</h2>
            <p className="text-gray-400">AI archaeologist is examining your code...</p>
          </div>
        )}

        {step === 'report' && analysis && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: File List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Files Scanned ({files.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {files.map(file => (
                    <div key={file.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-800 last:border-0">
                      <span className="truncate flex-1">{file.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        file.debtScore > 70 ? 'bg-red-500/20 text-red-400' :
                        file.debtScore > 40 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {Math.round(file.debtScore)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center: Graph */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Dependency Graph</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded">Export PNG</button>
                    <Link href={`/repositories/${Date.now()}`} className="px-3 py-1 text-xs bg-cyan-500 text-black rounded hover:bg-cyan-400">
                      View Details
                    </Link>
                  </div>
                </div>
                <div style={{ height: '500px' }}>
                  <DependencyGraph
                    nodes={graphData.nodes}
                    links={graphData.links}
                    onNodeSelect={setSelectedNode}
                    onNodeDoubleClick={(node, content) => console.log('Open file:', node.id)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Report Modal (if step === 'report') */}
        {step === 'report' && analysis && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto bg-gray-900 border border-cyan-500 rounded-xl my-8">
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-cyan-400">📋 Legacy Intelligence Report</h2>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-400">Executive Summary</h3>
                  <p className="text-gray-300 leading-relaxed">{analysis.executiveSummary}</p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-400">Business Domain</h3>
                  <p className="text-gray-300">{analysis.businessDomain}</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-400">Architecture Pattern</h3>
                  <p className="text-gray-300">{analysis.architecturePattern}</p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-400">Top Critical Files</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {analysis.criticalFiles.map((file: string, i: number) => (
                      <li key={i}>{file}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-400">Tech Debt Score</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold" style={{ color: analysis.debtScore > 70 ? '#ef4444' : analysis.debtScore > 40 ? '#f59e0b' : '#10b981' }}>
                      {analysis.debtScore}
                    </div>
                    <div className="text-2xl text-gray-500">/ 100</div>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 via-amber-500 to-red-500"
                      style={{ width: `${analysis.debtScore}%` }}
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2 text-cyan-400">Risk Assessment</h3>
                  <p className="text-gray-300">{analysis.riskAssessment}</p>
                </section>

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button className="px-6 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400">
                    Export PDF Report
                  </button>
                  <button className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
                    Share with Team
                  </button>
                  <Link href="/studio" className="px-6 py-2 bg-green-500 text-black rounded hover:bg-green-400">
                    Start Refactoring
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
