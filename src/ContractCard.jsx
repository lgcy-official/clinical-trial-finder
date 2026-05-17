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

export default function ContractCard({ contract }) {
  const [expanded, setExpanded] = useState(false);
  const scoreClass = contract.matchScore >= 70 ? "tag-green" : contract.matchScore >= 40 ? "tag-amber" : "tag-red";
  const scoreLabel = contract.matchScore >= 70 ? "Strong bid fit" : contract.matchScore >= 40 ? "Possible bid fit" : "Weak bid fit";

  return (
    <div className="card fade-in" style={{ marginBottom: 16, borderLeft: `3px solid ${contract.matchScore >= 70 ? "var(--teal)" : contract.matchScore >= 40 ? "var(--amber)" : "var(--border2)"}` }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <ScoreRing score={contract.matchScore} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {contract.agentDecision && <span className="tag tag-teal">{contract.agentDecision}</span>}
            <span className={`tag ${scoreClass}`}>{scoreLabel}</span>
            {contract.noticeType && <span className="tag tag-gray">{contract.noticeType}</span>}
            {contract.setAside && <span className="tag tag-teal">{contract.setAside}</span>}
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 500, fontFamily: "var(--font-sans, 'DM Sans')", lineHeight: 1.4, marginBottom: 6 }}>{contract.title}</h3>
          <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>{contract.fitReason}</p>
          <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>
            {contract.agency} · Due {contract.responseDeadline || "not listed"} · NAICS {contract.naicsCode || "not listed"}
          </p>
        </div>
      </div>

      <button
        className="btn-ghost"
        onClick={() => setExpanded((value) => !value)}
        style={{ marginTop: 14, fontSize: 13, padding: "7px 14px", width: "100%", textAlign: "center" }}
      >
        {expanded ? "Show less" : "See bid requirements & next steps"}
      </button>

      {expanded && (
        <div className="fade-in" style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            <DetailBlock title="Bid readiness">
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{contract.bidReadiness}</p>
              {contract.decisionReason && <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginTop: 8 }}><strong style={{ color: "var(--text)" }}>Agent recommendation:</strong> {contract.decisionReason}</p>}
            </DetailBlock>
            <DetailBlock title="Opportunity facts">
              <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 13, color: "var(--text2)", lineHeight: 1.5, wordBreak: "break-word" }}>
                <p><strong style={{ color: "var(--text)" }}>Posted:</strong> {contract.postedDate}</p>
                <p><strong style={{ color: "var(--text)" }}>Deadline:</strong> {contract.responseDeadline}</p>
                <p><strong style={{ color: "var(--text)" }}>Place:</strong> {contract.placeOfPerformance}</p>
                <p><strong style={{ color: "var(--text)" }}>Value:</strong> {contract.estimatedValue}</p>
                <p><strong style={{ color: "var(--text)" }}>Contact:</strong> {contract.contact}</p>
              </div>
            </DetailBlock>
            <DetailBlock title="Requirements">
              <List items={contract.requirements} />
            </DetailBlock>
            <DetailBlock title="Win themes">
              <List items={contract.winThemes} marker="+" />
            </DetailBlock>
            <DetailBlock title="Risks">
              <List items={contract.risks} marker="!" />
            </DetailBlock>
            <DetailBlock title="Next steps">
              <List items={contract.nextSteps} marker=">" />
            </DetailBlock>
            <DetailBlock title="Questions to ask">
              <List items={contract.questionsToAsk} marker="?" />
            </DetailBlock>
          </div>
          {contract.link && (
            <a
              href={contract.link}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 13, color: "var(--teal)", textDecoration: "none", fontWeight: 500 }}
            >
              View opportunity on SAM.gov
            </a>
          )}
        </div>
      )}
    </div>
  );
}
