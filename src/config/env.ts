function intOrUndefined(value: string | undefined): number | undefined {
  if (!value) return undefined

  const n = Number(value)

  return Number.isFinite(n) ? n : undefined
}

function intOrDefault(value: string | undefined, def: number): number {
  const n = intOrUndefined(value)

  return n === undefined ? def : n
}

function trimToUndefined(value: string | undefined): string | undefined {
  if (value === undefined) return undefined

  const v = value.trim()

  return v.length === 0 ? undefined : v
}

function assertHttpUrl(name: string, value: string): void {
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    throw new Error(`${name} must start with http/https`)
  }
}

export const env = {
  API_BASE_URL: trimToUndefined(process.env.API_BASE_URL) ?? 'https://dummyjson.com',
  UI_BASE_URL: trimToUndefined(process.env.UI_BASE_URL) ?? 'https://saucedemo.com',

  PW_WORKERS: intOrUndefined(process.env.PW_WORKERS),
  PW_RETRIES: intOrUndefined(process.env.PW_RETRIES),
  PW_TIMEOUT_MS: intOrDefault(process.env.PW_TIMEOUT_MS, 30_000),
} as const

assertHttpUrl('API_BASE_URL', env.API_BASE_URL)
assertHttpUrl('UI_BASE_URL', env.UI_BASE_URL)
