# ⬡ CHRONOS // Legacy Code Archaeologist

**Enterprise-grade AI-powered web application for analyzing, visualizing, and refactoring legacy codebases.**

---

## Features

### 🔍 Code Upload & Ingestion
- Drag-and-drop "excavation site" zone
- Supports .zip, individual files, and raw pasted code
- Auto-detects 20+ languages (COBOL, Java, C/C++, Python, JavaScript/TypeScript, etc.)
- Real-time scanning with file count, total lines, language breakdown
- Color-coded tech debt indicators per file

### 📊 Interactive Dependency Graph (D3.js)
- Force-directed graph with zoom, pan, drag
- Node size = lines of code, color = language
- Click node → highlights all connections with animated signal
- Double-click → opens full code viewer with syntax highlighting
- Tooltip shows LOC, debt score, last modified
- Toolbar filters: Flat/Cluster view, Danger Zones (>70 debt), Dead Code
- Live legend with language color codes

### 🤖 Claude AI Analysis (4 Tabs)
1. **Excavation Report** → Executive summary, business domain, architecture pattern, top 5 critical files, debt score, risk assessment
2. **Dependency Map** → Circular deps, god files, dead code, refactoring roadmap
3. **Refactor Blueprint** → Select any node → Claude explains + rewrites in TypeScript/Python with diff
4. **Terminal Simulation** → Commands: `scan --deep`, `test --legacy`, `deps --outdated`, `refactor [file]`, `explain [file]`, `risk-score`, `rosebud` (easter egg)

### 🎯 Demo Mode
- Pre-built 47-file legacy Java banking system
- Realistic patterns: BankCore god class (1250 LOC), circular deps (ModuleA/B/C), dead util classes, COBOL bridge
- Instantly test all features without uploading code

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4 with custom theme
- **Visualization**: D3.js v7 force simulation
- **Syntax Highlighting**: Highlight.js
- **Archive Support**: JSZip
- **AI Backend**: Anthropic Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- **Deployment**: Static/Edge-ready (no build tools required for frontend)

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Marvellousabio/Chronos.git
   cd Chronos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and add your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=sk-ant-...
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

---

## Usage Guide

### Basic Workflow

1. **Enter API Key** (top-left panel) — required for AI analysis. Demo mode works without it.
2. **Upload Your Codebase** — drag & drop ZIP or individual files, or click "LOAD DEMO CODEBASE"
3. **Explore the Graph** — pan/zoom, hover nodes for debt scores, click to select
4. **Run Analysis** — switch to Excavation Report tab to see AI insights
5. **Inspect Dependencies** — Dependency Map tab shows circular deps, god files, dead code
6. **Refactor** — double-click any node → choose TypeScript or Python → get modernized rewrite
7. **Terminal** — type commands like `scan --deep` or `risk-score` for quick insights

### Terminal Commands

| Command | Description |
|---------|-------------|
| `scan --deep` | Full code smell & security scan |
| `test --legacy` | Identify likely failing test scenarios |
| `deps --outdated` | List probably-outdated dependencies |
| `refactor [file]` | Generate refactor blueprint |
| `explain [file]` | Plain English explanation |
| `risk-score` | Overall migration risk 1-10 |
| `rosebud` | Easter egg — find 1987 COBOL subroutine |

### Keyboard Shortcuts

- **Escape** → Close code viewer modal
- **Click + Drag** → Pan graph
- **Scroll** → Zoom in/out
- **Node Click** → Select & open refactor tab
- **Node Double-Click** → Open code viewer

---

## Architecture

### Project Structure

```
chronos/
├── app/
│   ├── api/
│   │   └── claude/
│   │       └── route.ts       # Anthropic API proxy
│   ├── globals.css             # Global styles + Tailwind
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main application
├── components/
│   ├── Header.tsx              # Top bar with stats & gauge
│   ├── FileUpload.tsx          # Drag-drop upload zone
│   ├── FileTree.tsx            # Left panel file list
│   ├── DependencyGraph.tsx     # D3.js force graph
│   ├── AnalysisPanel.tsx       # Right panel tabs
│   ├── Terminal.tsx            # CLI simulation
│   ├── CodeViewer.tsx          # Modal with highlight.js
│   └── Toolbar.tsx             # Graph controls
├── lib/
│   ├── demoData.ts             # Demo codebase generator
│   └── utils.ts                # Helper functions
├── types/
│   └── index.ts                # TypeScript interfaces
├── .env.local.example          # Environment template
├── next.config.ts              # Next.js configuration
└── package.json                # Dependencies
```

### Data Flow

1. **Upload** → `FileUpload` processes files → `handleFilesProcessed` callback
2. **Graph Build** → Files → nodes + inferred links → `setDependencyGraph`
3. **Selection** → Node click → `setSelectedNode` → AnalysisPanel refactor tab
4. **AI Calls** → /api/claude route → Anthropic API → streaming response (structure ready)
5. **Terminal** → Command parser → returns canned or API-driven responses

### API Route

The `/api/claude` endpoint proxies requests to Anthropic, keeping the API key server-side. Request format:

```typescript
POST /api/claude
{
  "messages": [{ "role": "user", "content": "..." }],
  "systemPrompt": "..." // optional
}
```

Response:
```json
{ "content": "Claude's response text..." }
```

---

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable `ANTHROPIC_API_KEY`
4. Deploy

**Note**: For production, consider adding authentication, rate limiting, and request queuing.

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes (for AI) | Anthropic API key for Claude Sonnet 4 |

### Customization

- **Colors**: Edit CSS variables in `app/globals.css` (`--amber-primary`, `--bg-deep`, etc.)
- **Demo data**: Modify `lib/demoData.ts` to change the demo banking system structure
- **AI prompts**: Update `SYSTEM_PROMPT` in `app/api/claude/route.ts`
- **Max tokens**: Adjust `max_tokens` in API route (default: 4000)

---

## Performance

- Initial load: ~2.3MB (D3, Highlight.js, JSZip from CDN)
- D3 simulation: 60fps for up to 200 nodes
- Graph rebuild: ~100ms for 50 files
- Memory: ~50MB for 1000-file codebase
- No server-side rendering for D3 graph (client-only component)

---

## Known Limitations

- **File size**: Large files (>5MB) may cause browser slowdown
- **Zip depth**: Max 10 levels of nesting for directory trees
- **API rate limits**: Anthropic has per-minute limits; implement queuing for production
- **Browser support**: Modern browsers only (ES2020+, no IE)
- **No persistence**: Refresh clears all data (session-only)

---

## License

MIT — feel free to use in your own legacy modernization projects.

---

## Support

For issues, feature requests, or contributions, open an issue at:
[https://github.com/Marvellousabio/Chronos/issues](https://github.com/Marvellousabio/Chronos/issues)

---

*Built with surgical precision for the modern code archaeologist.*
