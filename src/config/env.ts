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

export const env = {
  API_BASE_URL: trimToUndefined(process.env.API_BASE_URL) ?? 'https://dummyjson.com',
  PW_WORKERS: intOrUndefined(process.env.PW_WORKERS),
  PW_RETRIES: intOrUndefined(process.env.PW_RETRIES),
  PW_TIMEOUT_MS: intOrDefault(process.env.PW_TIMEOUT_MS, 30_000),
  AUTH_USERNAME: trimToUndefined(process.env.AUTH_USERNAME) ?? 'emilys',
  AUTH_PASSWORD: trimToUndefined(process.env.AUTH_PASSWORD) ?? 'emilyspass'
} as const

if (!env.API_BASE_URL.startsWith('http')) {
  throw new Error('API_BASE_URL must start with http/https')
}
