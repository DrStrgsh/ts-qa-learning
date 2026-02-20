import type { Locator, Page } from '@playwright/test'

export type WaitVisibleOptions = {
  timeoutMs?: number
}

export type WaitPageReadyOptions = {
  timeoutMs?: number
  state?: 'domcontentloaded' | 'load' | 'networkidle'
}

export type WaitStableUrlOptions = {
  timeoutMs?: number
}

export async function waitVisible(locator: Locator, opts: WaitVisibleOptions = {}): Promise<void> {
  const timeout = opts.timeoutMs
  await locator.waitFor({ state: 'visible', timeout })
}

export async function waitUrl(
  page: Page,
  pattern: RegExp,
  opts: WaitStableUrlOptions = {},
): Promise<void> {
  const timeout = opts.timeoutMs
  await page.waitForURL(pattern, { timeout })
}

export async function waitPageReady(page: Page, opts: WaitPageReadyOptions = {}): Promise<void> {
  const state = opts.state ?? 'domcontentloaded'
  const timeout = opts.timeoutMs
  await page.waitForLoadState(state, { timeout })
}
