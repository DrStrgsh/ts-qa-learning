import type { APIRequestContext, APIResponse } from '@playwright/test'

export type ApiResult<T> = {
  res: APIResponse
  body: T
}

async function jsonOrThrow<T>(res: APIResponse, context: string): Promise<T> {
  try {
    return (await res.json()) as T
  } catch (e) {
    throw new Error(`Failed to parse JSON (${context}). Original error: ${String(e)}`)
  }
}

export class ApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async get<T>(
    path: string,
    opts?: {
      params?: Record<string, string | number | boolean>
      headers?: Record<string, string>
    },
  ): Promise<ApiResult<T>> {
    const res = await this.request.get(path, {
      params: opts?.params,
      headers: opts?.headers,
    })
    const body = await jsonOrThrow<T>(res, `GET ${path}`)

    return { res, body }
  }

  protected async post<T>(
    path: string,
    opts?: {
      data?: unknown
      headers?: Record<string, string>
    },
  ): Promise<ApiResult<T>> {
    const res = await this.request.post(path, {
      data: opts?.data,
      headers: {
        'Content-Type': 'application/json',
        ...(opts?.headers ?? {}),
      },
    })
    const body = await jsonOrThrow<T>(res, `POST ${path}`)

    return { res, body }
  }
}
