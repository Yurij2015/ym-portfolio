import { expect, test } from '@playwright/test'
import { gotoAndWaitReady, openLanguageMenu } from './utils'

test('header nav and language dropdown stay usable on a narrow viewport', async ({ page }) => {
  await gotoAndWaitReady(page, '/')

  const nav = page.getByRole('navigation')
  await expect(nav).toBeVisible()

  const langButton = page.getByRole('button', { name: /current language/i })
  await expect(langButton).toBeVisible()
  await expect(langButton).toBeInViewport()

  await openLanguageMenu(page)
  await expect(page.getByRole('menuitem', { name: 'English' })).toBeVisible()
})
