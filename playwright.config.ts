import 'dotenv/config'
import { defineConfig } from '@playwright/test'

import { env } from './src/config/env'

export default defineConfig({
  use: {},
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: env.API_BASE_URL,
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'ui-guest',
      testDir: './tests/ui/guest',
      use: {
        baseURL: env.UI_BASE_URL,
        testIdAttribute: 'data-test',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
      },
    },
    {
      name: 'ui-setup',
      testDir: './tests/ui',
      testMatch: ['**/*.setup.spec.ts'],
      use: {
        testIdAttribute: 'data-test',
        baseURL: env.UI_BASE_URL,
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'ui',
      testDir: './tests/ui/authed',
      dependencies: ['ui-setup'],
      use: {
        baseURL: env.UI_BASE_URL,
        testIdAttribute: 'data-test',
        storageState: 'tests/ui/.auth/user.json',
        trace: 'on-first-retry',
        screenshot: 'on-first-failure',
        video: 'on-first-retry',
      },
    },
  ],
  timeout: env.PW_TIMEOUT_MS,
  workers: env.PW_WORKERS,
  retries: env.PW_RETRIES,
  reporter: [['list'], ['html', { open: 'never' }]],
})
