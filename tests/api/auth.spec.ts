import { testData } from '../../src/testdata'
import { decodeJwtPayload } from '../../src/utils/jwt'
import {
  LoginSuccessSchema,
  parseLoginSuccess,
  AuthMeSchema,
  parseAuthMe,
  RefreshSuccessSchema,
  parseRefreshSuccess,
} from '../../src/validations/auth.schema'
import { ApiErrorSchema, parseApiError } from '../../src/validations/error.schema'
import { test, expect } from '../fixtures/test'

async function tryReadJson(res: { json(): Promise<unknown> }): Promise<unknown | undefined> {
  try {
    return await res.json()
  } catch {
    return undefined
  }
}

test('GET /auth/me returns current user (using worker auth session)', async ({
  authed,
  authSession,
}) => {
  const res = await test.step('Call GET /auth/me (authorized)', async () => {
    return authed.get('/auth/me')
  })

  const body = await test.step('Read JSON body', async () => {
    return res.json()
  })

  await test.step('Verify HTTP status', async () => {
    expect(res.status()).toBe(200)
  })

  await test.step('Verify contract (schema)', async () => {
    expect(body).toMatchSchema(AuthMeSchema, 'AuthMe')
  })

  await test.step('Verify business assertions', async () => {
    const me = parseAuthMe(body)

    expect(me.username).toBe(authSession.username)
    expect(typeof me.id).toBe('number')
  })
})

test('POST /auth/login returns token for valid credentials', async ({ auth }) => {
  const { res, body } = await test.step('Call POST /auth/login with valid params', async () => {
    return auth.login(testData.auth.username, testData.auth.password)
  })

  await test.step('Verify HTTP status', async () => {
    expect(res.status()).toBe(200)
  })

  await test.step('Verify contract (schema)', async () => {
    expect(body).toMatchSchema(LoginSuccessSchema, 'LoginSuccess')
  })

  await test.step('Verify business assertions', async () => {
    const parsed = parseLoginSuccess(body)

    expect(parsed.username).toBe(testData.auth.username)
    expect(parsed.accessToken.length).toBeGreaterThan(10)
    expect(parsed.refreshToken.length).toBeGreaterThan(10)
  })
})

test('POST /auth/login fails for invalid credentials (contract + data)', async ({ auth }) => {
  const { res } = await test.step('Call POST /auth/login with invalid password', async () => {
    return auth.login(testData.auth.username, testData.auth.invalidPassword)
  })

  const body = await test.step('Read JSON body', async () => {
    return res.json()
  })

  await test.step('Verify HTTP status', async () => {
    expect(res.status()).toBe(400)
  })

  await test.step('Verify error contract (schema)', async () => {
    expect(body).toMatchSchema(ApiErrorSchema, 'ApiError')
  })

  await test.step('Verify error message', async () => {
    const err = parseApiError(body)

    expect(err.message.toLowerCase()).toContain('invalid')
  })
})

test('POST /auth/refresh returns new tokens and refreshed accessToken works (flow)', async ({
  auth,
  authSession,
  request,
}) => {
  const prevPayload = decodeJwtPayload(authSession.accessToken)

  const { res, body } = await test.step('Call POST /auth/refresh with refreshToken', async () => {
    return auth.refresh(authSession.refreshToken, { expiresInMins: 60 })
  })

  await test.step('Verify HTTP status', async () => {
    expect(res.status()).toBe(200)
  })

  await test.step('Verify contract (schema)', async () => {
    expect(body).toMatchSchema(RefreshSuccessSchema, 'RefreshSuccess')
  })

  const refreshed = await test.step('Parse refreshed tokens', async () => {
    return parseRefreshSuccess(body)
  })

  await test.step('Verify tokens look valid', async () => {
    expect(refreshed.accessToken.length).toBeGreaterThan(10)
    expect(refreshed.refreshToken.length).toBeGreaterThan(10)
  })

  await test.step('Verify refreshed token claims are not older', async () => {
    const newPayload = decodeJwtPayload(refreshed.accessToken)

    if (prevPayload.iat !== undefined && newPayload.iat !== undefined) {
      expect(newPayload.iat).toBeGreaterThanOrEqual(prevPayload.iat)
    }

    if (prevPayload.exp !== undefined && newPayload.exp !== undefined) {
      expect(newPayload.exp).toBeGreaterThanOrEqual(prevPayload.exp)
    }
  })

  await test.step('Verify refreshed accessToken can call GET /auth/me', async () => {
    const meRes = await request.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${refreshed.accessToken}`,
      },
    })

    expect(meRes.status()).toBe(200)

    const meBody = await meRes.json()

    expect(typeof meBody.username).toBe('string')
  })
})

test('POST /auth/refresh fails for invalid refreshToken (contract + data)', async ({ auth }) => {
  const { res } = await test.step('Call POST /auth/refresh with invalid refreshToken', async () => {
    return auth.refresh(testData.auth.invalidRefreshToken)
  })

  await test.step('Verify HTTP status is 401 or 400', async () => {
    expect([400, 401, 403]).toContain(res.status())
  })

  const contentType = (res.headers()['content-type'] ?? '').toLowerCase()

  const body = await test.step('Read response body (JSON if possible)', async () => {
    const maybeJson = await tryReadJson(res)

    return maybeJson
  })

  await test.step('Verify error payload if JSON os present', async () => {
    if (body === undefined) {
      return
    }

    expect(body).toMatchSchema(ApiErrorSchema, 'ApiError')

    const err = parseApiError(body)
    expect(err.message.length).toBeGreaterThan(0)

    if (contentType.includes('application/json')) {
      expect(typeof err.message).toBe('string')
    }
  })
})
