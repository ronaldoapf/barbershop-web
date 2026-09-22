import { apiClient } from "@/lib/api-client"
import { userResponseSchema } from "@/schemas/user"
import type { UserResponse } from "@/schemas/user"
import type { LoginParams, RegisterParams } from "./types"

const baseURL = 'auth'

export const AuthApi = {
  register: async (dto: RegisterParams): Promise<UserResponse> => {
    const { data } = await apiClient.post(`/${baseURL}/register`, dto)
    return userResponseSchema.parse(data)
  },
  login: async (dto: LoginParams): Promise<UserResponse> => {
    const { data } = await apiClient.post(`/${baseURL}/login`, dto)
    return data
  },
  refreshToken: async (): Promise<void> => {
    await apiClient.post(`/${baseURL}/refresh`)
  },
  logout: async (): Promise<void> => {
    await apiClient.post(`/${baseURL}/logout`)
  },
  loginWithGoogle: async (): Promise<void> => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }
}
