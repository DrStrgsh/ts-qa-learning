import { waitUrl, waitVisible } from '../../../src/utils/uiExpect'

import { BasePage } from './base.page'

import type { Locator, Page } from '@playwright/test'

export class InventoryPage extends BasePage {
  readonly title: Locator
  readonly inventoryContainer: Locator
  readonly cartLink: Locator
  readonly cartBadge: Locator
  readonly addBackpackButton: Locator
  readonly menuButton: Locator
  readonly logoutLink: Locator

  constructor(page: Page) {
    super(page)
    this.title = page.getByTestId('title')
    this.inventoryContainer = page.getByTestId('inventory-container')
    this.cartLink = page.getByTestId('shopping-cart-link')
    this.cartBadge = page.getByTestId('shopping-cart-badge')
    this.addBackpackButton = page.getByTestId('add-to-cart-sauce-labs-backpack')
    this.menuButton = page.locator('#react-burger-menu-btn')
    this.logoutLink = page.getByTestId('logout-sidebar-link')
  }

  async open(): Promise<void> {
    await this.goto('/inventory.html')
    const loginUsername = this.page.getByTestId('username')
    const result = await Promise.race([
      waitVisible(this.inventoryContainer, { timeoutMs: 10_000 }).then(() => 'inventory' as const),
      waitVisible(loginUsername, { timeoutMs: 10_000 }).then(() => 'login' as const),
    ])

    if (result === 'login') {
      throw new Error(
        'Not authenticated: redirected to login while opening /inventory.html.' +
          'Run `npx playwright test --project=ui-setup` to refresh storageState.',
      )
    }
  }

  async assertVisible(): Promise<void> {
    await waitVisible(this.inventoryContainer)
  }

  async addBackpackToCart(): Promise<void> {
    await this.addBackpackButton.click()
  }

  async openCart(): Promise<void> {
    await this.cartLink.click()
  }

  async logout(): Promise<void> {
    await this.menuButton.click()
    await waitVisible(this.logoutLink)
    await Promise.all([waitUrl(this.page, /\/($|\?)/), this.logoutLink.click()])
  }
}
