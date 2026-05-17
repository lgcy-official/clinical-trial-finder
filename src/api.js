const CT_API = "https://clinicaltrials.gov/api/v2/studies";

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}.`);
  }

  return data;
}

export async function searchTrials({ condition, location }) {
  const params = new URLSearchParams({
    "query.cond": condition,
    "query.locn": location || "",
    "filter.overallStatus": "RECRUITING",
    "pageSize": "10",
    "format": "json"
  });
  const res = await fetch(`${CT_API}?${params}`);
  if (!res.ok) {
    throw new Error(`ClinicalTrials.gov request failed with status ${res.status}.`);
  }
  const data = await res.json();
  return data.studies || [];
}

export async function analyzeTrialsWithAI({ profile, trials }) {
  const data = await postJson("/api/analyze-trials", { profile, trials });
  return data.trials || [];
}

export async function searchContracts(profile) {
  const data = await postJson("/api/search-contracts", { profile });
  return data.opportunities || [];
}

export async function analyzeContractsWithAI({ profile, opportunities }) {
  const data = await postJson("/api/analyze-contracts", { profile, opportunities });
  return data.contracts || [];
}

export async function searchGrants(profile) {
  const data = await postJson("/api/search-grants", { profile });
  return data.grants || [];
}

export async function analyzeGrantsWithAI({ profile, grants }) {
  const data = await postJson("/api/analyze-grants", { profile, grants });
  return data.grants || [];
}

export async function askAI({ question, profile, trials, contracts, grants, domain }) {
  const data = await postJson("/api/ask-ai", { question, profile, trials, contracts, grants, domain });
  return data.answer || "I couldn't process that question.";
}
