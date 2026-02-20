import { test as base } from '@playwright/test'

import { CartPage } from '../ui/pages/cart.page'
import { CheckoutPage } from '../ui/pages/checkout.page'
import { InventoryPage } from '../ui/pages/inventory.page'

import { expect } from './expect'

type UiAuthedFixtures = {
  inventory: InventoryPage
  cart: CartPage
  checkout: CheckoutPage
}

export const test = base.extend<UiAuthedFixtures>({
  inventory: async ({ page }, use) => {
    await use(new InventoryPage(page))
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page))
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page))
  },
})

export { expect }
