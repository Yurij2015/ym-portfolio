// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt',
    'nuxt-studio'
  ],

  devtools: {
    enabled: true
  },

  // Google Analytics 4 — official gtag.js snippet, SSR-rendered into <head>
  // so Google's tag detector and crawlers see it in the raw HTML (a
  // client-side-only injection is invisible to them). Loaded only when a
  // measurement ID is configured via NUXT_PUBLIC_GTAG_ID. SPA navigations
  // are covered by GA4 "Enhanced measurement" (browser history events).
  app: {
    head: {
      script: process.env.NUXT_PUBLIC_GTAG_ID
        ? [
            {
              src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GTAG_ID}`,
              async: true
            },
            {
              innerHTML:
                'window.dataLayer = window.dataLayer || [];\n'
                + 'function gtag(){dataLayer.push(arguments);}\n'
                + 'gtag(\'js\', new Date());\n'
                + `gtag('config', '${process.env.NUXT_PUBLIC_GTAG_ID}');`
            }
          ]
        : []
    }
  },

  css: ['~/assets/css/main.css'],

  content: {
    experimental: {
      sqliteConnector: 'better-sqlite3'
    }
  },
  buildDir: '.nuxt',

  compatibilityDate: '2026-06-30',

  // Nitro 2.13.4's prerender step corrupts the final build for any
  // non-static preset (server bundle + client `_nuxt/*` assets end up
  // missing from `.output`), regardless of which/how many routes are
  // prerendered — this also happens with zero explicit prerender config,
  // since @nuxt/content unconditionally marks its SQL-dump routes for
  // prerendering. Disabling prerendering entirely avoids the bug; the
  // trade-off is every page is now rendered dynamically on each request
  // instead of served as static HTML.
  nitro: {
    preset: 'vercel',
    hooks: {
      'prerender:routes': (routes: Set<string>) => {
        routes.clear()
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    locales: [
      {
        code: 'uk',
        iso: 'uk-UA',
        name: 'Українська'
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English'
      },
      {
        code: 'pl',
        iso: 'pl-PL',
        name: 'Polski'
      }
    ],
    defaultLocale: 'uk',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    bundle: {
      optimizeTranslationDirective: false
    },
    vueI18n: './i18n.config.ts'
  },

  // zeroRuntime bakes OG images during the prerender crawl — but prerendering
  // is disabled above (see the nitro hook comment), so with zeroRuntime on,
  // no images ever get generated and og:image is silently omitted.
  ogImage: {
    zeroRuntime: false
  }
})
