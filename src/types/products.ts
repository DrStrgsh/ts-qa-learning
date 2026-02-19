export type Product = {
  id: number
  title: string
  price: number
  description?: string
  category?: string
  brand?: string
}

export type ProductsListResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}
