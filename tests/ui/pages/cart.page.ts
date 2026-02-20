import { waitVisible } from '../../../src/utils/uiExpect'

import { BasePage } from './base.page'

import type { Locator, Page } from '@playwright/test'

export class CartPage extends BasePage {
  readonly title: Locator
  readonly cartList: Locator
  readonly checkoutButton: Locator

  constructor(page: Page) {
    super(page)
    this.title = page.getByTestId('title')
    this.cartList = page.getByTestId('cart-list')
    this.checkoutButton = page.getByTestId('checkout')
  }

  async assertVisible(): Promise<void> {
    await waitVisible(this.cartList)
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click()
  }
}
