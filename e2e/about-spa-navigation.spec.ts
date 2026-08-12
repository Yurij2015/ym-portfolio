import { expect, test } from '@playwright/test'
import { gotoAndWaitReady } from './utils'

test('about page renders its Markdown body after client-side navigation', async ({ page }) => {
  await gotoAndWaitReady(page, '/')

  // client-side nav, not a hard reload — this is exactly the path that broke
  // when @nuxtjs/mdc's transitive deps weren't hoisted (see content.config.ts history)
  await page.getByRole('navigation').getByRole('link', { name: 'Про мене' }).click()
  await expect(page).toHaveURL(/\/about$/)

  const main = page.locator('main')
  await expect(main).toContainText('Yurii Mokryi', { timeout: 10_000 })
  const bodyLength = await main.innerText()
  expect(bodyLength.length).toBeGreaterThan(200)
})
