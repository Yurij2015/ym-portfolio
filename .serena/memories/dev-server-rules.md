# Dev server rules (portfolio-new-ym)

- **NEVER start the dev server** (`pnpm dev` / `nuxt dev`) — the user runs it themselves.
- The project dev server is already running at **http://localhost:3002** — use it for all runtime checks (curl, e2e).
- **Do not run `pnpm test`/vitest while the dev server is running**: both processes write to the same `.data/content/contents.sqlite` → the DB gets partially rebuilt (index/about/pages collections disappear, pages return 404). Fix: `touch content.config.ts` (or restart the dev server).
- Run long checks (9-route curl loops + typecheck) in the background via nohup into a /tmp log — synchronous runs exceed the command timeout.
- Production: Vercel, build via `pnpm build` (Nitro `vercel` preset), prerendering disabled (Nitro 2.13.4 bug), OG images generated at runtime (`ogImage.zeroRuntime: false`).
- **Production URL: https://yuriimokryi.vercel.app/** (project `digispace-projects/portfolio-template`). `ym-portfolio.vercel.app` / `aktpf.vercel.app` — старі/чужі проєкти, НЕ використовувати для перевірок. Deploy = push в origin/main; статус через `vercel ls` (CLI автентифікований як yuriimokryi).
- Docs in this repo (AGENTS.md etc.) are written in English.
- Content YAML: ALWAYS quote strings that contain `: ` (colon+space) — unquoted they break parsing silently (page renders with null fields → 500). After many restarts the content DB can rebuild partially (missing tables → 404); fix with `touch content.config.ts`.
- OG (takumi) templates do NOT support CSS `filter` (blur-*) — rendering 500s; use plain translucent shapes instead.
