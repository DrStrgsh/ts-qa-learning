import 'dotenv/config'
import { defineConfig } from '@playwright/test'
import { env } from './src/config/env'

export default defineConfig({
  testDir: './tests',
  timeout: env.PW_TIMEOUT_MS,
  workers: env.PW_WORKERS,
  retries: env.PW_RETRIES,
  use: {
    baseURL: env.API_BASE_URL,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ]
})
