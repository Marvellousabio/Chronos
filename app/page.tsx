export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1020] to-[#111827] text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-2">
                <span className="text-2xl">⬡</span>
                <span className="text-xl font-bold tracking-tight">CHRONOS</span>
              </a>
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="/auth/signin" className="px-4 py-2 text-sm font-medium hover:text-cyan-400 transition-colors">
                Sign In
              </a>
              <a
                href="/auth/signup"
                className="px-4 py-2 text-sm font-medium bg-cyan-500 text-black rounded hover:bg-cyan-400 transition-colors"
              >
                Start Free Audit
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            AI-Powered Code Archaeology
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Understand Legacy Code.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Modernize With Confidence.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Map thousands of files, uncover hidden dependencies, detect risks, and safely refactor aging systems using advanced AI. Transform chaos into clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/auth/signup"
              className="px-8 py-4 text-lg font-semibold bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/30"
            >
              Start Free Audit
            </a>
            <a
              href="#demo"
              className="px-8 py-4 text-lg font-semibold border border-gray-700 rounded-lg hover:border-gray-600 transition-all flex items-center gap-2"
            >
              <span>▶</span> Watch Demo
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            No credit card required • Scan 1 repository free • See results in minutes
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-y border-gray-800 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-400">50M+</div>
              <div className="text-sm text-gray-500">Lines of Code Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">10,000+</div>
              <div className="text-sm text-gray-500">Files Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400">97%</div>
              <div className="text-sm text-gray-500">Risk Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">500+</div>
              <div className="text-sm text-gray-500">Enterprises Trust Chronos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">The Legacy Trap is Real.</h2>
              <p className="text-lg text-gray-400 mb-6">
                Your core systems run on decades-old code. Original developers are gone. Documentation is missing. Architecture is a mystery. One wrong change can bring down the business.
              </p>
              <ul className="space-y-4">
                {[
                  'No one understands the full system',
                  'Dependencies are tangled and undocumented',
                  'Tests fail or don\'t exist',
                  'Deployments are terrifying',
                  'Modernization feels impossible',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-800/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-400">The Chaos</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`/legacy
├── cobol/          ← Who knows?
├── old-java/       ← 500k lines
├── php-modules/    ← No tests
├── vb6-apps/       ← Unsupported
├── scripts/        ← Written in 1999
└── configs/        ← Magic numbers`}
              </pre>
            </div>
          </div>

          <div className="mt-20 grid lg:grid-cols-2 gap-16 items-center">
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-800/30 rounded-2xl p-8 order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">The Clarity</h3>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`/migration-plan
├── phase-1-stabilize/
│   ├── write-tests/
│   └── identify-critical/
├── phase-2-isolate/
│   ├── extract-services/
│   └── document-apis/
├── phase-3-modernize/
│   ├── rewrite-core/
│   └── deploy-cloud/
└── phase-4-optimize/
    ├── performance/
    └── scale-architecture`}
              </pre>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold mb-6">Chronos Brings Order to Chaos.</h2>
              <p className="text-lg text-gray-400 mb-6">
                Upload your repository, let our AI scan and analyze, and get a complete modernization blueprint. We map every file, every dependency, every risk.
              </p>
              <ul className="space-y-4">
                {[
                  'Complete architecture visualization',
                  'Automated risk detection',
                  'AI-generated refactor plans',
                  'Step-by-step migration roadmap',
                  'Real-time progress tracking',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Chronos Works</h2>
            <p className="text-xl text-gray-400">Three simple steps to modernization clarity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect & Scan',
                description: 'Upload your repository or connect GitHub/GitLab. Chronos scans every file, detecting languages, dependencies, and potential issues.',
                icon: '📡',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI archaeologist analyzes your codebase, mapping relationships, identifying bottlenecks, and generating insights in minutes.',
                icon: '🔍',
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: '03',
                title: 'Modernize',
                description: 'Receive a complete modernization plan with refactored code, migration phases, and estimated effort. Execute with confidence.',
                icon: '🚀',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((feature) => (
              <div
                key={feature.step}
                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all group"
              >
                <div className={`text-4xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  {feature.icon}
                </div>
                <div className="text-sm font-semibold text-gray-500 mb-2">STEP {feature.step}</div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Intelligence Report Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Legacy Intelligence Report</h2>
            <p className="text-xl text-gray-400">AI-generated insights that feel like consulting with a senior architect</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Executive Summary', icon: '📋', color: 'bg-blue-500/10 border-blue-500/20' },
              { label: 'Architecture Map', icon: '🗺️', color: 'bg-purple-500/10 border-purple-500/20' },
              { label: 'Risk Assessment', icon: '⚠️', color: 'bg-amber-500/10 border-amber-500/20' },
              { label: 'Refactor Blueprint', icon: '🛠️', color: 'bg-green-500/10 border-green-500/20' },
              { label: 'Migration Roadmap', icon: '🛣️', color: 'bg-pink-500/10 border-pink-500/20' },
              { label: 'Code Rewrites', icon: '✍️', color: 'bg-cyan-500/10 border-cyan-500/20' },
              { label: 'Test Generation', icon: '🧪', color: 'bg-orange-500/10 border-orange-500/20' },
              { label: 'Export PDF', icon: '📄', color: 'bg-gray-500/10 border-gray-500/20' },
            ].map((item) => (
              <div
                key={item.label}
                className={`p-4 rounded-lg border ${item.color} hover:bg-opacity-20 transition-all cursor-pointer`}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-medium text-gray-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: [
                  '1 repository scan',
                  'Basic dependency graph',
                  'Executive summary',
                  'Community support',
                ],
                cta: 'Start Free',
                href: '/auth/signup',
              },
              {
                name: 'Pro',
                price: '$299',
                period: '/month',
                popular: true,
                features: [
                  'Unlimited repositories',
                  'Advanced AI analysis',
                  'Refactor studio access',
                  'Migration planner',
                  'Priority support',
                  'PDF export',
                ],
                cta: 'Start Pro Trial',
                href: '/auth/signup?plan=pro',
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                features: [
                  'Everything in Pro',
                  'On-premise deployment',
                  'Dedicated success manager',
                  'Custom integrations',
                  'SLA guarantee',
                  'SSO / SAML',
                  'Audit logs',
                ],
                cta: 'Contact Sales',
                href: '/contact',
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-cyan-900/30 to-blue-900/30 border-2 border-cyan-500 scale-105'
                    : 'bg-gray-900/50 border border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-500 text-black text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <span className="text-cyan-400">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Tame Your Legacy Code?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join hundreds of companies using Chronos to modernize with confidence.
          </p>
          <a
            href="/auth/signup"
            className="inline-block px-10 py-4 text-lg font-bold bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25"
          >
            Start Your Free Audit
          </a>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⬡</span>
              <span className="text-lg font-bold">CHRONOS</span>
            </div>
            <div className="text-sm text-gray-500">
              © 2026 Chronos AI. All rights reserved.
            </div>
            <div className="flex gap-4 text-sm">
              <a href="/privacy" className="text-gray-500 hover:text-white">Privacy</a>
              <a href="/terms" className="text-gray-500 hover:text-white">Terms</a>
              <a href="/docs" className="text-gray-500 hover:text-white">Docs</a>
              <a href="/contact" className="text-gray-500 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
