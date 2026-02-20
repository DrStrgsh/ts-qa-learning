import fs from 'node:fs'
import path from 'node:path'

import { testData } from '../../src/testdata'
import { test } from '../fixtures/ui'

import { InventoryPage } from './pages/inventory.page'
import { LoginPage } from './pages/login.page'

const STORAGE_STATE_PATH = path.resolve(process.cwd(), 'tests/ui/.auth/user.json')
const STORAGE_STATE_DIR = path.dirname(STORAGE_STATE_PATH)
const STORAGE_TTL_MS = 10 * 60 * 1000

function storageStateIsFresh(): boolean {
  try {
    const stat = fs.statSync(STORAGE_STATE_PATH)
    const ageMs = Date.now() - stat.mtimeMs

    return ageMs >= 0 && ageMs < STORAGE_TTL_MS
  } catch {
    return false
  }
}

test('ui auth: create storageState', async ({ page }) => {
  if (storageStateIsFresh()) {
    test.skip(true, 'storageState exists and is fresh')
  }

  fs.mkdirSync(STORAGE_STATE_DIR, { recursive: true })

  const login = new LoginPage(page)
  const inventory = new InventoryPage(page)

  await test.step('Open login page', async () => {
    await login.open()
    await login.assertVisible()
  })

  await test.step('Login with valid credentials', async () => {
    await login.login(testData.uiAuth.username, testData.uiAuth.password)
    await inventory.assertVisible()
  })

  await test.step('Persist storageState', async () => {
    await page.context().storageState({ path: 'tests/ui/.auth/user.json' })
  })
})
