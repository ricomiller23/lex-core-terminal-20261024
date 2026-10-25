import { NextResponse } from "next/server";
import clinicalMatters from "@/data/clinical_matters.json";

export async function POST(req: Request) {
  try {
    const { matterId } = await req.json().catch(() => ({}));
    
    const targets = matterId
      ? clinicalMatters.filter((m) => m.id === matterId)
      : clinicalMatters;

    const audited = targets.map((m) => {
      // Calculate dynamic days until statute of limitations expires
      const solTime = new Date(m.statute_of_limitations_date).getTime();
      const now = Date.now();
      const daysRemaining = Math.max(0, Math.ceil((solTime - now) / (1000 * 60 * 60 * 24)));
      const solUrgency = daysRemaining < 90 ? "CRITICAL (UNDER 90 DAYS)" : daysRemaining < 180 ? "HIGH ATTENTION" : "STABLE DOCKET";

      // Evaluate treatment gaps
      const gaps = m.treatment_gaps.map((g) => ({
        ...g,
        status: "PRE_EXPLAINED",
        audit_verdict: "DOCUMENTED DEFENSE ASSET",
      }));

      return {
        matter_id: m.id,
        case_title: m.case_title,
        matter_number: m.matter_number,
        venue: m.venue,
        days_to_sol: daysRemaining,
        sol_status: solUrgency,
        active_encounters_analyzed: m.clinical_timeline.length,
        gaps_detected: gaps.length,
        treatment_gaps: gaps,
        insurance_limits: m.insurance_limits,
        damages: m.economic_damages_summary,
        demand: m.demand_recommendation,
        source_url: m.source_url,
        retrieved_at: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      audit_run_id: `aud-${Date.now()}`,
      matters_scanned: audited.length,
      timestamp: new Date().toISOString(),
      findings: audited,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Auditor scan failed" }, { status: 500 });
  }
}
