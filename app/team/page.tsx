'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin', avatar: 'J' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@company.com', role: 'Developer', avatar: 'S' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Viewer', avatar: 'M' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

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
                <Link href="/team" className="text-cyan-400">Team</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/billing" className="px-4 py-2 text-sm font-medium border border-gray-700 rounded hover:border-gray-600 transition-colors">
                Billing
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
            <h1 className="text-3xl font-bold mb-2">Team Collaboration</h1>
            <p className="text-gray-400">Manage members and permissions</p>
          </div>
          <button className="px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 font-medium">
            + Invite Member
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-1">Total Members</div>
            <div className="text-2xl font-bold text-cyan-400">{members.length}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-1">Active Repos</div>
            <div className="text-2xl font-bold text-green-400">12</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-1">Pending Invites</div>
            <div className="text-2xl font-bold text-amber-400">2</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Members List */}
          <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 bg-gray-800/30">
              <h2 className="font-semibold">Team Members</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {members.map(member => (
                <div key={member.id} className="p-4 hover:bg-gray-800/30 transition-colors flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-semibold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-400">{member.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      member.role === 'Admin' ? 'bg-red-500/20 text-red-400' :
                      member.role === 'Developer' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {member.role}
                    </span>
                    <button className="text-gray-400 hover:text-white">⚙️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Panel */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold mb-4">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="colleague@company.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Viewer">Viewer</option>
                  <option value="Developer">Developer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button className="w-full py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition-colors font-medium">
                Send Invite
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="font-semibold mb-3">Permissions Overview</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Admin</span>
                  <span>Full access, manage team</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Developer</span>
                  <span>Scan, analyze, refactor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Viewer</span>
                  <span>Read-only access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="font-semibold mb-4">Recent Team Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-cyan-400">Sarah</span>
              <span className="text-gray-400">completed scan on</span>
              <span className="text-white">payment-module</span>
              <span className="text-gray-500 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-cyan-400">Mike</span>
              <span className="text-gray-400">commented on</span>
              <span className="text-white">legacy-utils.cbl</span>
              <span className="text-gray-500 ml-auto">5 hours ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-cyan-400">John</span>
              <span className="text-gray-400">generated refactor for</span>
              <span className="text-white">AccountService.java</span>
              <span className="text-gray-500 ml-auto">1 day ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
