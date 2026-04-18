"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Terminal, Play, RotateCcw, FileCode, Zap, AlertTriangle, 
  CheckCircle, Loader2, ChevronRight, GitBranch, Clock, Download,
  Copy, Eye, EyeOff 
} from "lucide-react";

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "info";
  content: string;
  timestamp: Date;
}

export default function RefactorPage() {
  const [command, setCommand] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "info", content: "CHRONOS REFACTOR ENGINE v2.4.1", timestamp: new Date() },
    { type: "info", content: "Connected to Anthropic Claude API", timestamp: new Date() },
    { type: "success", content: "System ready. Awaiting refactor commands.", timestamp: new Date() },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    { cmd: "refactor BankAccount.java --target=typescript", desc: "Modernize to TypeScript" },
    { cmd: "explain CustomerDAO.java", desc: "Plain English explanation" },
    { cmd: "scan --deep --circular", desc: "Find circular dependencies" },
    { cmd: "test --generate", desc: "Generate missing tests" },
    { cmd: "risk --module=TransactionService", desc: "Module risk assessment" },
  ];

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setLines(prev => [...prev, { type: "input", content: `$ ${trimmed}`, timestamp: new Date() }]);
    setIsProcessing(true);

    try {
      if (trimmed === "help") {
        setLines(prev => [...prev, {
          type: "output",
          content: `CHRONOS REFACTOR COMMANDS:
            
  refactor <file> [--target=<lang>]  Modernize a legacy file
  explain <file>                     Plain English explanation
  scan [options]                     Deep code analysis
  test [--generate]                  Test analysis/generation
  risk [--module=<name>]             Risk assessment
  deps [--circular]                  Dependency analysis
  optimize <file>                    Performance improvements
  security <file>                    Security audit

EXAMPLES:
  refactor LegacyDBAdapter.cobol --target=python
  scan --deep --visualize
  risk --module=PaymentGateway`,
          timestamp: new Date()
        }]);
      } else if (trimmed.startsWith("refactor ")) {
        const parts = trimmed.split(" ");
        const file = parts[1];
        const targetMatch = trimmed.match(/--target=(\w+)/);
        const target = targetMatch ? targetMatch[1] : "typescript";
        
        setLines(prev => [...prev, {
          type: "info",
          content: `\n⬡ CHRONOS ANALYZING ${file}...`,
          timestamp: new Date()
        }]);
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        setLines(prev => [...prev, 
          {
            type: "success",
            content: `Refactor blueprint generated for ${file}\nTarget: ${target.toUpperCase()}\nEstimated effort: 3-5 days`,
            timestamp: new Date()
          },
          {
            type: "output",
            content: `\n═══ MODERNIZATION BLUEPRINT ═══\n\n1. DIRECT MAPPING\n   Legacy: COBOL paragraph structure\n   Modern: ${target === "typescript" ? "class methods" : "functions"} with clear separation\n\n2. DATA TYPE CONVERSION\n   COMP-3 packed decimal → ${target === "typescript" ? "number" : "Decimal"}\n   PIC X(20) → string\n\n3. TRANSACTION WRAPPER\n   Legacy: PERFORM ... END-PERFORM\n   Modern: Atomic transactions with rollback\n\n4. ERROR HANDLING\n   Legacy: GOTO error-handler\n   Modern: Try-catch with structured logging\n\n5. API SURFACE\n   Expose as REST endpoint or message queue consumer\n\n═══ RISK FACTORS ═══\n• Data migration validation required\n• Performance benchmarking needed\n• Integration testing critical`,
            timestamp: new Date()
          }
        ]);
      } else if (trimmed.startsWith("explain ")) {
        const file = trimmed.split(" ")[1];
        setLines(prev => [...prev, {
          type: "output",
          content: `\n═══ PLAIN ENGLISH EXPLANATION: ${file} ═══\n\nThis module handles ${file.includes("Account") ? "account management operations" : 
            file.includes("Transaction") ? "transaction processing" : 
            file.includes("DAO") ? "data access layer" : "business logic"}.\n\nKEY RESPONSIBILITIES:\n• Primary: Core banking operations\n• Secondary: Audit trail creation\n• Dependencies: 4 external services\n• Entry points: 3 public methods\n\nCOMPLEXITY SCORE: ${Math.floor(Math.random() * 30 + 60)}/100\nTECH DEBT: HIGH (legacy patterns, no tests)\n\n"At first glance, this code appears to implement a ${file.includes("COBOL") ? "procedural" : "object-oriented"} approach to managing ${file.includes("Bank") ? "financial accounts" : "data persistence"}. The main algorithm follows a ${file.includes("Legacy") ? "spaghetti" : "layered"} pattern with ${Math.floor(Math.random() * 5 + 2)} levels of indirection."`,
          timestamp: new Date()
        }]);
      } else if (trimmed === "scan --deep" || trimmed === "scan") {
        setLines(prev => [...prev, {
          type: "info",
          content: "\n⬡ CHRONOS DEEP SCAN INITIATED...",
          timestamp: new Date()
        }]);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setLines(prev => [...prev, {
          type: "output",
          content: `SCAN COMPLETE\n\nCritical Issues Found:
  ⚠️  73 circular dependencies
  ⚠️  5 god classes (TransactionService, SecurityManager)
  ⚠️  12 dead code files (0 references)
  ⚠️  47 files with >200 LOC (too complex)
  
Architecture: SPAGHETTI MONOLITH
Hotspots: com.bank.*.cobol bridge layer
Recommendation: Strangler Fig pattern`,
          timestamp: new Date()
        }]);
      } else if (trimmed === "test --legacy") {
        setLines(prev => [...prev, {
          type: "output",
          content: `LEGACY TEST ANALYSIS\n\nCurrent Test Coverage: 12%\n\nLikely Failure Scenarios:
  1. Concurrent account access (race conditions)
  2. Large transaction amounts (overflow)
  3. Network timeout during COBOL bridge call
  4. Database connection pool exhaustion
  5. Invalid currency conversion rates
  
Estimated test count needed: 347
High-priority tests: 47`,
          timestamp: new Date()
        }]);
      } else if (trimmed === "deps --outdated") {
        setLines(prev => [...prev, {
          type: "output",
          content: `OUTDATED DEPENDENCIES (Probable)\n\n┌─────────────────────────────────┬────────────┬─────────────┐\n│ Library                         │ Detected   │ Recommended │\n├─────────────────────────────────┼────────────┼─────────────┤\n│ commons-logging                 │ 1.1.1      │ 1.2         │\n│ log4j                           │ 1.2.17     │ 2.17.1      │\n│ struts                          │ 1.3        │ 2.5.30      │\n│ hibernate-core                  │ 3.6        │ 5.6.15      │\n│ spring-context                  │ 2.5        │ 5.3.30      │\n│ itext                           │ 2.1        │ 7.2.5       │\n└─────────────────────────────────┴────────────┴─────────────┘\n\nACTION: Schedule dependency upgrade sprint`,
          timestamp: new Date()
        }]);
      } else if (trimmed === "risk-score") {
        setLines(prev => [...prev, {
          type: "output",
          content: `CALCULATING MIGRATION RISK...\n\nScanning codebase...\nAnalyzing dependencies...\nAssessing complexity...\n\n═══ RISK ASSESSMENT ═══\n\nOverall Score: 8/10 (HIGH)\n\nBreakdown:\n  • Architecture complexity: 9/10\n  • Test coverage: 8/10\n  • Team familiarity: 6/10\n  • Business criticality: 9/10\n  • Integration count: 7/10\n\nPrimary concerns:\n  ⚠️  COBOL integration layer (47 files)\n  ⚠️  Monolithic transaction manager (12k LOC)\n  ⚠️  Zero automated test coverage\n\nRECOMMENDATION: 6-9 months with 3 engineers`,
          timestamp: new Date()
        }]);
      } else if (trimmed === "clear" || trimmed === "cls") {
        setLines([]);
      } else if (trimmed === "") {
        // no-op
      } else {
        setLines(prev => [...prev, {
          type: "error",
          content: `Unknown command: ${trimmed}\nType 'help' for available commands.`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setLines(prev => [...prev, {
        type: "error",
        content: `ERROR: ${error instanceof Error ? error.message : "Unknown error"}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(command);
      setCommand("");
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className={`h-full flex flex-col bg-[#0d1117] ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex items-center justify-between px-6 py-3 bg-surface-dark border-b border-card-dark">
        <div className="flex items-center gap-3">
          <Terminal size={18} className="text-neon-cyan" />
          <h1 className="text-lg font-bold text-white">Refactor Terminal</h1>
          <span className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded font-mono">v2.4.1</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-card-dark/50 border border-card-dark rounded-lg px-3 py-1 text-xs">
            <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse"></div>
            <span className="text-muted-gray">Anthropic API</span>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-card-dark rounded transition-colors text-muted-gray"
          >
            {isFullscreen ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div 
            ref={terminalRef}
            className="flex-1 overflow-y-auto p-6 space-y-1 font-mono text-sm"
            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {lines.map((line, i) => (
              <div key={i} className={`flex items-start gap-2 ${line.type === "input" ? "text-neon-cyan" : 
                line.type === "error" ? "text-risk-red" :
                line.type === "success" ? "text-signal-green" :
                line.type === "info" ? "text-graph-blue" : "text-muted-gray"}`}>
                {line.type === "input" && <span className="text-muted-gray mr-2">$</span>}
                <span className="whitespace-pre-wrap">{line.content}</span>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex items-center gap-2 text-neon-cyan">
                <Loader2 size={14} className="animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>

          <div className="border-t border-card-dark p-4 bg-surface-dark/30">
            <div className="flex items-center bg-card-dark rounded-lg overflow-hidden border border-card-dark focus-within:border-neon-cyan/50 transition-colors">
              <span className="px-3 text-neon-cyan font-mono">$</span>
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter refactor command (help for list)..."
                className="flex-1 bg-transparent outline-none px-2 py-2 text-white font-mono"
                autoFocus
              />
              <button
                onClick={() => { processCommand(command); setCommand(""); }}
                disabled={!command.trim() || isProcessing}
                className="px-4 py-2 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 disabled:opacity-50 transition-colors"
              >
                <Play size={14} />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-muted-gray">
              <div className="flex items-center gap-4">
                <span>Prompt: refactor BankAccount.java --target=ts</span>
                <span>•</span>
                <span>Up: ↑ history</span>
                <span>•</span>
                <span>Ctrl+C: cancel</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 border-l border-surface-dark p-4 bg-card-dark/20 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={14} className="text-neon-cyan" />
            QUICK ACTIONS
          </h3>
          
          <div className="space-y-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  setCommand(suggestion.cmd);
                  inputRef.current?.focus();
                }}
                className="w-full text-left p-3 bg-surface-dark border border-card-dark rounded-lg hover:border-neon-cyan/50 transition-all group"
              >
                <div className="text-xs text-neon-cyan font-mono mb-1 group-hover:text-white">
                  {suggestion.cmd}
                </div>
                <div className="text-xs text-muted-gray">{suggestion.desc}</div>
                <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-gray opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-warning-amber/10 border border-warning-amber/30 rounded-lg">
            <div className="flex items-center gap-2 text-warning-amber text-sm font-medium mb-2">
              <AlertTriangle size={14} />
              ACTIVE RISKS
            </div>
            <ul className="text-xs text-muted-gray space-y-2">
              <li>• TransactionService.java: Coupling score 94/100</li>
              <li>• 3 COBOL bridge adapters blocking migration</li>
              <li>• Legacy batch jobs run nightly (2hr window)</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-signal-green/10 border border-signal-green/30 rounded-lg">
            <div className="flex items-center gap-2 text-signal-green text-sm font-medium mb-2">
              <CheckCircle size={14} />
              REFACTOR STATUS
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-gray">Completed</span>
                <span className="text-white">12 files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-gray">In Progress</span>
                <span className="text-warning-amber">3 files</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-gray">Remaining</span>
                <span className="text-risk-red">35 files</span>
              </div>
            </div>
            <div className="mt-3 w-full bg-card-dark h-2 rounded-full overflow-hidden">
              <div className="h-full bg-signal-green" style={{ width: "25%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
