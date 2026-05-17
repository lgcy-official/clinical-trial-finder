import { useState } from "react";
import PatientForm from "./PatientForm";
import Results from "./Results";
import BusinessForm from "./BusinessForm";
import ContractResults from "./ContractResults";
import GrantForm from "./GrantForm";
import GrantResults from "./GrantResults";
import { searchTrials, analyzeTrialsWithAI, searchContracts, analyzeContractsWithAI, searchGrants, analyzeGrantsWithAI } from "./api";
import { demoContracts, demoGrants, demoProfiles, demoRunLog, demoTrials } from "./demoData";

function ModeSwitcher({ mode, onChange }) {
  return (
    <div style={{ maxWidth: 680, margin: "1.5rem auto 0", padding: "0 1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, background: "var(--surface2)", padding: 6, borderRadius: "var(--radius-sm)" }}>
        {[
          { key: "trials", label: "Clinical trials" },
          { key: "contracts", label: "Government contracts" },
          { key: "grants", label: "Grants" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            style={{
              padding: "9px 12px",
              borderRadius: "var(--radius-sm)",
              background: mode === item.key ? "var(--surface)" : "transparent",
              color: mode === item.key ? "var(--text)" : "var(--text2)",
              border: mode === item.key ? "1px solid var(--border)" : "1px solid transparent",
              fontSize: 14,
              fontWeight: 500
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("trials");
  const [screen, setScreen] = useState("form");
  const [profile, setProfile] = useState(null);
  const [trials, setTrials] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");
  const [investigationLog, setInvestigationLog] = useState([]);

  const startRun = (entries) => setInvestigationLog(entries);
  const addRunStep = (entry) => setInvestigationLog((current) => [...current, entry]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setScreen("form");
    setProfile(null);
    setTrials([]);
    setContracts([]);
    setGrants([]);
    setInvestigationLog([]);
    setError("");
  };

  const handleDemo = (demoMode) => {
    setMode(demoMode);
    setError("");
    setLoading(false);

    if (demoMode === "contracts") {
      setProfile(demoProfiles.contracts);
      setContracts(demoContracts);
      setTrials([]);
      setGrants([]);
      setInvestigationLog(demoRunLog.contracts);
      setScreen("contracts");
      return;
    }

    if (demoMode === "grants") {
      setProfile(demoProfiles.grants);
      setGrants(demoGrants);
      setTrials([]);
      setContracts([]);
      setInvestigationLog(demoRunLog.grants);
      setScreen("grants");
      return;
    }

    setProfile(demoProfiles.trials);
    setTrials(demoTrials);
    setContracts([]);
    setGrants([]);
    setInvestigationLog(demoRunLog.trials);
    setScreen("results");
  };

  const handleSearch = async (formData) => {
    setLoading(true);
    setError("");
    setProfile(formData);
    startRun([
      `Goal: find recruiting clinical trials for ${formData.condition}.`,
      "Searching ClinicalTrials.gov for recruiting studies."
    ]);
    try {
      setLoadingMsg("Searching ClinicalTrials.gov...");
      const rawTrials = await searchTrials(formData);
      if (rawTrials.length === 0) {
        setError("No recruiting trials found for this condition. Try a different condition or location.");
        setLoading(false);
        return;
      }
      addRunStep(`Found ${rawTrials.length} recruiting studies.`);
      addRunStep("Checking eligibility language, locations, costs, insurance questions, and coordinator next steps.");
      setLoadingMsg(`Found ${rawTrials.length} trials. Analyzing with AI...`);
      const analyzed = await analyzeTrialsWithAI({ profile: formData, trials: rawTrials });
      addRunStep("Ranked trials and generated screening recommendations.");
      addRunStep("Prepared a screening packet workspace for the strongest matches.");
      setTrials(analyzed);
      setScreen("results");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      console.error(e);
    }
    setLoading(false);
  };

  const handleContractSearch = async (formData) => {
    setLoading(true);
    setError("");
    setProfile(formData);
    startRun([
      `Goal: find active government contracts for ${formData.industry}.`,
      "Searching SAM.gov active opportunities."
    ]);
    try {
      setLoadingMsg("Searching SAM.gov opportunities...");
      const rawContracts = await searchContracts(formData);
      if (rawContracts.length === 0) {
        setError("No active opportunities found for this business profile. Try broader keywords or a different NAICS code.");
        setLoading(false);
        return;
      }
      addRunStep(`Found ${rawContracts.length} active opportunities.`);
      addRunStep("Checking NAICS fit, set-asides, deadlines, contacts, and bid-readiness signals.");
      setLoadingMsg(`Found ${rawContracts.length} opportunities. Analyzing bid fit...`);
      const analyzed = await analyzeContractsWithAI({ profile: formData, opportunities: rawContracts });
      addRunStep("Ranked opportunities and generated bid/no-bid recommendations.");
      addRunStep("Prepared bid pursuit packets for the strongest opportunities.");
      setContracts(analyzed);
      setScreen("contracts");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      console.error(e);
    }
    setLoading(false);
  };

  const handleGrantSearch = async (formData) => {
    setLoading(true);
    setError("");
    setProfile(formData);
    startRun([
      `Goal: find grant opportunities for ${formData.fundingNeed}.`,
      "Searching Grants.gov posted and forecasted opportunities."
    ]);
    try {
      setLoadingMsg("Searching Grants.gov opportunities...");
      const rawGrants = await searchGrants(formData);
      if (rawGrants.length === 0) {
        setError("No posted or forecasted grants found for this profile. Try broader keywords or a different category.");
        setLoading(false);
        return;
      }
      addRunStep(`Found ${rawGrants.length} grant opportunities.`);
      addRunStep("Checking eligibility, award details, deadlines, documents, and application effort.");
      setLoadingMsg(`Found ${rawGrants.length} grants. Analyzing application fit...`);
      const analyzed = await analyzeGrantsWithAI({ profile: formData, grants: rawGrants });
      addRunStep("Ranked grants and generated apply/monitor recommendations.");
      addRunStep("Prepared application packets for the strongest grants.");
      setGrants(analyzed);
      setScreen("grants");
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
      console.error(e);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 16, padding: "2rem" }}>
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
        <p style={{ color: "var(--text2)", fontSize: 15 }}>{loadingMsg}</p>
        <div className="card" style={{ width: "min(560px, 100%)", boxShadow: "none" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Investigation log</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {investigationLog.map((item, index) => (
              <li key={index} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45 }}>
                {index === investigationLog.length - 1 ? "→" : "✓"} {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <>
      <ModeSwitcher mode={mode} onChange={handleModeChange} />
      {screen === "form" && (
        <>
          {mode === "trials" ? (
            <PatientForm onSubmit={handleSearch} onDemo={() => handleDemo("trials")} loading={loading} />
          ) : mode === "contracts" ? (
            <BusinessForm onSubmit={handleContractSearch} onDemo={() => handleDemo("contracts")} loading={loading} />
          ) : (
            <GrantForm onSubmit={handleGrantSearch} onDemo={() => handleDemo("grants")} loading={loading} />
          )}
          {error && (
            <div style={{ maxWidth: 580, margin: "0 auto 2rem", padding: "12px 16px", background: "var(--red-light)", borderRadius: "var(--radius-sm)", color: "var(--red)", fontSize: 14 }}>
              {error}
            </div>
          )}
        </>
      )}
      {screen === "results" && (
        <Results trials={trials} profile={profile} runLog={investigationLog} onReset={() => { setScreen("form"); setTrials([]); }} />
      )}
      {screen === "contracts" && (
        <ContractResults contracts={contracts} profile={profile} runLog={investigationLog} onReset={() => { setScreen("form"); setContracts([]); }} />
      )}
      {screen === "grants" && (
        <GrantResults grants={grants} profile={profile} runLog={investigationLog} onReset={() => { setScreen("form"); setGrants([]); }} />
      )}
    </>
  );
}
