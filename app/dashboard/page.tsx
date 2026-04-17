'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalScans: 0,
    avgDebtScore: 0,
    securityIssues: 0,
    recentScans: [],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="spinner w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-white">
      {/* Dashboard Header */}
      <header className="border-b border-gray-800 bg-[#111827]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">⬡</span>
                <span className="text-xl font-bold tracking-tight">CHRONOS</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/dashboard" className="text-cyan-400">Dashboard</Link>
                <Link href="/repositories" className="text-gray-400 hover:text-white transition-colors">Repositories</Link>
                <Link href="/scan" className="text-gray-400 hover:text-white transition-colors">New Scan</Link>
                <Link href="/team" className="text-gray-400 hover:text-white transition-colors">Team</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/repositories/new"
                className="px-4 py-2 text-sm font-medium bg-cyan-500 text-black rounded hover:bg-cyan-400 transition-colors"
              >
                + New Repository
              </Link>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-semibold">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name}</h1>
          <p className="text-gray-400">Here's an overview of your code modernization progress.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total Repositories',
              value: stats.totalRepos.toString(),
              change: '+2 this week',
              positive: true,
              color: 'bg-blue-500',
            },
            {
              label: 'Technical Debt Score',
              value: `${Math.round(stats.avgDebtScore)}/100`,
              change: '-12% improvement',
              positive: true,
              color: 'bg-amber-500',
            },
            {
              label: 'Security Issues',
              value: stats.securityIssues.toString(),
              change: '8 critical',
              positive: false,
              color: 'bg-red-500',
            },
            {
              label: 'Scans Completed',
              value: stats.totalScans.toString(),
              change: '+15 this month',
              positive: true,
              color: 'bg-green-500',
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{metric.label}</span>
                <div className={`w-2 h-2 rounded-full ${metric.color}`} />
              </div>
              <div className="text-3xl font-bold mb-1">{metric.value}</div>
              <div className={`text-xs ${metric.positive ? 'text-green-400' : 'text-amber-400'}`}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Upload Repository', icon: '📤', link: '/repositories/new' },
                { label: 'Run Deep Scan', icon: '🔬', link: '/scan/new' },
                { label: 'View Reports', icon: '📊', link: '/reports' },
                { label: 'Team Access', icon: '👥', link: '/team' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.link}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-xs text-gray-300">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Subscription</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Current Plan</span>
              <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded font-medium">
                Pro Trial
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• 25 scans remaining</p>
              <p>• 5 team members</p>
              <p>• Renews in 14 days</p>
            </div>
            <Link
              href="/billing"
              className="block w-full mt-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-center transition-colors"
            >
              Manage Billing
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Scans</h2>
            <Link href="/repositories" className="text-sm text-cyan-400 hover:underline">
              View All
            </Link>
          </div>
          {stats.recentScans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">📡</div>
              <p>No scans yet. Upload your first repository to get started.</p>
              <Link
                href="/repositories/new"
                className="inline-block mt-4 px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition-colors"
              >
                Upload Repository
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentScans.map((scan: any) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <div className="font-medium">{scan.repositoryName}</div>
                    <div className="text-sm text-gray-400">
                      {scan.type} • {new Date(scan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      scan.status === 'COMPLETED'
                        ? 'bg-green-500/10 text-green-400'
                        : scan.status === 'FAILED'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {scan.status}
                    </span>
                    <Link
                      href={`/repositories/${scan.repositoryId}`}
                      className="text-cyan-400 hover:underline text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
