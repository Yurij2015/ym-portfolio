import type { Page } from '@playwright/test'

/**
 * Nuxt SSR-renders the header before Vue hydration attaches its click
 * handlers, so a click that lands in that gap (common under parallel
 * workers) is silently swallowed. Waiting for network idle gives
 * hydration time to finish before the test starts interacting.
 */
export async function gotoAndWaitReady(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

/**
 * The language dropdown (Reka UI's DropdownMenu) sometimes swallows its
 * first click — the trigger button ends up focused/active but the menu
 * content never opens, only reliably fixed by a second click. Retrying
 * once here avoids flaky tests without masking a real navigation bug.
 */
export async function openLanguageMenu(page: Page) {
  const trigger = page.getByRole('button', { name: /current language/i })
  await trigger.click()
  try {
    await page.getByRole('menu').waitFor({ state: 'visible', timeout: 1500 })
  } catch {
    await trigger.click()
    await page.getByRole('menu').waitFor({ state: 'visible' })
  }
}
