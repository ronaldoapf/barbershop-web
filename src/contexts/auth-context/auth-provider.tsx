import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useLogout, useRegister } from "@/api/auth/hooks"
import { getMe } from "@/api/users"
import type { LoginDto, RegisterDto } from "@/schemas/auth"
import { AuthContext, type AuthContextValue } from "./auth-context"
import { AuthApi } from "@/api/auth"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient()

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  })

  const { mutateAsync: registerMutation } = useRegister()
  const { mutateAsync: logoutMutation } = useLogout()

  async function refetchUser(): Promise<void> {
    const result = await refetch()
    if (result.isError || !result.data) {
      throw result.error ?? new Error("Failed to fetch authenticated user")
    }
  }

  async function login(dto: LoginDto): Promise<void> {
    await AuthApi.login(dto)
    await refetchUser()
  }

  async function register(dto: RegisterDto): Promise<void> {
    await registerMutation(dto)
  }

  async function logout(): Promise<void> {
    await logoutMutation()
    queryClient.setQueryData(["me"], null)
  }

  const value: AuthContextValue = {
    user: user ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    refetchUser,
  }

  return <AuthContext value={value}>{children}</AuthContext>
}
