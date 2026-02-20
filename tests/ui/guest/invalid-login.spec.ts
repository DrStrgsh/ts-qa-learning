import { testData } from '../../../src/testdata'
import { test, expect } from '../../fixtures/ui'
import { LoginPage } from '../pages/login.page'

test.describe('UI Guest - Invalid Login', () => {
  test('user cannot log in with wrong creds', async ({ page }) => {
    const login = new LoginPage(page)

    await test.step('Open login page', async () => {
      await login.open()
      await login.assertVisible()
    })

    await test.step('Attempt login with invalid creds', async () => {
      await login.login(testData.uiAuth.username, testData.uiAuth.invalidPassword)
    })

    await test.step('Verify error message is shown', async () => {
      await expect(login.error).toBeVisible()
      await expect(login.error).toContainText(/username and password do not match/i)
    })

    await test.step('Verify user is still on login page', async () => {
      await expect(login.loginButton).toBeVisible()
    })
  })
})
