import { z } from 'zod'

export const AuthMeSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  email: z.email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  image: z.url().optional()
})

export type AuthMe = z.infer<typeof AuthMeSchema>

export function parseAuthMe(data: unknown): AuthMe {
  return AuthMeSchema.parse(data)
}

export const LoginSuccessSchema = z.object({
  id: z.number(),
  username: z.string().min(1),
  email: z.email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  image: z.url().optional(),
  accessToken: z.string().min(10),
  refreshToken: z.string().min(10),
})

export type LoginSuccess = z.infer<typeof LoginSuccessSchema>

export function parseLoginSuccess(data: unknown): LoginSuccess {
  return LoginSuccessSchema.parse(data)
}

export const RefreshSuccessSchema = z.object({
  accessToken: z.string().min(10),
  refreshToken: z.string().min(10),
})

export type RefreshSuccess = z.infer<typeof RefreshSuccessSchema>

export function parseRefreshSuccess(data: unknown): RefreshSuccess {
  return RefreshSuccessSchema.parse(data)
}
