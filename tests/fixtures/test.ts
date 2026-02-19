import { test as base } from '@playwright/test'
import { ProductsClient } from '../../src/clients/productsClient'
import { AuthClient } from '../../src/clients/authClient'
import { env } from '../../src/config/env'
import { expect } from './expect'
import type { APIRequestContext } from '@playwright/test'

type AuthSession = {
  accessToken: string
  refreshToken: string
  username: string
}

export class AuthedApi {
  constructor(private readonly request: APIRequestContext, private readonly token: string) { }

  async get(path: string, params?: Record<string, string | number | boolean>) {
    return this.request.get(path, {
      params,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
  }

  async post(path: string, data?: unknown) {
    return this.request.post(path, {
      data,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    })
  }
}

export type TestFixtures = {
  products: ProductsClient
  auth: AuthClient
  authed: AuthedApi
}

export type WorkerFixture = {
  authSession: AuthSession
}

export const test = base.extend<TestFixtures, WorkerFixture>({
  products: async ({ request }, use) => {
    await use(new ProductsClient(request))
  },

  auth: async ({ request }, use) => {
    await use(new AuthClient(request))
  },

  authSession: [
    async ({ playwright }, use) => {
      const ctx = await playwright.request.newContext({
        baseURL: env.API_BASE_URL,
      })

      try {
        const authClient = new AuthClient(ctx)
        const { res, body } = await authClient.login(env.AUTH_USERNAME, env.AUTH_PASSWORD, { expiresInMins: 1 })

        if (res.status() !== 200) {
          throw new Error(`Auth failed during worker setup: ${res.status()}`)
        }

        await use({
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
          username: body.username,
        })
      } finally {
        await ctx.dispose()
      }
    },
    { scope: 'worker' },
  ],

  authed: async ({ request, authSession }, use) => {
    await use(new AuthedApi(request, authSession.accessToken))
  },
})

export { expect }
