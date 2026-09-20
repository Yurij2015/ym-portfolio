# Tasks

## 1. Unit tests — content integrity

- [x] 1.1 Extend `content.config.spec.ts`: validate `index.yml` (indexSchema), `about.yml` (aboutSchema), `projects.yml` (pagesSchema) for uk/en/pl — verify: `pnpm test` passes and fails if a schema is violated (touches all three locales)
- [x] 1.2 Add cross-locale parity test: identical slug sets in `content/*/projects/` — verify: test fails when a project file exists in one locale only
- [x] 1.3 Add about-images guardrail: every `about.yml` image `src` starts with `/` — verify: test fails on external URL

## 2. E2E — SEO surface

- [x] 2.1 New `e2e/sitemap.spec.ts`: 200 + `application/xml`, hreflang alternates incl. `x-default`, project URLs from content (assert each `content/en/projects/*.yml` slug present), `lastmod` equals newest project date — verify: `pnpm test:e2e e2e/sitemap.spec.ts` green against dev server
- [x] 2.2 New `e2e/head-meta.spec.ts`: rendered page `<head>` has svg icon + ico fallback + apple-touch-icon links, each href returns 200 — verify: e2e green

## 3. Verification

- [x] 3.1 `pnpm exec eslint .` clean
- [x] 3.2 `pnpm test` green (unit suite; run only while dev server is down — shared sqlite)
- [ ] 3.3 `pnpm test:e2e` green on dev server (all specs incl. existing) — pending: dev server must be started by the user
