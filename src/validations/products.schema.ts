import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
})

export const ProductsListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().nonnegative(),
  skip: z.number().nonnegative(),
  limit: z.number().positive(),
})

export type ProductValidated = z.infer<typeof ProductSchema>
export type ProductsListValidated = z.infer<typeof ProductsListSchema>

export function parseProductsList(data: unknown): ProductsListValidated {
  return ProductsListSchema.parse(data)
}
