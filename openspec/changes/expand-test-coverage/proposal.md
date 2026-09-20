# Proposal

## Why

Recent changes (rewritten project content, dynamic sitemap, ISR route rules, custom favicon, real testimonial, SystemFreaks description) shipped without test coverage. Unit tests currently validate only `content/*/projects/*.yml` against schemas — `index.yml`, `about.yml`, `projects.yml` and the sitemap route are unverified. A stale nav-links spec was already caught failing, which shows the gaps are real.

## What Changes

- Extend content unit tests: validate `index.yml`, `about.yml`, `projects.yml` per locale against their Zod schemas (today only `projects/*.yml` are covered).
- Add cross-locale parity check: identical project slug sets in uk/en/pl.
- Guardrail: `about.yml` images must be site-local paths (no external hotlinks — regression guard for the Unsplash fix).
- New e2e spec for `/sitemap.xml`: 200 + XML content-type, hreflang alternates incl. `x-default`, project URLs derived from content (not hardcoded), valid ISO `lastmod`.
- New e2e spec for favicon/head: every page exposes svg icon, ico fallback, apple-touch-icon links, and each referenced file returns 200.

## Capabilities

### New Capabilities

- `testing`: automated verification requirements for content integrity (schema/parity/local assets) and SEO surface (sitemap, icon links).

### Modified Capabilities

(none)

## Non-goals

- Unit-testing Nitro route handlers directly — sitemap is covered via e2e instead.
- Visual regression, coverage thresholds, mutation testing.
- Re-enabling prerender or changing ISR config (covered by the previous change).

## Impact

- `content.config.spec.ts` (extended), `e2e/sitemap.spec.ts` (new), `e2e/head-meta.spec.ts` (new).
- No runtime code changes; CI gains coverage automatically via existing `pnpm test` / `pnpm test:e2e` steps.
