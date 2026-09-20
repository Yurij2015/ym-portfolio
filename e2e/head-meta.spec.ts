import { expect, test } from '@playwright/test'

for (const path of ['/', '/en/about', '/pl/projects']) {
  test(`${path} exposes svg + ico + apple-touch icons that all resolve`, async ({ page, request }) => {
    await page.goto(path)

    const svg = page.locator('head link[rel="icon"][type="image/svg+xml"]')
    const ico = page.locator('head link[rel="icon"][href$=".ico"]')
    const apple = page.locator('head link[rel="apple-touch-icon"]')

    await expect(svg).toHaveCount(1)
    await expect(ico).toHaveCount(1)
    await expect(apple).toHaveCount(1)

    for (const locator of [svg, ico, apple]) {
      const href = await locator.getAttribute('href')
      expect(href).toBeTruthy()
      const response = await request.get(href!)
      expect(response.status()).toBe(200)
    }
  })
}
