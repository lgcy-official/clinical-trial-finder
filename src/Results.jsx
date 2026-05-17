import { useState } from "react";
import AgentWorkspace from "./AgentWorkspace";
import ApplicationWorkspace from "./ApplicationWorkspace";
import TrialCard from "./TrialCard";
import { askAI } from "./api";

export default function Results({ trials, profile, runLog, onReset }) {
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = trials.filter(t => {
    if (filter === "strong") return t.matchScore >= 70;
    if (filter === "possible") return t.matchScore >= 40 && t.matchScore < 70;
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAsking(true);
    setAiAnswer("");
    try {
      const ans = await askAI({ question, profile, trials });
      setAiAnswer(ans);
      setQuestion("");
    } catch (e) {
      setAiAnswer(e.message || "I couldn't process that question.");
      console.error(e);
    } finally {
      setAsking(false);
    }
  };

  const strong = trials.filter(t => t.matchScore >= 70).length;
  const possible = trials.filter(t => t.matchScore >= 40 && t.matchScore < 70).length;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v4m0 8v4M4 12h4m8 0h4" strokeLinecap="round"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 400 }}>Trials for <em>{profile.condition}</em></h1>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Age {profile.age} · {profile.location || "Any location"}</p>
        </div>
        <button className="btn-ghost" onClick={onReset} style={{ fontSize: 13 }}>← New search</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Trials found", value: trials.length, color: "var(--text)" },
          { label: "Strong matches", value: strong, color: "var(--teal)" },
          { label: "Possible matches", value: possible, color: "var(--amber)" },
        ].map(s => (
          <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "14px 18px" }}>
            <p style={{ fontSize: 24, fontWeight: 500, color: s.color }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <AgentWorkspace domain="trials" profile={profile} items={trials} runLog={runLog} />
      <ApplicationWorkspace domain="trials" profile={profile} items={trials} />

      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 10 }}>Ask AI about these trials</p>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="e.g. Which trial is closest? What should I ask my insurance? How do I contact the study?"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAsk()}
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
          { key: "all", label: `All (${trials.length})` },
          { key: "strong", label: `Strong (${strong})` },
          { key: "possible", label: `Possible (${possible})` },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: filter === f.key ? "var(--teal)" : "var(--surface)",
              color: filter === f.key ? "#fff" : "var(--text2)",
              border: filter === f.key ? "none" : "1px solid var(--border)",
              cursor: "pointer"
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text3)" }}>
          <p>No trials in this category.</p>
        </div>
      ) : (
        filtered.map((trial, i) => <TrialCard key={trial.nctId || i} trial={trial} />)
      )}

      <div style={{ marginTop: 24, padding: "14px 18px", background: "var(--surface2)", borderRadius: "var(--radius-sm)", fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
        This tool is for informational purposes only. Always consult your healthcare provider before enrolling in any clinical trial. Match scores, cost notes, insurance notes, and reimbursement notes are estimates or questions to verify, not medical, financial, or coverage advice.
      </div>
    </div>
  );
}
