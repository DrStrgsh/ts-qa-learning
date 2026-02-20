import { test, expect } from '../../fixtures/uiAuthed'

test.describe('UI Smoke (SauseDemo) - Authenticated', () => {
  test('authed user can open inventory', async ({ inventory }) => {
    await test.step('Open inventory page', async () => {
      await inventory.open()
    })

    await test.step('Verify inventory cart link is visible', async () => {
      await expect(inventory.cartLink).toBeVisible()
    })

    await test.step('Verify title', async () => {
      await expect(inventory.title).toHaveText(/products/i)
    })
  })
})
