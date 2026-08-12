import { expect, test } from '@playwright/test'
import { gotoAndWaitReady, openLanguageMenu } from './utils'

const locales = [
  { code: 'uk', switchLabel: 'Українська', path: '/', homeNavText: 'Головна' },
  { code: 'en', switchLabel: 'English', path: '/en', homeNavText: 'Home' },
  { code: 'pl', switchLabel: 'Polski', path: '/pl', homeNavText: 'Główna' }
]

test.describe('language switcher', () => {
  for (const target of locales) {
    test(`switching to ${target.code} lands on ${target.path} with translated nav`, async ({ page }) => {
      await gotoAndWaitReady(page, '/')
      await openLanguageMenu(page)
      await page.getByRole('menuitem', { name: target.switchLabel }).click()

      await expect(page).toHaveURL(new RegExp(`${target.path}$`))
      await expect(page.getByRole('navigation').getByText(target.homeNavText, { exact: true })).toBeVisible()
    })
  }

  test('switching between two non-default locales keeps working', async ({ page }) => {
    await gotoAndWaitReady(page, '/en')
    await openLanguageMenu(page)
    await page.getByRole('menuitem', { name: 'Polski' }).click()
    await expect(page).toHaveURL(/\/pl$/)

    await openLanguageMenu(page)
    await page.getByRole('menuitem', { name: 'English' }).click()
    await expect(page).toHaveURL(/\/en$/)
  })
})
