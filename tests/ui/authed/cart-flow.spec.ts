import { test, expect } from '../../fixtures/uiAuthed'

test.describe('UI Cart FLow (SauceDemo)', () => {
  test('user can add item to cart and open cart', async ({ inventory, cart }) => {
    await test.step('Open inventory', async () => {
      await inventory.open()
    })

    await test.step('Add backpack to cart', async () => {
      await inventory.addBackpackToCart()
      await expect(inventory.cartBadge).toHaveText('1')
    })

    await test.step('Open cart and verify it is visible', async () => {
      await inventory.openCart()
      await cart.assertVisible()
      await expect(cart.checkoutButton).toBeVisible()
    })
  })
})
