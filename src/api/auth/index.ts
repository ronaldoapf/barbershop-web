import { apiClient } from "@/lib/api-client"
import { authResponseSchema } from "@/schemas/auth"
import { userResponseSchema } from "@/schemas/user"
import type { AuthResponse, LoginDto, RefreshTokenDto, RegisterDto } from "@/schemas/auth"
import type { UserResponse } from "@/schemas/user"

export async function register(dto: RegisterDto): Promise<UserResponse> {
  const { data } = await apiClient.post("/auth/register", dto)
  return userResponseSchema.parse(data)
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/login", dto)
  return authResponseSchema.parse(data)
}

export async function refreshToken(dto: RefreshTokenDto): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/refresh", dto)
  return authResponseSchema.parse(data)
}

export async function logout(dto: RefreshTokenDto): Promise<void> {
  await apiClient.post("/auth/logout", dto)
}

export function loginWithGoogle(): void {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
}
