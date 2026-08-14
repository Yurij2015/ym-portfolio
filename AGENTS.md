# Agent Rules

## Dev server

- **NEVER start the dev server** (`pnpm dev` / `nuxt dev`) — the user runs it themselves.
- The project dev server is already running at **http://localhost:3002** — use it for all runtime checks (curl, e2e, OG images).
- **Do not run `pnpm test` (vitest) while the dev server is running**: both processes write to the same `.data/content/contents.sqlite`, the DB gets partially rebuilt and pages return 404. If that happens: `touch content.config.ts` or restart the dev server.
- Run long checks (curl loops, typecheck, build) in the background with output logged to /tmp — synchronous runs exceed the command timeout.

## Build / deploy

- Production: Vercel (Nitro `vercel` preset), prerendering disabled (Nitro 2.13.4 bug), OG images are generated at runtime (`ogImage.zeroRuntime: false`).
- Env vars: `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_GTAG_ID` (GA4, optional), `NUXT_OG_IMAGE_SECRET` (stable OG URL signatures across deploys).
