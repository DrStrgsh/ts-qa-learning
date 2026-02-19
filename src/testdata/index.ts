import { env } from '../config/env'

export const testData = {
  auth: {
    username: env.AUTH_USERNAME,
    password: env.AUTH_PASSWORD,
    invalidPassword: 'wrong-password',
    invalidRefreshToken: 'invalid-refresh-token',
  },
  products: {
    searchQuery: 'phone',
    pageSize: 5,
  },
} as const
