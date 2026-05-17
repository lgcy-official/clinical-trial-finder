export const demoProfiles = {
  trials: {
    condition: "Type 2 Diabetes",
    age: "52",
    gender: "Female",
    location: "San Diego, CA",
    history: "Diagnosed 6 years ago, A1C remains elevated despite oral therapy, no insulin use.",
    medications: "Metformin, GLP-1 therapy"
  },
  contracts: {
    industry: "healthcare data analytics",
    keywords: "FHIR, claims analytics, patient engagement, quality measures",
    naicsCodes: "541511, 541512",
    companySize: "11-50 employees",
    certifications: ["Small Business", "Woman-Owned"],
    location: "Remote-capable, US",
    state: "CA",
    pastPerformance: "Built HIPAA-aligned dashboards for regional clinics and care management teams.",
    notes: "Can prime small software pilots and subcontract on larger systems work."
  },
  grants: {
    applicantType: "Nonprofit",
    organization: "Community Health Access Lab",
    fundingNeed: "AI-assisted chronic disease navigation",
    keywords: "diabetes, care navigation, rural health, digital health",
    location: "California rural counties",
    agencies: "HHS",
    fundingCategory: "HL",
    fundingInstrument: "Grant",
    experience: "Won local foundation funding and has a finance lead for federal reporting.",
    notes: "Needs a no-match or low-match opportunity."
  }
};

export const demoTrials = [
  {
    nctId: "NCT06123456",
    title: "Digital Coaching and Medication Optimization for Type 2 Diabetes",
    matchScore: 86,
    agentDecision: "Contact to screen",
    decisionReason: "The profile appears aligned with an adult Type 2 Diabetes study using digital coaching and medication support.",
    matchReason: "This trial targets adults with Type 2 Diabetes and appears practical for a San Diego patient if remote check-ins are available.",
    phase: "Phase 3",
    status: "RECRUITING",
    keyEligibility: [
      "Adult with Type 2 Diabetes and elevated A1C.",
      "Stable current medications for a recent period.",
      "Able to complete remote check-ins and provide lab history."
    ],
    patientInsight: "This study appears focused on improving diabetes control with digital coaching and medication optimization. It may be useful for a patient who wants structured support without frequent long-distance visits.",
    estimatedParticipants: "240",
    location: "San Diego, CA; Los Angeles, CA",
    costInfo: "The record does not list exact patient costs, so the coordinator should confirm study-covered services and routine-care billing.",
    insuranceGuidance: "Ask whether labs, standard visits, and medication changes are billed to insurance or covered by the sponsor.",
    reimbursementInfo: "Travel and parking support are not confirmed in the record and should be verified before screening.",
    practicalFit: "The listed California sites make this a reasonable first contact for a San Diego patient if visit frequency is manageable.",
    nextSteps: [
      "Email the study coordinator with the screening packet.",
      "Ask for the full inclusion and exclusion criteria.",
      "Confirm visit frequency, costs, insurance billing, and reimbursement before scheduling."
    ],
    questionsToAsk: [
      "Which diabetes medications are allowed during screening?",
      "Are labs and study visits sponsor-covered?",
      "How many in-person visits are required?",
      "Is travel, parking, or remote monitoring equipment reimbursed?"
    ],
    primaryContact: "Maria Chen · Study Coordinator · maria.chen@example.edu · 619-555-0142",
    sites: [
      { display: "UC San Diego Diabetes Center · San Diego, CA · Recruiting" },
      { display: "Los Angeles Clinical Research Network · Los Angeles, CA · Recruiting" }
    ]
  },
  {
    nctId: "NCT06987654",
    title: "Lifestyle Intervention for Adults With Insulin Resistance",
    matchScore: 58,
    agentDecision: "Verify first",
    decisionReason: "The condition area may fit, but medication history and eligibility thresholds need review.",
    matchReason: "The study is relevant to metabolic disease, though the public summary suggests it may target prediabetes or insulin resistance more than established Type 2 Diabetes.",
    phase: "Phase 2",
    status: "RECRUITING",
    keyEligibility: [
      "Adult with insulin resistance or related metabolic risk.",
      "No recent major cardiovascular event.",
      "Able to attend coaching visits over several months."
    ],
    patientInsight: "This may be useful if the study accepts participants with established Type 2 Diabetes. It is a second-priority contact because eligibility looks less direct than the top trial.",
    estimatedParticipants: "120",
    location: "Irvine, CA",
    costInfo: "Exact participant costs are not listed in the public summary.",
    insuranceGuidance: "Ask the study team which services are research-only and which may be routine care.",
    reimbursementInfo: "Reimbursement is not listed and should be confirmed.",
    practicalFit: "The location may be manageable but less convenient than a San Diego site.",
    nextSteps: [
      "Verify whether Type 2 Diabetes is allowed.",
      "Ask whether remote coaching is available.",
      "Compare visit burden with the top-ranked trial."
    ],
    questionsToAsk: [
      "Do you accept participants with diagnosed Type 2 Diabetes?",
      "What A1C range is allowed?",
      "How many in-person visits are required?",
      "Are any costs billed to insurance?"
    ],
    primaryContact: "Recruiting Office · trials@example.org",
    sites: [{ display: "Metabolic Research Institute · Irvine, CA · Recruiting" }]
  }
];

export const demoContracts = [
  {
    noticeId: "DEMO-HEALTH-2026-001",
    title: "Patient Engagement Analytics Pilot for Community Clinics",
    matchScore: 88,
    agentDecision: "Bid",
    decisionReason: "The scope, NAICS, and small-business profile align well enough to start a bid pursuit immediately.",
    agency: "Department of Health and Human Services · Health Resources and Services Administration",
    noticeType: "Solicitation",
    setAside: "Total Small Business Set-Aside",
    naicsCode: "541512",
    pscCode: "DA10",
    postedDate: "05/10/2026",
    responseDeadline: "06/12/2026 05:00 PM EDT",
    placeOfPerformance: "United States, remote",
    estimatedValue: "Not listed",
    fitReason: "The opportunity asks for healthcare analytics and patient engagement capabilities that match the business profile.",
    bidReadiness: "The business should verify SAM status, size standard, and required security controls before writing the technical response.",
    requirements: [
      "Active SAM registration, UEI, and small-business representation.",
      "Healthcare data security and privacy controls.",
      "Past performance with analytics dashboards or patient engagement software."
    ],
    winThemes: [
      "Low-risk implementation with clinic-friendly onboarding.",
      "FHIR-ready integrations and clear security posture.",
      "Measurable improvements in outreach, follow-up, and quality reporting."
    ],
    risks: [
      "Security requirements may be more extensive in attachments.",
      "Evaluation may favor incumbent clinic technology vendors.",
      "Pricing volume could require a detailed labor category breakdown."
    ],
    nextSteps: [
      "Open the SAM.gov listing and download all attachments.",
      "Build a compliance matrix from the solicitation instructions.",
      "Send clarification questions before the Q&A deadline."
    ],
    questionsToAsk: [
      "Is there an incumbent system or prior contract number?",
      "Which security controls are mandatory at award?",
      "Will APIs or synthetic test data be available for implementation?",
      "How will technical merit and price be weighted?"
    ],
    contact: "Alicia Morgan · Contract Specialist · alicia.morgan@example.gov · 202-555-0188",
    link: "https://sam.gov/content/opportunities",
    attachments: []
  },
  {
    noticeId: "DEMO-MARKET-2026-009",
    title: "Sources Sought for Digital Health Outreach Tools",
    matchScore: 64,
    agentDecision: "Monitor",
    decisionReason: "This is useful market intelligence and a chance to shape the requirement before a solicitation.",
    agency: "Department of Veterans Affairs",
    noticeType: "Sources Sought",
    setAside: "Set-aside not determined",
    naicsCode: "541511",
    pscCode: "7A21",
    postedDate: "05/01/2026",
    responseDeadline: "05/30/2026 03:00 PM EDT",
    placeOfPerformance: "Nationwide",
    estimatedValue: "Not listed",
    fitReason: "The business can respond with capabilities, but this is not yet a bid opportunity.",
    bidReadiness: "Prepare a concise capability statement and relevant examples rather than a full proposal.",
    requirements: [
      "Capability statement under the listed page limit.",
      "Relevant federal or commercial healthcare examples.",
      "Small-business and socioeconomic certification details."
    ],
    winThemes: [
      "Fast deployment for distributed care teams.",
      "Accessibility and patient-centered design.",
      "Privacy-first analytics and auditability."
    ],
    risks: [
      "This may not become a procurement.",
      "The final NAICS or set-aside may change.",
      "Response format may be strict and short."
    ],
    nextSteps: [
      "Submit a capability statement.",
      "Ask whether a draft solicitation or industry day is planned.",
      "Track the agency for follow-on notices."
    ],
    questionsToAsk: [
      "What problem is the agency trying to solve first?",
      "Will there be an industry day?",
      "What integrations are expected?",
      "How will small-business responses influence acquisition strategy?"
    ],
    contact: "Market Research Team · marketresearch@example.gov",
    link: "https://sam.gov/content/opportunities",
    attachments: []
  }
];

export const demoGrants = [
  {
    opportunityId: "999001",
    opportunityNumber: "HHS-DEMO-26-101",
    title: "Community Chronic Disease Navigation and Digital Health Demonstration",
    matchScore: 91,
    agentDecision: "Apply",
    decisionReason: "The nonprofit applicant, chronic disease focus, and rural health angle align strongly with the opportunity.",
    agency: "Department of Health and Human Services",
    status: "Posted",
    category: "Health",
    fundingInstrument: "Grant",
    eligibility: "Nonprofits, public health organizations, and community-based organizations",
    awardCeiling: "$750,000",
    awardFloor: "$150,000",
    costSharing: "Not listed as required",
    postedDate: "05/06/2026",
    closeDate: "07/15/2026",
    fitReason: "The grant aligns with AI-assisted care navigation for chronic disease programs in underserved communities.",
    eligibilityReadiness: "The applicant should confirm nonprofit eligibility, SAM/UEI status, and whether AI-enabled tools require extra privacy documentation.",
    requirements: [
      "Eligible nonprofit or community-based organization.",
      "Program plan for chronic disease navigation and measurable outcomes.",
      "Budget, reporting plan, privacy safeguards, and partner commitments."
    ],
    applicationSteps: [
      "Open the Grants.gov listing and confirm the full notice and package.",
      "Create a requirement matrix for narrative, budget, forms, and attachments.",
      "Assign owners for program design, budget, partner letters, and submission."
    ],
    documentsNeeded: [
      "Project narrative and statement of need.",
      "Budget and budget justification.",
      "Privacy, data use, and evaluation plan.",
      "Letters of support from clinics or community partners."
    ],
    risks: [
      "AI-related privacy and evaluation requirements may be detailed in the notice.",
      "Partner letters can take longer than expected.",
      "Budget restrictions may limit software or staffing costs."
    ],
    questionsToAsk: [
      "Are nonprofit applicants eligible without a university partner?",
      "Are software development and AI workflow costs allowable?",
      "Is cost sharing required or encouraged?",
      "What evaluation metrics carry the most weight?"
    ],
    contact: "Program Office · grants@example.hhs.gov · 301-555-0120",
    link: "https://www.grants.gov/search-grants",
    attachments: []
  },
  {
    opportunityId: "999002",
    opportunityNumber: "USDA-DEMO-26-044",
    title: "Rural Care Access and Telehealth Support Program",
    matchScore: 67,
    agentDecision: "Verify eligibility",
    decisionReason: "The rural health focus may fit, but eligible applicant types and cost sharing need confirmation.",
    agency: "U.S. Department of Agriculture",
    status: "Forecasted",
    category: "Health; Community development",
    fundingInstrument: "Cooperative Agreement",
    eligibility: "Local governments, nonprofits, and rural service providers",
    awardCeiling: "$500,000",
    awardFloor: "$50,000",
    costSharing: "Required or possible",
    postedDate: "Forecasted",
    closeDate: "Estimated 09/01/2026",
    fitReason: "The care access focus is relevant, but the applicant may need a rural delivery partner.",
    eligibilityReadiness: "Verify whether the nonprofit can apply directly or needs a local government or rural provider partner.",
    requirements: [
      "Rural service-area documentation.",
      "Telehealth or access improvement plan.",
      "Partner commitments and matching fund plan if required."
    ],
    applicationSteps: [
      "Monitor the forecast until the full notice is posted.",
      "Identify rural partners and service areas.",
      "Draft a cost-share plan in case matching funds are required."
    ],
    documentsNeeded: [
      "Rural service-area evidence.",
      "Partner letters.",
      "Budget and match documentation.",
      "Work plan and evaluation metrics."
    ],
    risks: [
      "Forecasted details may change.",
      "Cost sharing may make the project harder to fund.",
      "Rural eligibility boundaries may be strict."
    ],
    questionsToAsk: [
      "Can nonprofits apply directly?",
      "Which rural geographies qualify?",
      "What match percentage is expected?",
      "When will the full notice be posted?"
    ],
    contact: "Rural Programs Desk · ruralgrants@example.usda.gov",
    link: "https://www.grants.gov/search-grants",
    attachments: []
  }
];

export const demoRunLog = {
  trials: [
    "Goal: find recruiting clinical trials for Type 2 Diabetes.",
    "Loaded a judge-safe demo scenario with ranked trials.",
    "Prepared a screening packet workspace for the strongest matches."
  ],
  contracts: [
    "Goal: find active government contracts for healthcare data analytics.",
    "Loaded a judge-safe demo scenario with ranked opportunities.",
    "Prepared bid pursuit packets for the strongest opportunities."
  ],
  grants: [
    "Goal: find grant opportunities for AI-assisted chronic disease navigation.",
    "Loaded a judge-safe demo scenario with ranked grants.",
    "Prepared application packets for the strongest grants."
  ]
};
