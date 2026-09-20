## 1. Content model

- [x] 1.1 Add `technologySchema` to `content.schemas.ts` (title, description, icon, category enum, projects, content; optional since/links/faq/updated) — `pnpm typecheck` passes
- [x] 1.2 Register `technologies_{uk,en,pl}` collections in `content.config.ts` (`content/<locale>/technologies/*.yml`, type `data`) — dev server on :3002 serves the new collection after `touch content.config.ts`
- [x] 1.3 Create `app/utils/technologies.ts`: `techSlugFromImage(src)` (shared by carousel) and `techSlugForName(name)` (stack chips, alias table) — covered by a unit test in `app/utils/technologies.spec.ts`

## 2. Content — 23 technologies × 3 locales

- [x] 2.1 Author `content/en/technologies/*.yml` for all 23 slugs (php, laravel, symfony, filament, vue, nuxt, typescript, tailwindcss, vite, docker, terraform, digitalocean, hetzner, proxmox, caddy, github-actions, hostinger, go, postgresql, mysql, redis, cloudflare, stripe) — each ~2500–3500 chars, direct-answer lead, `projects` slugs verified against `content/en/projects/`
- [x] 2.2 Translate to `content/uk/technologies/*.yml` — same slugs/fields, natural Ukrainian
- [x] 2.3 Translate to `content/pl/technologies/*.yml` — same slugs/fields, natural Polish
- [x] 2.4 Parity check: identical slug sets + schema-valid files across all three locales (extend `content.config.spec.ts` or add a spec)

## 3. Pages

- [x] 3.1 `app/pages/technologies/index.vue` — hero + category-grouped card grid linking to detail pages; SEO meta + OG image — renders all 23 cards per locale
- [x] 3.2 `app/pages/technologies/[slug].vue` — icon hero, MDC article, resolved project cards (missing slugs skipped), FAQ accordion when present, `UPageCTA` bottom with `{tech}`-interpolated headline; 404 on unknown slug
- [x] 3.3 JSON-LD `@graph` in `[slug].vue`: Article + BreadcrumbList (+ FAQPage when `faq` exists) — validates in page source
- [x] 3.4 i18n keys `technologies.*` (index title/description, category labels, `ctaTitle` with `{tech}` placeholder, back link, "used in projects" label) in all three `i18n/locales/*.json`; index page ends with `UPageCTA` reusing `projectsCta.*`

## 4. Internal linking

- [x] 4.1 Hero carousel: wrap icon in `NuxtLink` → `localePath('/technologies/<slug>')` via `techSlugFromImage` — click navigates, drag still works, tooltip kept
- [x] 4.2 Project pages (index + detail): stack chips link via `techSlugForName` when a tech page exists — chips without a match stay plain

## 5. Imagery

- [x] 5.1 `scripts/generate-tech-banners.mjs`: renders `public/tech/<slug>.svg` (brand gradient + existing tech logo) for all 23 slugs — files generated, look right in browser
- [x] 5.2 Wire banner into `[slug].vue` hero and index cards — every tech page shows its banner
- [x] 5.3 Tech-specific OG template (icon + title) via `defineOgImage` — `og:image` differs per tech page

## 6. Discovery & SEO infra

- [x] 6.1 `server/routes/sitemap.xml.get.ts`: add `/technologies` + tech slugs; `lastmod` = max(project dates, tech `updated`) — `/sitemap.xml` contains all new URLs
- [x] 6.2 `nuxt.config.ts` routeRules: `/technologies` + `/technologies/**` ISR — routes still SSR/ISR correctly

## 7. Tests & verification

- [x] 7.1 Update `e2e/sitemap.spec.ts` URL count formula and add tech-slug assertions — passes
- [x] 7.2 New e2e spec (or extend existing): tech index lists cards, detail page renders article + CTA + banner, carousel icon navigates, unknown slug → 404 — passes locally via `pnpm test:e2e`
- [x] 7.3 Lint + typecheck + unit tests green (`pnpm lint`, `pnpm typecheck`, `pnpm test` — only when dev server is stopped per AGENTS.md)
- [x] 7.4 Manual check on :3002: `/technologies`, `/en/technologies/laravel`, `/pl/technologies/docker` render; OG image URL returns an image
