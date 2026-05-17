# Clinical Trial Finder

Local React/Vite app with an Express API layer for clinical trials, SAM.gov contracts, Grants.gov opportunities, AI analysis, and application packet workflows.

The results pages now move beyond search and display:

- Clinical trials generate a screening packet, coordinator outreach draft, readiness checklist, and ClinicalTrials.gov route.
- Government contracts generate a bid pursuit packet, contracting-office question draft, compliance checklist, and SAM.gov route.
- Grants generate an application packet, kickoff/contact draft, document checklist, and Grants.gov route.
- AgentApply manifests expose each application as machine-readable JSON with target metadata, readiness state, permissions, blocked actions, artifacts, and official handoff routes.
- The multi-agent application run shows scout, eligibility/screening, compliance, drafting, and submission agents with an explicit human approval gate.

Checklist progress and stage tracking are saved locally in the browser for the current machine.

Each search mode also includes a `Load demo` path so the complete ranking and application workflow can be shown without relying on live API keys during a demo.

## Setup

Create a local `.env` file with one provider:

```sh
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

or:

```sh
AI_PROVIDER=google
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_MODEL=gemini-2.5-flash
```

To enable government contract searches, add:

```sh
SAM_API_KEY=your_sam_gov_public_api_key_here
```

Grant searches use Grants.gov public search endpoints and do not require an API key for basic opportunity search.

Then run:

```sh
npm install
npm run dev
```

Open `http://127.0.0.1:5173`.

The frontend calls local `/api/*` endpoints. The server reads AI and SAM.gov keys from `.env` and sends API requests server-side, which avoids browser CORS failures and keeps keys out of client JavaScript.
