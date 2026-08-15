# Agent Rules

## Git workflow

- **NEVER commit or push without the user's explicit permission for that specific change set.** Always show the change set (git status/diff summary) and ask before committing.

## Dev server

- **NEVER start the dev server** (`pnpm dev` / `nuxt dev`) — the user runs it themselves.
- The project dev server is already running at **http://localhost:3002** — use it for all runtime checks (curl, e2e, OG images).
- **Do not run `pnpm test` (vitest) while the dev server is running**: both processes write to the same `.data/content/contents.sqlite`, the DB gets partially rebuilt and pages return 404. If that happens: `touch content.config.ts` or restart the dev server.
- Run long checks (curl loops, typecheck, build) in the background with output logged to /tmp — synchronous runs exceed the command timeout.

## Build / deploy

- Production: Vercel (Nitro `vercel` preset), prerendering disabled (Nitro 2.13.4 bug), OG images are generated at runtime (`ogImage.zeroRuntime: false`).
- **Production URL: https://yuriimokryi.vercel.app/** (Vercel project `digispace-projects/portfolio-template`; `ym-portfolio.vercel.app` and `aktpf.vercel.app` are unrelated/old projects — do not use them for verification).
- Deploy = push to `origin/main` (Vercel auto-builds); check status with `vercel ls`.
- Env vars: `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_GTAG_ID` (GA4, optional), `NUXT_OG_IMAGE_SECRET` (stable OG URL signatures across deploys).

## Custom agents

Project-scoped agent definitions live in `.cline/agents/` (Cline Agents tab) and `.claude/agents/` (Claude Code), kept in sync:

- `og-seo-checker` — verifies OG/SEO meta + rendered OG images for all 9 routes/locales (report-only).
- `content-translator` — syncs content uk → en/pl keeping `content.schemas.ts` parity.
- `code-reviewer` — read-only review of diffs against repo conventions.
- `test-runner` — runs lint/typecheck/unit/e2e in the right order under the dev-server constraints.
