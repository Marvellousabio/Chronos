"use client";

import { useState, useRef, useEffect } from "react";
 import { 
   FileText, Network, Wrench, Terminal, Copy, Download, 
   FileCode, AlertTriangle, GitBranch, Clock, Zap, Shield,
   Code2, ArrowRight, Sparkles, Loader2, ChevronLeft, ChevronRight, Globe
 } from "lucide-react";

type TabId = "excavation" | "dependencies" | "refactor" | "terminal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState<TabId>("excavation");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "CHRONOS AI ARCHAEOLOGIST ONLINE\n\nAwaiting codebase analysis...\n\nReady to excavate legacy systems." }
  ]);
  const [selectedFile, setSelectedFile] = useState<string>("BankAccount.java");
  const [targetLanguage, setTargetLanguage] = useState<"typescript" | "python">("typescript");
  const [terminalCommand, setTerminalCommand] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "excavation", label: "EXCAVATION REPORT", icon: FileText },
    { id: "dependencies", label: "DEPENDENCY MAP", icon: Network },
    { id: "refactor", label: "REFACTOR BLUEPRINT", icon: Wrench },
    { id: "terminal", label: "TERMINAL SIMULATION", icon: Terminal },
  ];

  const files = [
    "BankAccount.java",
    "TransactionService.java", 
    "CustomerDAO.java",
    "AccountValidator.cobol",
    "LegacyInterface.cbl",
    "MoneyTransferServlet.java",
    "AuditLogger.java",
    "StatementGenerator.java",
    "SecurityManager.java",
    "BatchProcessor.cobol",
  ];

  const streamResponse = async (prompt: string) => {
    setIsAnalyzing(true);
    setMessages(prev => [...prev, { role: "user", content: prompt }]);
    
    try {
      const response = await fetch("/api/anthropic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          mode: activeTab,
          selectedFile,
          targetLanguage,
        }),
      });

      if (!response.ok) throw new Error("API call failed");

      const data = await response.json();
      let fullResponse = data.content || "";
      
      // Simulate typewriter effect
      let displayedText = "";
      const words = fullResponse.split(" ");
      for (let i = 0; i < words.length; i++) {
        displayedText += (i > 0 ? " " : "") + words[i];
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { 
            role: "assistant", 
            content: displayedText 
          };
          return updated;
        });
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "ERROR: SIGNAL LOST — RETRYING...\n\nConnection to Claude API interrupted. Please try again." 
      }]);
    } finally {
      setIsAnalyzing(false);
    }
  };


  useEffect(() => {
    if (activeTab === "excavation" && messages.length === 1) {
      setTimeout(() => {
        streamResponse("Generate initial excavation report for the demo banking codebase");
      }, 500);
    }
  }, [activeTab]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTerminalCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
    setTerminalHistory(prev => [...prev, `$ ${trimmed}`]);

    setTerminalCommand("");

    const lowerCmd = trimmed.toLowerCase();
    
    if (lowerCmd === "help") {
      setTerminalHistory(prev => [...prev, 
        "Available commands:",
        "  scan --deep           Run deep dependency analysis",
        "  test --legacy         Identify failing test scenarios",
        "  deps --outdated       List outdated dependencies",
        "  refactor [filename]   Generate refactor blueprint",
        "  explain [filename]    Plain English explanation",
        "  risk-score            Overall migration risk (1-10)",
        "  clear                 Clear terminal"
      ]);
    } else if (lowerCmd === "clear") {
      setTerminalHistory([]);
    } else if (lowerCmd === "risk-score") {
      setTerminalHistory(prev => [...prev, 
        "Calculating migration risk...",
        "█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 15%",
        "██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 28%",
        "████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 45%",
        "██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 62%",
        "████████▒▒▒▒▒▒▒▒▒▒▒▒▒ 78%",
        "███████████▒▒▒▒▒▒▒▒▒▒ 89%",
        "RISK SCORE: 8/10 (HIGH)",
        "",
        "Key concerns:",
        "• 73 circular dependencies in core modules",
        "• Mixed COBOL/Java integration layers",
        "• No test coverage on legacy components",
        "• Database schema tightly coupled to business logic"
      ]);
    } else if (lowerCmd.startsWith("refactor ")) {
      const filename = trimmed.split(" ")[1];
      setSelectedFile(filename || "BankAccount.java");
      setActiveTab("refactor");
      setTimeout(() => {
        streamResponse(`Generate refactor blueprint for ${filename || "BankAccount.java"}`);
      }, 100);
    } else if (lowerCmd.startsWith("explain ")) {
      const filename = trimmed.split(" ")[1];
      setTerminalHistory(prev => [...prev, 
        `Analyzing ${filename}...`,
        "",
        "This is a legacy banking module responsible for account management.",
        "Key responsibilities: balance calculation, transaction validation,",
        "and audit logging through a COBOL bridge interface.",
        "",
        "Complexity: HIGH (312 lines, cyclomatic 14)",
        "Legacy dependencies: 8 external calls",
        "Test coverage: 0%"
      ]);
    } else {
      setTerminalHistory(prev => [...prev, `Command not found: ${trimmed}. Type 'help' for available commands.`]);
    }
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setTerminalCommand(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setTerminalCommand("");
        } else {
          setHistoryIndex(newIndex);
          setTerminalCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === "Enter") {
      handleTerminalCommand(terminalCommand);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportReport = () => {
    const reportContent = messages
      .filter(m => m.role === "assistant")
      .map(m => m.content)
      .join("\n\n" + "═".repeat(50) + "\n\n");
    
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>CHRONOS Archaeological Report</title>
            <style>
              body { font-family: 'Courier Prime', monospace; background: #0d0f0e; color: #f5a623; padding: 40px; line-height: 1.6; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${reportContent}</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-dark">
        <div className="flex items-center gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium
                  ${activeTab === tab.id 
                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30" 
                    : "text-muted-gray hover:text-white hover:bg-card-dark"
                  }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-3">
          {activeTab === "refactor" && (
            <>
              <select 
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value as "typescript" | "python")}
                className="bg-surface-dark border border-card-dark rounded px-3 py-2 text-sm text-white"
              >
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>
              <select 
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className="bg-surface-dark border border-card-dark rounded px-3 py-2 text-sm text-white font-mono"
              >
                {files.map(file => (
                  <option key={file} value={file}>{file}</option>
                ))}
              </select>
            </>
          )}
          <button
            onClick={() => {
              if (activeTab === "refactor") {
                streamResponse(`Generate refactor blueprint for ${selectedFile} in ${targetLanguage}`);
              } else if (activeTab === "dependencies") {
                streamResponse("Analyze dependency graph for circular dependencies and god classes");
              } else {
                streamResponse("Generate comprehensive excavation report");
              }
            }}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-neon-cyan hover:bg-neon-cyan/90 text-deep-space font-semibold px-4 py-2 rounded transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            Analyse
          </button>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 bg-surface-dark border border-card-dark hover:bg-card-dark text-white px-4 py-2 rounded transition-all"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "excavation" && (
          <div className="h-full flex">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="bg-surface-dark border border-card-dark rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-neon-cyan" />
                    EXECUTIVE SUMMARY
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-text-white leading-relaxed">
                      {messages.find(m => m.role === "assistant")?.content.split("═══")[0] || "Analyzing codebase..."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-dark border border-card-dark rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe size={18} className="text-graph-blue" />
                      <h4 className="font-semibold text-white">Business Domain</h4>
                    </div>
                    <p className="text-muted-gray text-sm">Financial Services • Core Banking</p>
                  </div>
                  <div className="bg-surface-dark border border-card-dark rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <GitBranch size={18} className="text-warning-amber" />
                      <h4 className="font-semibold text-white">Architecture</h4>
                    </div>
                    <p className="text-muted-gray text-sm">Monolithic • Tightly Coupled</p>
                  </div>
                  <div className="bg-surface-dark border border-card-dark rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle size={18} className="text-risk-red" />
                      <h4 className="font-semibold text-white">Critical Files</h4>
                    </div>
                    <ul className="text-sm text-muted-gray space-y-1">
                      <li>• TransactionService.java</li>
                      <li>• SecurityManager.java</li>
                      <li>• LegacyDBAdapter.cobol</li>
                    </ul>
                  </div>
                  <div className="bg-surface-dark border border-card-dark rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield size={18} className="text-signal-green" />
                      <h4 className="font-semibold text-white">Risk Assessment</h4>
                    </div>
                    <div className="text-2xl font-bold text-warning-amber">HIGH</div>
                    <p className="text-xs text-muted-gray mt-1">8/10 migration risk score</p>
                  </div>
                </div>

                <div className="bg-surface-dark border border-card-dark rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">FULL ANALYSIS</h3>
                  <div className="font-mono text-sm text-muted-gray whitespace-pre-wrap leading-relaxed">
                    {messages.find(m => m.role === "assistant")?.content || ""}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-80 border-l border-surface-dark p-6 bg-card-dark/30 overflow-y-auto">
              <h4 className="font-semibold text-white mb-4">QUICK STATS</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-gray">Debt Score</span>
                    <span className="text-warning-amber font-bold">78/100</span>
                  </div>
                  <div className="w-full bg-card-dark h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-signal-green via-warning-amber to-risk-red" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-gray">Test Coverage</span>
                    <span className="text-risk-red font-bold">12%</span>
                  </div>
                  <div className="w-full bg-card-dark h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-risk-red" style={{ width: "12%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-gray">Circular Deps</span>
                    <span className="text-graph-blue font-bold">73</span>
                  </div>
                  <div className="w-full bg-card-dark h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-graph-blue" style={{ width: "73%" }}></div>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-white mb-4 mt-8">LANGUAGE BREAKDOWN</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-muted-gray">Java</span>
                  </div>
                  <span className="text-white">62%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-muted-gray">COBOL</span>
                  </div>
                  <span className="text-white">38%</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-amber-900/20 border border-amber-600/30 rounded-lg">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                  <Clock size={14} />
                  EST. REFACTOR TIME
                </div>
                <div className="text-2xl font-bold text-white">6-9 months</div>
                <p className="text-xs text-muted-gray mt-1">3-person team</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "dependencies" && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-surface-dark border border-card-dark rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Network size={18} className="text-neon-cyan" />
                  DEPENDENCY ANALYSIS
                </h3>
                <div className="prose prose-invert max-w-none">
                  <div className="font-mono text-sm text-muted-gray whitespace-pre-wrap leading-relaxed">
                    {messages.find(m => m.role === "assistant" && activeTab === "dependencies")?.content || "Analyzing dependency graph..."}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-dark border border-risk-red/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-risk-red" />
                    <span className="text-sm font-semibold text-white">Circular</span>
                  </div>
                  <div className="text-2xl font-bold text-risk-red">73</div>
                  <p className="text-xs text-muted-gray">dependencies</p>
                </div>
                <div className="bg-surface-dark border border-warning-amber/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch size={16} className="text-warning-amber" />
                    <span className="text-sm font-semibold text-white">God Modules</span>
                  </div>
                  <div className="text-2xl font-bold text-warning-amber">5</div>
                  <p className="text-xs text-muted-gray">critical files</p>
                </div>
                <div className="bg-surface-dark border border-graph-blue/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-graph-blue" />
                    <span className="text-sm font-semibold text-white">Dead Code</span>
                  </div>
                  <div className="text-2xl font-bold text-graph-blue">12</div>
                  <p className="text-xs text-muted-gray">unused files</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "refactor" && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="bg-surface-dark border border-card-dark rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Wrench size={18} className="text-neon-cyan" />
                    REFACTOR BLUEPRINT: {selectedFile}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(messages.find(m => m.role === "assistant")?.content || "")}
                    className="flex items-center gap-2 bg-card-dark hover:bg-card-dark/80 px-3 py-1 rounded text-sm"
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-gray uppercase mb-3">Original (Legacy)</h4>
                    <div className="bg-deep-space border border-card-dark rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre className="text-amber-400">
{`public class ${selectedFile.replace(/\.[^/.]+$/, "")} {
    private double balance;
    private String accountNum;
    
    public void deposit(double amount) {
        if(amount > 0) {
            balance += amount;
            logTransaction("DEP", amount);
        }
    }
    
    // ... 127 more lines
`}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-signal-green uppercase mb-3">
                      Modernized ({targetLanguage === "typescript" ? "TypeScript" : "Python"})
                    </h4>
                    <div className="bg-deep-space border border-signal-green/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre className="text-green-400">
{`export class ${selectedFile.replace(/\.[^/.]+$/, "")} {
  private balance: number = 0;
  private accountNum: string;
  
  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      this.logTransaction("DEP", amount);
    }
  }
  
  // Type-safe, documented, testable
`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-warning-amber/10 border border-warning-amber/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-warning-amber mb-2 flex items-center gap-2">
                    <AlertTriangle size={14} />
                    MIGRATION RISKS
                  </h4>
                  <ul className="text-sm text-muted-gray space-y-1">
                    <li>• COBOL bridge calls need adapter layer</li>
                    <li>• Transaction state management differs</li>
                    <li>• Decimal precision handling (COBOL COMP-3)</li>
                    <li>• Legacy logging format incompatibility</li>
                  </ul>
                </div>

                <div className="mt-4 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-neon-cyan mb-2 flex items-center gap-2">
                    <Code2 size={14} />
                    EFFORT ESTIMATE
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-gray">Lines Changed</div>
                      <div className="text-xl font-bold text-white">~180</div>
                    </div>
                    <div>
                      <div className="text-muted-gray">Complexity</div>
                      <div className="text-xl font-bold text-white">Medium</div>
                    </div>
                    <div>
                      <div className="text-muted-gray">Tests Needed</div>
                      <div className="text-xl font-bold text-white">12</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 font-mono text-sm text-muted-gray whitespace-pre-wrap">
                  {messages.find(m => m.role === "assistant" && activeTab === "refactor")?.content || ""}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "terminal" && (
          <div className="h-full flex flex-col bg-[#0d1117] font-mono">
            <div className="px-6 py-3 bg-surface-dark/50 border-b border-card-dark flex items-center gap-2">
              <Terminal size={14} className="text-neon-cyan" />
              <span className="text-sm text-muted-gray">CHRONOS TERMINAL SIMULATION</span>
              {isAnalyzing && (
                <Loader2 size={12} className="animate-spin ml-auto text-neon-cyan" />
              )}
            </div>
            
            <div 
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-6 space-y-2 text-sm"
            >
              {terminalHistory.map((line, i) => (
                <div key={i} className={line.startsWith("$") ? "text-neon-cyan" : "text-muted-gray"}>
                  {line}
                </div>
              ))}
              
              {isAnalyzing && (
                <div className="flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-neon-cyan" />
                  <span className="text-muted-gray">Processing...</span>
                </div>
              )}

              {!isAnalyzing && (
                <div className="flex items-center">
                  <span className="text-neon-cyan mr-2">$</span>
                  <input
                    type="text"
                    value={terminalCommand}
                    onChange={(e) => setTerminalCommand(e.target.value)}
                    onKeyDown={handleTerminalKeyDown}
                    className="flex-1 bg-transparent outline-none text-white caret-white"
                    placeholder="Type a command (type 'help' for list)..."
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
