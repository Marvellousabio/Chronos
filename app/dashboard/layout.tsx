import { ReactNode } from "react";
import { 
  Upload, Network, Brain, Terminal, Map, Zap, FileCode2 
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-deep-space text-text-white overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex flex-col border-r border-surface-dark bg-surface-dark/50 relative z-10 backdrop-blur-md">
        <div className="p-6 flex items-center gap-3 border-b border-surface-dark/50">
          <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/30">
            <span className="font-bold text-neon-cyan leading-none">C</span>
          </div>
          <span className="font-bold tracking-wider text-xl text-text-white">Chronos</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-gray uppercase tracking-widest mb-4 px-2">Ingest</p>
          
          <Link href="/dashboard/scan" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-card-dark text-muted-gray hover:text-text-white transition-colors">
            <Upload size={18} />
            <span>Code Upload</span>
          </Link>

          <Link href="/dashboard/visualize" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-card-dark text-muted-gray hover:text-text-white transition-colors">
            <Network size={18} />
            <span>Dependency Graph</span>
          </Link>

          <p className="text-xs font-semibold text-muted-gray uppercase tracking-widest mt-6 mb-4 px-2">Analysis</p>

          <Link href="/dashboard/report" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-card-dark text-muted-gray hover:text-text-white transition-colors">
            <Brain size={18} />
            <span>AI Report</span>
          </Link>

          <Link href="/dashboard/refactor" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-card-dark text-muted-gray hover:text-text-white transition-colors">
            <Terminal size={18} />
            <span>Refactor Terminal</span>
          </Link>

          <p className="text-xs font-semibold text-muted-gray uppercase tracking-widest mt-6 mb-4 px-2">Tools</p>

          <Link href="/dashboard/migration-planner" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-card-dark text-muted-gray hover:text-text-white transition-colors">
            <Map size={18} />
            <span>Migration Planner</span>
          </Link>

          <Link href="/dashboard/automation" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-card-dark text-muted-gray hover:text-text-white transition-colors">
            <Zap size={18} />
            <span>Automation</span>
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative h-full bg-deep-space overflow-y-auto">
        <header className="h-16 flex items-center px-8 border-b border-surface-dark bg-deep-space/80 backdrop-blur-md sticky top-0 z-20 w-full justify-between">
          <h1 className="text-lg font-semibold tracking-wide flex items-center gap-3">
            <span className="text-muted-gray">Project:</span>
            <span className="text-text-white">Demo Banking System</span>
          </h1>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-xs text-neon-cyan">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
              Claude API
            </div>
            <div className="w-8 h-8 rounded-full border border-surface-dark bg-card-dark"></div>
          </div>
        </header>

        <section className="flex-1 relative">
          {children}
        </section>
      </main>
    </div>
  );
}
