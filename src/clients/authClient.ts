import { ApiClient } from './apiClient'
import type { LoginResponse } from '../types/auth'

export type RefreshResponse = {
  accessToken: string
  refreshToken: string
}

export class AuthClient extends ApiClient {
  async login(username: string, password: string, opts?: { expiresInMins?: number }) {
    return this.post<LoginResponse>('/auth/login', {
      data: {
        username,
        password,
        ...(opts?.expiresInMins !== undefined ? { expiresInMins: opts.expiresInMins } : {})
      },
    })
  }

  async refresh(refreshToken?: string, opts?: { expiresInMins?: number }) {
    return this.post<RefreshResponse>('/auth/refresh', {
      data: {
        ...(refreshToken ? { refreshToken } : {}),
        ...(opts?.expiresInMins !== undefined ? { expiresInMins: opts.expiresInMins } : {})
      }
    })
  }
}
