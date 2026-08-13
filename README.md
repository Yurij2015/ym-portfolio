# Yurii Mokryi — Portfolio

Personal portfolio of **Yurii Mokryi**, Senior Full-Stack PHP Developer.

Built with [Nuxt](https://nuxt.com) + [Nuxt UI](https://ui.nuxt.com) with content managed via [Nuxt Content](https://content.nuxt.com). Multilingual (Ukrainian by default, English, Polish) via `@nuxtjs/i18n`. Deployed on [Vercel](https://vercel.com).

## Features

- **Three locales**: `uk` (default), `en`, `pl` — configured in `nuxt.config.ts`
- **Content in Markdown/YAML**: pages, projects and profile are driven by `content/` without touching code
- **Nuxt Content with SQLite** (`better-sqlite3`) for fast content access
- **On-the-fly OG images** via `nuxt-og-image`
- **Animations** with `motion-v`, helpers from `@vueuse/nuxt`

## Stack

| Category | Technologies |
| --- | --- |
| Framework | Nuxt 4, Vue 3, TypeScript |
| UI | Nuxt UI v4, Tailwind CSS v4 |
| Content | Nuxt Content v3 (SQLite) |
| i18n | @nuxtjs/i18n |
| Deployment | Vercel (Nitro `vercel` preset) |

## Setup

```bash
pnpm install
```

## Development Server

```bash
pnpm dev
```

Server is available at `http://localhost:3000`.

## Production

```bash
pnpm build
```

Locally preview the production build:

```bash
pnpm preview
```

## Other Commands

```bash
pnpm lint          # ESLint
pnpm typecheck     # Type checks
pnpm test          # Unit tests (Vitest)
pnpm test:e2e      # E2E tests (Playwright)
```

## Structure

```
app/
  pages/        # index, about, projects
  components/   # UI components
  layouts/      # Layouts
content/
  uk/           # Ukrainian content (YAML + projects)
  en/           # English content
  pl/           # Polish content
locales/        # i18n messages
```

Content (texts, projects, experience) is edited in `content/<locale>/` and `locales/` — no component changes required.

## Deploy

The project is configured for [Vercel](https://vercel.com) (`vercel.json`, Nitro `vercel` preset). Required environment variable:

```env
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```
