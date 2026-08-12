import { expect, test } from '@playwright/test'

test('project cards show a real year, image and clickable link', async ({ page }) => {
  await page.goto('/projects')

  const cards = page.locator('main a[href^="http"]').filter({ hasText: /Переглянути проєкт/ })
  await expect(cards).toHaveCount(4)

  for (const card of await cards.all()) {
    const href = await card.getAttribute('href')
    expect(href).toMatch(/^https?:\/\//)
  }

  const years = await page.locator('main span.text-muted').allInnerTexts()
  expect(years.length).toBeGreaterThan(0)
  for (const year of years) {
    expect(Number(year)).toBeGreaterThan(2000)
    expect(Number(year)).not.toBe(1970)
  }

  const images = page.locator('main img')
  const count = await images.count()
  expect(count).toBeGreaterThan(0)
  for (const img of await images.all()) {
    const src = await img.getAttribute('src')
    expect(src).toBeTruthy()
  }
})
