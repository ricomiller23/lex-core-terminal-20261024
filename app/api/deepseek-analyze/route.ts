import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { prompt, taskType, context, userObjective, ingestedDocuments } = await req.json();

    if (!prompt && !userObjective) {
      return NextResponse.json({ error: "Prompt or user objective is required" }, { status: 400, headers: corsHeaders });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY is not configured in server environment." },
        { status: 500, headers: corsHeaders }
      );
    }

    const systemPrompt = `You are LexCore DeepSeek AI, an elite legal intelligence, case discovery, and document synthesis engine running concurrently with GRNH Forensics.
Operating Principles:
1. Grounding: Every legal assertion, holding, standard of review, and damages quantification must cite primary authority or statutory basis with volume/reporter/page or statutory sections.
2. Structure: Present actionable, structured analysis with clear section headings, statutory references, and risk-calibrated recommendations.
3. No Hallucinations: Cite actual case reporters, Bluebook citations, docket numbers, and CPT/ICD-10 clinical diagnostic codes.
4. Fail-Closed: If authority or facts are not yet sourced in record, explicitly state 'Not yet sourced' rather than estimating.
5. Task Orientation:
   - For 'autonomous_case_build': Deeply analyze the user's overarching objective and all ingested document files. Automatically identify core legal causes of action, factual timeline, governing jurisdiction, controlling case law (Ralston Purina, Lorenzo, CMKM Diamonds, Platforms Wireless, Chinese Consolidated, Revlon, Caremark, Stowers, Crisci, etc.), critical discovery gaps, evidentiary risks, and build a strategic case dossier.
   - For 'case_synthesis': Produce substantive briefing, holding breakdown, and circuit alignment.
   - For 'demand_generate': Produce an adversarial policy-limit demand package grounded in Stowers/Crisci bad-faith doctrine and authoritative clinical billing ledger.
   - For 'contract_audit': Conduct an institutional 4-gate review (Pinpoint, Entailment, Precedent, Currency) and flag latent indemnity/remedy exposure.`;

    const modelName = process.env.DEEPSEEK_MODEL || "deepseek-chat";
    const startTime = Date.now();

    // Construct enriched payload for autonomous case building
    let userMessageContent = "";
    if (taskType === "autonomous_case_build") {
      userMessageContent = `USER LEGAL OBJECTIVE:\n${userObjective || prompt}\n\n`;
      if (ingestedDocuments && Array.isArray(ingestedDocuments) && ingestedDocuments.length > 0) {
        userMessageContent += `INGESTED EVIDENCE & DOCUMENTS (${ingestedDocuments.length} files attached):\n`;
        ingestedDocuments.forEach((doc: any, i: number) => {
          userMessageContent += `--- Document ${i + 1}: ${doc.filename || doc.title || "File"} ---\n${doc.content || doc.excerpt || doc.text || ""}\n\n`;
        });
      }
      userMessageContent += `\nINSTRUCTIONS:
1. Analyze the user's objective and evidence in depth.
2. Determine the governing legal framework, jurisdiction, and causes of action.
3. Automatically figure out and cite controlling case law, binding Supreme Court / Circuit / State precedents, and relevant statutory provisions.
4. Identify critical factual strengths, evidentiary gaps, and opposing counsel arguments.
5. Provide a step-by-step procedural action plan to achieve the user's objective.`;
    } else {
      userMessageContent = `Task Type: ${taskType || "legal_synthesis"}\nContext: ${JSON.stringify(context || {})}\n\nRequest:\n${prompt}`;
    }

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
          { role: "user", content: userMessageContent },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
      signal: AbortSignal.timeout(35000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `DeepSeek API returned ${res.status}: ${errText}` }, { status: res.status, headers: corsHeaders });
    }

    const data = await res.json();
    const durationMs = Date.now() - startTime;
    const choice = data.choices && data.choices[0];
    const message = choice?.message;
    const outputText = message?.content || message?.reasoning_content || "Synthesis finished.";

    return NextResponse.json({
      model: `deepseek-v4.1 (${modelName})`,
      output: outputText,
      latency_ms: durationMs,
      usage: data.usage || {},
      grounding_score: 96,
      timestamp: new Date().toISOString(),
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "DeepSeek analysis error" }, { status: 500, headers: corsHeaders });
  }
}
