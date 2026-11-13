## 1. Content model
- [x] 1.1 `serviceSchema` in `content.schemas.ts`
- [x] 1.2 `services_{uk,en,pl}` collections in `content.config.ts`

## 2. Pages & navigation
- [x] 2.1 `app/pages/services/index.vue` — grouped cards, SEO meta, OG
- [x] 2.2 `app/pages/services/[slug].vue` — hero, deliverables, process, MDC article, related projects/tech, FAQ, CTA; 404 on unknown slug
- [x] 2.3 JSON-LD: Service + BreadcrumbList + FAQPage
- [x] 2.4 "Services" nav item (`app/utils/links.ts` + spec)
- [x] 2.5 i18n `services.*` + `nav.services` — ALL THREE LOCALES

## 3. Content — first batch (ALL THREE LOCALES)
- [x] 3.1 `laravel-development` uk/en/pl
- [x] 3.2 `laravel-upgrade` uk/en/pl
- [x] 3.3 Remaining 14 services written (uk/en/pl)

## 4. Discovery
- [x] 4.1 sitemap: `/services` + service slugs
- [x] 4.2 routeRules: `/services`, `/services/**` ISR

## 5. Verification
- [x] 5.1 Schema parity spec for services
- [x] 5.2 Update `e2e/sitemap.spec.ts` URL count
- [x] 5.3 lint + typecheck; manual check on :3002

## 7. Directions: development / support (ALL THREE LOCALES)
- [x] 7.1 `serviceSchema.group` → `development | support`; remap all 48 service files (10 development, 6 support per locale)
- [x] 7.2 Extend `services.yml` schema: overview title/description/intro/indexable + `directions.{development,support}` with title, description, intro, featured slugs, indexable
- [x] 7.3 Unit tests: direction parity, featured slugs exist and belong to their direction, no service slug equals a direction slug
- [x] 7.4 `/services` overview page: intro, two direction blocks with featured services and links, CTA, SEO/OG, robots from `services.yml`
- [x] 7.5 `/services/development` and `/services/support` pages (shared component): intro, full list, SEO/OG, BreadcrumbList, robots from `services.yml`
- [x] 7.6 Service detail breadcrumbs and BreadcrumbList go through the direction page
- [x] 7.7 Sitemap + routeRules include both direction pages; update `e2e/sitemap.spec.ts` URL count (+6)
- [x] 7.8 Write overview and direction copy uk → en/pl with the new headings; update i18n keys (`services.groups.*` etc.)

## 8. Admin panels service (ALL THREE LOCALES)
- [x] 8.1 Rename `filament-admin-panels` → `admin-panels` in uk/en/pl; update all references
- [x] 8.2 Rewrite copy: Filament / Flowbite / AdminLTE with when-to-choose guidance; examples per the proposal's admin-panel proof rule; FAQ «Filament, Flowbite чи AdminLTE?»
- [x] 8.3 Related projects: digispace, digipulse, netpostpanel, vetspace; technologies: filament, laravel, php, tailwindcss, vue, nuxt
- [x] 8.4 Check no client names, domains, third-party platform names or repository names appear in any locale

## 9. Verification of sections 7–8
- [x] 9.1 Validate YAML/schema and locale parity; lint + typecheck (in background, logged)
- [x] 9.2 Refresh `docs/services-copy-uk.md`
- [x] 9.3 Manual check on the running dev server: overview, both direction pages, breadcrumbs, admin-panels page

## 6. Editorial revision (ALL THREE LOCALES)
- [x] 6.1 Prepare the editorial prompt before changing service copy
- [x] 6.2 Rewrite technology and upgrade services page by page (uk/en/pl)
- [x] 6.3 Rewrite product and integration services page by page (uk/en/pl)
- [x] 6.4 Rewrite audit, stabilization, performance and engagement services (uk/en/pl)
- [x] 6.5 Validate YAML/schema, locale parity, prices, links and rendered service content on :3002
- [x] 6.6 Hold indexing of service lists and details with robots meta and X-Robots-Tag in all locales until user review
- [x] 6.7 Expose per-locale Studio indexing toggles for service lists and details, default false, controlling both meta and response headers
- [x] 6.8 Refine all service leads, concrete deliverables and budget explanations (uk/en/pl); strengthen team-engagement experience and refresh the Ukrainian review document

Second editorial pass (2026-11-11): all 48 leads revised, first deliverables made concrete, closing paragraphs made service-specific, starting budgets explained without adding fixed package promises. Laravel FAQ clarifies the $2,400 reference; team-engagement copy describes commercial and own-product experience. Isolated schema and page-setup indexing checks pass; indexing flags, prices, ordering and relationships are unchanged. Runtime remains unchecked because :3002 refuses connections.

Indexing toggle verification (2026-11-11): isolated checks execute both actual page setup scripts for true/false/missing values in all three locales and verify matching robots meta and response headers. All 48 service files and 3 list settings validate with indexing disabled; missing values default to false and strings are rejected. Targeted ESLint passes; Nuxt typecheck exits 0 with the existing plugin/OG warnings. UI/runtime checks still require the user's running :3002 server. See `docs/service-indexing.md`.

Editorial validation (2026-11-11): all 48 YAML files pass the actual serviceSchema in an isolated Node process; locale slug/array parity, unchanged base prices and relationships, meta lengths, project/technology references and legacy-copy checks pass. Runtime rendering remains unchecked: localhost:3002 refused connections. No dev server or Vitest run was started.

ESLint completed with 0 errors and 2 warnings in the existing project pages. Nuxt typecheck exited 0 with an unresolved `vue-router/volar/sfc-route-blocks` plugin warning and the OG JPEG warning; this is not a clean warning-free check. OpenSpec strict validation passed. Ukrainian review copy: `docs/services-copy-uk.md`.

Directions and admin panels (2026-11-13): services split into development (10) and support (6) per locale; `/services` is an overview with featured services, `/services/development` and `/services/support` are direction pages, detail breadcrumbs and BreadcrumbList pass through the direction. `filament-admin-panels` renamed to `admin-panels` and rewritten for Filament, Flowbite and AdminLTE; AdminLTE panels and the photo-gallery service are described by function only, with no client, platform, domain or repository names (grep check clean). An isolated Node run of the real schemas passes for all 48 service files and 3 `services.yml` files: slug, direction, price and featured parity, technology/project references, meta lengths ≤160, no Cyrillic in en/pl. ESLint exits 0 (2 existing warnings in project pages); Nuxt typecheck exits 0. On the user's running dev server (port 3000, not 3002) all 57 service URLs across three locales return 200, an unknown slug returns 404, the sitemap has 156 URLs including both direction pages in each locale, and robots headers stay `noindex, follow`. Not run: Vitest (the dev server is up) and Playwright e2e, so the new unit tests in `content.config.spec.ts` and the updated `e2e/sitemap.spec.ts` are unexecuted. Pages were checked through HTTP responses, not visually in a browser.
