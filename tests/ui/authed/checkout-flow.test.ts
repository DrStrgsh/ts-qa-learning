import { testData } from '../../../src/testdata'
import { test } from '../../fixtures/uiAuthed'

test.describe('UI Checkout Flow (SauceDemo)', () => {
  test('user can complete checkout', async ({ inventory, cart, checkout }) => {
    await test.step('Open inventory', async () => {
      await inventory.open()
    })

    await test.step('Add item to cart', async () => {
      await inventory.addBackpackToCart()
      await inventory.openCart()
      await cart.assertVisible()
    })

    await test.step('Start checkout', async () => {
      await cart.checkout()
    })

    await test.step('Fill customer info', async () => {
      await checkout.fillCustomerInfo(
        testData.uiCustomerInfo.firstName,
        testData.uiCustomerInfo.lastName,
        testData.uiCustomerInfo.postalCode,
      )
    })

    await test.step('Finish checkout', async () => {
      await checkout.finish()
      await checkout.assertOrderCompleted()
    })
  })
})
