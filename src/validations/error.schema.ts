import { z } from 'zod'

export const ApiErrorSchema = z.object({
  message: z.string().min(1),
  name: z.string().optional(),
  status: z.number().int().optional(),
})

export type ApiError = z.infer<typeof ApiErrorSchema>

export function parseApiError(data: unknown): ApiError {
  return ApiErrorSchema.parse(data)
}
