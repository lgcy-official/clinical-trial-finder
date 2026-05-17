import { useState } from "react";

const APPLICANT_TYPES = [
  "Nonprofit",
  "Small business / startup",
  "Research institution",
  "School / university",
  "Local government",
  "State government",
  "Individual",
  "Tribal organization"
];

const FUNDING_CATEGORIES = [
  { label: "Any category", value: "" },
  { label: "Health", value: "HL" },
  { label: "Education", value: "ED" },
  { label: "Environment", value: "ENV" },
  { label: "Science and technology", value: "ST" },
  { label: "Community development", value: "CD" },
  { label: "Business and commerce", value: "BC" },
  { label: "Arts", value: "AR" }
];

export default function GrantForm({ onSubmit, onDemo, loading }) {
  const [form, setForm] = useState({
    applicantType: "",
    organization: "",
    fundingNeed: "",
    keywords: "",
    location: "",
    agencies: "",
    fundingCategory: "",
    fundingInstrument: "",
    experience: "",
    notes: ""
  });

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const canSubmit = form.applicantType && (form.keywords || form.fundingNeed);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600 }}>
            G
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.2 }}>GrantMatch</h1>
            <p style={{ fontSize: 13, color: "var(--text3)" }}>AI-powered grant opportunity finder</p>
          </div>
        </div>
      </div>

      <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Applicant type *</label>
            <select value={form.applicantType} onChange={(e) => set("applicantType", e.target.value)}>
              <option value="">Select...</option>
              {APPLICANT_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Organization</label>
            <input placeholder="e.g. nonprofit, lab, city office" value={form.organization} onChange={(e) => set("organization", e.target.value)} />
          </div>
        </div>

        <div className="card">
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>
            What do you need funding for? *
          </label>
          <input placeholder="e.g. youth mental health, climate resilience, workforce training" value={form.fundingNeed} onChange={(e) => set("fundingNeed", e.target.value)} />
        </div>

        <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Search keywords</label>
            <input placeholder="Use broad terms: health, workforce, climate" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Location</label>
            <input placeholder="e.g. California, rural counties, nationwide" value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
        </div>

        <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Funding category</label>
            <select value={form.fundingCategory} onChange={(e) => set("fundingCategory", e.target.value)}>
              {FUNDING_CATEGORIES.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Agency filter</label>
            <input placeholder="Optional. Leave blank for more matches." value={form.agencies} onChange={(e) => set("agencies", e.target.value.toUpperCase())} />
          </div>
        </div>

        <div className="card">
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Grant experience</label>
          <textarea rows={3} placeholder="e.g. won local grants before, never applied federally, has finance team" value={form.experience} onChange={(e) => set("experience", e.target.value)} style={{ resize: "vertical" }} />
        </div>

        <div className="card">
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text2)", marginBottom: 8 }}>Other notes</label>
          <textarea rows={2} placeholder="e.g. needs no-match grants, wants forecasted opportunities, can partner with universities" value={form.notes} onChange={(e) => set("notes", e.target.value)} style={{ resize: "vertical" }} />
        </div>

        <div style={{ padding: "12px 16px", background: "var(--teal-light)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--teal)", lineHeight: 1.5 }}>
          Grants.gov search works best with broad keywords first. Leave agency and category blank unless you intentionally want a narrow search.
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={onDemo}>Load demo</button>
          <button className="btn-primary" onClick={() => onSubmit(form)} disabled={!canSubmit || loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Finding grants...</> : "Find Grants"}
          </button>
        </div>
      </div>
    </div>
  );
}
