# Dev server rules (portfolio-new-ym)

- **NEVER start the dev server** (`pnpm dev` / `nuxt dev`) — the user runs it themselves.
- The project dev server is already running at **http://localhost:3002** — use it for all runtime checks (curl, e2e).
- **Do not run `pnpm test`/vitest while the dev server is running**: both processes write to the same `.data/content/contents.sqlite` → the DB gets partially rebuilt (index/about/pages collections disappear, pages return 404). Fix: `touch content.config.ts` (or restart the dev server).
- Run long checks (9-route curl loops + typecheck) in the background via nohup into a /tmp log — synchronous runs exceed the command timeout.
- Production: Vercel, build via `pnpm build` (Nitro `vercel` preset), prerendering disabled (Nitro 2.13.4 bug), OG images generated at runtime (`ogImage.zeroRuntime: false`).
- Docs in this repo (AGENTS.md etc.) are written in English.
