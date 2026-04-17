export interface FileNode {
  id: string;
  name: string;
  language: string;
  loc: number;
  lines: number;
  content: string;
  debtScore: number;
  group?: string;
}

export interface ProcessedFile extends FileNode {
  // Same as FileNode, used for uploaded files
}

export interface GraphNode extends FileNode {
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface AnalysisState {
  executiveSummary: string;
  businessDomain: string;
  architecturePattern: string;
  criticalFiles: string[];
  debtScore: number;
  riskAssessment: string;
}

export interface TerminalCommand {
  command: string;
  response: string;
  timestamp: Date;
}

export type AnalysisTab = 'excavation' | 'deps' | 'refactor' | 'terminal';

export interface RefactorTarget {
  node: GraphNode;
  targetLang: 'ts' | 'py';
}

export const LANGUAGE_COLORS: Record<string, string> = {
  'COBOL': '#f5a623',
  'Java': '#3b82f6',
  'JavaScript': '#10b981',
  'TypeScript': '#10b981',
  'Python': '#8b5cf6',
  'C': '#6b7280',
  'C++': '#6b7280',
  'PHP': '#6366f1',
  'Ruby': '#ec4899',
  'Perl': '#14b8a6',
  'Visual Basic': '#f97316',
  'BASIC': '#f59e0b',
  'Assembly': '#9ca3af',
  'SQL': '#ef4444',
  'XML': '#8b5cf6',
  'JSON': '#10b981',
  'C#': '#3b82f6',
  'Go': '#00d4aa',
  'Rust': '#ce422b',
  'Kotlin': '#7f52ff',
  'Scala': '#c24033',
  'Swift': '#f05138',
  'Text': '#9ca3af',
};

export const FILE_ICONS: Record<string, string> = {
  'COBOL': '⬡', 'Java': '◈', 'JavaScript': '◇',
  'TypeScript': '◆', 'Python': '◎', 'C': '△', 'C++': '▲',
  'PHP': '⬟', 'Ruby': '◉', 'Perl': '○', 'Visual Basic': '□',
  'BASIC': '▢', 'Assembly': '⬡', 'SQL': '⬡', 'XML': '⬟',
  'JSON': '◇', 'C#': '◈', 'Go': '◎', 'Rust': '▲', 'Kotlin': '◆',
  'Scala': '◇', 'Swift': '◎', 'Text': '◇',
};
