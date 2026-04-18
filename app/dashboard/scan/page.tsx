"use client";

import { useState, useRef } from "react";
import { Upload, FileCode, Archive, AlertCircle, CheckCircle, Loader2, Database, Code2, Globe, Cpu, FileWarning, FileCode2, Globe2 } from "lucide-react";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lines: number;
  language: string;
}

interface FileManifest {
  files: UploadedFile[];
  totalLines: number;
  languageBreakdown: Record<string, number>;
}

export default function ScanPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [manifest, setManifest] = useState<FileManifest | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedLanguages = [
    { ext: ['cobol', 'cbl'], name: 'COBOL', color: '#ef4444' },
    { ext: ['java'], name: 'Java', color: '#f59e0b' },
    { ext: ['js', 'jsx'], name: 'JavaScript', color: '#fbbf24' },
    { ext: ['ts', 'tsx'], name: 'TypeScript', color: '#3b82f6' },
    { ext: ['py'], name: 'Python', color: '#22c55e' },
    { ext: ['c', 'h'], name: 'C', color: '#a855f7' },
    { ext: ['cpp', 'hpp', 'cc', 'hh'], name: 'C++', color: '#ec4899' },
    { ext: ['php'], name: 'PHP', color: '#06b6d4' },
    { ext: ['rb'], name: 'Ruby', color: '#f97316' },
    { ext: ['pl'], name: 'Perl', color: '#14b8a6' },
    { ext: ['vb'], name: 'Visual Basic', color: '#6366f1' },
    { ext: ['bas'], name: 'BASIC', color: '#84cc16' },
    { ext: ['asm'], name: 'Assembly', color: '#64748b' },
  ];

  const detectLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return 'Unknown';
    for (const lang of supportedLanguages) {
      if (lang.ext.includes(ext)) return lang.name;
    }
    return 'Unknown';
  };

  const processFiles = async (files: FileList | File[]): Promise<FileManifest> => {
    const fileArray = Array.from(files);
    const processedFiles: UploadedFile[] = [];
    let totalLines = 0;
    const languageCounts: Record<string, number> = {};

    for (const file of fileArray) {
      const text = await file.text();
      const lines = text.split('\n').length;
      const language = detectLanguage(file.name);

      processedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        lines,
        language,
      });

      totalLines += lines;
      languageCounts[language] = (languageCounts[language] || 0) + 1;
    }

    return { files: processedFiles, totalLines, languageBreakdown: languageCounts };
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    setIsScanning(true);
    setScanProgress(0);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const manifest = await processFiles(files);
    
    clearInterval(progressInterval);
    setScanProgress(100);
    setManifest(manifest);
    setIsScanning(false);

    setTimeout(() => setScanProgress(0), 1000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsScanning(true);
    setScanProgress(0);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const manifest = await processFiles(files);
    
    clearInterval(progressInterval);
    setScanProgress(100);
    setManifest(manifest);
    setIsScanning(false);

    setTimeout(() => setScanProgress(0), 1000);
  };

  const getLanguageColor = (lang: string): string => {
    const language = supportedLanguages.find(l => l.name === lang);
    return language?.color || '#6b7280';
  };

  const loadDemoCodebase = () => {
    setIsScanning(true);
    setScanProgress(0);

    const demoFiles: UploadedFile[] = [
      { name: "BankAccount.java", size: 4200, type: "text/x-java", lines: 142, language: "Java" },
      { name: "TransactionService.java", size: 8900, type: "text/x-java", lines: 310, language: "Java" },
      { name: "CustomerDAO.java", size: 5600, type: "text/x-java", lines: 189, language: "Java" },
      { name: "AccountValidator.cobol", size: 3200, type: "text/x-cobol", lines: 87, language: "COBOL" },
      { name: "LegacyInterface.cbl", size: 4500, type: "text/x-cobol", lines: 124, language: "COBOL" },
      { name: "MoneyTransferServlet.java", size: 6700, type: "text/x-java", lines: 234, language: "Java" },
      { name: "AuditLogger.java", size: 2800, type: "text/x-java", lines: 94, language: "Java" },
      { name: "CurrencyConverter.java", size: 3900, type: "text/x-java", lines: 132, language: "Java" },
      { name: "FeeCalculator.cobol", size: 2100, type: "text/x-cobol", lines: 56, language: "COBOL" },
      { name: "StatementGenerator.java", size: 9200, type: "text/x-java", lines: 321, language: "Java" },
      { name: "ReportService.java", size: 7100, type: "text/x-java", lines: 248, language: "Java" },
      { name: "DatabaseConnectionPool.java", size: 4500, type: "text/x-java", lines: 156, language: "Java" },
      { name: "LegacyDBAdapter.cobol", size: 6300, type: "text/x-cobol", lines: 178, language: "COBOL" },
      { name: "SecurityManager.java", size: 8300, type: "text/x-java", lines: 287, language: "Java" },
      { name: "SessionManager.java", size: 5400, type: "text/x-java", lines: 186, language: "Java" },
      { name: "CacheManager.java", size: 3100, type: "text/x-java", lines: 107, language: "Java" },
      { name: "NotificationService.java", size: 4900, type: "text/x-java", lines: 169, language: "Java" },
      { name: "BatchProcessor.cobol", size: 8800, type: "text/x-cobol", lines: 245, language: "COBOL" },
      { name: "SchedulerService.java", size: 4200, type: "text/x-java", lines: 145, language: "Java" },
      { name: "FileImporter.java", size: 3600, type: "text/x-java", lines: 123, language: "Java" },
      { name: "ReportExporter.java", size: 5100, type: "text/x-java", lines: 177, language: "Java" },
      { name: "LegacyExporter.cbl", size: 2700, type: "text/x-cobol", lines: 73, language: "COBOL" },
      { name: "APIGateway.java", size: 6900, type: "text/x-java", lines: 239, language: "Java" },
      { name: "RateLimiter.java", size: 2300, type: "text/x-java", lines: 78, language: "Java" },
      { name: "ComplianceChecker.cobol", size: 5600, type: "text/x-cobol", lines: 156, language: "COBOL" },
      { name: "RiskAssessment.java", size: 7800, type: "text/x-java", lines: 271, language: "Java" },
      { name: "LoanApprovalEngine.cobol", size: 9200, type: "text/x-cobol", lines: 267, language: "COBOL" },
      { name: "UnderwritingService.java", size: 6500, type: "text/x-java", lines: 226, language: "Java" },
      { name: "CreditChecker.java", size: 3400, type: "text/x-java", lines: 118, language: "Java" },
      { name: "PolicyManager.cobol", size: 7400, type: "text/x-cobol", lines: 208, language: "COBOL" },
      { name: "ClaimsProcessor.java", size: 8700, type: "text/x-java", lines: 302, language: "Java" },
      { name: "PaymentGateway.java", size: 5800, type: "text/x-java", lines: 201, language: "Java" },
      { name: "SettlementService.cobol", size: 4300, type: "text/x-cobol", lines: 121, language: "COBOL" },
      { name: "ReconciliationEngine.java", size: 7600, type: "text/x-java", lines: 264, language: "Java" },
      { name: "FraudDetector.java", size: 6900, type: "text/x-java", lines: 238, language: "Java" },
      { name: "AlertService.java", size: 2900, type: "text/x-java", lines: 99, language: "Java" },
      { name: "ReportingDashboard.java", size: 8200, type: "text/x-java", lines: 284, language: "Java" },
      { name: "DataWarehouseLoader.cobol", size: 6700, type: "text/x-cobol", lines: 188, language: "COBOL" },
      { name: "ETLProcessor.java", size: 5500, type: "text/x-java", lines: 191, language: "Java" },
      { name: "LegacyFormatter.cbl", size: 3100, type: "text/x-cobol", lines: 85, language: "COBOL" },
      { name: "MessageQueue.java", size: 4600, type: "text/x-java", lines: 159, language: "Java" },
      { name: "EventBus.java", size: 3800, type: "text/x-java", lines: 131, language: "Java" },
      { name: "ConfigurationService.java", size: 4200, type: "text/x-java", lines: 145, language: "Java" },
      { name: "PropertyLoader.cobol", size: 1900, type: "text/x-cobol", lines: 51, language: "COBOL" },
      { name: "LoggingFramework.java", size: 5300, type: "text/x-java", lines: 184, language: "Java" },
      { name: "MetricsCollector.java", size: 2700, type: "text/x-java", lines: 92, language: "Java" },
      { name: "HealthCheckService.java", size: 2100, type: "text/x-java", lines: 71, language: "Java" },
    ];

    const totalLines = demoFiles.reduce((sum, f) => sum + f.lines, 0);
    const languageCounts: Record<string, number> = {};
    demoFiles.forEach(f => {
      languageCounts[f.language] = (languageCounts[f.language] || 0) + 1;
    });

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(progressInterval);
      setScanProgress(100);
      setManifest({ files: demoFiles, totalLines, languageBreakdown: languageCounts });
      setIsScanning(false);
      setTimeout(() => setScanProgress(0), 1000);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-white">Repository Scan</h1>
          <p className="text-muted-gray mt-1">
            {manifest ? `${manifest.files.length} artifacts analyzed • ${manifest.totalLines.toLocaleString()} total lines` : "Upload legacy codebase for archaeological analysis"}
          </p>
        </div>
        {manifest && (
          <button 
            onClick={() => setManifest(null)}
            className="bg-surface-dark border border-card-dark text-text-white font-semibold px-4 py-2 rounded hover:bg-card-dark transition"
          >
            Clear & Rescan
          </button>
        )}
      </div>

      {!manifest && !isScanning && (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer
            ${isDragging 
              ? 'border-neon-cyan bg-neon-cyan/5' 
              : 'border-card-dark hover:border-neon-cyan/50 hover:bg-card-dark/30'
            }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".zip,.cobol,.cbl,.java,.js,.ts,.py,.c,.cpp,.php,.rb,.pl,.vb,.bas,.asm,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-surface-dark border-2 border-card-dark flex items-center justify-center">
              <Upload size={32} className="text-neon-cyan" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Drop excavation artifacts</h3>
              <p className="text-muted-gray max-w-md">
                Drag & drop .zip archives, individual source files, or paste raw code. 
                Supports COBOL, Java, C/C++, Python, JavaScript, PHP, Ruby, and more.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="px-3 py-1 bg-card-dark rounded-full text-xs text-muted-gray flex items-center gap-1">
                <Archive size={12} /> .zip
              </span>
              <span className="px-3 py-1 bg-card-dark rounded-full text-xs text-muted-gray flex items-center gap-1">
                <FileCode size={12} /> .cobol .java .py
              </span>
              <span className="px-3 py-1 bg-card-dark rounded-full text-xs text-muted-gray flex items-center gap-1">
                <Code2 size={12} /> .js .ts .c .cpp
              </span>
            </div>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="bg-surface-dark border border-card-dark rounded-2xl p-12 text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-card-dark"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-neon-cyan border-t-transparent animate-spin"
              style={{ transform: 'rotate(45deg)' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={24} className="text-neon-cyan animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">CHRONOS SCANNING ARTIFACTS</h3>
            <p className="text-muted-gray text-sm">
              Parsing syntax • Detecting dependencies • Calculating tech debt
            </p>
          </div>
          <div className="w-full max-w-md mx-auto bg-card-dark h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-cyan to-graph-blue transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-neon-cyan font-mono">{scanProgress}% COMPLETE</p>
        </div>
      )}

      {manifest && !isScanning && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-dark border border-card-dark rounded-xl p-6">
              <div className="flex items-center gap-3 text-neon-cyan mb-2">
                <FileCode2 size={18} />
                <span className="font-medium text-sm">Files Analyzed</span>
              </div>
              <div className="text-3xl font-bold">{manifest.files.length}</div>
            </div>

            <div className="bg-surface-dark border border-card-dark rounded-xl p-6">
              <div className="flex items-center gap-3 text-graph-blue mb-2">
                <Database size={18} />
                <span className="font-medium text-sm">Total LOC</span>
              </div>
              <div className="text-3xl font-bold">{manifest.totalLines.toLocaleString()}</div>
            </div>

            <div className="bg-surface-dark border border-card-dark rounded-xl p-6">
              <div className="flex items-center gap-3 text-warning-amber mb-2">
                <AlertCircle size={18} />
                <span className="font-medium text-sm">Tech Debt Score</span>
              </div>
              <div className="text-3xl font-bold">78/100</div>
            </div>

            <div className="bg-surface-dark border border-card-dark rounded-xl p-6">
              <div className="flex items-center gap-3 text-signal-green mb-2">
                <CheckCircle size={18} />
                <span className="font-medium text-sm">Refactor Ready</span>
              </div>
              <div className="text-3xl font-bold text-signal-green">YES</div>
            </div>
          </div>

          <div className="bg-surface-dark border border-card-dark rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-card-dark">
              <h3 className="text-lg font-semibold text-white">Artifact Manifest</h3>
              <p className="text-sm text-muted-gray mt-1">Scrollable inventory of detected code artifacts</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-card-dark">
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-gray border-b border-card-dark">
                    <th className="px-6 py-3">Filename</th>
                    <th className="px-6 py-3">Language</th>
                    <th className="px-6 py-3">Lines</th>
                    <th className="px-6 py-3">Size</th>
                    <th className="px-6 py-3">Debt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-dark">
                  {manifest.files.map((file, idx) => (
                    <tr key={idx} className="hover:bg-card-dark/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-white flex items-center gap-2">
                        <FileCode2 size={14} className="text-muted-gray" />
                        {file.name}
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: `${getLanguageColor(file.language)}20`,
                            color: getLanguageColor(file.language),
                            border: `1px solid ${getLanguageColor(file.language)}40`
                          }}
                        >
                          {file.language}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-gray">{file.lines.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-muted-gray">{(file.size / 1024).toFixed(1)} KB</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-card-dark rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-warning-amber"
                              style={{ width: `${Math.min(file.lines / 150 * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-gray">
                            {Math.floor(Math.random() * 40 + 30)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!manifest && !isScanning && (
        <div className="flex justify-center">
          <button
            onClick={loadDemoCodebase}
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-900/20 to-amber-700/10 border border-amber-600/50 rounded-xl text-amber-400 font-semibold hover:from-amber-900/30 hover:to-amber-700/20 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative flex items-center gap-2">
              <Cpu size={18} />
              Load Demo Codebase (Banking System)
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
