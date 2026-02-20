import { test, expect } from '../../fixtures/uiAuthed'
import { LoginPage } from '../pages/login.page'

test.describe('UI Auth Invalid (SauceDemo)', () => {
  test('after logout, protected pages are not accessible', async ({ inventory, page }) => {
    const login = new LoginPage(page)

    await test.step('Open inventory', async () => {
      await inventory.open()
    })

    await test.step('Logout', async () => {
      await inventory.logout()
      await login.assertVisible()
    })

    await test.step('Attempt to open protected page directly', async () => {
      await page.goto('/inventory.html', { waitUntil: 'domcontentloaded' })
    })

    await test.step('Verify user is redirected back to login', async () => {
      await login.assertVisible()
      await expect(login.loginButton).toBeVisible()
    })
  })
})
