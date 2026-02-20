import { ProductsListSchema } from './products.schema'

import type { ProductsListValidated } from './products.schema'

export function assertProductsList(data: unknown): ProductsListValidated {
  return ProductsListSchema.parse(data)
}
