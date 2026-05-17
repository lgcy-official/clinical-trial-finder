import { useState } from "react";
import AgentWorkspace from "./AgentWorkspace";
import ApplicationWorkspace from "./ApplicationWorkspace";
import ContractCard from "./ContractCard";
import { askAI } from "./api";

export default function ContractResults({ contracts, profile, runLog, onReset }) {
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = contracts.filter((contract) => {
    if (filter === "strong") return contract.matchScore >= 70;
    if (filter === "possible") return contract.matchScore >= 40 && contract.matchScore < 70;
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setAiAnswer("");
    try {
      const ans = await askAI({ question, profile, contracts, domain: "contracts" });
      setAiAnswer(ans);
      setQuestion("");
    } catch (e) {
      setAiAnswer(e.message || "I couldn't process that question.");
      console.error(e);
    } finally {
      setAsking(false);
    }
  };

  const strong = contracts.filter((contract) => contract.matchScore >= 70).length;
  const possible = contracts.filter((contract) => contract.matchScore >= 40 && contract.matchScore < 70).length;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600 }}>
          $
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 400 }}>Contracts for <em>{profile.industry}</em></h1>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>{profile.naicsCodes || "Any NAICS"} · {profile.location || "Any location"}</p>
        </div>
        <button className="btn-ghost" onClick={onReset} style={{ fontSize: 13 }}>New search</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Opportunities", value: contracts.length, color: "var(--text)" },
          { label: "Strong fits", value: strong, color: "var(--teal)" },
          { label: "Possible fits", value: possible, color: "var(--amber)" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 18px" }}>
            <p style={{ fontSize: 24, fontWeight: 500, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <AgentWorkspace domain="contracts" profile={profile} items={contracts} runLog={runLog} />
      <ApplicationWorkspace domain="contracts" profile={profile} items={contracts} />

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 10 }}>Ask AI about these opportunities</p>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="e.g. Can a small business win this? What past performance do I need?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={handleAsk} disabled={asking || !question.trim()} style={{ whiteSpace: "nowrap", padding: "10px 18px" }}>
            {asking ? <span className="spinner" style={{ width: 16, height: 16 }} /> : "Ask"}
          </button>
        </div>
        {aiAnswer && (
          <div className="fade-in" style={{ marginTop: 14, padding: "12px 16px", background: "var(--teal-light)", borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--teal)", lineHeight: 1.6 }}>
            <strong>AI:</strong> {aiAnswer}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { key: "all", label: `All (${contracts.length})` },
          { key: "strong", label: `Strong (${strong})` },
          { key: "possible", label: `Possible (${possible})` },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: filter === item.key ? "var(--teal)" : "var(--surface)",
              color: filter === item.key ? "#fff" : "var(--text2)",
              border: filter === item.key ? "none" : "1px solid var(--border)",
              cursor: "pointer"
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text3)" }}>
          <p>No opportunities in this category.</p>
        </div>
      ) : (
        filtered.map((contract, i) => <ContractCard key={contract.noticeId || i} contract={contract} />)
      )}

      <div style={{ marginTop: 24, padding: "14px 18px", background: "var(--surface2)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
        This tool is for informational purposes only. Verify all requirements, deadlines, set-asides, amendments, and submission instructions directly in SAM.gov and the solicitation documents before bidding.
      </div>
    </div>
  );
}
