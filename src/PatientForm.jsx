import { useState } from "react";

const CONDITIONS = [
  "Type 2 Diabetes", "Breast Cancer", "Lung Cancer", "Alzheimer's Disease",
  "Parkinson's Disease", "Multiple Sclerosis", "Rheumatoid Arthritis",
  "Crohn's Disease", "Heart Failure", "Depression", "COPD", "Asthma",
  "Hypertension", "Obesity", "Prostate Cancer"
];

export default function PatientForm({ onSubmit, onDemo, loading }) {
  const [form, setForm] = useState({
    condition: "", customCondition: "", age: "", gender: "",
    location: "", history: "", medications: ""
  });
  const [step, setStep] = useState(1);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const conditionValue = form.condition === "__custom__" ? form.customCondition : form.condition;
  const canNext = step === 1 ? conditionValue && form.age && form.gender : true;

  const handleSubmit = () => {
    onSubmit({ ...form, condition: conditionValue });
  };

  return (
    <div style={{ maxWidth: 580, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v4m0 8v4M4 12h4m8 0h4" strokeLinecap="round"/></svg>
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.2 }}>TrialMatch</h1>
            <p style={{ fontSize: 13, color: "var(--text3)" }}>AI-powered clinical trial finder</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {[1,2].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: step >= s ? "var(--teal)" : "var(--border)" }} />
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>
          Step {step} of 2 — {step === 1 ? "Your health profile" : "Additional context (optional)"}
        </p>
      </div>

      {step === 1 && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card">
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>
              What condition are you looking for trials for? *
            </label>
            <select value={form.condition} onChange={e => set("condition", e.target.value)}>
              <option value="">Select a condition...</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__custom__">Other (type below)</option>
            </select>
            {form.condition === "__custom__" && (
              <input style={{ marginTop: 10 }} placeholder="Type your condition..." value={form.customCondition} onChange={e => set("customCondition", e.target.value)} />
            )}
          </div>

          <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Age *</label>
              <input type="number" min="1" max="120" placeholder="e.g. 45" value={form.age} onChange={e => set("age", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Gender *</label>
              <select value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="">Select...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="card">
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Location (city or country)</label>
            <input placeholder="e.g. San Francisco, CA or United States" value={form.location} onChange={e => set("location", e.target.value)} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <button className="btn-ghost" onClick={onDemo} data-coframe-conversion="load-trials-demo">Load demo</button>
            <button className="btn-primary" disabled={!canNext} onClick={() => setStep(2)}>
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card">
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>
              Medical history
              <span style={{ fontWeight: 400, color: "var(--text3)", marginLeft: 6 }}>— helps AI assess eligibility</span>
            </label>
            <textarea rows={3} placeholder="e.g. diagnosed 3 years ago, had surgery in 2022, no prior chemotherapy..." value={form.history} onChange={e => set("history", e.target.value)} style={{ resize: "vertical" }} />
          </div>

          <div className="card">
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>
              Current medications
            </label>
            <textarea rows={2} placeholder="e.g. Metformin 500mg, Lisinopril 10mg..." value={form.medications} onChange={e => set("medications", e.target.value)} style={{ resize: "vertical" }} />
          </div>

          <div style={{ padding: "12px 16px", background: "var(--teal-light)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--teal)" }}>
            <strong>Privacy note:</strong> Your information is only used to search and analyze trials in this session. Nothing is stored.
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <button className="btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={onDemo} data-coframe-conversion="load-trials-demo">Load demo</button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading} data-coframe-conversion="search-trials">
                {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Finding trials...</> : "Find My Trials →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
