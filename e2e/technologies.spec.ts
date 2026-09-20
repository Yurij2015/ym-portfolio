import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const techDir = join(dirname(fileURLToPath(import.meta.url)), '../content/en/technologies')
const techSlugs = readdirSync(techDir).filter(f => f.endsWith('.yml')).map(f => f.replace(/\.yml$/, ''))

test('technology index lists every technology grouped by category', async ({ page }) => {
  await page.goto('/technologies')
  await expect(page).toHaveTitle(/Технології, з якими я працюю/)

  const cards = page.locator('a[href*="/technologies/"]')
  await expect(cards).toHaveCount(techSlugs.length)

  for (const slug of techSlugs) {
    await expect(page.locator(`a[href="/en/technologies/${slug}"], a[href="/technologies/${slug}"]`).first()).toBeVisible()
  }
})

test('technology detail page renders article, projects and tech-specific CTA', async ({ page }) => {
  await page.goto('/en/technologies/laravel')

  await expect(page.getByRole('heading', { name: 'Laravel', exact: true })).toBeVisible()
  // Generated banner
  await expect(page.locator('img[src*="laravel.svg"]')).toBeVisible()
  // Article body
  await expect(page.getByRole('heading', { name: 'How I use Laravel' })).toBeVisible()
  // Projects block
  await expect(page.getByRole('heading', { name: 'Projects built on Laravel' })).toBeVisible()
  await expect(page.locator('a[href="/en/projects/vetspace"]')).toBeVisible()
  // Tech-specific CTA headline
  await expect(page.getByText('Need a Laravel project?')).toBeVisible()
  // JSON-LD structured data
  const ldJson = await page.locator('script[type="application/ld+json"]').textContent()
  expect(ldJson).toContain('BreadcrumbList')
  expect(ldJson).toContain('FAQPage')
})

test('technology pages are localized', async ({ page }) => {
  await page.goto('/technologies/docker')
  await expect(page.getByText('Потрібен проєкт на Docker?')).toBeVisible()

  await page.goto('/pl/technologies/docker')
  await expect(page.getByText('Potrzebujesz projektu w Docker?')).toBeVisible()
})

test('homepage hero carousel icons link to technology pages', async ({ page }) => {
  await page.goto('/')
  const link = page.locator('a[href="/technologies/laravel"]')
  await expect(link.first()).toBeVisible()
  await link.first().click()
  await expect(page).toHaveURL(/\/technologies\/laravel$/)
})

test('project stack chips link to matching technology pages', async ({ page }) => {
  await page.goto('/en/projects/vetspace')
  const chip = page.locator('a[href="/en/technologies/laravel"]')
  await expect(chip.first()).toBeVisible()
  await chip.first().click()
  await expect(page).toHaveURL(/\/en\/technologies\/laravel$/)
})

test('unknown technology slug returns 404', async ({ page }) => {
  const response = await page.goto('/technologies/cobol')
  expect(response?.status()).toBe(404)
})
