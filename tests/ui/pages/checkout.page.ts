import { waitVisible } from '../../../src/utils/uiExpect'

import { BasePage } from './base.page'

import type { Locator, Page } from '@playwright/test'

export class CheckoutPage extends BasePage {
  readonly title: Locator
  readonly firstName: Locator
  readonly lastName: Locator
  readonly postalCode: Locator
  readonly continueButton: Locator
  readonly finishButton: Locator
  readonly completeHeader: Locator

  constructor(page: Page) {
    super(page)
    this.title = page.getByTestId('title')
    this.firstName = page.getByTestId('firstName')
    this.lastName = page.getByTestId('lastName')
    this.postalCode = page.getByTestId('postalCode')
    this.continueButton = page.getByTestId('continue')
    this.finishButton = page.getByTestId('finish')
    this.completeHeader = page.getByTestId('complete-header')
  }

  async fillCustomerInfo(first: string, last: string, zip: string): Promise<void> {
    await this.firstName.fill(first)
    await this.lastName.fill(last)
    await this.postalCode.fill(zip)
    await this.continueButton.click()
  }

  async finish(): Promise<void> {
    await this.finishButton.click()
  }

  async assertOrderCompleted(): Promise<void> {
    await waitVisible(this.completeHeader)
  }
}
