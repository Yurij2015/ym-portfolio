import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // `nuxt dev`'s on-demand Vite compilation handles concurrent requests
  // poorly — running fully parallel workers against a single dev server
  // causes navigation timeouts under contention, so tests run serially.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3002',
    locale: 'uk-UA',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /mobile\.spec\.ts$/
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: /mobile\.spec\.ts$/
    }
  ],
  webServer: {
    // e2e runs against `nuxt dev` rather than a production build: the
    // `vercel` nitro preset (see nuxt.config.ts) has no local `nuxt preview`
    // equivalent — its output is meant to run via Vercel's own runtime
    // (`vercel dev` / a preview deployment), not a plain Node process.
    command: 'pnpm run dev',
    url: 'http://localhost:3002',
    env: { PORT: '3002' },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
