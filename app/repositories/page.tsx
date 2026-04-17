'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { ProcessedFile, GraphNode } from "@/types";
import dynamic from "next/dynamic";

const DependencyGraph = dynamic(() => import("@/components/DependencyGraph"), {
  ssr: false,
});

export default function RepositoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<any[]>([]);
  const [currentRepo, setCurrentRepo] = useState<any>(null);
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [view, setView] = useState<'list' | 'graph'>('list');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleFilesProcessed = (processedFiles: ProcessedFile[]) => {
    setFiles(processedFiles);
    const nodes: GraphNode[] = processedFiles.map(f => ({
      ...f,
      x: Math.random() * 800,
      y: Math.random() * 600,
    }));
    setGraphNodes(nodes);
    setView('graph');
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
                <Link href="/repositories" className="text-cyan-400">Repositories</Link>
                <Link href="/scan" className="text-gray-400 hover:text-white">New Scan</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/repositories/new"
                className="px-4 py-2 text-sm font-medium bg-cyan-500 text-black rounded hover:bg-cyan-400 transition-colors"
              >
                + Add Repository
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Repositories</h1>
            <p className="text-gray-400">Manage and analyze your codebases</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setView('graph')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                view === 'graph'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Graph View
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-xl p-8 mb-8">
          <FileUpload onFilesProcessed={handleFilesProcessed} />
          <p className="text-sm text-gray-500 mt-4">
            Supported: ZIP archives, individual source files (COBOL, Java, JS, TS, Python, C/C++, PHP, etc.)
          </p>
        </div>

        {/* View Toggle */}
        {view === 'list' ? (
          <div className="grid gap-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-colors cursor-pointer"
                onClick={() => setCurrentRepo(repo)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{repo.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{repo.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">{repo.primaryLanguage}</span>
                      <span className="text-gray-500">{repo.totalFiles} files</span>
                      <span className="text-gray-500">{repo.totalLines?.toLocaleString()} LOC</span>
                      {repo.techDebtScore && (
                        <span className={`px-2 py-1 rounded ${
                          repo.techDebtScore > 70
                            ? 'bg-red-500/10 text-red-400'
                            : repo.techDebtScore > 40
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          Debt: {Math.round(repo.techDebtScore)}/100
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/repositories/${repo.id}`}
                      className="px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          currentRepo && files.length > 0 && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4" style={{ height: '70vh' }}>
              <DependencyGraph
                nodes={graphNodes}
                links={[]}
                onNodeSelect={(node) => console.log('Selected:', node)}
                onNodeDoubleClick={(node, content) => console.log('Open:', node)}
              />
            </div>
          )
        )}
      </main>
    </div>
  );
}
