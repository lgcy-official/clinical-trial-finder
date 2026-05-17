import { useState } from "react";

const CERTIFICATIONS = [
  "Small Business",
  "8(a)",
  "HUBZone",
  "Woman-Owned",
  "Veteran-Owned",
  "Service-Disabled Veteran-Owned"
];

export default function BusinessForm({ onSubmit, onDemo, loading }) {
  const [form, setForm] = useState({
    industry: "",
    keywords: "",
    naicsCodes: "",
    companySize: "",
    certifications: [],
    location: "",
    state: "",
    pastPerformance: "",
    notes: ""
  });

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const canSubmit = form.industry && (form.keywords || form.naicsCodes);

  const toggleCertification = (certification) => {
    setForm((current) => ({
      ...current,
      certifications: current.certifications.includes(certification)
        ? current.certifications.filter((item) => item !== certification)
        : [...current.certifications, certification]
    }));
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600 }}>
            $
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.2 }}>BidMatch</h1>
            <p style={{ fontSize: 13, color: "var(--text3)" }}>AI-powered government contract finder</p>
          </div>
        </div>
      </div>

      <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="card">
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>
            What does your business sell? *
          </label>
          <input placeholder="e.g. cybersecurity consulting, janitorial services, medical supplies" value={form.industry} onChange={(e) => set("industry", e.target.value)} />
        </div>

        <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Keywords *</label>
            <input placeholder="Use broad terms: software, data, medical, construction" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>NAICS codes</label>
            <input placeholder="Use 1-2 broad codes: 541511, 541512" value={form.naicsCodes} onChange={(e) => set("naicsCodes", e.target.value)} />
          </div>
        </div>

        <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Location</label>
            <input placeholder="e.g. Austin, TX or remote-capable" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>State</label>
            <input placeholder="TX" maxLength={2} value={form.state} onChange={(e) => set("state", e.target.value.toUpperCase())} />
          </div>
        </div>

        <div className="card">
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 10 }}>
            Certifications and set-asides
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CERTIFICATIONS.map((certification) => {
              const selected = form.certifications.includes(certification);
              return (
                <button
                  key={certification}
                  type="button"
                  onClick={() => toggleCertification(certification)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: 20,
                    fontSize: 13,
                    background: selected ? "var(--teal)" : "var(--surface2)",
                    color: selected ? "#fff" : "var(--text2)",
                    border: selected ? "1px solid var(--teal)" : "1px solid var(--border)"
                  }}
                >
                  {certification}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Company size</label>
          <select value={form.companySize} onChange={(e) => set("companySize", e.target.value)}>
            <option value="">Select...</option>
            <option>Solo / freelancer</option>
            <option>2-10 employees</option>
            <option>11-50 employees</option>
            <option>51-200 employees</option>
            <option>200+ employees</option>
          </select>
        </div>

        <div className="card">
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Past performance</label>
          <textarea rows={3} placeholder="e.g. local government projects, commercial customers, relevant prime/subcontract work" value={form.pastPerformance} onChange={(e) => set("pastPerformance", e.target.value)} style={{ resize: "vertical" }} />
        </div>

        <div className="card">
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Other notes</label>
          <textarea rows={2} placeholder="e.g. can travel nationally, only want small contracts, looking for sources sought first" value={form.notes} onChange={(e) => set("notes", e.target.value)} style={{ resize: "vertical" }} />
        </div>

        <div style={{ padding: "12px 16px", background: "var(--amber-light)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--amber)", lineHeight: 1.5 }}>
          SAM.gov searches work best with broad title words and one primary NAICS. Leave state blank unless the work must be performed in that state.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={onDemo}>Load demo</button>
          <button className="btn-primary" onClick={() => onSubmit(form)} disabled={!canSubmit || loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Finding contracts...</> : "Find Contracts"}
          </button>
        </div>
      </div>
    </div>
  );
}
