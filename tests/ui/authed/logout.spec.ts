import { test, expect } from '../../fixtures/uiAuthed'
import { LoginPage } from '../pages/login.page'

test.describe('UI Logout (SauceDemo)', () => {
  test('user can logout and is returned to login page', async ({ inventory, page }) => {
    const login = new LoginPage(page)

    await test.step('Open inventory', async () => {
      await inventory.open()
    })

    await test.step('Logout via menu', async () => {
      await inventory.logout()
    })

    await test.step('Verify login page is visible', async () => {
      await login.assertVisible()
      await expect(login.loginButton).toBeVisible()
    })
  })
})
