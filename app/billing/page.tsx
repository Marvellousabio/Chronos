'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BillingPage() {
  const [subscription, setSubscription] = useState({
    plan: 'pro',
    status: 'active',
    nextBilling: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    usage: {
      scans: 18,
      scansLimit: 100,
      storage: '2.4 GB',
      storageLimit: '10 GB',
      teamMembers: 3,
      teamLimit: 10,
    },
  });

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        '1 repository',
        '10 scans/month',
        'Basic analysis',
        'Community support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$299',
      period: '/month',
      popular: true,
      features: [
        'Unlimited repositories',
        'Unlimited scans',
        'Advanced AI analysis',
        'Refactor studio',
        'Migration planner',
        'PDF export',
        'Priority support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'SSO / SAML',
        'On-premise option',
        'Dedicated success manager',
        'SLA guarantee',
        'Custom integrations',
      ],
    },
  ];

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
                <Link href="/team" className="text-gray-400 hover:text-white">Team</Link>
                <Link href="/billing" className="text-cyan-400">Billing</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-400 hover:text-white">
                ← Back to Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-semibold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Usage</h1>
          <p className="text-gray-400">Manage your subscription and usage</p>
        </div>

        {/* Current Plan */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-800/30 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">Pro Plan</h2>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                  Active
                </span>
              </div>
              <p className="text-gray-400 mb-4">$299/month • Renews on {subscription.nextBilling}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-cyan-400 font-semibold">{subscription.usage.scans}</span>
                  <span className="text-gray-500"> scans used</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">{subscription.usage.teamMembers}</span>
                  <span className="text-gray-500"> team members</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">{subscription.usage.storage}</span>
                  <span className="text-gray-500"> storage</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded font-medium transition-colors">
                Change Plan
              </button>
              <button className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded hover:bg-red-500/30 transition-colors font-medium">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Usage Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Scans Usage</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{subscription.usage.scans} of {subscription.usage.scansLimit} scans</span>
                <span className="text-cyan-400">18%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${(subscription.usage.scans / subscription.usage.scansLimit) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">Resets on May 1, 2026</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Storage Usage</h3>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{subscription.usage.storage} of {subscription.usage.storageLimit}</span>
                <span className="text-cyan-400">24%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: '24%' }}
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">Includes scanned codebases and generated reports</p>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className=" mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`relative rounded-xl p-6 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-cyan-900/30 to-blue-900/30 border-2 border-cyan-500 scale-105'
                    : 'bg-gray-900/50 border border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-black text-sm font-semibold rounded-full">
                    Current Plan
                  </div>
                )}
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-cyan-400">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded font-medium transition-colors ${
                    plan.id === subscription.plan
                      ? 'bg-cyan-500 text-black'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                  disabled={plan.id === subscription.plan}
                >
                  {plan.id === subscription.plan ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <div className="font-medium">•••• 4242</div>
                <div className="text-sm text-gray-400">Expires 12/25</div>
              </div>
            </div>
            <button className="text-sm text-cyan-400 hover:underline">Update</button>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-800/30">
            <h2 className="font-semibold">Billing History</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {[
              { date: 'Apr 1, 2026', amount: '$299', status: 'Paid' },
              { date: 'Mar 1, 2026', amount: '$299', status: 'Paid' },
              { date: 'Feb 1, 2026', amount: '$299', status: 'Paid' },
            ].map((invoice, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-800/30">
                <div>
                  <div className="font-medium">{invoice.date}</div>
                  <div className="text-sm text-gray-400">Pro Plan</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{invoice.amount}</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">
                    {invoice.status}
                  </span>
                  <button className="text-sm text-cyan-400 hover:underline">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
