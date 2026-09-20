import { expect, test } from '@playwright/test'
import { gotoAndWaitReady, openLanguageMenu } from './utils'

test('mobile header collapses nav into a working menu', async ({ page }) => {
  await gotoAndWaitReady(page, '/')

  // Wide-nav pill is hidden; hamburger exposes the same links instead
  await expect(page.getByRole('navigation')).toBeHidden()
  const menuButton = page.getByRole('button', { name: 'Menu' })
  await expect(menuButton).toBeVisible()
  await expect(menuButton).toBeInViewport()

  await menuButton.click()
  await expect(page.getByRole('menuitem', { name: 'Проєкти' })).toBeVisible()
  await page.getByRole('menuitem', { name: 'Проєкти' }).click()
  await expect(page).toHaveURL(/\/projects$/)
})

test('language dropdown stays usable on a narrow viewport', async ({ page }) => {
  await gotoAndWaitReady(page, '/')

  const langButton = page.getByRole('button', { name: /current language/i })
  await expect(langButton).toBeVisible()
  await expect(langButton).toBeInViewport()

  await openLanguageMenu(page)
  await expect(page.getByRole('menuitem', { name: 'English' })).toBeVisible()
})
