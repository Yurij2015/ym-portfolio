# Spec Delta

## Purpose

Automated tests that guarantee content integrity across locales and the integrity of the SEO surface (sitemap, icon links) — so content edits and config changes fail in CI instead of silently breaking production.

## ADDED Requirements

### Requirement: every localized content file matches its schema

Each locale's `index.yml`, `about.yml`, `projects.yml` and every `projects/*.yml` SHALL be validated against the corresponding Zod schema from `content.schemas.ts`.

#### Scenario: all content files are schema-valid

- **WHEN** the content unit spec runs
- **THEN** every `content/<locale>/*.yml` file parses and satisfies its schema for all three locales (uk, en, pl)

### Requirement: project slugs stay in parity across locales

All locales SHALL define the same set of project slugs — a project page must exist in every locale or in none.

#### Scenario: slug sets are identical

- **WHEN** the content spec compares `content/<locale>/projects/` file lists
- **THEN** uk, en and pl expose the same slugs

### Requirement: about-page images are site-local

`about.yml` images SHALL reference local paths under `public/` (src starting with `/`), not external URLs — regression guard against hotlinked stock photos.

#### Scenario: external image URL is rejected

- **WHEN** an `about.yml` image `src` does not start with `/`
- **THEN** the content spec fails

### Requirement: sitemap lists every localized route

`GET /sitemap.xml` SHALL return 200 XML listing `/`, `/about`, `/projects` and every content-derived `/projects/<slug>` URL for all locales, each with hreflang alternates including `x-default` and an ISO-8601 `lastmod`.

#### Scenario: sitemap reflects content

- **WHEN** `/sitemap.xml` is requested
- **THEN** it contains one `<url>` per locale per route, alternates for uk-UA/en-US/pl-PL/x-default, and a `<lastmod>` that parses as ISO-8601

### Requirement: every page exposes a complete icon set

Each page's `<head>` SHALL include an SVG icon, an `.ico` fallback, and an `apple-touch-icon`; each referenced file SHALL resolve with HTTP 200.

#### Scenario: icon files exist

- **WHEN** the e2e spec reads the icon links from a rendered page
- **THEN** all three link types are present and each `href` returns 200
