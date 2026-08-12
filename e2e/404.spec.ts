import { expect, test } from '@playwright/test'

test('unknown route shows the error page with header and footer intact', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
})

test('unknown route under a non-default locale prefix also 404s cleanly', async ({ page }) => {
  const response = await page.goto('/en/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('navigation')).toBeVisible()
})
