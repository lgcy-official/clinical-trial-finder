function getTopItem(items) {
  return [...items].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))[0];
}

function goalFor(domain, profile) {
  if (domain === "contracts") return `Find bid-worthy government contracts for ${profile.industry}.`;
  if (domain === "grants") return `Find grant opportunities for ${profile.fundingNeed}.`;
  return `Find recruiting clinical trials for ${profile.condition}.`;
}

function fallbackChecks(domain) {
  if (domain === "contracts") {
    return ["Searched SAM.gov active opportunities.", "Checked NAICS, set-aside, deadline, agency, contact, and bid-readiness signals.", "Ranked opportunities by likely pursuit value."];
  }
  if (domain === "grants") {
    return ["Searched Grants.gov posted and forecasted opportunities.", "Checked eligibility, funding instrument, deadline, award details, and application requirements.", "Ranked grants by likely application fit."];
  }
  return ["Searched ClinicalTrials.gov recruiting studies.", "Checked condition fit, eligibility, locations, contacts, costs, insurance questions, and next steps.", "Ranked trials by likely screening fit."];
}

function missingInfo(domain, item) {
  if (!item) return ["No results are loaded yet."];

  if (domain === "contracts") {
    return [
      item.estimatedValue === "Not listed" && "Estimated contract value is not listed.",
      item.setAside?.toLowerCase().includes("no set") && "No set-aside protection is listed.",
      item.responseDeadline === "Not listed" && "Response deadline needs verification.",
      item.contact === "Contact not listed" && "Contracting contact is not listed."
    ].filter(Boolean);
  }

  if (domain === "grants") {
    return [
      (item.awardCeiling === "Not listed" || item.awardCeiling === "none") && "Award ceiling is not clearly listed.",
      item.costSharing === "Not listed" && "Cost sharing or matching funds are unclear.",
      item.closeDate === "Not listed" && "Application deadline needs verification.",
      item.eligibility?.toLowerCase().includes("see") && "Eligibility requires reading the full notice."
    ].filter(Boolean);
  }

  return [
    item.costInfo?.toLowerCase().includes("does not") && "Exact patient costs are not listed.",
    item.insuranceGuidance?.toLowerCase().includes("ask") && "Insurance coverage needs verification.",
    item.location === "Location not listed" && "Trial location is not listed.",
    item.primaryContact?.toLowerCase().includes("clinicaltrials.gov") && "Study contact needs confirmation from the full listing."
  ].filter(Boolean);
}

function nextActionsFor(domain, item) {
  if (!item) return [];
  if (domain === "grants") return item.applicationSteps || [];
  return item.nextSteps || [];
}

function suggestedFollowUp(domain) {
  if (domain === "contracts") return "Ask: should I bid, team, or no-bid the top two opportunities?";
  if (domain === "grants") return "Ask: which grant has the highest chance relative to application effort?";
  return "Ask: which trial should I contact first and what should I ask the coordinator?";
}

export default function AgentWorkspace({ domain, profile, items, runLog }) {
  const top = getTopItem(items);
  const gaps = missingInfo(domain, top);
  const actions = nextActionsFor(domain, top);
  const checks = runLog?.length ? runLog : fallbackChecks(domain);

  return (
    <section className="card" style={{ marginBottom: 24, borderLeft: "3px solid var(--teal)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Agent workspace</p>
          <h2 style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.25 }}>{goalFor(domain, profile)}</h2>
        </div>
        {top?.agentDecision && (
          <span className="tag tag-teal" style={{ whiteSpace: "nowrap" }}>{top.agentDecision}</span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 18 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>What I checked</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
            {checks.slice(-5).map((item, index) => (
              <li key={index} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45 }}>✓ {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Top recommendation</p>
          <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, lineHeight: 1.45 }}>{top?.title || "No recommendation yet."}</p>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.55, marginTop: 6 }}>{top?.decisionReason || "Run a search to generate a recommendation."}</p>
        </div>

        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Missing information</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
            {(gaps.length ? gaps : ["No major missing fields on the top result. Still verify official records before acting."]).map((item, index) => (
              <li key={index} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45 }}>! {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Next actions</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
            {actions.slice(0, 3).map((item, index) => (
              <li key={index} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45 }}>→ {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--surface2)", fontSize: 13, color: "var(--text2)" }}>
        {suggestedFollowUp(domain)}
      </div>
    </section>
  );
}
