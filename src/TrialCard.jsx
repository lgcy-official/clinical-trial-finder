import { useState } from "react";

function ScoreRing({ score }) {
  const r = 22, circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 70 ? "var(--teal)" : score >= 40 ? "var(--amber)" : "var(--red)";
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r={r} fill="none" stroke="var(--border)" strokeWidth="4"/>
      <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 30 30)"/>
      <text x="30" y="34" textAnchor="middle" fontSize="13" fontWeight="600" fill={color}>{score}</text>
    </svg>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      {children}
    </div>
  );
}

function List({ items, marker = "✓" }) {
  return (
    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items?.map((item, i) => (
        <li key={i} style={{ fontSize: 13, color: "var(--text2)", display: "flex", gap: 8, lineHeight: 1.45 }}>
          <span style={{ color: "var(--teal)", flexShrink: 0 }}>{marker}</span> {item}
        </li>
      ))}
    </ul>
  );
}

export default function TrialCard({ trial }) {
  const [expanded, setExpanded] = useState(false);
  const scoreClass = trial.matchScore >= 70 ? "tag-green" : trial.matchScore >= 40 ? "tag-amber" : "tag-red";
  const scoreLabel = trial.matchScore >= 70 ? "Strong match" : trial.matchScore >= 40 ? "Possible match" : "Low match";

  const phaseColor = {
    "PHASE1": "tag-red", "PHASE2": "tag-amber",
    "PHASE3": "tag-teal", "PHASE4": "tag-green"
  }[trial.phase?.replace(/\s/g,'').toUpperCase()] || "tag-gray";

  return (
    <div className="card fade-in" style={{ marginBottom: 16, borderLeft: `3px solid ${trial.matchScore >= 70 ? 'var(--teal)' : trial.matchScore >= 40 ? 'var(--amber)' : 'var(--border2)'}` }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <ScoreRing score={trial.matchScore} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {trial.agentDecision && <span className="tag tag-teal">{trial.agentDecision}</span>}
            <span className={`tag ${scoreClass}`}>● {scoreLabel}</span>
            {trial.phase && <span className={`tag ${phaseColor}`}>{trial.phase}</span>}
            {trial.status && <span className="tag tag-gray">{trial.status}</span>}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 500, fontFamily: "var(--font-sans, 'DM Sans')", lineHeight: 1.4, marginBottom: 6 }}>{trial.title}</h3>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>{trial.matchReason}</p>
          {trial.location && (
            <p style={{ fontSize: 12, color: "var(--text3)" }}>
              {trial.location} · {trial.estimatedParticipants && `${trial.estimatedParticipants} participants`}
            </p>
          )}
        </div>
      </div>

      <button
        className="btn-ghost"
        onClick={() => setExpanded(e => !e)}
        style={{ marginTop: 14, fontSize: 13, padding: "7px 14px", width: "100%", textAlign: "center" }}
      >
        {expanded ? "Show less" : "See costs, sites & next steps"}
      </button>

      {expanded && (
        <div className="fade-in" style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            <DetailBlock title="Key eligibility">
              <List items={trial.keyEligibility} />
            </DetailBlock>
            <DetailBlock title="What this means">
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{trial.patientInsight}</p>
              {trial.decisionReason && <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginTop: 8 }}><strong style={{ color: "var(--text)" }}>Agent recommendation:</strong> {trial.decisionReason}</p>}
            </DetailBlock>
            <DetailBlock title="Costs & insurance">
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--text2)", lineHeight: 1.55 }}>
                <p><strong style={{ color: "var(--text)" }}>Cost:</strong> {trial.costInfo}</p>
                <p><strong style={{ color: "var(--text)" }}>Insurance:</strong> {trial.insuranceGuidance}</p>
                <p><strong style={{ color: "var(--text)" }}>Reimbursement:</strong> {trial.reimbursementInfo}</p>
              </div>
            </DetailBlock>
            <DetailBlock title="How to start">
              <List items={trial.nextSteps} marker="→" />
            </DetailBlock>
            <DetailBlock title="Questions to ask">
              <List items={trial.questionsToAsk} marker="?" />
            </DetailBlock>
            <DetailBlock title="Sites & contact">
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--text2)", lineHeight: 1.5, wordBreak: "break-word" }}>
                <p><strong style={{ color: "var(--text)" }}>Main contact:</strong> {trial.primaryContact || "Use the ClinicalTrials.gov listing to contact the study team."}</p>
                {trial.sites?.length > 0 ? (
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                    {trial.sites.map((site, i) => (
                      <li key={i}>{site.display}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{trial.location || "Location not listed"}</p>
                )}
              </div>
            </DetailBlock>
            <DetailBlock title="Practical fit">
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{trial.practicalFit}</p>
            </DetailBlock>
          </div>
          {trial.nctId && (
            <a
              href={`https://clinicaltrials.gov/study/${trial.nctId}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, color: "var(--teal)", textDecoration: "none", fontWeight: 500 }}
            >
              View full trial on ClinicalTrials.gov ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
