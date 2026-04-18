"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { 
  Network, ZoomIn, ZoomOut, RotateCcw, GitBranch, AlertTriangle, 
  Eye, EyeOff, FileCode2, Maximize2, Minimize2, AlertCircle 
} from "lucide-react";

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  language: string;
  lines: number;
  debtScore: number;
  group: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: "import" | "call" | "extend" | "implement";
  strength: number;
}

interface DependencyGraphProps {
  files: Array<{
    name: string;
    lines: number;
    language: string;
  }>;
  dependencies: Array<{
    source: string;
    target: string;
    type: "import" | "call" | "extend" | "implement";
  }>;
}

export default function VisualizePage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [showCluster, setShowCluster] = useState(true);
  const [showDangerZones, setShowDangerZones] = useState(true);
  const [showDeadCode, setShowDeadCode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transform, setTransform] = useState(d3.zoomIdentity);

  const languageColors: Record<string, string> = {
    "Java": "#f59e0b",
    "COBOL": "#ef4444",
    "JavaScript": "#fbbf24",
    "TypeScript": "#3b82f6",
    "Python": "#22c55e",
    "C": "#a855f7",
    "C++": "#ec4899",
    "PHP": "#06b6d4",
    "Ruby": "#f97316",
    "Perl": "#14b8a6",
  };

  const edgeColors: Record<string, string> = {
    import: "#22d3ee",
    call: "#f59e0b",
    extend: "#a855f7",
    implement: "#10b981",
  };

  const sampleFiles = [
    { name: "BankAccount.java", lines: 142, language: "Java" },
    { name: "TransactionService.java", lines: 310, language: "Java" },
    { name: "CustomerDAO.java", lines: 189, language: "Java" },
    { name: "AccountValidator.cobol", lines: 87, language: "COBOL" },
    { name: "LegacyInterface.cbl", lines: 124, language: "COBOL" },
    { name: "MoneyTransferServlet.java", lines: 234, language: "Java" },
    { name: "AuditLogger.java", lines: 94, language: "Java" },
    { name: "CurrencyConverter.java", lines: 132, language: "Java" },
    { name: "FeeCalculator.cobol", lines: 56, language: "COBOL" },
    { name: "StatementGenerator.java", lines: 321, language: "Java" },
    { name: "ReportService.java", lines: 248, language: "Java" },
    { name: "DatabaseConnectionPool.java", lines: 156, language: "Java" },
    { name: "LegacyDBAdapter.cobol", lines: 178, language: "COBOL" },
    { name: "SecurityManager.java", lines: 287, language: "Java" },
    { name: "SessionManager.java", lines: 186, language: "Java" },
    { name: "CacheManager.java", lines: 107, language: "Java" },
    { name: "NotificationService.java", lines: 169, language: "Java" },
    { name: "BatchProcessor.cobol", lines: 245, language: "COBOL" },
    { name: "SchedulerService.java", lines: 145, language: "Java" },
    { name: "FileImporter.java", lines: 123, language: "Java" },
  ];

  const sampleDeps = [
    { source: "BankAccount.java", target: "TransactionService.java", type: "call" as const },
    { source: "TransactionService.java", target: "CustomerDAO.java", type: "import" as const },
    { source: "CustomerDAO.java", target: "LegacyDBAdapter.cobol", type: "call" as const },
    { source: "TransactionService.java", target: "AccountValidator.cobol", type: "call" as const },
    { source: "MoneyTransferServlet.java", target: "TransactionService.java", type: "call" as const },
    { source: "AuditLogger.java", target: "SecurityManager.java", type: "import" as const },
    { source: "CurrencyConverter.java", target: "FeeCalculator.cobol", type: "call" as const },
    { source: "StatementGenerator.java", target: "ReportService.java", type: "import" as const },
    { source: "ReportService.java", target: "DatabaseConnectionPool.java", type: "call" as const },
    { source: "DatabaseConnectionPool.java", target: "LegacyDBAdapter.cobol", type: "extend" as const },
    { source: "SecurityManager.java", target: "SessionManager.java", type: "call" as const },
    { source: "SessionManager.java", target: "CacheManager.java", type: "import" as const },
    { source: "NotificationService.java", target: "AuditLogger.java", type: "call" as const },
    { source: "BatchProcessor.cobol", target: "AccountValidator.cobol", type: "call" as const },
    { source: "SchedulerService.java", target: "BatchProcessor.cobol", type: "import" as const },
    { source: "FileImporter.java", target: "LegacyFormatter.cbl", type: "call" as const },
    { source: "ReportExporter.java", target: "ReportService.java", type: "implement" as const },
    { source: "APIGateway.java", target: "SecurityManager.java", type: "call" as const },
    { source: "RateLimiter.java", target: "SessionManager.java", type: "import" as const },
    { source: "ComplianceChecker.cobol", target: "AccountValidator.cobol", type: "call" as const },
    { source: "RiskAssessment.java", target: "TransactionService.java", type: "call" as const },
    { source: "LoanApprovalEngine.cobol", target: "RiskAssessment.java", type: "call" as const },
    { source: "UnderwritingService.java", target: "CreditChecker.java", type: "import" as const },
    { source: "ClaimsProcessor.java", target: "PaymentGateway.java", type: "call" as const },
    { source: "PaymentGateway.java", target: "LegacyDBAdapter.cobol", type: "extend" as const },
    { source: "ReconciliationEngine.java", target: "TransactionService.java", type: "call" as const },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const nodes: GraphNode[] = sampleFiles.map((f, i) => ({
      id: f.name,
      name: f.name,
      language: f.language,
      lines: f.lines,
      debtScore: Math.floor(Math.random() * 70 + 20),
      group: f.language === "Java" ? 1 : 2,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    const links: GraphLink[] = sampleDeps.map(d => ({
      ...d,
      strength: 1,
    }));

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("xoverflow", "visible")
      .append("path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#64748b")
      .attr("class", "arrow-head");

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setTransform(event.transform);
      });

    zoomRef.current = zoom;

    svg.call(zoom);

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius(d => Math.sqrt(d.lines) * 2 + 10));

    simulationRef.current = simulation;

    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", d => edgeColors[d.type] || "#64748b")
      .attr("stroke-width", d => Math.sqrt(d.strength) * 2)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", d => d.type === "call" ? "5,5" : "none");

    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    node.append("circle")
      .attr("r", d => Math.sqrt(d.lines) * 2 + 8)
      .attr("fill", d => languageColors[d.language] || "#6b7280")
      .attr("stroke", d => d.debtScore > 70 ? "#ef4444" : "#1f2937")
      .attr("stroke-width", d => d.debtScore > 70 ? 3 : 2)
      .attr("opacity", 0.8)
      .on("click", (event, d) => {
        setSelectedNode(d);
        simulateSignal(links.filter(l => l.source === d || l.target === d));
      })
      .on("mouseover", function(event, d) {
        d3.select(this).transition().duration(200).attr("r", Math.sqrt(d.lines) * 2 + 12);
        
        link.transition().duration(200)
          .attr("stroke-opacity", l => 
            (l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id ? 1 : 0.1
          )
          .attr("stroke-width", l => 
            ((l.source as GraphNode).id === d.id || (l.target as GraphNode).id === d.id) ? 4 : 1
          );
      })
      .on("mouseout", function(event, d) {
        d3.select(this).transition().duration(200).attr("r", Math.sqrt(d.lines) * 2 + 8);
        
        link.transition().duration(200)
          .attr("stroke-opacity", 0.6)
          .attr("stroke-width", d => Math.sqrt(d.strength) * 2);
      });

    node.append("text")
      .text(d => {
        const name = d.name;
        return name.length > 20 ? name.substring(0, 17) + "..." : name;
      })
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", d => {
        const base = Math.sqrt(d.lines);
        return Math.min(10, Math.max(8, base));
      })
      .attr("dy", d => Math.sqrt(d.lines) * 2 + 14)
      .attr("font-family", "IBM Plex Mono, monospace")
      .attr("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    const simulateSignal = (connectedLinks: GraphLink[]) => {
      connectedLinks.forEach(l => {
        const line = d3.select(link.nodes().find(n => 
          (n as unknown as { __data__: GraphLink }).__data__ === l
        ) || link.nodes()[0]);
        
        line
          .attr("stroke-dashoffset", 100)
          .transition()
          .duration(500)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      });
    };

    return () => {
      simulation.stop();
    };
  }, []);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.call(zoomRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.call(zoomRef.current.scaleBy, 0.7);
  };

  const handleReset = () => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.call(zoomRef.current.transform, d3.zoomIdentity);
  };

  const applyFilter = () => {
    if (!svgRef.current || !simulationRef.current) return;
    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll(".nodes").selectAll("g").data();
    const links = svg.selectAll(".links").selectAll("line").data();

    svg.selectAll<SVGCircleElement, GraphNode>(".nodes circle")
      .transition()
      .duration(500)
      .attr("opacity", d => {
        if (showDangerZones && d.debtScore > 70) return 1;
        if (!showDeadCode && d.lines < 50) return 0.2;
        return 0.8;
      })
      .attr("stroke", d => d.debtScore > 70 && showDangerZones ? "#ef4444" : "#1f2937")
      .attr("stroke-width", d => d.debtScore > 70 && showDangerZones ? 4 : 2);
  };

  useEffect(() => {
    applyFilter();
  }, [showDangerZones, showDeadCode]);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-deep-space' : 'h-full'}`}>
      <div className="absolute top-4 left-4 z-10 bg-surface-dark/80 backdrop-blur border border-card-dark rounded-lg p-2 space-y-2">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-card-dark rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={16} className="text-neon-cyan" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-card-dark rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={16} className="text-neon-cyan" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 hover:bg-card-dark rounded transition-colors"
          title="Reset View"
        >
          <RotateCcw size={16} className="text-neon-cyan" />
        </button>
        <div className="w-8 h-px bg-card-dark my-1"></div>
        <button
          onClick={() => setShowCluster(!showCluster)}
          className={`p-2 rounded transition-colors ${showCluster ? 'bg-neon-cyan/20 text-neon-cyan' : 'hover:bg-card-dark text-muted-gray'}`}
          title="Toggle Cluster View"
        >
          <GitBranch size={16} />
        </button>
        <button
          onClick={() => setShowDangerZones(!showDangerZones)}
          className={`p-2 rounded transition-colors ${showDangerZones ? 'bg-risk-red/20 text-risk-red' : 'hover:bg-card-dark text-muted-gray'}`}
          title="Toggle Danger Zones"
        >
          <AlertTriangle size={16} />
        </button>
        <button
          onClick={() => setShowDeadCode(!showDeadCode)}
          className={`p-2 rounded transition-colors ${showDeadCode ? 'bg-graph-blue/20 text-graph-blue' : 'hover:bg-card-dark text-muted-gray'}`}
          title="Toggle Dead Code"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 hover:bg-card-dark rounded transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 bg-surface-dark/90 backdrop-blur border border-card-dark rounded-lg p-4 min-w-[200px]">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Network size={14} />
          LEGEND
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-muted-gray">Java</span>
            </div>
            <span className="text-white">62%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-muted-gray">COBOL</span>
            </div>
            <span className="text-white">38%</span>
          </div>
          <div className="w-full h-px bg-card-dark my-2"></div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-12 h-1 bg-cyan-400 rounded"></div>
            <span className="text-muted-gray">import</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-12 h-1 bg-amber-400 rounded"></div>
            <span className="text-muted-gray">call</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-12 h-1 bg-purple-400 rounded"></div>
            <span className="text-muted-gray">extend</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-12 h-1 bg-green-400 rounded"></div>
            <span className="text-muted-gray">implement</span>
          </div>
        </div>
      </div>

      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 bg-surface-dark/95 backdrop-blur border border-card-dark rounded-lg p-6 w-80 shadow-2xl animate-slide-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <FileCode2 size={16} className="text-neon-cyan" />
                {selectedNode.name}
              </h3>
              <p className="text-xs text-muted-gray mt-1">{selectedNode.language}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-muted-gray hover:text-white transition-colors"
            >
              <AlertCircle size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-gray">Lines of Code</span>
              <span className="text-white font-mono">{selectedNode.lines.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-gray">Tech Debt Score</span>
              <span className={`font-bold ${selectedNode.debtScore > 70 ? 'text-risk-red' : selectedNode.debtScore > 50 ? 'text-warning-amber' : 'text-signal-green'}`}>
                {selectedNode.debtScore}/100
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-gray">Complexity</span>
              <span className="text-white">
                {selectedNode.lines > 300 ? "Extreme" : selectedNode.lines > 150 ? "High" : "Medium"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-gray">Last Modified</span>
              <span className="text-white">2019-03-14</span>
            </div>
          </div>

          {selectedNode.debtScore > 70 && (
            <div className="mt-4 p-3 bg-risk-red/10 border border-risk-red/30 rounded-lg">
              <div className="flex items-center gap-2 text-risk-red text-sm font-medium">
                <AlertTriangle size={14} />
                CRITICAL DEBT ZONE
              </div>
              <p className="text-xs text-muted-gray mt-1">
                This module has {Math.floor(Math.random() * 30 + 20)} circular dependencies and is a migration blocker.
              </p>
            </div>
          )}

          <button className="w-full mt-4 bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 text-neon-cyan font-semibold py-2 px-4 rounded transition-colors">
            View Source Code
          </button>
        </div>
      )}

      <svg
        ref={svgRef}
        className={`w-full ${isFullscreen ? 'h-screen' : 'h-[600px]'} bg-gradient-to-br from-deep-space via-[#0d1117] to-deep-space`}
      />

      <div className="absolute bottom-4 left-4 z-10 text-xs text-muted-gray font-mono">
        <div className="flex items-center gap-4">
          <span>Nodes: {sampleFiles.length}</span>
          <span>Edges: {sampleDeps.length}</span>
          <span>FPS: 60</span>
        </div>
      </div>
    </div>
  );
}
