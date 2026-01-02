# Echo — Real-time AI chat monorepo

![Template](https://img.shields.io/badge/template-open--source-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![pnpm](https://img.shields.io/badge/pnpm-%3E%3D10.4.1-36BCF7)
![Turborepo](https://img.shields.io/badge/turborepo-%5E2.5.5-ff7b00)
![Convex](https://img.shields.io/badge/convex-1.25.4-7B61FF)
![License](https://img.shields.io/badge/license-none-lightgrey)

Echo is a monorepo for a real-time AI chat product built around Convex Agents and an embeddable voice-enabled widget (VAPI). It provides:
- A Next.js web dashboard (apps/web)
- An embeddable Next.js widget (apps/widget) with voice support
- A Convex backend with schema, realtime functions and AI Agents (packages/backend)
- A shared UI component package (packages/ui) used by both apps

Tech highlights: Next.js (App Router), Convex (serverless database + functions + Agents), @convex-dev/agent, @ai-sdk/google (Gemini), @vapi-ai/web (voice), pnpm workspaces, Turborepo, TypeScript, Tailwind/Radix UI.

Table of contents
- Quick start
- Run a single app or everything
- Project structure
- Key packages and what they do
- Environment variables (.env examples)
- How voice (VAPI) is used in the widget
- Convex & Agents notes
- Shared UI package (design system)
- Developer workflows & tips
- Testing
- Troubleshooting & FAQ
- Contributing
- Open source template (new)
- Where to look in code
- License
- Useful commands summary
- Final notes

Open source template (how to use this repo as a public template)
- Goal: Make this monorepo easy to fork/seed for new projects.
- Recommended GitHub repository metadata and files to add:
  - LICENSE (e.g. MIT) — add a clear license file in repo root.
  - CONTRIBUTING.md — detailed contribution guide (see Contributing section in this README).
  - CODE_OF_CONDUCT.md — expected contributor behavior.
  - .github/ISSUE_TEMPLATE/* and .github/PULL_REQUEST_TEMPLATE.md — lightweight templates to standardize contributions.
  - SECURITY.md — vulnerability reporting instructions and disclosure policy.
  - A short repo description and topic tags (e.g. "monorepo", "convex", "nextjs", "vapi", "voice", "ai").
  - Optional: release workflow / CI (GitHub Actions) for run/build/lint checks.
- How to adopt this as a template:
  1. Fork or Use GitHub's "Use this template" to create a new repository.
  2. Add a LICENSE file and update package.json "name", "version", and repo links.
  3. Add recommended .github files from above.
  4. Update README badges (CI, license, npm, etc.) and any project-specific links/URLs.
  5. If publishing packages, set up npm access and release workflows.

Quick start (local)
1. Requirements
   - Node.js >= 20
   - pnpm >= 10 (root package.json expects pnpm@10.4.1)
   - Convex CLI installed globally for backend dev (optional): npm i -g convex

2. Install dependencies (from repo root)
```bash
pnpm install
```

3. Run everything (recommended during development)
```bash
pnpm dev
```
This runs `turbo dev` which will start all workspace packages that expose a `dev` script (apps/web, apps/widget, packages/backend).

Run a single package
- Web app (local):
```bash
pnpm --filter web dev
# or
cd apps/web && pnpm dev
```

- Widget app (local):
```bash
pnpm --filter widget dev
# or
cd apps/widget && pnpm dev
```

- Convex backend (local):
```bash
pnpm --filter @workspace/backend dev
# or
cd packages/backend && pnpm run dev
```
The backend package also provides `pnpm --filter @workspace/backend run setup` which runs `convex dev --until-success` to ensure Convex is ready.

Build / start for production
- Build everything (uses Turborepo):
```bash
pnpm build
```

- Build and start a Next.js app individually:
```bash
# Build
cd apps/web && pnpm build
# Start
cd apps/web && pnpm start
```

Linting / formatting / type-check
```bash
pnpm lint          # runs turbo lint across workspace
pnpm format        # runs prettier across repo
# Typecheck a workspace package (examples)
pnpm --filter web run typecheck
pnpm --filter widget run typecheck
```

Project structure (high-level)
- apps/
  - web/        — main dashboard (Next.js)
  - widget/     — embeddable widget (Next.js)
- packages/
  - backend/    — Convex functions, schema, Agents configuration
  - ui/         — shared UI components, CSS and hooks
  - math/       — example utility package
  - eslint-config, typescript-config — reusable configs
- turbo.json, pnpm-workspace.yaml — monorepo tooling

Key files and why they matter
- apps/web/app/layout.tsx — top-level layout; Note: this includes ClerkProvider for authentication.
- apps/widget/modules/widget/hooks/use-vapi.ts — hook that connects to @vapi-ai/web for voice calls in the widget.
- packages/backend/convex/schema.ts — Convex database schema and indices.
- packages/backend/convex/system/ai/agents/supportAgent.ts — Agent configuration that uses @ai-sdk/google for chat (Gemini model).
- apps/*/next.config.mjs — both apps transpile the shared UI package: transpilePackages: ["@workspace/ui"].

Environment variables (example .env.local)
Create .env.local at the repo root or next to the app you run. The repository does not include a concrete .env file, so fill these with your values:

```
# Authentication (Clerk)
CLERK_JWT_ISSUER_DOMAIN=your-clerk-issuer
CLERK_API_KEY=pk_live_...

# Convex (if using remote Convex)
# CONVEX_URL or check your convex CLI / project settings
CONVEX_ROOT_URL=...

# Google AI (Gemini) credentials - follow @ai-sdk/google docs
GOOGLE_API_KEY=your_google_api_key
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-credentials.json

# VAPI (voice) — Widget voice provider
VAPI_API_KEY=your_vapi_api_key

# Next.js runtime env preview
NEXT_PUBLIC_SOME_KEY=...
```

Notes:
- The exact variable names used by third-party packages (Clerk/Google/VAPI/Convex) may differ; consult each provider's docs and the code in packages/backend and apps for what the app expects.
- Convex uses its own local dev setup (convex dev). If you plan to deploy Convex, follow Convex docs to set up tokens and remote deployment.

Voice integration (widget)
- The widget uses the package @vapi-ai/web. The hook lives at:
  apps/widget/modules/widget/hooks/use-vapi.ts
- Basic usage (conceptual):
  - Instantiate the Vapi client with an API key or token.
  - Listen for events: call-start, speech-start, speech-end, message (transcripts).
  - Call start() and stop() to control the call.

Example snippet (based on use-vapi hook logic):
```ts
import Vapi from '@vapi-ai/web';

const vapi = new Vapi(process.env.VAPI_API_KEY);
vapi.on("speech-start", () => { /* show speaking UI */ });
vapi.on("message", (m) => {
  if (m.type === "transcript" && m.transcriptType === "final") {
    // append final transcript
  }
});
vapi.start(); // start a call
vapi.stop();  // end a call
```

Convex and Agents
- The backend uses Convex serverless functions and schema (packages/backend/convex).
- AI Agent:
  - packages/backend/convex/system/ai/agents/supportAgent.ts configures an Agent that uses @ai-sdk/google with model "gemini-2.0-flash".
  - This Agent is mounted into the Convex app via packages/backend/convex/convex.config.ts.
- To run Convex locally:
```bash
# from repo root via pnpm filter
pnpm --filter @workspace/backend dev
# or
cd packages/backend && pnpm run dev
```
- To deploy agents & functions, follow Convex's deployment docs. Ensure your AI provider credentials are set in the environment where Convex runs.

Shared UI package (design system)
- packages/ui contains a set of reusable components (Radix + Tailwind) and exports:
  - ./globals.css
  - ./components/*
  - ./hooks/*
- To use a component from another package/app:
```ts
import { Button } from "@workspace/ui/components/button";
```
Note: Next.js apps transpile this package (next.config.mjs uses transpilePackages), so importing directly works in both apps.

Developer workflows & tips
- Add a new UI component
  - Add a file in packages/ui/src/components/
  - Export it (packages/ui's package.json exports are set to map "./components/*")
  - In apps, import from "@workspace/ui/components/your-component"
- Run linter across the repo:
```bash
pnpm lint
```
- Fix formatting:
```bash
pnpm format
```

Testing
- There are no repository-wide automated tests included by default. If you add tests, integrate them into turbo.json tasks so `pnpm test` or `pnpm build` can depend on them.

Troubleshooting & FAQ
- Q: pnpm dev fails with convex errors
  - A: Ensure convex CLI is installed and available in PATH or run Convex from within its workspace (cd packages/backend && pnpm run dev). Check Convex docs for login and project setup.
- Q: Widget voice not working locally
  - A: Make sure VAPI credentials are configured in the environment visible to the widget. Check the browser console for network or CORS errors.
- Q: Clerk auth failing in web app
  - A: Verify Clerk env values and client keys. The web layout uses ClerkProvider in apps/web/app/layout.tsx — you must provide keys in runtime env for Clerk.

Contributing
- Quick process
  1. Fork the repo and create a branch: feat/your-feature or fix/issue-id.
  2. Run tests/lint/format locally and ensure typecheck passes.
  3. Open a PR with a clear title and description referencing any related issues.

- PR checklist (please run before opening PR)
  - [ ] Ran `pnpm install` and `pnpm dev` (or the relevant package dev) to validate changes.
  - [ ] Ran `pnpm format` and `pnpm lint` to fix style issues.
  - [ ] Type checks pass: `pnpm --filter <package> run typecheck` where applicable.
  - [ ] Added / updated docs or README sections for user-visible changes.
  - [ ] If adding a new package, update `pnpm-workspace.yaml` and `turbo.json` as needed.
  - [ ] For UI changes, include screenshots or short instructions in the PR description.

- Branch and commit guidance
  - Branch naming: feat/<short-description>, fix/<short-description>, chore/<short-description>.
  - Commit messages: follow Conventional Commits style (recommended): feat:, fix:, docs:, chore:, refactor:, test:, perf:.
  - Keep commits focused and small; squash when merging if appropriate.

- Review & maintainers
  - Assign reviewers and request at least one approving review before merge.
  - Use labels to indicate status: area/ui, area/backend, blocked, review-needed, docs, good-first-issue.
  - Consider adding MAINTAINERS.md or a GOVERNANCE section if this becomes a community project.

- Security & disclosure
  - Add SECURITY.md in .github to instruct how to report vulnerabilities.
  - Do not commit secrets. Use environment variables or encrypted secret storage for CI.

- Creating release / publishing
  - If packages are published to npm, use semantic versioning and a changelog (CHANGELOG.md) or use GitHub Releases for notes.
  - Automate builds/test/lint on CI (GitHub Actions) before publishing.

Where to look in code
- apps/web — Next.js dashboard (app router)
- apps/widget — Widget UI, embeds voice hook (use-vapi.ts)
- packages/backend — Convex server functions, system agent integrations, schema
- packages/ui — Design system components and styles

License
- No license file included in the repository. Add a LICENSE file if you plan to open source (MIT is a common choice). If you add a license, update the badge at the top of this README.

Useful commands summary
```bash
pnpm install         # install deps for workspace (run from root)
pnpm dev             # start dev for all (turbo dev)
pnpm --filter web dev       # start only web
pnpm --filter widget dev    # start only widget
pnpm --filter @workspace/backend dev  # start only Convex backend
pnpm build           # build (turbo build)
pnpm lint            # lint all workspaces
pnpm format          # prettier format
```

Final notes
- This monorepo is opinionated for a real-time conversational product: Convex for realtime & Agents, Google AI integration for assistant, VAPI for voice, and Clerk for auth. When deploying to production, ensure you store secrets in your hosting environment and follow Convex/Clerk/VAPI provider guides for production credentials.

If you want, I can:
- Add a sample .env.example file to the repo with the environment keys above.
- Create a step-by-step Convex local setup guide (commands + expected output).
- Generate a CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, and a PR checklist that you can add to .github/ templates.
- Draft a simple GitHub Actions workflow for lint/build checks.
