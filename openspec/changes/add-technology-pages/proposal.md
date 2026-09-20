## Why

The portfolio has no organic-search surface beyond the homepage, about and six project pages. Dedicated per-technology pages (`/technologies/laravel`, `/technologies/nuxt`, …) target hire-intent queries ("Laravel developer", "Nuxt freelancer") in all three locales, turn the homepage tech carousel into internal links, and give every claim a proof anchor (projects using that tech). Content follows the ai-seo/copywriting/schema skills used on the author's other projects.

## What Changes

- New `technologies_{uk,en,pl}` content collections — `content/<locale>/technologies/<slug>.yml` for all 23 technologies shown in the homepage hero carousel (php, laravel, symfony, filament, vue, nuxt, typescript, tailwindcss, vite, docker, terraform, digitalocean, hetzner, proxmox, caddy, github-actions, hostinger, go, postgresql, mysql, redis, cloudflare, stripe).
- New `technologySchema` in `content.schemas.ts`: `title`, `description` (meta), `icon`, `category`, `since`, `projects` (explicit project slugs), `links`, `content` (article ~2500–3500 chars), optional `faq`.
- New index page `/technologies` — tech grid grouped by category.
- New detail page `/technologies/[slug]` — icon hero with a 40–60 word direct-answer block, MDC article, "projects using this tech" list resolved from `projects_{locale}`, optional FAQ accordion, `UPageCTA` at the bottom.
- Hero carousel items become links to `/technologies/<slug>`; project stack chips link to matching tech pages when one exists.
- `sitemap.xml` gains `/technologies` + every tech slug; `lastmod` also considers tech `updated` dates.
- JSON-LD per tech page: `Article` (author = Person) + `BreadcrumbList` (+ `FAQPage` when `faq` present).
- Per-article visuals generated from code: a small script renders `public/tech/<slug>.svg` banners (brand gradient + the existing `tech-<slug>.svg` logo), shown in the detail-page hero and reused on index cards; a dedicated OG template stamps the tech icon + title for a unique social image per page (runtime, no assets committed for OG).
- i18n keys for section labels/CTA.
- E2E/unit tests updated: sitemap URL count + tech slugs, tech pages render, carousel/chip links.

## Capabilities

### New Capabilities

- `technology-pages`: SEO landing pages per technology — content model, index/detail routes, internal linking from hero carousel and project stack chips, sitemap + structured data integration.

### Modified Capabilities

(none — no existing specs)

## Non-goals

- No "Technologies" item in the top navigation — entry via homepage carousel, project stack chips and sitemap.
- No blog/articles system — tech pages are a closed set tied to the carousel, not an open-ended blog.
- No automatic project↔tech matching — the `projects` field is curated explicitly in each YAML.
- No new dependencies; `llms.txt`/`okf` and other AI-search files are out of scope for this change.

## Impact

- `content.config.ts`, `content.schemas.ts` — new collection + schema.
- 69 new content files: `content/{uk,en,pl}/technologies/*.yml` × 23.
- `app/pages/technologies/index.vue`, `app/pages/technologies/[slug].vue` — new.
- `app/components/landing/Hero.vue` — carousel items wrapped in `NuxtLink`.
- `app/pages/projects/index.vue`, `app/pages/projects/[slug].vue` — stack chips link to tech pages.
- `server/routes/sitemap.xml.get.ts` — tech routes added.
- `i18n/locales/{uk,en,pl}.json` — new `technologies.*` keys.
- `scripts/generate-tech-banners.mjs` (or similar) + 23 generated `public/tech/<slug>.svg` files; new OG image template for tech pages.
- `e2e/sitemap.spec.ts` (URL count, tech slugs, lastmod), possible new e2e spec for tech pages; unit tests for any new util (slug mapping).
- `nuxt.config.ts` `routeRules` — `/technologies/**` covered by existing `/**` per-locale rules (`/en/**`, `/pl/**`) plus explicit `/technologies` + `/technologies/**` for the default locale.
