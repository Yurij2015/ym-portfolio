## Why

Hire-intent searches for PHP work are framed as services ("Laravel development", "Symfony upgrade", "PHP code audit", "hire Laravel developer"), not as technologies. Leading Laravel/Symfony agencies on Clutch (Accesto, Polcode, Tighten, The Software House) each run one substantial page per service — modernization/upgrades and legacy rescue first, then build services, team extension and AI integration. The portfolio has technology pages but no service pages, so it has nothing to rank for these queries.

## What Changes

- New `services_{uk,en,pl}` collections — `content/<locale>/services/<slug>.yml`, one full service page per slug (not templated variants).
- New `serviceSchema`: title, description (meta), summary (direct-answer lead), icon, group, order, priceFrom, timeline, deliverables, process steps, related technologies + projects, MDC article, FAQ, updated.
- Services are split into two directions, `development` and `support` (the `group` enum replaces `technology | modernization | build | engagement`):
  - development (10): laravel-development, symfony-development, php-development, laravel-saas-development, laravel-vue-nuxt, api-development, payment-integration, ai-integration, admin-panels, hire-laravel-developer
  - support (6): laravel-upgrade, symfony-upgrade, php-code-audit, legacy-php-rescue, performance-optimization, support-maintenance
- `/services` is an overview page: intro, one block per direction with its own description and 3–4 featured services, CTA. It is not a bare link page.
- `/services/development` and `/services/support` are direction pages: own intro and the full list of that direction's services.
- Service detail URLs stay flat at `/services/[slug]`; the hierarchy is shown in breadcrumbs (Services → Direction → Service).
- Headings (uk): overview «Розробка й підтримка PHP-проєктів на Laravel і Symfony»; development «Розробка на PHP, Laravel і Symfony»; support «Підтримка й оновлення PHP-проєктів на Laravel і Symfony». en/pl are localized, not word-for-word.
- Overview and direction copy (title, description, intro, featured slugs, indexable) live in `content/<locale>/services.yml` so they are Studio-editable.
- `filament-admin-panels` becomes `admin-panels` («Адмін-панелі для PHP та Laravel-застосунків»): Filament, Flowbite (Tailwind) and AdminLTE (Bootstrap) as three ways to build a panel, with when-to-choose guidance and an FAQ on choosing between them.
- `/services/[slug]` detail page with deliverables, process, article, related projects/technologies, FAQ, CTA.
- JSON-LD: `Service` (provider = Person, offer with minPrice) + `BreadcrumbList` + `FAQPage`.
- Header nav gets a "Services" item; sitemap and ISR route rules include `/services/**`, including both direction pages.
- First batch: `laravel-development`, `laravel-upgrade` in uk/en/pl for review; remaining 14 services follow after sign-off.

## Content rules

- Every page is written for its own service: own problem, process, deliverables, prices and FAQ. No city/keyword permutations.
- Proof comes from the author's own products (VetSpace, VetCard, DigiPulse, NetPostPanel, DigiSpace). Client work is described only by domain — e.g. high-load ticketing for sports and cultural events, museums and exhibitions (Symfony 4.4–7.4, PHP 8.0–8.4) — never by client or event name.
- Admin panel proof: Filament — DigiSpace, DigiPulse; Flowbite — NetPostPanel (Laravel + Inertia) and the VetSpace clinic panel (Nuxt + flowbite-vue), linked as portfolio projects, plus a photo-gallery service for photographers (described by domain only); AdminLTE — two Laravel panels described only by what they do: an analytics panel for an agency (scheduled data collection from an external service's API, statistics, costs, export) and a panel for collecting and filtering social-network data (task queues, proxy rotation, browser automation). No client names, domains, third-party platform names, repository names or links for this work.
- Name technologies without unsupported claims about the latest version. Agree target versions after checking dependencies.
- Preserve existing base prices as starting estimates for an agreed scope; do not invent packages, availability guarantees or SLA terms.
- Editorial revision follows `docs/service-copy-editing-prompt.md`: concise first-person copy, distinct service scope, verified project context, natural uk/en/pl localization. Code examples and fixed article lengths are not required.
- The overview, both direction pages and every service detail have a Studio-editable `indexable` boolean per locale, initially false. Both robots meta and X-Robots-Tag follow this field. Overview and direction settings live in `content/<locale>/services.yml`; detail settings live with each service. No global header may override editor approval.

## Non-goals

- No location pages, no keyword-permutation pages.
- No blog system.
- No changes to existing technology/project pages beyond adding links.
- No new technology pages for Flowbite, Bootstrap or AdminLTE.
- No nested service URLs (`/services/<direction>/<slug>`).

## Impact

- `content.schemas.ts`, `content.config.ts`, `content.config.spec.ts`
- `content/{uk,en,pl}/services/*.yml`
- `content/{uk,en,pl}/services.yml` (overview + direction copy), `content/{uk,en,pl}/services/filament-admin-panels.yml` → `admin-panels.yml`
- `app/pages/services/index.vue`, `app/pages/services/development.vue`, `app/pages/services/support.vue` (or a shared direction component), `app/pages/services/[slug].vue`
- `docs/services-copy-uk.md` (review copy)
- `app/utils/links.ts` (+ spec), `i18n/locales/*.json`
- `server/routes/sitemap.xml.get.ts`, `e2e/sitemap.spec.ts`, `nuxt.config.ts` routeRules
