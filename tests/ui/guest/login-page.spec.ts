import { test, expect } from '../../fixtures/ui'
import { LoginPage } from '../pages/login.page'

test.describe('UI Guest', () => {
  test('guest can see login page', async ({ page }) => {
    const login = new LoginPage(page)

    await test.step('Open login page', async () => {
      await login.open()
    })

    await test.step('Verify login from elements are visible', async () => {
      await login.assertVisible()
      await expect(login.loginButton).toBeVisible()
    })
  })
})
