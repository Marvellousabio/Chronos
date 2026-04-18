import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Chronos, an expert legacy code archaeologist with 30 years of experience in enterprise software modernization. You specialize in COBOL, early Java, C, and ancient JavaScript systems. You communicate findings with surgical precision: concrete, actionable, no fluff. You understand the business risk of touching legacy systems and always balance technical idealism with enterprise pragmatism. Format output with clear sections using ASCII dividers (═══) for structure. Use code blocks for all code samples. Be decisive — give recommendations, not options.`;

const DEMO_CODEBASE_CONTEXT = `
Legacy Banking Codebase Analysis (Demo):

Files analyzed: 47
Languages: 62% Java, 38% COBOL
Total LOC: ~12,000
Architecture: Spaghetti monolith with tight coupling
Tech Debt Score: 78/100

Key Critical Modules:
- TransactionService.java (310 LOC) - handles all transaction processing, 14 direct dependencies
- SecurityManager.java (287 LOC) - authentication/authorization, used by 23 files
- LegacyDBAdapter.cobol (178 LOC) - COBOL bridge to mainframe, bottleneck
- StatementGenerator.java (321 LOC) - complex report generation
- BatchProcessor.cobol (245 LOC) - nightly batch processing

Dependency Issues:
- 73 circular dependencies in core package
- 5 "god classes" (everything depends on them)
- 12 dead code files (no inbound references)
- 47 files exceed 200 LOC (high complexity)

Integration Points:
- COBOL bridge via JNI wrapper
- Mainframe DB2 connections (connection pool issues)
- Legacy batch job scheduler (incompatible with cloud)

Most Critical Risk: 
TransactionService.java calls directly into COBOL layer with no abstraction, 
making any change a production risk.`.trim();

export async function POST(request: NextRequest) {
  try {
    const { message, mode, selectedFile, targetLanguage, files } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    let systemPrompt = SYSTEM_PROMPT;
    
    if (mode === "excavation") {
      systemPrompt += `\n\n${DEMO_CODEBASE_CONTEXT}\n\nProvide a comprehensive excavation report. Include: 1) Executive summary 2) Business domain 3) Architecture pattern 4) Top 5 critical files 5) Tech debt score with reasoning 6) Risk assessment.`;
    } else if (mode === "dependencies") {
      systemPrompt += `\n\n${DEMO_CODEBASE_CONTEXT}\n\nFocus on analyzing the import/require/call graph. Identify: 1) Circular dependencies (list them) 2) God classes/god files 3) Dead code candidates 4) Tightly coupled modules that should be decoupled. Provide a prioritized refactoring roadmap.`;
    } else if (mode === "refactor") {
      systemPrompt += `\n\n${DEMO_CODEBASE_CONTEXT}\n\nUser has selected file: ${selectedFile}. Target language: ${targetLanguage}. Provide EXACTLY these sections: 1) Plain-English explanation (what does this legacy code do?) 2) Full ${targetLanguage.toUpperCase()} rewrite (complete, runnable code) 3) Migration risks (watch out for these edge cases...) 4) Effort estimate (lines changed, complexity, test coverage needed). Use code blocks for all code.`;
    } else if (mode === "terminal") {
      systemPrompt += `\n\n${DEMO_CODEBASE_CONTEXT}\n\nYou are simulating a terminal interface. The user will type commands and you respond as if executing real operations on the codebase. Support: scan --deep, test --legacy, deps --outdated, refactor [file], explain [file], risk-score. Be concise, output only what a terminal would show (no conversational fluff).`;
    }

    const userMessage = mode === "refactor" 
      ? `Refactor blueprint request for file: ${selectedFile} to ${targetLanguage}. Full file content:\n\n[Legacy code for ${selectedFile} would be here].\n\nProduce: 1) Explanation 2) Full ${targetLanguage} rewrite 3) Migration risks 4) Effort estimate.`
      : message;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error?.message || `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ content: data.content[0].text });
  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      { error: 'Failed to call Claude API' },
      { status: 500 }
    );
  }
}
