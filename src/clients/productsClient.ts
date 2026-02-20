import { ApiClient } from './apiClient'

import type { Product, ProductsListResponse } from '../types/products'

export class ProductsClient extends ApiClient {
  async list(params?: { limit?: number; skip?: number }) {
    return this.get<ProductsListResponse>('/products', {
      params: {
        ...(params?.limit !== undefined ? { limit: params.limit } : {}),
        ...(params?.skip !== undefined ? { skip: params.skip } : {}),
      },
    })
  }

  async byId(id: number) {
    return this.get<Product>(`/products/${id}`)
  }

  async search(q: string) {
    return this.get<ProductsListResponse>('/products/search', { params: { q } })
  }
}
