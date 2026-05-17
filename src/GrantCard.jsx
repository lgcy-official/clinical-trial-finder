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

function List({ items, marker = "-" }) {
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

export default function GrantCard({ grant }) {
  const [expanded, setExpanded] = useState(false);
  const scoreClass = grant.matchScore >= 70 ? "tag-green" : grant.matchScore >= 40 ? "tag-amber" : "tag-red";
  const scoreLabel = grant.matchScore >= 70 ? "Strong grant fit" : grant.matchScore >= 40 ? "Possible grant fit" : "Weak grant fit";

  return (
    <div className="card fade-in" style={{ marginBottom: 16, borderLeft: `3px solid ${grant.matchScore >= 70 ? "var(--teal)" : grant.matchScore >= 40 ? "var(--amber)" : "var(--border2)"}` }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <ScoreRing score={grant.matchScore} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {grant.agentDecision && <span className="tag tag-teal">{grant.agentDecision}</span>}
            <span className={`tag ${scoreClass}`}>{scoreLabel}</span>
            {grant.status && <span className="tag tag-gray">{grant.status}</span>}
            {grant.fundingInstrument && <span className="tag tag-teal">{grant.fundingInstrument}</span>}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 500, fontFamily: "var(--font-sans, 'DM Sans')", lineHeight: 1.4, marginBottom: 6 }}>{grant.title}</h3>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>{grant.fitReason}</p>
          <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>
            {grant.agency} · Due {grant.closeDate || "not listed"} · Ceiling {grant.awardCeiling || "not listed"}
          </p>
        </div>
      </div>

      <button
        className="btn-ghost"
        onClick={() => setExpanded((value) => !value)}
        style={{ marginTop: 14, fontSize: 13, padding: "7px 14px", width: "100%", textAlign: "center" }}
      >
        {expanded ? "Show less" : "See eligibility & application steps"}
      </button>

      {expanded && (
        <div className="fade-in" style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            <DetailBlock title="Eligibility readiness">
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{grant.eligibilityReadiness}</p>
              {grant.decisionReason && <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginTop: 8 }}><strong style={{ color: "var(--text)" }}>Agent recommendation:</strong> {grant.decisionReason}</p>}
            </DetailBlock>
            <DetailBlock title="Opportunity facts">
              <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13, color: "var(--text2)", lineHeight: 1.5, wordBreak: "break-word" }}>
                <p><strong style={{ color: "var(--text)" }}>Posted:</strong> {grant.postedDate}</p>
                <p><strong style={{ color: "var(--text)" }}>Deadline:</strong> {grant.closeDate}</p>
                <p><strong style={{ color: "var(--text)" }}>Eligibility:</strong> {grant.eligibility}</p>
                <p><strong style={{ color: "var(--text)" }}>Award floor:</strong> {grant.awardFloor}</p>
                <p><strong style={{ color: "var(--text)" }}>Award ceiling:</strong> {grant.awardCeiling}</p>
                <p><strong style={{ color: "var(--text)" }}>Cost sharing:</strong> {grant.costSharing}</p>
                <p><strong style={{ color: "var(--text)" }}>Contact:</strong> {grant.contact}</p>
              </div>
            </DetailBlock>
            <DetailBlock title="Requirements">
              <List items={grant.requirements} />
            </DetailBlock>
            <DetailBlock title="Application steps">
              <List items={grant.applicationSteps} marker=">" />
            </DetailBlock>
            <DetailBlock title="Documents needed">
              <List items={grant.documentsNeeded} marker="+" />
            </DetailBlock>
            <DetailBlock title="Risks">
              <List items={grant.risks} marker="!" />
            </DetailBlock>
            <DetailBlock title="Questions to ask">
              <List items={grant.questionsToAsk} marker="?" />
            </DetailBlock>
          </div>
          {grant.link && (
            <a
              href={grant.link}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, color: "var(--teal)", textDecoration: "none", fontWeight: 500 }}
            >
              View opportunity on Grants.gov
            </a>
          )}
        </div>
      )}
    </div>
  );
}
