## Context

Content-driven Nuxt 4 portfolio: YAML collections per locale (`projects_<locale>`, `about_<locale>`, `pages_<locale>`) validated by Zod in `content.schemas.ts`, pages query via `queryCollection`, SEO extras (canonical/hreflang/OG url) are automatic via `useSeoExtras()` in the default layout, OG images via `defineOgImage('Portfolio', ...)`. The homepage hero already renders all 23 technologies as a `UCarousel` of `/hero/tech-<slug>.svg` icons — the slug is derivable from the filename (same mapping as `techTip()`). See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- `/technologies` index + `/technologies/<slug>` detail for all 23 carousel technologies, in uk/en/pl.
- Every page carries enough unique, first-person content (~2500–3500 chars) to be a real search result, not a thin doorway page.
- Internal links: carousel icons and project stack chips → tech pages; tech pages → project pages (both directions).
- Full SEO/AI surface: sitemap entries, Article + BreadcrumbList JSON-LD, optional FAQPage.

**Non-Goals:**
- No top-nav item, no blog system, no auto-matching of projects, no new dependencies (proposal.md).

## Decisions

### Slug = filename, English, shared across locales
`content/en/technologies/laravel.yml` → `/technologies/laravel`, `/en/technologies/laravel`, `/pl/technologies/laravel`. Same convention as projects (`stem`-based lookup). Alternative considered: localized slugs — rejected: breaks slug parity, complicates hreflang and cross-locale switching for no measurable gain.

### `projects` field is explicit, not derived
Each tech YAML lists project slugs (`projects: [vetspace, digipulse]`). Alternatives considered: matching `project.stack[].name`/`tags` to the tech title — rejected: names differ across locales and spellings ("Vue" vs "Vue.js", "Nuxt" vs "Nuxt 4"), producing silent mismatches. Explicit slugs are curated, ordered, and verified by tests.

### Stack chip → tech slug mapping
A small util (`app/utils/technologies.ts`) normalizes a stack/tag name to a slug (lowercase, strip dots/spaces/version, alias table e.g. `vue.js→vue`, `github actions→github-actions`) and the page links the chip only if a matching tech file exists. Reuses the same filename-derived slug the carousel uses, so one source of truth.

### Carousel links inside a draggable UCarousel
Wrap the `NuxtImg` in `NuxtLink` inside the existing `UTooltip`. Embla applies a click threshold, so a drag doesn't navigate; a plain click does. Tooltip stays. E2E covers a real click.

### Content model (`technologySchema`)
`title`, `description` (meta + hero lead, kept ≤160 chars), `icon`, `category` (enum: `backend`, `frontend`, `database`, `infrastructure`, `tools`), `projects` (`string[]`), `content` (markdown). Optional: `since` (year string, shown as "using since"), `links` (docs/site buttons), `faq` (`{label, content}[]` → accordion + FAQPage), `updated` (ISO date → sitemap lastmod input).

### Article structure (per ai-seo/copywriting skills)
Lead = 40–60 word direct answer ("what it is + how I use it"), then `## How I use it` / `## Experience` sections with first-hand specifics and named projects. ~2500–3500 chars per locale. CTA reuses `UPageCTA` + existing `contact.*` buttons (Telegram primary, email secondary); the headline is tech-specific via interpolation — `technologies.ctaTitle` = "Need a {tech} project?" / "Потрібен проєкт на {tech}?" / …, rendered as `t('technologies.ctaTitle', { tech: page.title })`. The `/technologies` index ends with the generic `projectsCta` block (same as projects index).

### Structured data
`useHead` JSON-LD `@graph` in `[slug].vue`: `Article` (headline, author `Person` Yurii Mokryi, `about` = tech name), `BreadcrumbList` (Home → Technologies → <tech>), `FAQPage` only when `faq` exists and matches visible content (schema skill: no markup for invisible content).

### Sitemap
Extend `server/routes/sitemap.xml.get.ts`: add `/technologies` to PATHS and append tech slugs like project slugs (query `technologies_en`). `lastmod` = max(project dates, tech `updated`/`date` fields) — keeps the honest-content-date rule.

### routeRules
Add `/technologies` + `/technologies/**` to `routeRules` for the default locale (`/en/**`, `/pl/**` already cover prefixed routes). Consistent with `/about`, `/projects/**`.

### Imagery — generated, not hand-made
Two layers, both produced from code:
1. **Banner per tech**: `scripts/generate-tech-banners.mjs` stamps the existing `/hero/tech-<slug>.svg` logo onto a subtle brand-tinted gradient (per-tech hue map in the script) → `public/tech/<slug>.svg`. 23 files, one run, re-runnable when the set changes. Used in the detail hero and on index cards. Alternatives considered: AI-generated raster art (inconsistent style, heavy files, licensing noise) and manual screenshots (no meaningful per-tech subject) — rejected.
2. **OG image per tech**: dedicated `nuxt-og-image` template variant rendering the tech icon + title + site name — unique share card per page, zero committed assets.
Project screenshots in the "projects using this tech" block already provide real-world imagery inside the article.

### Index page
One `UPageHero` + sections per category (backend/frontend/database/infrastructure/tools), each a grid of `UPageCard`s (icon + title + one-line `description`). Category labels come from `technologies.categories.*` i18n keys.

## Risks / Trade-offs

- [23 thin pages read as doorway/scaled content] → Mitigate: mandated length + structure, first-person experience, per-tech project links; `projects` curated so no page lacks proof.
- [Drag-vs-click regression in the carousel] → Embla click threshold + e2e click test; fallback: keep tooltip-only if conflicts appear.
- [Content DB stale after adding a collection] → Known workflow: `touch content.config.ts` rebuilds `.data/content/contents.sqlite` (AGENTS.md).
- [Locale parity drift over time] → Unit/e2e check comparing slug sets across the three collections.

## Migration Plan

Purely additive: new collection, pages, content; existing routes untouched. Rollback = revert the commit. After pulling, run `touch content.config.ts` once to rebuild the content DB.

## Open Questions

None blocking. (Whether `go`, `vite`, `hostinger` justify their own pages long-term can be revisited by looking at impressions in Search Console after a few weeks.)
