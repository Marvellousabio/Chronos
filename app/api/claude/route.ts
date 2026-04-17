import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Chronos, an expert legacy code archaeologist with 30 years of experience in enterprise software modernization. You specialize in COBOL, early Java, C, and ancient JavaScript systems. You communicate findings with surgical precision: concrete, actionable, no fluff. You understand the business risk of touching legacy systems and always balance technical idealism with enterprise pragmatism. Format output with clear sections using ASCII dividers (═══) for structure. Use code blocks for all code samples. Be decisive — give recommendations, not options.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured on server' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt || SYSTEM_PROMPT,
        messages,
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
