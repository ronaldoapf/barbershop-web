import { createContext } from "react"
import type { LoginDto, RegisterDto } from "@/schemas/auth"
import type { UserResponse } from "@/schemas/user"

export interface AuthContextValue {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (dto: LoginDto) => Promise<void>
  register: (dto: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  refetchUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
