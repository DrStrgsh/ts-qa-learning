import { waitVisible } from '../../../src/utils/uiExpect'

import { BasePage } from './base.page'

import type { Locator, Page } from '@playwright/test'

export class LoginPage extends BasePage {
  readonly username: Locator
  readonly password: Locator
  readonly loginButton: Locator
  readonly error: Locator

  constructor(page: Page) {
    super(page)
    this.username = page.getByTestId('username')
    this.password = page.getByTestId('password')
    this.loginButton = page.getByTestId('login-button')
    this.error = page.getByTestId('error')
  }

  async open(): Promise<void> {
    await this.goto('/')
  }

  async assertVisible(): Promise<void> {
    await waitVisible(this.username)
    await waitVisible(this.password)
    await waitVisible(this.loginButton)
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username)
    await this.password.fill(password)
    await this.loginButton.click()
  }
}
