'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MigrationPlannerPage() {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [tasks, setTasks] = useState([
    { id: 1, title: "Write integration tests for core modules", phase: 1, priority: "critical", assignee: "John", status: "pending" },
    { id: 2, title: "Identify all external API dependencies", phase: 1, priority: "high", assignee: "Sarah", status: "in-progress" },
    { id: 3, title: "Set up monitoring and alerting", phase: 1, priority: "high", assignee: "Mike", status: "pending" },
    { id: 4, title: "Create service boundaries from monolith", phase: 2, priority: "critical", assignee: "Team A", status: "pending" },
    { id: 5, title: "Implement API gateway", phase: 2, priority: "high", assignee: "Team B", status: "pending" },
    { id: 6, title: "Extract user management service", phase: 2, priority: "medium", assignee: "John", status: "pending" },
    { id: 7, title: "Rewrite payment processing in TypeScript", phase: 3, priority: "critical", assignee: "Sarah", status: "pending" },
    { id: 8, title: "Deploy to cloud infrastructure", phase: 3, priority: "high", assignee: "DevOps", status: "pending" },
    { id: 9, title: "Performance optimization & load testing", phase: 4, priority: "medium", assignee: "Mike", status: "pending" },
  ]);

  const phases = [
    { id: 1, name: "Stabilize", description: "Test coverage, monitoring, baseline", duration: "2-3 weeks", color: "bg-blue-500" },
    { id: 2, name: "Isolate", description: "Extract services, define boundaries", duration: "4-6 weeks", color: "bg-purple-500" },
    { id: 3, name: "Modernize", description: "Rewrite core, deploy cloud", duration: "8-12 weeks", color: "bg-green-500" },
    { id: 4, name: "Optimize", description: "Performance, scale, refine", duration: "2-4 weeks", color: "bg-amber-500" },
  ];

  const filteredTasks = tasks.filter(t => t.phase === selectedPhase || selectedPhase === 0);
  const totalWeeks = phases.reduce((acc, p) => acc + parseInt(p.duration), 0);

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
                <Link href="/scan" className="text-gray-400 hover:text-white">Scan</Link>
                <Link href="/studio" className="text-gray-400 hover:text-white">Studio</Link>
                <Link href="/migration" className="text-cyan-400">Migration</Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Migration Planner</h1>
          <p className="text-gray-400">Phased roadmap from legacy to modern architecture</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-1">Total Duration</div>
            <div className="text-2xl font-bold text-cyan-400">~16 weeks</div>
            <div className="text-xs text-gray-500 mt-1">4 development phases</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-1">Estimated Effort</div>
            <div className="text-2xl font-bold text-amber-400">1,240 hrs</div>
            <div className="text-xs text-gray-500 mt-1">~3 engineers full-time</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-1">Risk Level</div>
            <div className="text-2xl font-bold text-red-400">High</div>
            <div className="text-xs text-gray-500 mt-1">Careful planning required</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-1">Budget Estimate</div>
            <div className="text-2xl font-bold text-green-400">$287K</div>
            <div className="text-xs text-gray-500 mt-1">Including contingency</div>
          </div>
        </div>

        {/* Phase Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {phases.map(phase => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                selectedPhase === phase.id
                  ? `${phase.color} text-black`
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="text-lg">Phase {phase.id}: {phase.name}</div>
              <div className="text-sm opacity-75">{phase.duration}</div>
            </button>
          ))}
          <button
            onClick={() => setSelectedPhase(0)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              selectedPhase === 0
                ? 'bg-cyan-500 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div className="text-lg">All Tasks</div>
            <div className="text-sm opacity-75">{tasks.length} total</div>
          </button>
        </div>

        {/* Tasks List */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-800/30">
            <h2 className="font-semibold">
              {selectedPhase === 0 ? 'All Migration Tasks' : `Phase ${selectedPhase}: ${phases.find(p => p.id === selectedPhase)?.name}`}
            </h2>
          </div>
          <div className="divide-y divide-gray-800">
            {filteredTasks.map(task => (
              <div key={task.id} className="p-4 hover:bg-gray-800/30 transition-colors flex items-center gap-4">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600" />
                <div className="flex-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500">Assigned to {task.assignee}</div>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-medium ${
                  task.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                  task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {task.priority.toUpperCase()}
                </div>
                <div className={`px-3 py-1 rounded text-xs ${
                  task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  task.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {task.status.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 font-semibold">
            📄 Export Roadmap PDF
          </button>
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-semibold">
            📊 Generate Gantt Chart
          </button>
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-semibold">
            💬 Share with Team
          </button>
        </div>
      </main>
    </div>
  );
}
