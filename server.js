import dotenv from "dotenv";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 5173);
const isProduction = process.env.NODE_ENV === "production";
const anthropicApi = "https://api.anthropic.com/v1/messages";
const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";
const anthropicVersion = process.env.ANTHROPIC_VERSION || "2023-06-01";
const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const googleModel = process.env.GOOGLE_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
const aiProvider = process.env.AI_PROVIDER
  || (process.env.ANTHROPIC_API_KEY ? "anthropic" : googleApiKey ? "google" : "anthropic");
const samApi = "https://api.sam.gov/opportunities/v2/search";
const samApiKey = process.env.SAM_API_KEY;
const grantsSearchApi = "https://api.grants.gov/v1/api/search2";
const grantsFetchApi = "https://api.grants.gov/v1/api/fetchOpportunity";

app.use(express.json({ limit: "8mb" }));

const trialAnalysisSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      nctId: { type: "STRING" },
      title: { type: "STRING" },
      matchScore: { type: "NUMBER" },
      agentDecision: { type: "STRING" },
      decisionReason: { type: "STRING" },
      matchReason: { type: "STRING" },
      phase: { type: "STRING" },
      status: { type: "STRING" },
      keyEligibility: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      patientInsight: { type: "STRING" },
      estimatedParticipants: { type: "STRING" },
      location: { type: "STRING" },
      costInfo: { type: "STRING" },
      insuranceGuidance: { type: "STRING" },
      reimbursementInfo: { type: "STRING" },
      practicalFit: { type: "STRING" },
      nextSteps: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      questionsToAsk: {
        type: "ARRAY",
        items: { type: "STRING" }
      }
    },
    required: [
      "nctId",
      "title",
      "matchScore",
      "agentDecision",
      "decisionReason",
      "matchReason",
      "phase",
      "status",
      "keyEligibility",
      "patientInsight",
      "estimatedParticipants",
      "location",
      "costInfo",
      "insuranceGuidance",
      "reimbursementInfo",
      "practicalFit",
      "nextSteps",
      "questionsToAsk"
    ]
  }
};

const contractAnalysisSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      noticeId: { type: "STRING" },
      title: { type: "STRING" },
      matchScore: { type: "NUMBER" },
      agentDecision: { type: "STRING" },
      decisionReason: { type: "STRING" },
      agency: { type: "STRING" },
      noticeType: { type: "STRING" },
      setAside: { type: "STRING" },
      naicsCode: { type: "STRING" },
      pscCode: { type: "STRING" },
      postedDate: { type: "STRING" },
      responseDeadline: { type: "STRING" },
      placeOfPerformance: { type: "STRING" },
      estimatedValue: { type: "STRING" },
      fitReason: { type: "STRING" },
      bidReadiness: { type: "STRING" },
      requirements: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      winThemes: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      risks: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      nextSteps: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      questionsToAsk: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      contact: { type: "STRING" },
      link: { type: "STRING" }
    },
    required: [
      "noticeId",
      "title",
      "matchScore",
      "agentDecision",
      "decisionReason",
      "agency",
      "noticeType",
      "setAside",
      "naicsCode",
      "pscCode",
      "postedDate",
      "responseDeadline",
      "placeOfPerformance",
      "estimatedValue",
      "fitReason",
      "bidReadiness",
      "requirements",
      "winThemes",
      "risks",
      "nextSteps",
      "questionsToAsk",
      "contact",
      "link"
    ]
  }
};

const grantAnalysisSchema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      opportunityId: { type: "STRING" },
      opportunityNumber: { type: "STRING" },
      title: { type: "STRING" },
      matchScore: { type: "NUMBER" },
      agentDecision: { type: "STRING" },
      decisionReason: { type: "STRING" },
      agency: { type: "STRING" },
      status: { type: "STRING" },
      category: { type: "STRING" },
      fundingInstrument: { type: "STRING" },
      eligibility: { type: "STRING" },
      awardCeiling: { type: "STRING" },
      awardFloor: { type: "STRING" },
      costSharing: { type: "STRING" },
      postedDate: { type: "STRING" },
      closeDate: { type: "STRING" },
      fitReason: { type: "STRING" },
      eligibilityReadiness: { type: "STRING" },
      requirements: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      applicationSteps: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      documentsNeeded: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      risks: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      questionsToAsk: {
        type: "ARRAY",
        items: { type: "STRING" }
      },
      contact: { type: "STRING" },
      link: { type: "STRING" }
    },
    required: [
      "opportunityId",
      "opportunityNumber",
      "title",
      "matchScore",
      "agentDecision",
      "decisionReason",
      "agency",
      "status",
      "category",
      "fundingInstrument",
      "eligibility",
      "awardCeiling",
      "awardFloor",
      "costSharing",
      "postedDate",
      "closeDate",
      "fitReason",
      "eligibilityReadiness",
      "requirements",
      "applicationSteps",
      "documentsNeeded",
      "risks",
      "questionsToAsk",
      "contact",
      "link"
    ]
  }
};

function formatLocation(location) {
  return [
    location?.city,
    location?.state,
    location?.country
  ].filter(Boolean).join(", ");
}

function formatContact(contact) {
  const label = [contact?.name, contact?.role].filter(Boolean).join(" · ") || "Study contact";
  const details = [contact?.phone, contact?.email].filter(Boolean);
  return [label, ...details].join(" · ");
}

function compactSites(locations) {
  return locations.map((location) => ({
    facility: location?.facility || "Study site",
    status: location?.status || "Status not listed",
    city: location?.city || "",
    state: location?.state || "",
    country: location?.country || "",
    display: [
      location?.facility,
      formatLocation(location),
      location?.status
    ].filter(Boolean).join(" · "),
    contacts: (location?.contacts || []).map(formatContact).filter(Boolean)
  })).filter((site) => site.display).slice(0, 5);
}

function getTrialFacts(study) {
  const protocol = study?.protocolSection;
  const identification = protocol?.identificationModule;
  const eligibility = protocol?.eligibilityModule;
  const description = protocol?.descriptionModule;
  const status = protocol?.statusModule;
  const design = protocol?.designModule;
  const conditions = protocol?.conditionsModule;
  const contactsLocations = protocol?.contactsLocationsModule;
  const locations = contactsLocations?.locations || [];
  const centralContacts = contactsLocations?.centralContacts || [];
  const siteContacts = locations.flatMap((location) => location?.contacts || []);
  const contacts = [...centralContacts, ...siteContacts].map(formatContact).filter(Boolean);
  const sites = compactSites(locations);

  return {
    nctId: identification?.nctId || "",
    title: identification?.briefTitle || "Untitled clinical trial",
    status: status?.overallStatus || "Status not listed",
    phase: design?.phases?.join(", ") || "Phase not listed",
    enrollment: design?.enrollmentInfo?.count,
    summary: description?.briefSummary || "",
    eligibility: eligibility?.eligibilityCriteria || "",
    conditions: conditions?.conditions || [],
    location: sites.map((site) => formatLocation(site)).filter(Boolean).slice(0, 3).join("; ")
      || locations.map(formatLocation).filter(Boolean).slice(0, 3).join("; ")
      || "Location not listed",
    sites,
    contacts: contacts.slice(0, 5),
    primaryContact: contacts[0] || "Use the ClinicalTrials.gov listing to contact the study team."
  };
}

function trialSummary(study, index) {
  const facts = getTrialFacts(study);

  return `
TRIAL ${index + 1}:
Title: ${facts.title}
NCT ID: ${facts.nctId || "N/A"}
Status: ${facts.status}
Phase: ${facts.phase}
Enrollment: ${facts.enrollment || "N/A"} participants
Conditions: ${facts.conditions.join(", ") || "N/A"}
Location: ${facts.location}
Listed contact: ${facts.primaryContact}
Summary: ${facts.summary.slice(0, 300) || "N/A"}
Eligibility: ${facts.eligibility.slice(0, 450) || "N/A"}
`.trim();
}

function buildTrialAnalysisPrompt({ profile, trials }) {
  const trialsText = trials.map(trialSummary).join("\n\n---\n\n");

  return `You are a medical research assistant helping patients find and understand clinical trials.

PATIENT PROFILE:
- Condition: ${profile.condition}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Location: ${profile.location}
- Medical history: ${profile.history || "Not provided"}
- Current medications: ${profile.medications || "Not provided"}

CLINICAL TRIALS TO ANALYZE:
${trialsText}

For each trial, provide a JSON array of objects with these fields:
- nctId: string
- title: string
- matchScore: number (0-100, how well this patient likely matches)
- agentDecision: string (Contact to screen, Verify first, Monitor, or Skip)
- decisionReason: string (1 sentence explaining the recommendation)
- matchReason: string (1-2 sentences why they may qualify or not)
- phase: string
- status: string
- keyEligibility: array of 3 bullet strings (plain language key criteria)
- patientInsight: string (what this trial means for someone with this condition - 2 sentences)
- estimatedParticipants: string
- location: string
- costInfo: string (what the trial record says or does not say about patient costs; do not guess exact prices)
- insuranceGuidance: string (plain-language insurance guidance; tell the patient what to verify with insurer and study team)
- reimbursementInfo: string (travel, parking, lodging, stipend, or reimbursement guidance; say if not listed)
- practicalFit: string (1 sentence on travel/time/logistics fit based on location and profile)
- nextSteps: array of 3 concrete steps to start screening or enrollment
- questionsToAsk: array of 4 questions the patient should ask the coordinator, including cost and insurance

Return ONLY valid JSON array, no markdown, no explanation. Keep every string to one sentence and do not include line breaks inside string values.`;
}

function buildQuestionPrompt({ question, profile, trials }) {
  const context = trials.length > 0
    ? `Current trials being reviewed: ${trials.map((trial) => trial.title).join("; ")}`
    : "No trials loaded yet.";

  return `You are a compassionate medical assistant helping a patient understand clinical trials.
Patient profile: condition=${profile?.condition}, age=${profile?.age}.
${context}
Question: ${question}
Give a clear, honest answer in 2-4 sentences. Never give specific medical, insurance, or financial advice; tell the patient what to confirm with the study team, insurer, and healthcare provider.`;
}

function buildContractAnalysisPrompt({ profile, opportunities }) {
  const opportunitiesText = opportunities.map((opportunity, index) => {
    const facts = getContractFacts(opportunity);
    return `
OPPORTUNITY ${index + 1}:
Title: ${facts.title}
Notice ID: ${facts.noticeId || "N/A"}
Agency: ${facts.agency}
Type: ${facts.noticeType}
Set-aside: ${facts.setAside}
NAICS: ${facts.naicsCode || "N/A"}
PSC: ${facts.pscCode || "N/A"}
Posted: ${facts.postedDate || "N/A"}
Response deadline: ${facts.responseDeadline || "N/A"}
Place of performance: ${facts.placeOfPerformance}
Contact: ${facts.contact}
Attachments: ${facts.attachments.length}
`.trim();
  }).join("\n\n---\n\n");

  return `You are a government contracting analyst helping a business decide which public opportunities are worth pursuing.

BUSINESS PROFILE:
- Industry: ${profile.industry}
- Keywords/capabilities: ${profile.keywords || "Not provided"}
- NAICS codes: ${profile.naicsCodes || "Not provided"}
- Company size: ${profile.companySize || "Not provided"}
- Certifications: ${profile.certifications?.join(", ") || "None listed"}
- Location: ${profile.location || "Not provided"}
- Past performance: ${profile.pastPerformance || "Not provided"}
- Notes: ${profile.notes || "Not provided"}

SAM.GOV OPPORTUNITIES TO ANALYZE:
${opportunitiesText}

For each opportunity, provide a JSON array of objects with these fields:
- noticeId: string
- title: string
- matchScore: number (0-100, how likely this business should pursue it)
- agentDecision: string (Bid, Review first, Monitor, or No-bid)
- decisionReason: string (1 sentence explaining the recommendation)
- agency: string
- noticeType: string
- setAside: string
- naicsCode: string
- pscCode: string
- postedDate: string
- responseDeadline: string
- placeOfPerformance: string
- estimatedValue: string
- fitReason: string (1 sentence)
- bidReadiness: string (plain-English view of whether they can realistically bid)
- requirements: array of 3 likely requirements or eligibility checks
- winThemes: array of 3 things the business should emphasize
- risks: array of 3 red flags or unknowns
- nextSteps: array of 3 concrete next steps to pursue the opportunity
- questionsToAsk: array of 4 questions to ask the contracting office
- contact: string
- link: string

Return ONLY valid JSON array, no markdown, no explanation. Keep every string to one sentence and do not include line breaks inside string values.`;
}

function buildContractQuestionPrompt({ question, profile, contracts }) {
  const context = contracts.length > 0
    ? `Current opportunities being reviewed: ${contracts.map((contract) => `${contract.title} (${contract.agency})`).join("; ")}`
    : "No opportunities loaded yet.";

  return `You are a practical government contracting advisor.
Business profile: industry=${profile?.industry}, NAICS=${profile?.naicsCodes}, certifications=${profile?.certifications?.join(", ") || "none listed"}.
${context}
Question: ${question}
Give a direct answer in 2-4 sentences. Do not give legal advice; tell the user what to verify in the solicitation, with the contracting officer, or with a qualified advisor.`;
}

function buildGrantAnalysisPrompt({ profile, grants }) {
  const grantsText = grants.map((grant, index) => {
    const facts = getGrantFacts(grant);
    return `
GRANT ${index + 1}:
Title: ${facts.title}
Opportunity ID: ${facts.opportunityId || "N/A"}
Opportunity number: ${facts.opportunityNumber || "N/A"}
Agency: ${facts.agency}
Status: ${facts.status}
Funding instrument: ${facts.fundingInstrument}
Category: ${facts.category}
Eligibility: ${facts.eligibility}
Award ceiling: ${facts.awardCeiling}
Award floor: ${facts.awardFloor}
Cost sharing: ${facts.costSharing}
Posted: ${facts.postedDate}
Close date: ${facts.closeDate}
Contact: ${facts.contact}
Description: ${facts.description.slice(0, 500) || "N/A"}
`.trim();
  }).join("\n\n---\n\n");

  return `You are a grant strategy analyst helping an applicant decide which public grant opportunities are worth pursuing.

APPLICANT PROFILE:
- Applicant type: ${profile.applicantType}
- Mission/organization: ${profile.organization || "Not provided"}
- Funding need: ${profile.fundingNeed}
- Keywords/focus: ${profile.keywords || "Not provided"}
- Location: ${profile.location || "Not provided"}
- Experience: ${profile.experience || "Not provided"}
- Notes: ${profile.notes || "Not provided"}

GRANTS.GOV OPPORTUNITIES TO ANALYZE:
${grantsText}

For each grant, provide a JSON array of objects with these fields:
- opportunityId: string
- opportunityNumber: string
- title: string
- matchScore: number (0-100, how likely this applicant should pursue it)
- agentDecision: string (Apply, Verify eligibility, Monitor, or Skip)
- decisionReason: string (1 sentence explaining the recommendation)
- agency: string
- status: string
- category: string
- fundingInstrument: string
- eligibility: string
- awardCeiling: string
- awardFloor: string
- costSharing: string
- postedDate: string
- closeDate: string
- fitReason: string (1 sentence)
- eligibilityReadiness: string (plain-English view of whether they can realistically apply)
- requirements: array of 3 likely eligibility or compliance requirements
- applicationSteps: array of 3 concrete steps to pursue the grant
- documentsNeeded: array of 4 documents or assets they likely need
- risks: array of 3 red flags or unknowns
- questionsToAsk: array of 4 questions to ask the grant contact or internal team
- contact: string
- link: string

Return ONLY valid JSON array, no markdown, no explanation. Keep every string to one sentence and do not include line breaks inside string values.`;
}

function buildGrantQuestionPrompt({ question, profile, grants }) {
  const context = grants.length > 0
    ? `Current grant opportunities being reviewed: ${grants.map((grant) => `${grant.title} (${grant.agency})`).join("; ")}`
    : "No grant opportunities loaded yet.";

  return `You are a practical grants advisor.
Applicant profile: type=${profile?.applicantType}, funding need=${profile?.fundingNeed}, focus=${profile?.keywords}.
${context}
Question: ${question}
Give a direct answer in 2-4 sentences. Do not give legal or financial advice; tell the user what to verify in the notice of funding opportunity, Grants.gov Workspace, and with the agency contact.`;
}

async function callAnthropic({ prompt, maxTokens }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    const error = new Error("Missing ANTHROPIC_API_KEY. Add it to a local .env file and restart the dev server.");
    error.status = 500;
    throw error;
  }

  const response = await fetch(anthropicApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": anthropicVersion,
      "x-api-key": process.env.ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      model: anthropicModel,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || `Anthropic request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data.content
    ?.filter((block) => typeof block.text === "string")
    .map((block) => block.text)
    .join("\n")
    .trim() || "";
}

async function callGoogle({ prompt, maxTokens, responseMimeType, responseSchema }) {
  if (!googleApiKey) {
    const error = new Error("Missing GOOGLE_API_KEY. Add it to a local .env file and restart the dev server.");
    error.status = 500;
    throw error;
  }

  const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent`);
  url.searchParams.set("key", googleApiKey);

  const generationConfig = {
    maxOutputTokens: maxTokens,
    temperature: 0.2
  };

  if (responseMimeType) {
    generationConfig.responseMimeType = responseMimeType;
  }

  if (responseSchema) {
    generationConfig.responseSchema = responseSchema;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || `Google AI request failed with status ${response.status}.`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data.candidates?.[0]?.content?.parts
    ?.filter((part) => typeof part.text === "string")
    .map((part) => part.text)
    .join("\n")
    .trim() || "";
}

async function callAI({ prompt, maxTokens, responseMimeType, responseSchema }) {
  if (aiProvider === "google" || aiProvider === "gemini") {
    return callGoogle({ prompt, maxTokens, responseMimeType, responseSchema });
  }

  if (aiProvider === "anthropic") {
    return callAnthropic({ prompt, maxTokens });
  }

  const error = new Error(`Unsupported AI_PROVIDER "${aiProvider}". Use "anthropic" or "google".`);
  error.status = 500;
  throw error;
}

function parseJsonArray(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  const jsonText = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;

  try {
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) {
      const error = new Error("AI returned JSON, but it was not an array.");
      error.status = 502;
      throw error;
    }
    return parsed;
  } catch (error) {
    if (error.status) {
      throw error;
    }

    const parseError = new Error("AI returned invalid trial-analysis JSON. Please try the search again.");
    parseError.status = 502;
    parseError.cause = error;
    throw parseError;
  }
}

function firstSentences(text, count = 1) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, count)
    .join(" ");
}

function eligibilityBullets(criteria) {
  const lines = criteria
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•\s]+/, "").trim())
    .filter((line) => line.length > 18 && !/^inclusion criteria:?$/i.test(line) && !/^exclusion criteria:?$/i.test(line));

  return [
    ...lines.slice(0, 3),
    "Review the full eligibility criteria with the study team.",
    "Ask your healthcare provider whether this trial fits your situation.",
    "Confirm location, timing, and medical requirements before enrolling."
  ].slice(0, 3);
}

function cleanString(value, fallback) {
  return typeof value === "string" && value.trim() ? value.replace(/\s+/g, " ").trim() : fallback;
}

function cleanScore(value, fallback = 50) {
  const score = Number(value);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : fallback;
}

function trialDecision(score) {
  if (score >= 70) return "Contact to screen";
  if (score >= 40) return "Verify first";
  return "Skip";
}

function contractDecision(score, facts) {
  if (score >= 70) return "Bid";
  if (score >= 40) return facts.noticeType.toLowerCase().includes("sources sought") ? "Monitor" : "Review first";
  return "No-bid";
}

function grantDecision(score) {
  if (score >= 70) return "Apply";
  if (score >= 40) return "Verify eligibility";
  return "Monitor";
}

function cleanList(value, fallback, limit) {
  const items = Array.isArray(value)
    ? value.map((item) => cleanString(item, "")).filter(Boolean)
    : fallback;
  return items.slice(0, limit);
}

function defaultNextSteps(facts) {
  return [
    facts.primaryContact.includes("ClinicalTrials.gov")
      ? "Open the ClinicalTrials.gov listing and use the study contact information there."
      : `Contact the study team: ${facts.primaryContact}.`,
    "Ask for a phone screening to confirm the main inclusion and exclusion criteria.",
    "Before scheduling a visit, ask what costs, routine-care charges, travel, and reimbursement policies apply."
  ];
}

function defaultQuestionsToAsk() {
  return [
    "Which study visits, tests, or medications are paid by the sponsor?",
    "Which routine-care costs could be billed to my insurance?",
    "Do you offer travel, parking, lodging, childcare, or stipend reimbursement?",
    "What are the screening steps, visit schedule, and nearest active site?"
  ];
}

function fallbackTrialAnalysis(study, profile) {
  const facts = getTrialFacts(study);
  const condition = profile?.condition?.toLowerCase() || "";
  const searchableText = [facts.title, facts.summary, facts.conditions.join(" ")].join(" ").toLowerCase();
  const conditionMatches = condition && searchableText.includes(condition);
  const score = conditionMatches ? 65 : 45;
  const decision = trialDecision(score);

  return {
    nctId: facts.nctId,
    title: facts.title,
    matchScore: score,
    agentDecision: decision,
    decisionReason: decision === "Contact to screen"
      ? "The profile appears aligned enough to ask the study team for screening."
      : decision === "Verify first"
        ? "The trial may fit, but eligibility, travel burden, costs, or medical details need confirmation."
        : "The visible trial details suggest this is not a strong fit for the current profile.",
    matchReason: conditionMatches
      ? "This recruiting trial appears related to the condition you searched for, but eligibility still needs study-team review."
      : "This recruiting trial was returned by the search, but the available summary does not clearly confirm a strong match.",
    phase: facts.phase,
    status: facts.status,
    keyEligibility: eligibilityBullets(facts.eligibility),
    patientInsight: facts.summary
      ? firstSentences(facts.summary, 2)
      : "This trial may be relevant, but the brief summary is limited. Review the full listing with your healthcare provider.",
    estimatedParticipants: facts.enrollment ? String(facts.enrollment) : "Not listed",
    location: facts.location,
    costInfo: "The trial record does not list an exact patient price, so ask the coordinator which study-related costs are covered.",
    insuranceGuidance: "Ask your insurer whether routine care during the trial is covered and ask the study team what may be billed to insurance.",
    reimbursementInfo: "Travel, lodging, parking, and stipend details are not confirmed in this record; ask the coordinator before screening.",
    practicalFit: facts.location === "Location not listed"
      ? "The location is not listed, so confirm whether remote screening or a nearby site is available."
      : `The listed site information starts with ${facts.location}, so confirm visit frequency and travel requirements.`,
    nextSteps: defaultNextSteps(facts),
    questionsToAsk: defaultQuestionsToAsk(),
    sites: facts.sites,
    primaryContact: facts.primaryContact
  };
}

function normalizeTrialAnalysis(item, study, profile) {
  const fallback = fallbackTrialAnalysis(study, profile);
  const keyEligibility = Array.isArray(item?.keyEligibility)
    ? item.keyEligibility.map((value) => cleanString(value, "")).filter(Boolean).slice(0, 3)
    : fallback.keyEligibility;

  return {
    nctId: cleanString(item?.nctId, fallback.nctId),
    title: cleanString(item?.title, fallback.title),
    matchScore: cleanScore(item?.matchScore, fallback.matchScore),
    agentDecision: cleanString(item?.agentDecision, fallback.agentDecision),
    decisionReason: cleanString(item?.decisionReason, fallback.decisionReason),
    matchReason: cleanString(item?.matchReason, fallback.matchReason),
    phase: cleanString(item?.phase, fallback.phase),
    status: cleanString(item?.status, fallback.status),
    keyEligibility: keyEligibility.length ? keyEligibility : fallback.keyEligibility,
    patientInsight: cleanString(item?.patientInsight, fallback.patientInsight),
    estimatedParticipants: cleanString(item?.estimatedParticipants, fallback.estimatedParticipants),
    location: cleanString(item?.location, fallback.location),
    costInfo: cleanString(item?.costInfo, fallback.costInfo),
    insuranceGuidance: cleanString(item?.insuranceGuidance, fallback.insuranceGuidance),
    reimbursementInfo: cleanString(item?.reimbursementInfo, fallback.reimbursementInfo),
    practicalFit: cleanString(item?.practicalFit, fallback.practicalFit),
    nextSteps: cleanList(item?.nextSteps, fallback.nextSteps, 3),
    questionsToAsk: cleanList(item?.questionsToAsk, fallback.questionsToAsk, 4),
    sites: fallback.sites,
    primaryContact: fallback.primaryContact
  };
}

function formatSamDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}/${date.getFullYear()}`;
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function formatSamContact(contact) {
  const name = contact?.fullName || contact?.fullname || contact?.name;
  const label = [name, contact?.title].filter(Boolean).join(" · ") || "Contracting office";
  const details = [contact?.email, contact?.phone].filter(Boolean);
  return [label, ...details].join(" · ");
}

function formatPlaceOfPerformance(place) {
  if (!place) {
    return "Place of performance not listed";
  }

  return [
    place.city?.name || place.city,
    place.state?.code || place.state?.name || place.state,
    place.country?.name || place.country?.code || place.country,
    place.zip
  ].filter(Boolean).join(", ") || "Place of performance not listed";
}

function cleanSamLink(value, noticeId) {
  if (typeof value === "string" && value.trim() && value.trim() !== "null") {
    return value.trim();
  }
  return noticeId ? `https://sam.gov/opp/${noticeId}/view` : "https://sam.gov/content/opportunities";
}

function getContractFacts(opportunity) {
  const contacts = Array.isArray(opportunity?.pointOfContact)
    ? opportunity.pointOfContact.map(formatSamContact).filter(Boolean)
    : [];
  const noticeId = opportunity?.noticeId || "";
  const agency = opportunity?.fullParentPathName
    || [opportunity?.department, opportunity?.subTier, opportunity?.office].filter(Boolean).join(" · ")
    || "Agency not listed";

  return {
    noticeId,
    title: opportunity?.title || "Untitled opportunity",
    solicitationNumber: opportunity?.solicitationNumber || "",
    agency,
    office: opportunity?.office || "",
    noticeType: opportunity?.type || opportunity?.baseType || "Notice type not listed",
    setAside: opportunity?.typeOfSetAsideDescription || opportunity?.setAside || "No set-aside listed",
    setAsideCode: opportunity?.typeOfSetAside || opportunity?.setAsideCode || "",
    naicsCode: opportunity?.naicsCode || "",
    pscCode: opportunity?.classificationCode || "",
    postedDate: opportunity?.postedDate || "",
    responseDeadline: opportunity?.responseDeadLine || opportunity?.responseDeadline || "",
    placeOfPerformance: formatPlaceOfPerformance(opportunity?.placeOfPerformance),
    estimatedValue: opportunity?.award?.amount ? `$${opportunity.award.amount}` : "Not listed",
    contact: contacts[0] || "Contact not listed",
    contacts,
    link: cleanSamLink(opportunity?.uiLink, noticeId),
    attachments: Array.isArray(opportunity?.resourceLinks) ? opportunity.resourceLinks : [],
    description: opportunity?.description || "",
    additionalInfoLink: opportunity?.additionalInfoLink || ""
  };
}

function setAsideMatchesCert(setAside, certifications = []) {
  const value = setAside.toLowerCase();
  return certifications.some((certification) => {
    const cert = certification.toLowerCase();
    return (
      (cert.includes("8(a)") && value.includes("8(a)"))
      || (cert.includes("hubzone") && value.includes("hubzone"))
      || (cert.includes("veteran") && value.includes("veteran"))
      || (cert.includes("woman") && value.includes("women"))
      || (cert.includes("small") && value.includes("small business"))
    );
  });
}

function fallbackContractAnalysis(opportunity, profile) {
  const facts = getContractFacts(opportunity);
  const naicsCodes = String(profile?.naicsCodes || "").split(/[,\s]+/).filter(Boolean);
  const keywords = String(`${profile?.industry || ""} ${profile?.keywords || ""}`).toLowerCase().split(/[,\s]+/).filter((word) => word.length > 2);
  const searchableText = [facts.title, facts.agency, facts.noticeType, facts.naicsCode, facts.pscCode].join(" ").toLowerCase();
  let score = 45;

  if (facts.naicsCode && naicsCodes.includes(facts.naicsCode)) {
    score += 25;
  }

  if (keywords.some((keyword) => searchableText.includes(keyword))) {
    score += 15;
  }

  if (setAsideMatchesCert(facts.setAside, profile?.certifications || [])) {
    score += 15;
  }
  const normalizedScore = cleanScore(score);
  const decision = contractDecision(normalizedScore, facts);

  return {
    noticeId: facts.noticeId,
    title: facts.title,
    matchScore: normalizedScore,
    agentDecision: decision,
    decisionReason: decision === "Bid"
      ? "The opportunity appears relevant enough to justify a bid/no-bid review immediately."
      : decision === "Review first"
        ? "There is possible fit, but the solicitation details and eligibility need review before committing proposal effort."
        : decision === "Monitor"
          ? "This is useful market intelligence or an early-stage opportunity rather than a final bid decision."
          : "The current profile does not appear to justify proposal effort for this opportunity.",
    agency: facts.agency,
    noticeType: facts.noticeType,
    setAside: facts.setAside,
    naicsCode: facts.naicsCode || "Not listed",
    pscCode: facts.pscCode || "Not listed",
    postedDate: facts.postedDate || "Not listed",
    responseDeadline: facts.responseDeadline || "Not listed",
    placeOfPerformance: facts.placeOfPerformance,
    estimatedValue: facts.estimatedValue,
    fitReason: "This opportunity matched the search filters, but the solicitation details should be reviewed before deciding to bid.",
    bidReadiness: "Check NAICS fit, set-aside eligibility, past performance, required registrations, and the response deadline before investing proposal time.",
    requirements: [
      "Confirm your SAM registration, UEI, representations, and certifications are current.",
      "Review the solicitation package for technical requirements, submission format, and deadlines.",
      "Confirm your NAICS, size standard, and set-aside eligibility before bidding."
    ],
    winThemes: [
      "Emphasize directly relevant past performance.",
      "Show a low-risk delivery plan with named roles and timeline.",
      "Make compliance with every solicitation instruction easy to verify."
    ],
    risks: [
      "The opportunity may require attachments or a statement of work not summarized in the public listing.",
      "Set-aside or size-standard eligibility may exclude some businesses.",
      "A short deadline can make a compliant proposal difficult."
    ],
    nextSteps: [
      "Open the SAM.gov listing and download all attachments.",
      "Create a bid/no-bid checklist covering eligibility, scope, deadline, and required past performance.",
      "Email the contracting contact with any clarification questions before the Q&A deadline."
    ],
    questionsToAsk: [
      "Is there an incumbent or prior contract number for this requirement?",
      "What are the most important evaluation factors?",
      "Are teaming partners or subcontractors allowed?",
      "When is the Q&A deadline and how should questions be submitted?"
    ],
    contact: facts.contact,
    link: facts.link,
    attachments: facts.attachments
  };
}

function normalizeContractAnalysis(item, opportunity, profile) {
  const fallback = fallbackContractAnalysis(opportunity, profile);

  return {
    noticeId: cleanString(item?.noticeId, fallback.noticeId),
    title: cleanString(item?.title, fallback.title),
    matchScore: cleanScore(item?.matchScore, fallback.matchScore),
    agentDecision: cleanString(item?.agentDecision, fallback.agentDecision),
    decisionReason: cleanString(item?.decisionReason, fallback.decisionReason),
    agency: cleanString(item?.agency, fallback.agency),
    noticeType: cleanString(item?.noticeType, fallback.noticeType),
    setAside: cleanString(item?.setAside, fallback.setAside),
    naicsCode: cleanString(item?.naicsCode, fallback.naicsCode),
    pscCode: cleanString(item?.pscCode, fallback.pscCode),
    postedDate: cleanString(item?.postedDate, fallback.postedDate),
    responseDeadline: cleanString(item?.responseDeadline, fallback.responseDeadline),
    placeOfPerformance: cleanString(item?.placeOfPerformance, fallback.placeOfPerformance),
    estimatedValue: cleanString(item?.estimatedValue, fallback.estimatedValue),
    fitReason: cleanString(item?.fitReason, fallback.fitReason),
    bidReadiness: cleanString(item?.bidReadiness, fallback.bidReadiness),
    requirements: cleanList(item?.requirements, fallback.requirements, 3),
    winThemes: cleanList(item?.winThemes, fallback.winThemes, 3),
    risks: cleanList(item?.risks, fallback.risks, 3),
    nextSteps: cleanList(item?.nextSteps, fallback.nextSteps, 3),
    questionsToAsk: cleanList(item?.questionsToAsk, fallback.questionsToAsk, 4),
    contact: cleanString(item?.contact, fallback.contact),
    link: cleanString(item?.link, fallback.link),
    attachments: fallback.attachments
  };
}

function uniqueValues(values) {
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
}

function splitSearchTerms(value) {
  return uniqueValues(String(value || "")
    .split(/[,;/|]+/)
    .map((term) => term.replace(/\s+/g, " ").trim())
    .filter((term) => term.length >= 3));
}

function buildSamSearchPlans(profile) {
  const naicsCodes = uniqueValues(String(profile.naicsCodes || "").split(/[,\s]+/));
  const keywordTerms = splitSearchTerms(profile.keywords);
  const industryTerms = splitSearchTerms(profile.industry);
  const titleTerms = uniqueValues([
    ...keywordTerms,
    ...industryTerms,
    String(profile.industry || "").trim()
  ]);
  const primaryTitle = titleTerms[0] || "";
  const primaryNaics = naicsCodes[0] || "";
  const state = String(profile.state || "").trim();

  return [
    { title: primaryTitle, ncode: primaryNaics, state, days: 180 },
    { title: primaryTitle, ncode: primaryNaics, days: 365 },
    { ncode: primaryNaics, days: 365 },
    { title: primaryTitle, days: 365 },
    ...titleTerms.slice(1, 4).map((title) => ({ title, days: 365 })),
    { title: String(profile.industry || "").split(/\s+/).find((word) => word.length > 4) || primaryTitle, days: 365 }
  ].filter((plan) => plan.title || plan.ncode);
}

function buildSamSearchParams(plan) {
  const postedTo = new Date();
  const postedFrom = dateDaysAgo(plan.days || 365);
  const params = new URLSearchParams({
    api_key: samApiKey,
    postedFrom: formatSamDate(postedFrom),
    postedTo: formatSamDate(postedTo),
    limit: "20",
    offset: "0",
    status: "active"
  });

  if (plan.title) params.set("title", plan.title);
  if (plan.ncode) params.set("ncode", plan.ncode);
  if (plan.state) params.set("state", plan.state);

  ["o", "k", "p", "r"].forEach((type) => params.append("ptype", type));
  return params;
}

async function searchSamOpportunities(profile) {
  if (!samApiKey) {
    const error = new Error("Missing SAM_API_KEY. Add a SAM.gov public API key to .env and restart the dev server.");
    error.status = 500;
    throw error;
  }

  const plans = buildSamSearchPlans(profile);
  const seen = new Set();
  const opportunities = [];

  for (const plan of plans) {
    const response = await fetch(`${samApi}?${buildSamSearchParams(plan)}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data?.error?.message || data?.message || `SAM.gov request failed with status ${response.status}.`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    for (const opportunity of data.opportunitiesData || []) {
      const key = opportunity?.noticeId || opportunity?.solicitationNumber || opportunity?.title;
      if (key && !seen.has(key)) {
        seen.add(key);
        opportunities.push(opportunity);
      }
    }

    if (opportunities.length >= 10) {
      break;
    }
  }

  return opportunities.slice(0, 10);
}

function formatGrantList(values) {
  return Array.isArray(values)
    ? values.map((value) => value?.description || value?.programTitle || value?.title || value).filter(Boolean).join("; ")
    : "";
}

function formatGrantContact(synopsis) {
  const name = synopsis?.agencyContactName;
  const email = synopsis?.agencyContactEmail;
  const phone = synopsis?.agencyContactPhone || synopsis?.agencyPhone;
  const description = synopsis?.agencyContactDesc;
  return [name, email, phone, description].filter(Boolean).join(" · ") || "Agency contact not listed";
}

function getGrantFacts(grant) {
  const detail = grant?.detail || grant?.data || grant || {};
  const hit = grant?.searchHit || grant || {};
  const synopsis = detail?.synopsis || detail?.forecast || {};
  const opportunityId = String(detail?.id || hit?.id || "");
  const fundingInstrument = formatGrantList(synopsis?.fundingInstruments) || "Funding instrument not listed";
  const eligibility = formatGrantList(synopsis?.applicantTypes) || "Eligibility not listed";
  const category = detail?.opportunityCategory?.description
    || formatGrantList(synopsis?.fundingActivityCategories)
    || "Category not listed";

  return {
    opportunityId,
    opportunityNumber: detail?.opportunityNumber || hit?.number || "",
    title: detail?.opportunityTitle || hit?.title || "Untitled grant opportunity",
    agency: synopsis?.agencyName || hit?.agencyName || detail?.agencyDetails?.agencyName || "Agency not listed",
    status: hit?.oppStatus || detail?.docType || "Status not listed",
    category,
    fundingInstrument,
    eligibility,
    awardCeiling: synopsis?.awardCeilingFormatted || synopsis?.awardCeiling || synopsis?.estimatedFundingFormatted || synopsis?.estimatedFunding || "Not listed",
    awardFloor: synopsis?.awardFloorFormatted || synopsis?.awardFloor || "Not listed",
    costSharing: typeof synopsis?.costSharing === "boolean" ? (synopsis.costSharing ? "Required or possible" : "Not listed as required") : "Not listed",
    postedDate: synopsis?.postingDate || synopsis?.estSynopsisPostingDate || hit?.openDate || "Not listed",
    closeDate: synopsis?.responseDateDesc || synopsis?.responseDate || synopsis?.estApplicationResponseDate || hit?.closeDate || detail?.originalDueDateDesc || "Not listed",
    contact: formatGrantContact(synopsis),
    description: synopsis?.synopsisDesc || synopsis?.forecastDesc || "",
    alns: Array.isArray(detail?.cfdas) ? detail.cfdas.map((item) => item?.cfdaNumber).filter(Boolean) : hit?.cfdaList || [],
    link: opportunityId ? `https://www.grants.gov/search-results-detail/${opportunityId}` : "https://www.grants.gov/search-grants",
    attachments: Array.isArray(detail?.synopsisAttachmentFolders) ? detail.synopsisAttachmentFolders : []
  };
}

function grantEligibilityMatches(profile, eligibility) {
  const applicantType = String(profile?.applicantType || "").toLowerCase();
  const value = eligibility.toLowerCase();

  return (
    (applicantType.includes("nonprofit") && value.includes("nonprofit"))
    || (applicantType.includes("small business") && value.includes("small business"))
    || (applicantType.includes("startup") && value.includes("small business"))
    || (applicantType.includes("individual") && value.includes("individual"))
    || (applicantType.includes("local") && (value.includes("city") || value.includes("county") || value.includes("township") || value.includes("local")))
    || (applicantType.includes("school") && (value.includes("school") || value.includes("education")))
    || (applicantType.includes("research") && (value.includes("higher education") || value.includes("research")))
  );
}

function fallbackGrantAnalysis(grant, profile) {
  const facts = getGrantFacts(grant);
  const keywords = String(`${profile?.fundingNeed || ""} ${profile?.keywords || ""}`).toLowerCase().split(/[,\s]+/).filter((word) => word.length > 2);
  const searchableText = [facts.title, facts.agency, facts.category, facts.description].join(" ").toLowerCase();
  let score = 45;

  if (keywords.some((keyword) => searchableText.includes(keyword))) {
    score += 25;
  }

  if (grantEligibilityMatches(profile, facts.eligibility)) {
    score += 20;
  }
  const normalizedScore = cleanScore(score);
  const decision = grantDecision(normalizedScore);

  return {
    opportunityId: facts.opportunityId,
    opportunityNumber: facts.opportunityNumber,
    title: facts.title,
    matchScore: normalizedScore,
    agentDecision: decision,
    decisionReason: decision === "Apply"
      ? "The opportunity appears aligned enough to start an application readiness review."
      : decision === "Verify eligibility"
        ? "The grant may fit, but applicant eligibility, match requirements, and documents need confirmation."
        : "This is worth tracking, but it does not yet look like an immediate application priority.",
    agency: facts.agency,
    status: facts.status,
    category: facts.category,
    fundingInstrument: facts.fundingInstrument,
    eligibility: facts.eligibility,
    awardCeiling: facts.awardCeiling,
    awardFloor: facts.awardFloor,
    costSharing: facts.costSharing,
    postedDate: facts.postedDate,
    closeDate: facts.closeDate,
    fitReason: "This grant matched the search filters, but the full notice should be reviewed before deciding to apply.",
    eligibilityReadiness: "Confirm applicant eligibility, registration requirements, deadline, cost sharing, and required attachments before starting an application.",
    requirements: [
      "Confirm your organization type is eligible under the notice.",
      "Confirm SAM.gov, UEI, Grants.gov Workspace, and any agency-specific registrations are ready.",
      "Review the notice for cost sharing, match, reporting, and required attachments."
    ],
    applicationSteps: [
      "Open the Grants.gov opportunity and read the full notice of funding opportunity.",
      "Create an application checklist covering eligibility, deadlines, documents, and internal approvals.",
      "Start the Grants.gov Workspace package early and assign owners for narrative, budget, and attachments."
    ],
    documentsNeeded: [
      "Project narrative or statement of need.",
      "Detailed budget and budget justification.",
      "Organization information, UEI, and SAM/Grants.gov registration details.",
      "Letters of support, resumes, work plan, or compliance attachments if required."
    ],
    risks: [
      "Eligibility may be narrower than the search result suggests.",
      "Cost sharing or matching funds may be required.",
      "Agency forms and attachments can take longer than expected."
    ],
    questionsToAsk: [
      "Is my applicant type eligible for this opportunity?",
      "Are matching funds or cost sharing required?",
      "What are the most important review criteria?",
      "Are there webinars, FAQs, or agency contacts for applicant questions?"
    ],
    contact: facts.contact,
    link: facts.link,
    attachments: facts.attachments
  };
}

function normalizeGrantAnalysis(item, grant, profile) {
  const fallback = fallbackGrantAnalysis(grant, profile);

  return {
    opportunityId: cleanString(item?.opportunityId, fallback.opportunityId),
    opportunityNumber: cleanString(item?.opportunityNumber, fallback.opportunityNumber),
    title: cleanString(item?.title, fallback.title),
    matchScore: cleanScore(item?.matchScore, fallback.matchScore),
    agentDecision: cleanString(item?.agentDecision, fallback.agentDecision),
    decisionReason: cleanString(item?.decisionReason, fallback.decisionReason),
    agency: cleanString(item?.agency, fallback.agency),
    status: cleanString(item?.status, fallback.status),
    category: cleanString(item?.category, fallback.category),
    fundingInstrument: cleanString(item?.fundingInstrument, fallback.fundingInstrument),
    eligibility: cleanString(item?.eligibility, fallback.eligibility),
    awardCeiling: cleanString(item?.awardCeiling, fallback.awardCeiling),
    awardFloor: cleanString(item?.awardFloor, fallback.awardFloor),
    costSharing: cleanString(item?.costSharing, fallback.costSharing),
    postedDate: cleanString(item?.postedDate, fallback.postedDate),
    closeDate: cleanString(item?.closeDate, fallback.closeDate),
    fitReason: cleanString(item?.fitReason, fallback.fitReason),
    eligibilityReadiness: cleanString(item?.eligibilityReadiness, fallback.eligibilityReadiness),
    requirements: cleanList(item?.requirements, fallback.requirements, 3),
    applicationSteps: cleanList(item?.applicationSteps, fallback.applicationSteps, 3),
    documentsNeeded: cleanList(item?.documentsNeeded, fallback.documentsNeeded, 4),
    risks: cleanList(item?.risks, fallback.risks, 3),
    questionsToAsk: cleanList(item?.questionsToAsk, fallback.questionsToAsk, 4),
    contact: cleanString(item?.contact, fallback.contact),
    link: cleanString(item?.link, fallback.link),
    attachments: fallback.attachments
  };
}

function buildGrantSearchPlans(profile) {
  const keywordTerms = splitSearchTerms(profile.keywords);
  const fundingTerms = splitSearchTerms(profile.fundingNeed);
  const organizationTerms = splitSearchTerms(profile.organization);
  const broadWords = uniqueValues([
    ...String(`${profile.fundingNeed || ""} ${profile.keywords || ""}`)
      .split(/\s+/)
      .map((word) => word.replace(/[^a-z0-9-]/gi, "").trim())
      .filter((word) => word.length >= 5),
    "health",
    "research",
    "community"
  ]);
  const primaryKeyword = keywordTerms[0] || fundingTerms[0] || organizationTerms[0] || "";
  const fundingNeed = String(profile.fundingNeed || "").trim();
  const agency = String(profile.agencies || "").trim();
  const fundingCategory = String(profile.fundingCategory || "").trim();
  const fundingInstrument = String(profile.fundingInstrument || "").trim();

  return [
    { keyword: primaryKeyword || fundingNeed, agencies: agency, fundingCategory, fundingInstrument },
    { keyword: primaryKeyword || fundingNeed, fundingCategory, fundingInstrument },
    { keyword: primaryKeyword || fundingNeed },
    { keyword: fundingNeed },
    ...keywordTerms.slice(1, 4).map((keyword) => ({ keyword })),
    ...fundingTerms.slice(1, 4).map((keyword) => ({ keyword })),
    fundingCategory ? { fundingCategory } : null,
    ...broadWords.slice(0, 5).map((keyword) => ({ keyword }))
  ].filter((plan) => plan && (plan.keyword || plan.agencies || plan.fundingCategory || plan.fundingInstrument));
}

function buildGrantsSearchBody(plan) {
  return {
    rows: 25,
    keyword: plan.keyword || "",
    oppStatuses: "forecasted|posted",
    agencies: plan.agencies || "",
    eligibilities: "",
    fundingCategories: plan.fundingCategory || "",
    fundingInstruments: plan.fundingInstrument || "",
    aln: ""
  };
}

async function fetchGrantDetail(searchHit) {
  const opportunityId = Number(searchHit?.id);
  if (!Number.isFinite(opportunityId)) {
    return { searchHit, detail: null };
  }

  const response = await fetch(grantsFetchApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ opportunityId })
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.errorcode) {
    return { searchHit, detail: null };
  }

  return { searchHit, detail: data.data };
}

async function searchGrantOpportunities(profile) {
  const plans = buildGrantSearchPlans(profile);
  const seen = new Set();
  const hits = [];

  for (const plan of plans) {
    const response = await fetch(grantsSearchApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildGrantsSearchBody(plan))
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data?.errorcode) {
      const message = data?.msg || `Grants.gov request failed with status ${response.status}.`;
      const error = new Error(message);
      error.status = response.ok ? 502 : response.status;
      throw error;
    }

    for (const hit of data?.data?.oppHits || []) {
      const key = hit?.id || hit?.number || hit?.title;
      if (key && !seen.has(key)) {
        seen.add(key);
        hits.push(hit);
      }
    }

    if (hits.length >= 10) {
      break;
    }
  }

  return Promise.all(hits.slice(0, 10).map(fetchGrantDetail));
}

function sendError(res, error) {
  const status = error.status || 500;
  console.error(`[api] ${error.message}`);
  res.status(status).json({ error: error.message || "Unexpected server error." });
}

app.post("/api/analyze-trials", async (req, res) => {
  try {
    const { profile, trials } = req.body || {};
    if (!profile || !Array.isArray(trials)) {
      return res.status(400).json({ error: "Expected a profile and trials array." });
    }

    const text = await callAI({
      prompt: buildTrialAnalysisPrompt({ profile, trials }),
      maxTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: trialAnalysisSchema
    });

    try {
      const analyzed = parseJsonArray(text);
      res.json({
        trials: trials.map((trial, index) => normalizeTrialAnalysis(analyzed[index], trial, profile))
      });
    } catch (error) {
      console.warn(`[api] Invalid trial-analysis JSON from AI; using deterministic fallback. ${error.cause?.message || error.message}`);
      res.json({ trials: trials.map((trial) => fallbackTrialAnalysis(trial, profile)) });
    }
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/search-contracts", async (req, res) => {
  try {
    const { profile } = req.body || {};
    if (!profile) {
      return res.status(400).json({ error: "Expected a business profile." });
    }

    const opportunities = await searchSamOpportunities(profile);
    res.json({ opportunities });
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/analyze-contracts", async (req, res) => {
  try {
    const { profile, opportunities } = req.body || {};
    if (!profile || !Array.isArray(opportunities)) {
      return res.status(400).json({ error: "Expected a business profile and opportunities array." });
    }

    const text = await callAI({
      prompt: buildContractAnalysisPrompt({ profile, opportunities }),
      maxTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: contractAnalysisSchema
    });

    try {
      const analyzed = parseJsonArray(text);
      res.json({
        contracts: opportunities.map((opportunity, index) => normalizeContractAnalysis(analyzed[index], opportunity, profile))
      });
    } catch (error) {
      console.warn(`[api] Invalid contract-analysis JSON from AI; using deterministic fallback. ${error.cause?.message || error.message}`);
      res.json({ contracts: opportunities.map((opportunity) => fallbackContractAnalysis(opportunity, profile)) });
    }
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/search-grants", async (req, res) => {
  try {
    const { profile } = req.body || {};
    if (!profile) {
      return res.status(400).json({ error: "Expected a grant applicant profile." });
    }

    const grants = await searchGrantOpportunities(profile);
    res.json({ grants });
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/analyze-grants", async (req, res) => {
  try {
    const { profile, grants } = req.body || {};
    if (!profile || !Array.isArray(grants)) {
      return res.status(400).json({ error: "Expected a grant applicant profile and grants array." });
    }

    const text = await callAI({
      prompt: buildGrantAnalysisPrompt({ profile, grants }),
      maxTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: grantAnalysisSchema
    });

    try {
      const analyzed = parseJsonArray(text);
      res.json({
        grants: grants.map((grant, index) => normalizeGrantAnalysis(analyzed[index], grant, profile))
      });
    } catch (error) {
      console.warn(`[api] Invalid grant-analysis JSON from AI; using deterministic fallback. ${error.cause?.message || error.message}`);
      res.json({ grants: grants.map((grant) => fallbackGrantAnalysis(grant, profile)) });
    }
  } catch (error) {
    sendError(res, error);
  }
});

app.post("/api/ask-ai", async (req, res) => {
  try {
    const { question, profile, trials = [], contracts = [], grants = [], domain = "trials" } = req.body || {};
    if (!question) {
      return res.status(400).json({ error: "Expected a question." });
    }

    const prompt = domain === "contracts"
      ? buildContractQuestionPrompt({ question, profile, contracts })
      : domain === "grants"
        ? buildGrantQuestionPrompt({ question, profile, grants })
        : buildQuestionPrompt({ question, profile, trials });

    const answer = await callAI({
      prompt,
      maxTokens: 1000
    });

    res.json({ answer: answer || "I couldn't process that question." });
  } catch (error) {
    sendError(res, error);
  }
});

if (isProduction) {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    appType: "spa",
    server: { middlewareMode: true }
  });

  app.use(vite.middlewares);
}

app.listen(port, () => {
  console.log(`Clinical Trial Finder running at http://127.0.0.1:${port}`);
});
