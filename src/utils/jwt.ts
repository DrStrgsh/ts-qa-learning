export type JwtPayload = {
  iat?: number
  exp?: number
  [k: string]: unknown
}

function base64UrlToUtf8(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))

  return Buffer.from(base64 + pad, 'base64').toString('utf8')
}

export function decodeJwtPayload(token: string): JwtPayload {
  const parts = token.split('.')
  if (parts.length < 2) {
    throw new Error('Invalid JWT: expected at least 2 parts')
  }

  const json = base64UrlToUtf8(parts[1])
  const payload = JSON.parse(json) as JwtPayload

  return payload
}
