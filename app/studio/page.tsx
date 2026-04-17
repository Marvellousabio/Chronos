'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RefactorStudioPage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState<'ts' | 'py' | 'java'>('ts');
  const [explanation, setExplanation] = useState<string>('');
  const [refactoredCode, setRefactoredCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRefactor = async () => {
    if (!selectedFile) return;
    setIsGenerating(true);
    
    // Simulate AI call
    setTimeout(() => {
      setExplanation(`This ${selectedFile.endsWith('.java') ? 'Java' : 'COBOL'} module handles core business logic for account management. It processes deposits, withdrawals, and balance inquiries. The code uses a singleton pattern and contains several legacy anti-patterns including direct database access and exception swallowing.`);
      setRefactoredCode(`// Refactored to TypeScript with modern patterns
export class AccountService {
  private readonly logger: Logger;
  private readonly repository: AccountRepository;
  
  constructor(
    logger: Logger,
    repository: AccountRepository
  ) {
    this.logger = logger;
    this.repository = repository;
  }
  
  async processTransaction(
    accountId: string, 
    amount: number
  ): Promise<TransactionResult> {
    this.logger.info(\`Processing \${amount} for account \${accountId}\`);
    
    // Validation layer
    if (amount <= 0) {
      throw new InvalidTransactionError('Amount must be positive');
    }
    
    // Business logic with proper error handling
    try {
      const account = await this.repository.findById(accountId);
      if (!account) {
        throw new AccountNotFoundError(accountId);
      }
      
      const result = await account.applyTransaction(amount);
      await this.repository.save(account);
      
      return { success: true, transactionId: generateId() };
    } catch (error) {
      this.logger.error('Transaction failed', { error, accountId, amount });
      throw new TransactionProcessingError('Failed to process transaction');
    }
  }
}`);
      setIsGenerating(false);
    }, 2000);
  };

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
                <Link href="/scan" className="text-gray-400 hover:text-white">New Scan</Link>
                <Link href="/studio" className="text-cyan-400">Refactor Studio</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/scan"
                className="px-4 py-2 text-sm font-medium border border-gray-700 rounded hover:border-gray-600 transition-colors"
              >
                ← New Scan
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
          <h1 className="text-3xl font-bold mb-2">AI Refactor Studio</h1>
          <p className="text-gray-400">Transform legacy code into modern, maintainable systems</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel 1: Legacy Code */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-red-400">Legacy Code</h2>
              <select
                value={selectedFile || ''}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm"
              >
                <option value="">Select a file...</option>
                <option value="BankCore.java">BankCore.java</option>
                <option value="TransactionProcessor.java">TransactionProcessor.java</option>
                <option value="INTERFACE.cobol">INTERFACE.cobol</option>
              </select>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed h-96 overflow-y-auto bg-gray-950">
              {selectedFile === 'BankCore.java' ? `public class BankCore {
  private static BankCore instance;
  private Map<String, Object> cache = new HashMap<>();
  
  public static synchronized BankCore getInstance() {
    if (instance == null) {
      instance = new BankCore();
    }
    return instance;
  }
  
  public boolean process() {
    try {
      // 500+ lines of complex logic
      return true;
    } catch (Exception e) {
      return false; // Swallowing exceptions
    }
  }
}` : selectedFile === 'TransactionProcessor.java' ? `public class TransactionProcessor {
  public void process() {
    Connection conn = null;
    try {
      conn = DriverManager.getConnection("jdbc:derby:bankdb");
      // Direct DB access, no connection pool
      // ... 300 more lines
    } catch (SQLException e) {
      // Ignored
    }
  }
}` : selectedFile === 'INTERFACE.cobol' ? `       IDENTIFICATION DIVISION.
       PROGRAM-ID. INTERFACE.
       PROCEDURE DIVISION.
           CALL 'CALCULATION' USING AMOUNT.
           IF AMOUNT > 1000000
               MOVE 'EXCEEDS LIMIT' TO RESULT
           END-IF.
           STOP RUN.` : '// Select a file to view its contents'}
            </pre>
          </div>

          {/* Panel 2: Controls */}
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="font-semibold mb-4">Refactor Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Target Language</label>
                  <div className="flex gap-2">
                    {(['ts', 'py', 'java'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setTargetLang(lang)}
                        className={`px-4 py-2 rounded text-sm transition-colors ${
                          targetLang === lang
                            ? 'bg-cyan-500 text-black'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {lang === 'ts' ? 'TypeScript' : lang === 'py' ? 'Python' : 'Java Spring'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateRefactor}
                  disabled={!selectedFile || isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="spinner w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>✨ Generate Refactor</>
                  )}
                </button>
              </div>
            </div>

            {/* Explanation Panel */}
            {explanation && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h2 className="font-semibold mb-4 text-green-400">📖 Explanation</h2>
                <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
              </div>
            )}

            {/* Refactored Code */}
            {refactoredCode && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="font-semibold text-green-400">Refactored Code</h2>
                  <button className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded">
                    Copy
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed h-96 overflow-y-auto bg-gray-950">
                  {refactoredCode}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Migration Notes */}
        {refactoredCode && (
          <div className="mt-8 bg-amber-900/20 border border-amber-800/30 rounded-xl p-6">
            <h2 className="font-semibold text-amber-400 mb-3">⚠️ Migration Notes</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <strong>Database Connection:</strong> Replace Derby with PostgreSQL. Update connection strings and dialect.</li>
              <li>• <strong>Singleton Pattern:</strong> Replaced with dependency injection for testability.</li>
              <li>• <strong>Error Handling:</strong> Now uses typed exceptions instead of swallowing errors.</li>
              <li>• <strong>Transaction Management:</strong> Added explicit transaction boundaries and rollback handling.</li>
              <li>• <strong>Testing:</strong> Recommend adding unit tests for edge cases: negative amounts, concurrency, concurrent access.</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
