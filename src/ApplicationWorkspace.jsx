import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "application-workspace-progress-v1";
const STAGES = ["Qualify", "Draft", "Ready", "Submitted"];

function clean(value, fallback = "Not listed") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getItemId(domain, item, index) {
  if (domain === "contracts") return clean(item.noticeId, `contract-${index}`);
  if (domain === "grants") return clean(item.opportunityId || item.opportunityNumber, `grant-${index}`);
  return clean(item.nctId, `trial-${index}`);
}

function extractEmail(value) {
  return String(value || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function safeFileName(value) {
  return clean(value, "application-packet")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "application-packet";
}

function bulletList(items) {
  return items.filter(Boolean).map((item) => `- ${item}`).join("\n");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function downloadText({ text, filename, type = "text/plain;charset=utf-8" }) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function buildTrialPacket(profile, trial) {
  const subject = `Screening inquiry for ${clean(trial.title)}${trial.nctId ? ` (${trial.nctId})` : ""}`;
  const contact = clean(trial.primaryContact || trial.contact, "Study team contact not listed");
  const email = extractEmail(contact);
  const officialUrl = trial.nctId ? `https://clinicaltrials.gov/study/${trial.nctId}` : "";
  const checklist = [
    "Confirm main inclusion and exclusion criteria with the study coordinator.",
    "Send the screening inquiry with only the health details you are comfortable sharing.",
    "Ask which visits, tests, medications, travel, parking, and lodging are sponsor-covered.",
    "Confirm routine-care billing with the study team and insurer before scheduling.",
    "Schedule phone screening or request the nearest active site."
  ];
  const documents = [
    "Current diagnosis and treatment summary.",
    "Medication list and relevant allergies.",
    "Recent labs, imaging, or pathology reports if requested.",
    "Insurance card and preferred clinician contact.",
    "List of questions about costs, reimbursement, visits, and risks."
  ];
  const message = [
    `Subject: ${subject}`,
    "",
    "Hello,",
    "",
    `I am interested in being screened for ${clean(trial.title)}${trial.nctId ? ` (${trial.nctId})` : ""}.`,
    "",
    "Candidate snapshot:",
    bulletList([
      `Condition: ${clean(profile.condition)}`,
      `Age: ${clean(profile.age)}`,
      `Gender: ${clean(profile.gender)}`,
      `Location: ${clean(profile.location, "Open to qualifying sites")}`,
      profile.history ? `Relevant history: ${profile.history}` : "",
      profile.medications ? `Current medications: ${profile.medications}` : ""
    ]),
    "",
    "Could you confirm whether this profile may be appropriate for screening, what records you need, and what costs or travel support should be verified before a visit?",
    "",
    "Thank you."
  ].join("\n");

  return {
    noun: "trial",
    title: "Clinical Trial Screening Packet",
    targetLabel: "Selected trial",
    routeLabel: "Official trial listing",
    primaryAction: "Open trial listing",
    subject,
    contact,
    email,
    officialUrl,
    checklist,
    documents,
    message,
    summary: [
      `Recommendation: ${clean(trial.agentDecision)}`,
      `Match: ${clean(String(trial.matchScore ?? 0), "0")}/100`,
      `Location: ${clean(trial.location)}`,
      `Coordinator/contact: ${contact}`
    ],
    caution: "Clinical trial enrollment requires study-team screening and clinician review before any action."
  };
}

function buildContractPacket(profile, contract) {
  const subject = `Opportunity review for ${clean(contract.title)}${contract.noticeId ? ` (${contract.noticeId})` : ""}`;
  const contact = clean(contract.contact, "Contracting office contact not listed");
  const email = extractEmail(contact);
  const officialUrl = clean(contract.link, "");
  const checklist = [
    "Open SAM.gov and download the solicitation package and amendments.",
    "Confirm SAM registration, UEI, NAICS, size standard, and set-aside eligibility.",
    "Create a compliance matrix from every instruction and evaluation factor.",
    "Decide prime, sub, or teaming strategy before drafting the response.",
    "Prepare technical, past-performance, pricing, and required representation sections.",
    "Submit through the stated route before the response deadline."
  ];
  const documents = [
    "Solicitation package, amendments, and Q&A.",
    "Compliance matrix and bid/no-bid memo.",
    "Past performance citations and key personnel resumes.",
    "Technical approach, management plan, and schedule.",
    "Price volume, certifications, and required forms."
  ];
  const message = [
    `Subject: ${subject}`,
    "",
    "Hello,",
    "",
    `We are reviewing ${clean(contract.title)} and would like to confirm a few items before making a bid decision.`,
    "",
    "Company snapshot:",
    bulletList([
      `Capabilities: ${clean(profile.industry)}`,
      profile.keywords ? `Keywords: ${profile.keywords}` : "",
      profile.naicsCodes ? `NAICS: ${profile.naicsCodes}` : "",
      profile.certifications?.length ? `Certifications: ${profile.certifications.join(", ")}` : "",
      profile.pastPerformance ? `Relevant past performance: ${profile.pastPerformance}` : ""
    ]),
    "",
    "Questions:",
    bulletList(contract.questionsToAsk || [
      "Is there an incumbent or prior contract number?",
      "What are the most important evaluation factors?",
      "Are teaming partners or subcontractors allowed?",
      "When is the Q&A deadline?"
    ]),
    "",
    "Thank you."
  ].join("\n");

  return {
    noun: "contract",
    title: "Bid Pursuit Packet",
    targetLabel: "Selected opportunity",
    routeLabel: "Official SAM.gov route",
    primaryAction: "Open SAM.gov listing",
    subject,
    contact,
    email,
    officialUrl,
    checklist,
    documents,
    message,
    summary: [
      `Recommendation: ${clean(contract.agentDecision)}`,
      `Fit: ${clean(String(contract.matchScore ?? 0), "0")}/100`,
      `Agency: ${clean(contract.agency)}`,
      `Deadline: ${clean(contract.responseDeadline)}`
    ],
    caution: "Public bids must follow the solicitation, amendments, deadlines, and official submission instructions exactly."
  };
}

function buildGrantPacket(profile, grant) {
  const subject = `Application kickoff for ${clean(grant.title)}${grant.opportunityNumber ? ` (${grant.opportunityNumber})` : ""}`;
  const contact = clean(grant.contact, "Agency contact not listed");
  const email = extractEmail(contact);
  const officialUrl = clean(grant.link, "");
  const checklist = [
    "Open the Grants.gov opportunity and confirm the current notice and package.",
    "Confirm applicant eligibility, SAM/UEI status, and Grants.gov Workspace access.",
    "Assign owners for narrative, budget, budget justification, forms, and attachments.",
    "Build a requirement matrix from the notice, review criteria, and due dates.",
    "Draft the narrative and budget against the scoring criteria.",
    "Validate and submit the package before the close date."
  ];
  const documents = grant.documentsNeeded?.length ? grant.documentsNeeded : [
    "Project narrative or statement of need.",
    "Detailed budget and budget justification.",
    "Organization registration, UEI, and SAM details.",
    "Letters of support, resumes, work plan, or compliance attachments."
  ];
  const message = [
    `Subject: ${subject}`,
    "",
    "Hello,",
    "",
    `We are preparing to evaluate an application for ${clean(grant.title)}.`,
    "",
    "Applicant snapshot:",
    bulletList([
      `Applicant type: ${clean(profile.applicantType)}`,
      profile.organization ? `Organization: ${profile.organization}` : "",
      `Funding need: ${clean(profile.fundingNeed)}`,
      profile.location ? `Location: ${profile.location}` : "",
      profile.experience ? `Grant experience: ${profile.experience}` : ""
    ]),
    "",
    "Questions to resolve before submission:",
    bulletList(grant.questionsToAsk || [
      "Is this applicant type eligible?",
      "Are matching funds or cost sharing required?",
      "What are the highest-weighted review criteria?",
      "Are webinars, FAQs, or agency contacts available?"
    ]),
    "",
    "Thank you."
  ].join("\n");

  return {
    noun: "grant",
    title: "Grant Application Packet",
    targetLabel: "Selected grant",
    routeLabel: "Official Grants.gov route",
    primaryAction: "Open Grants.gov listing",
    subject,
    contact,
    email,
    officialUrl,
    checklist,
    documents,
    message,
    summary: [
      `Recommendation: ${clean(grant.agentDecision)}`,
      `Fit: ${clean(String(grant.matchScore ?? 0), "0")}/100`,
      `Agency: ${clean(grant.agency)}`,
      `Close date: ${clean(grant.closeDate)}`
    ],
    caution: "Grant applications must be verified against the official notice, package forms, and agency instructions."
  };
}

function buildPacket(domain, profile, item) {
  if (domain === "contracts") return buildContractPacket(profile, item);
  if (domain === "grants") return buildGrantPacket(profile, item);
  return buildTrialPacket(profile, item);
}

function buildPacketText(packet, item) {
  return [
    packet.title,
    "=".repeat(packet.title.length),
    "",
    packet.targetLabel,
    clean(item.title),
    "",
    "Readiness summary",
    bulletList(packet.summary),
    "",
    "Application checklist",
    bulletList(packet.checklist),
    "",
    "Documents to prepare",
    bulletList(packet.documents),
    "",
    "Draft outreach / application message",
    packet.message,
    "",
    "Submission route",
    packet.officialUrl || packet.contact,
    "",
    "Verification note",
    packet.caution
  ].join("\n");
}

function profileForManifest(domain, profile) {
  if (domain === "contracts") {
    return {
      type: "business",
      industry: clean(profile.industry),
      keywords: clean(profile.keywords, ""),
      naicsCodes: clean(profile.naicsCodes, ""),
      companySize: clean(profile.companySize, ""),
      certifications: profile.certifications || [],
      location: clean(profile.location, "")
    };
  }

  if (domain === "grants") {
    return {
      type: "grant_applicant",
      applicantType: clean(profile.applicantType),
      organization: clean(profile.organization, ""),
      fundingNeed: clean(profile.fundingNeed),
      keywords: clean(profile.keywords, ""),
      location: clean(profile.location, "")
    };
  }

  return {
    type: "patient",
    condition: clean(profile.condition),
    age: clean(profile.age),
    gender: clean(profile.gender),
    location: clean(profile.location, ""),
    sensitiveDataPolicy: "Share only after explicit human approval."
  };
}

function buildAgentRun({ domain, item, packet, completion, currentProgress, checked }) {
  const runStarted = Boolean(currentProgress.runStarted);
  const approved = Boolean(currentProgress.approved);
  const score = item.matchScore || 0;
  const readinessStatus = completion === 100 ? "complete" : runStarted ? "needs_input" : "queued";
  const routeStatus = approved ? "approved" : runStarted ? "waiting_for_human" : "queued";

  return [
    {
      id: "scout",
      name: "Scout Agent",
      status: "complete",
      output: `Selected the highest-fit ${packet.noun} from ranked results.`
    },
    {
      id: "eligibility",
      name: domain === "trials" ? "Screening Agent" : "Eligibility Agent",
      status: score >= 70 ? "complete" : "needs_review",
      output: `${clean(item.agentDecision)} with score ${score}/100.`
    },
    {
      id: "compliance",
      name: "Compliance Agent",
      status: readinessStatus,
      output: completion === 100
        ? "All visible readiness checks are complete."
        : `${Object.values(checked).filter(Boolean).length} checklist item(s) completed; remaining items require human or source verification.`
    },
    {
      id: "drafting",
      name: "Drafting Agent",
      status: runStarted ? "complete" : "queued",
      output: runStarted ? "Generated packet text, document list, and outreach/application draft." : "Ready to draft after run starts."
    },
    {
      id: "submission",
      name: "Submission Agent",
      status: routeStatus,
      output: approved
        ? "Human approved the handoff packet; official route is ready to open."
        : "Will not submit or send anything without explicit human approval."
    }
  ];
}

function buildAgentApplyManifest({ domain, profile, item, itemId, packet, packetText, completion, currentProgress, checked }) {
  const completedChecks = packet.checklist.filter((check) => checked[check]);
  const missingChecks = packet.checklist.filter((check) => !checked[check]);
  const agentRun = buildAgentRun({ domain, item, packet, completion, currentProgress, checked });

  return {
    schema: "agentapply.manifest.v1",
    name: `${packet.title}: ${clean(item.title)}`,
    domain,
    target: {
      id: itemId,
      title: clean(item.title),
      decision: clean(item.agentDecision),
      score: item.matchScore || 0,
      officialUrl: packet.officialUrl || null,
      contact: packet.contact,
      contactEmail: packet.email || null
    },
    applicant: profileForManifest(domain, profile),
    readiness: {
      stage: currentProgress.stage || STAGES[0],
      percent: completion,
      completedChecks,
      missingChecks,
      documentsToPrepare: packet.documents
    },
    permissions: {
      humanApprovalRequired: true,
      humanApproved: Boolean(currentProgress.approved),
      allowedAgentActions: [
        "rank_opportunities",
        "draft_application_packet",
        "prepare_outreach",
        "open_official_submission_route_after_human_approval"
      ],
      blockedAgentActions: [
        "submit_without_human_approval",
        "email_without_human_approval",
        "share_sensitive_data_without_consent",
        "claim_eligibility_or_award_is_guaranteed"
      ]
    },
    agentRun,
    artifacts: {
      subject: packet.subject,
      packetText,
      outreachDraft: packet.message
    }
  };
}

function loadProgress() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function ApplicationWorkspace({ domain, profile, items }) {
  const ranked = useMemo(() => {
    return items
      .map((item, index) => ({ item, id: getItemId(domain, item, index) }))
      .sort((a, b) => (b.item.matchScore || 0) - (a.item.matchScore || 0));
  }, [domain, items]);
  const [selectedId, setSelectedId] = useState("");
  const [progress, setProgress] = useState(loadProgress);
  const [copied, setCopied] = useState(false);
  const [manifestCopied, setManifestCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  if (!ranked.length) return null;

  const selected = ranked.find((row) => row.id === selectedId) || ranked[0];
  const packet = buildPacket(domain, profile, selected.item);
  const packetText = buildPacketText(packet, selected.item);
  const progressKey = `${domain}:${selected.id}`;
  const currentProgress = progress[progressKey] || { stage: STAGES[0], checked: {} };
  const checked = currentProgress.checked || {};
  const completed = packet.checklist.filter((item) => checked[item]).length;
  const completion = Math.round((completed / packet.checklist.length) * 100);
  const agentRun = buildAgentRun({ domain, item: selected.item, packet, completion, currentProgress, checked });
  const manifest = buildAgentApplyManifest({
    domain,
    profile,
    item: selected.item,
    itemId: selected.id,
    packet,
    packetText,
    completion,
    currentProgress,
    checked
  });
  const manifestText = JSON.stringify(manifest, null, 2);
  const mailto = packet.email
    ? `mailto:${packet.email}?subject=${encodeURIComponent(packet.subject)}&body=${encodeURIComponent(packet.message)}`
    : "";

  const setStage = (stage) => {
    setProgress((current) => ({
      ...current,
      [progressKey]: { ...currentProgress, stage, checked }
    }));
  };

  const toggleCheck = (label) => {
    setProgress((current) => ({
      ...current,
      [progressKey]: {
        ...currentProgress,
        checked: { ...checked, [label]: !checked[label] }
      }
    }));
  };

  const startAgentRun = () => {
    setProgress((current) => ({
      ...current,
      [progressKey]: {
        ...currentProgress,
        runStarted: true,
        checked
      }
    }));
  };

  const approveHandoff = () => {
    setProgress((current) => ({
      ...current,
      [progressKey]: {
        ...currentProgress,
        stage: completion === 100 ? "Ready" : currentProgress.stage || "Draft",
        runStarted: true,
        approved: true,
        checked
      }
    }));
  };

  const copyPacket = async () => {
    await copyText(packetText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const downloadPacket = () => {
    downloadText({
      text: packetText,
      filename: `${packet.noun}-${safeFileName(selected.item.title)}-packet.txt`
    });
  };

  const copyManifest = async () => {
    await copyText(manifestText);
    setManifestCopied(true);
    window.setTimeout(() => setManifestCopied(false), 1600);
  };

  const downloadManifest = () => {
    downloadText({
      text: manifestText,
      filename: `${packet.noun}-${safeFileName(selected.item.title)}-agentapply.json`,
      type: "application/json;charset=utf-8"
    });
  };

  return (
    <section className="card fade-in" style={{ marginBottom: 24, borderLeft: "3px solid var(--amber)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Application cockpit</p>
          <h2 style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.25 }}>{packet.title}</h2>
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 6, lineHeight: 1.5 }}>{packet.caution}</p>
        </div>
        <div style={{ minWidth: 118, textAlign: "right" }}>
          <p style={{ fontSize: 24, fontWeight: 500, color: completion === 100 ? "var(--teal)" : "var(--amber)" }}>{completion}%</p>
          <p style={{ fontSize: 12, color: "var(--text3)" }}>ready</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 170px", gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>{packet.targetLabel}</label>
          <select value={selected.id} onChange={(event) => setSelectedId(event.target.value)}>
            {ranked.map((row) => (
              <option key={row.id} value={row.id}>
                {clean(row.item.title)} ({row.item.matchScore || 0})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.05em" }}>Stage</label>
          <select value={currentProgress.stage || STAGES[0]} onChange={(event) => setStage(event.target.value)}>
            {STAGES.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </div>
      </div>

      <div style={{ height: 6, borderRadius: 4, background: "var(--surface2)", overflow: "hidden", marginBottom: 18 }}>
        <div style={{ width: `${completion}%`, height: "100%", background: completion === 100 ? "var(--teal)" : "var(--amber)", transition: "width 0.2s ease" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 0.9fr) minmax(260px, 1.1fr)", gap: 18 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 9, textTransform: "uppercase", letterSpacing: "0.05em" }}>Readiness checklist</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {packet.checklist.map((item) => (
              <label key={item} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: "var(--text2)", lineHeight: 1.45 }}>
                <input
                  type="checkbox"
                  checked={Boolean(checked[item])}
                  onChange={() => toggleCheck(item)}
                  style={{ width: 16, marginTop: 2, accentColor: "var(--teal)", flexShrink: 0 }}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", margin: "18px 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Documents to prepare</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
            {packet.documents.map((item) => (
              <li key={item} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.45 }}>+ {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 9 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Draft packet</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={copyPacket} data-coframe-conversion="copy-application-packet" style={{ fontSize: 12, padding: "7px 10px" }}>{copied ? "Copied" : "Copy"}</button>
              <button className="btn-ghost" onClick={downloadPacket} data-coframe-conversion="download-application-packet" style={{ fontSize: 12, padding: "7px 10px" }}>Download</button>
            </div>
          </div>

          <textarea
            readOnly
            value={packetText}
            rows={14}
            style={{ resize: "vertical", fontSize: 12, lineHeight: 1.5, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
          />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            {packet.officialUrl && (
              <a href={packet.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" data-coframe-conversion="open-official-route" style={{ textDecoration: "none", fontSize: 13, padding: "10px 14px" }}>
                {packet.primaryAction}
              </a>
            )}
            {mailto && (
              <a href={mailto} className="btn-ghost" data-coframe-conversion="open-email-draft" style={{ textDecoration: "none", fontSize: 13, padding: "10px 14px" }}>
                Open email draft
              </a>
            )}
          </div>

          <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: "var(--radius-sm)", background: "var(--surface2)", fontSize: 12, color: "var(--text2)", lineHeight: 1.5, wordBreak: "break-word" }}>
            <strong style={{ color: "var(--text)" }}>{packet.routeLabel}:</strong> {packet.officialUrl || packet.contact}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>AgentApply protocol</p>
            <h3 style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.25 }}>Multi-agent application run</h3>
            <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 5, lineHeight: 1.5 }}>A machine-readable handoff for agents with explicit permissions, blocked actions, readiness state, and a human approval gate.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button className="btn-primary" onClick={startAgentRun} data-coframe-conversion="run-application-team" style={{ fontSize: 13, padding: "10px 14px" }}>
              {currentProgress.runStarted ? "Re-run agents" : "Run application team"}
            </button>
            <button className="btn-ghost" onClick={approveHandoff} data-coframe-conversion="approve-agent-handoff" style={{ fontSize: 13, padding: "10px 14px" }}>
              {currentProgress.approved ? "Approved" : "Approve handoff"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 0.9fr) minmax(260px, 1.1fr)", gap: 18 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", marginBottom: 9, textTransform: "uppercase", letterSpacing: "0.05em" }}>Agent team</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {agentRun.map((agent) => {
                const statusColor = agent.status === "complete" || agent.status === "approved"
                  ? "var(--teal)"
                  : agent.status === "queued"
                    ? "var(--text3)"
                    : "var(--amber)";
                return (
                  <div key={agent.id} style={{ display: "grid", gridTemplateColumns: "18px minmax(0, 1fr)", gap: 9, alignItems: "start" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: statusColor, marginTop: 5 }} />
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{agent.name}</p>
                        <span className="tag tag-gray" style={{ fontSize: 11, padding: "2px 7px" }}>{agent.status.replaceAll("_", " ")}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.45, marginTop: 3 }}>{agent.output}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: "var(--radius-sm)", background: currentProgress.approved ? "var(--teal-light)" : "var(--amber-light)", fontSize: 12, color: currentProgress.approved ? "var(--teal)" : "var(--amber)", lineHeight: 1.5 }}>
              <strong>Human approval gate:</strong> {currentProgress.approved ? "Approved for handoff. The app still opens official routes instead of submitting automatically." : "Agents can prepare packets, but they cannot send email, submit forms, or share sensitive data until approved."}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 9 }}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Agent view manifest</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <button className="btn-ghost" onClick={copyManifest} data-coframe-conversion="copy-agentapply-manifest" style={{ fontSize: 12, padding: "7px 10px" }}>{manifestCopied ? "Copied" : "Copy JSON"}</button>
                <button className="btn-ghost" onClick={downloadManifest} data-coframe-conversion="download-agentapply-manifest" style={{ fontSize: 12, padding: "7px 10px" }}>Download JSON</button>
              </div>
            </div>
            <textarea
              readOnly
              value={manifestText}
              rows={14}
              style={{ resize: "vertical", fontSize: 11, lineHeight: 1.5, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
