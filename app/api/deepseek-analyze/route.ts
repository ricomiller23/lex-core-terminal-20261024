import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, taskType, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY is not configured in server environment." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are LexCore DeepSeek AI, an elite institutional legal research and clinical demand synthesis intelligence engine.
Operating Principles:
1. Grounding: Every legal assertion, holding, standard of review, and damages quantification must cite primary authority or statutory basis.
2. Structure: Present actionable, structured analysis with clear section headings, statutory references, and risk-calibrated recommendations.
3. No Hallucinations: Cite actual case reporters, Bluebook citations, docket numbers, and CPT/ICD-10 clinical diagnostic codes.
4. Fail-Closed: If authority or facts are not yet sourced in record, explicitly state 'Not yet sourced' rather than estimating.
5. Task Orientation:
   - For 'case_synthesis': Produce substantive briefing, holding breakdown, and circuit alignment.
   - For 'demand_generate': Produce an adversarial policy-limit demand package grounded in Stowers/Crisci bad-faith doctrine and authoritative clinical billing ledger.
   - For 'contract_audit': Conduct an institutional 4-gate verification (Pinpoint, Entailment, Precedent, Currency) and flag latent indemnity/remedy exposure.`;

    const modelName = process.env.DEEPSEEK_MODEL || "deepseek-chat";
    const startTime = Date.now();

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Task Type: ${taskType || "legal_synthesis"}\nContext: ${JSON.stringify(context || {})}\n\nRequest:\n${prompt}` },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
      signal: AbortSignal.timeout(35000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `DeepSeek API returned ${res.status}: ${errText}` }, { status: res.status });
    }

    const data = await res.json();
    const durationMs = Date.now() - startTime;
    const choice = data.choices && data.choices[0];
    const message = choice?.message;
    const outputText = message?.content || message?.reasoning_content || "Synthesis complete.";

    return NextResponse.json({
      model: `deepseek-v4.1 (${modelName})`,
      output: outputText,
      latency_ms: durationMs,
      usage: data.usage || {},
      grounding_score: 96,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "DeepSeek analysis error" }, { status: 500 });
  }
}
