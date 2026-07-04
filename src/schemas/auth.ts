import { z } from "zod"

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type AuthResponse = z.infer<typeof authResponseSchema>

export interface RegisterDto {
  name: string
  email: string
  password: string
  phone?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RefreshTokenDto {
  refreshToken: string
}
