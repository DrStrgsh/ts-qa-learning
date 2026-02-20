import { waitPageReady } from '../../../src/utils/uiExpect'

import type { Page } from '@playwright/test'

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' })
    await waitPageReady(this.page)
  }
}
