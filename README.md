# AgentApply

The agent-native application layer for public programs: clinical trials, federal grants, and government contracts.

## The Problem

Government and public-benefit programs can change someone's life or a company's trajectory. Clinical trials can unlock treatment access. Federal grants can fund research, nonprofits, schools, and community programs. Government contracts can create major revenue for small businesses.

But actually using these programs is painful.

People have to search across ClinicalTrials.gov, Grants.gov, and SAM.gov, then interpret dense eligibility rules, deadlines, forms, contacts, attachments, costs, registration requirements, and submission instructions. The web pages are built for humans clicking around, not for agents that can reason, prepare packets, track missing requirements, and hand work off safely.

AgentApply turns that messy discovery process into an agent-assisted application workflow.

## The Solution

AgentApply searches public opportunity systems, ranks the best matches with AI, explains the fit, and then helps the user move from "I found something" to "I am ready to apply or start screening."

It supports three high-friction public program workflows:

- Clinical trials from ClinicalTrials.gov
- Federal grants from Grants.gov
- Government contracts from SAM.gov

For each result, AgentApply creates:

- A plain-language fit analysis
- An application or outreach packet
- A readiness checklist
- A document list
- A draft email or kickoff message
- An official submission or contact route
- A local stage tracker
- A machine-readable AgentApply manifest for other agents

The system keeps a human approval gate before anything sensitive is shared or any official action is taken.

## Why This Fits The Hackathon

Internet of Agents is about rebuilding the web for agent use. AgentApply makes public programs legible to agents.

Instead of only showing cards to a person, each opportunity is converted into an `agentapply.manifest.v1` JSON object. That manifest describes the target, applicant, missing requirements, permissions, blocked actions, artifacts, and official handoff route.

This creates two views of the same workflow:

- Human view: recommendations, checklists, packets, and next steps
- Agent view: structured state, permissions, artifacts, and handoff instructions

That is the core idea: public-program application workflows should be accessible to humans and agents, with explicit consent and safety boundaries.

## Key Features

### Search And Ranking

- Searches ClinicalTrials.gov for recruiting studies
- Searches Grants.gov for posted and forecasted opportunities
- Searches SAM.gov for active contract opportunities
- Uses progressive broadening for grants and contracts so narrow filters do not immediately return zero results
- Uses AI to rank opportunities and explain fit

### Application Cockpit

Each selected opportunity gets a cockpit with:

- Readiness percentage
- Stage tracking: Qualify, Draft, Ready, Submitted
- Checklist progress saved in local browser storage
- Documents to prepare
- Copyable and downloadable packet text
- Official program route
- Email draft when a contact email is available

### Multi-Agent Run

The application cockpit shows a multi-agent workflow:

- Scout Agent: finds and selects the strongest opportunity
- Eligibility or Screening Agent: checks fit and risk
- Compliance Agent: tracks missing requirements
- Drafting Agent: prepares the packet
- Submission Agent: prepares the official route but does not submit without approval

### AgentApply Manifest

Every opportunity can export a JSON manifest:

```json
{
  "schema": "agentapply.manifest.v1",
  "domain": "grants",
  "target": {
    "title": "Example Opportunity",
    "score": 91,
    "officialUrl": "https://www.grants.gov/search-grants"
  },
  "permissions": {
    "humanApprovalRequired": true,
    "blockedAgentActions": [
      "submit_without_human_approval",
      "email_without_human_approval",
      "share_sensitive_data_without_consent"
    ]
  }
}
```

This is the agent-native layer: a structured handoff format for high-stakes public-program workflows.

### Coframe-Ready Optimization

AgentApply is prepared for Coframe optimization with an optional project ID:

```sh
VITE_COFRAME_PROJECT_ID=your_coframe_project_id_here
```

When this variable is set, the app installs Coframe in the page `<head>` so the experience can be optimized and measured through Coframe.

The product is set up around conversion actions that matter for this workflow:

- Loading a demo
- Running a live search
- Running the application team
- Approving the agent handoff
- Copying or downloading the application packet
- Copying or downloading the AgentApply manifest
- Opening the official ClinicalTrials.gov, Grants.gov, or SAM.gov route

The strongest Coframe use case is optimizing the activation path: which headline, copy, call-to-action, or cockpit layout gets users from search to a completed application packet or approved agent handoff.

### Demo Mode

Each mode includes a `Load demo` button. This lets judges see the full workflow even if an external API is slow, unavailable, or missing a key during the demo.

## Demo Flow

1. Open the app.
2. Choose Clinical trials, Government contracts, or Grants.
3. Use `Load demo` for a fast judge-safe path, or run a live search.
4. Review AI-ranked results.
5. Open the Application Cockpit.
6. Run the multi-agent application team.
7. Show the human approval gate.
8. Copy or download the packet.
9. Copy or download the AgentApply manifest.
10. Open the official ClinicalTrials.gov, Grants.gov, or SAM.gov route.

## Tech Stack

- React
- Vite
- Express
- Node.js
- ClinicalTrials.gov API
- Grants.gov API
- SAM.gov API
- Anthropic Claude or Google Gemini for AI analysis
- Coframe-ready script integration for UI/copy optimization
- Browser localStorage for local readiness tracking
- Custom `agentapply.manifest.v1` JSON protocol
- HTML, CSS, and JavaScript

## Architecture

```text
React/Vite frontend
  |
  | local /api requests
  v
Express API server
  |
  |-- ClinicalTrials.gov public API
  |-- Grants.gov public API
  |-- SAM.gov opportunities API
  |-- Anthropic or Google AI provider
  |
  v
Ranked opportunities + application packets + AgentApply manifests
```

The frontend never exposes API keys. AI and SAM.gov credentials are read server-side from a local `.env` file.

## Setup

Install dependencies:

```sh
npm install
```

Create a local `.env` file using `.env.example` as a template.

For Anthropic:

```sh
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

Or for Google Gemini:

```sh
AI_PROVIDER=google
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_MODEL=gemini-2.5-flash
```

To enable live government contract searches:

```sh
SAM_API_KEY=your_sam_gov_public_api_key_here
```

To enable Coframe optimization:

```sh
VITE_COFRAME_PROJECT_ID=your_coframe_project_id_here
```

Grant searches use Grants.gov public endpoints and do not require an API key for basic search.

Run the app:

```sh
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Secret Safety

Do not commit real API keys.

This repo ignores local secret files, including:

- `.env`
- `.env.*`
- `.envrc`
- key and certificate files
- common credential JSON files

Only `.env.example` should be committed.

## Useful Search Tips

### Government Contracts

SAM.gov can return zero results if the query is too narrow. Start broad:

```text
Industry: software development
Keywords: software
NAICS: 541511, 541512
State: leave blank
```

### Grants

Grants.gov works best with broad keywords first:

```text
Applicant type: Nonprofit
Funding need: community health
Keywords: health
Agency: leave blank
Funding category: Any category
```

Narrow only after results appear.

## Hackathon Judge Summary

AgentApply is not just another search UI. It is an agent-native application layer for the public internet.

It takes programs that are difficult to search, understand, and apply for, then turns them into structured workflows that humans and agents can both use. The product demonstrates agent UX, agent permissions, human approval, structured handoff manifests, and real integrations with public government systems.
