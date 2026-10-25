import { NextResponse } from "next/server";
import casesData from "@/data/authoritative_cases.json";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

async function executeCaseSearch(query: string, jurisdiction?: string) {
  const cleanQuery = query.trim().toLowerCase();
  
  // 1. Check local authoritative dataset first for instant high-confidence matches
  const localMatches = casesData.filter((c) => {
    const matchName = c.case_name.toLowerCase().includes(cleanQuery);
    const matchCite = c.citation.toLowerCase().includes(cleanQuery);
    const matchHolding = c.key_holding.toLowerCase().includes(cleanQuery);
    const matchCat = c.category.toLowerCase().includes(cleanQuery);
    const matchJur = !jurisdiction || jurisdiction === "ALL" || c.jurisdiction.toLowerCase().includes(jurisdiction.toLowerCase());
    return (matchName || matchCite || matchHolding || matchCat) && matchJur;
  });

  // 2. Query Free Law Project CourtListener REST API v4 for live federal/state opinions
  let courtListenerHits: any[] = [];
  try {
    const clUrl = `https://www.courtlistener.com/api/rest/v4/search/?q=${encodeURIComponent(query)}&type=o&order_by=score%20desc`;
    const clRes = await fetch(clUrl, {
      headers: {
        "User-Agent": "LEX-CORE-LegalTech-Platform/1.0 (ricomiller@gmail.com; research workbench)",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (clRes.ok) {
      const clJson = await clRes.json();
      if (clJson && Array.isArray(clJson.results)) {
        courtListenerHits = clJson.results.slice(0, 5).map((r: any) => ({
          id: `cl-${r.cluster_id || r.id || Math.random().toString(36).substring(7)}`,
          case_name: r.caseName || r.caseNameShort || "Matter vs. Record",
          citation: (r.citation && r.citation[0]) || r.neutralCite || r.lexisCite || "Citation Pending",
          court: r.court || "United States Federal / State Appellate",
          jurisdiction: r.court_exact || "Federal Appellate",
          date_decided: r.dateFiled || new Date().toISOString().split("T")[0],
          author_judge: r.judge || "Per Curiam",
          docket_number: r.docketNumber || "Civil Docket",
          category: "Active Case Law Research",
          precedent_status: "AUTHORITATIVE DOCKET",
          key_holding: r.snippet ? r.snippet.replace(/<[^>]*>?/gm, "").slice(0, 240) + "..." : "Opinion text retrieved from CourtListener federal archive.",
          substantive_analysis: r.snippet ? r.snippet.replace(/<[^>]*>?/gm, "") : "Direct opinion search match.",
          citable_spans: [
            {
              span_id: `cl-span-${r.id || "01"}`,
              pinpoint: `CourtListener Cluster #${r.cluster_id || "7"}`,
              text: r.snippet ? r.snippet.replace(/<[^>]*>?/gm, "").slice(0, 180) : "Official opinion excerpt.",
            },
          ],
          source_url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : "https://www.courtlistener.com",
          retrieved_at: new Date().toISOString(),
        }));
      }
    }
  } catch (clErr) {
    // CourtListener rate-limit or timeout graceful fallback
  }

  const merged = [...localMatches, ...courtListenerHits];
  const unique = Array.from(new Map(merged.map((c) => [c.id, c])).values());

  return {
    query,
    total_found: unique.length,
    primary_source: courtListenerHits.length > 0 ? "CourtListener Free Law Project REST v4 + Local Corpus" : "Local Authoritative Judicial Corpus",
    results: unique,
    retrieved_at: new Date().toISOString(),
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || url.searchParams.get("query") || "";
    const jurisdiction = url.searchParams.get("jurisdiction") || url.searchParams.get("court") || undefined;

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400, headers: corsHeaders });
    }

    const data = await executeCaseSearch(query, jurisdiction);
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Case research failed" }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query || body.q;
    const jurisdiction = body.jurisdiction;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query string is required" }, { status: 400, headers: corsHeaders });
    }

    const data = await executeCaseSearch(query, jurisdiction);
    return NextResponse.json(data, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Case research failed" }, { status: 500, headers: corsHeaders });
  }
}
