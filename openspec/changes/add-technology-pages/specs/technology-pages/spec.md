## Purpose

SEO landing pages for every technology in the author's stack, reachable at `/technologies/<slug>` in all three locales, interlinked with the homepage carousel and project pages, and indexed via sitemap + structured data.

## ADDED Requirements

### Requirement: Localized technology content

Every technology MUST have a YAML content file in each of the three locales (`uk`, `en`, `pl`) under `content/<locale>/technologies/`. The slug is the file basename and MUST be identical across locales. Each file MUST provide: `title`, `description`, `icon`, `category`, `projects` (list of existing project slugs), and `content` (the article body). Optional fields: `since`, `links`, `faq`, `updated`.

#### Scenario: All carousel technologies have pages

- **WHEN** the set of technologies rendered in the homepage hero carousel is compared to the `technologies_en` collection
- **THEN** every carousel technology has a corresponding content file

#### Scenario: Locale parity

- **WHEN** the slug sets of `technologies_uk`, `technologies_en` and `technologies_pl` are compared
- **THEN** they are identical

#### Scenario: Article substance

- **WHEN** a technology article is rendered
- **THEN** its `content` leads with a short direct-answer paragraph describing what the technology is and how the author uses it, followed by experience/project evidence — not a generic technology definition only

### Requirement: Technology index page

`/<locale?>/technologies` MUST list all technologies of the current locale grouped by `category`, each rendered as a card linking to its detail page.

#### Scenario: Index renders grouped grid

- **WHEN** a visitor opens `/technologies` (or `/en/technologies`, `/pl/technologies`)
- **THEN** all technologies appear grouped under their category headings and each card navigates to `/technologies/<slug>`

### Requirement: Technology detail page

`/technologies/<slug>` MUST render: a hero with the technology icon, title and `description`; the article body; a list of the projects named in `projects` (each linking to its project page); an optional FAQ section; and a call-to-action block at the bottom offering to discuss a project that uses this technology — the CTA headline MUST name the technology (e.g. "Need a Laravel project?").

#### Scenario: Detail page renders fully

- **WHEN** a visitor opens `/technologies/laravel`
- **THEN** they see the hero, the article, the linked project cards, and a contact CTA at the bottom whose headline mentions "Laravel"

#### Scenario: Unknown slug returns 404

- **WHEN** a visitor opens `/technologies/<slug>` for a slug with no content file
- **THEN** the response is a 404 page

#### Scenario: Missing project slug does not break the page

- **WHEN** a technology's `projects` list names a slug absent from the projects collection
- **THEN** that entry is omitted and the page still renders

### Requirement: Internal linking to technology pages

Existing technology touchpoints MUST link to the detail pages: each homepage hero-carousel icon navigates to its technology page, and project stack chips link whenever a matching technology page exists.

#### Scenario: Hero carousel links

- **WHEN** a visitor clicks (not drags) a technology icon in the homepage hero carousel
- **THEN** they navigate to that technology's detail page in the current locale

#### Scenario: Project stack chips link

- **WHEN** a project page lists a stack item that maps to an existing technology page
- **THEN** the chip links to that technology page; stack items without a matching page remain non-interactive

### Requirement: Search and AI discovery

Technology pages MUST be crawlable and shareable: listed in `sitemap.xml` for all locales, each with unique metadata, canonical/hreflang alternates, an OG image, and JSON-LD structured data.

#### Scenario: Sitemap coverage

- **WHEN** `sitemap.xml` is generated
- **THEN** it contains `/technologies` and every `/technologies/<slug>` URL for all three locales with hreflang alternates and x-default

#### Scenario: Per-page SEO metadata

- **WHEN** a technology detail page is rendered
- **THEN** it has a unique `<title>`, meta description, canonical URL, hreflang alternates and an OG image

#### Scenario: Structured data

- **WHEN** a technology detail page is rendered
- **THEN** its JSON-LD includes `Article` (with the author as `Person`) and `BreadcrumbList`; when the file defines `faq` items, it also includes `FAQPage` matching the visible FAQ

### Requirement: Per-article imagery

Each technology MUST have a visual: a generated banner image rendered in the detail-page hero (and usable on index cards) plus a unique OG share image carrying the technology icon and title. Real project screenshots appear inside the "projects using this tech" section.

#### Scenario: Banner exists for every technology

- **WHEN** the technologies collection is compared to `public/tech/<slug>.svg` files
- **THEN** every technology slug has a generated banner

#### Scenario: Unique OG image per page

- **WHEN** a technology detail page is rendered
- **THEN** its `og:image` is generated for that technology (icon + title), not the generic site image
