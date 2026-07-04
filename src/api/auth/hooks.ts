import { useMutation } from "@tanstack/react-query"
import type { UseMutationResult } from "@tanstack/react-query"
import { login, logout, refreshToken, register } from "."
import type { AuthResponse, LoginDto, RefreshTokenDto, RegisterDto } from "@/schemas/auth"
import type { UserResponse } from "@/schemas/user"

export function useRegister(): UseMutationResult<UserResponse, Error, RegisterDto> {
  return useMutation({
    mutationFn: register,
  })
}

export function useLogin(): UseMutationResult<AuthResponse, Error, LoginDto> {
  return useMutation({
    mutationFn: login,
  })
}

export function useRefreshToken(): UseMutationResult<AuthResponse, Error, RefreshTokenDto> {
  return useMutation({
    mutationFn: refreshToken,
  })
}

export function useLogout(): UseMutationResult<void, Error, RefreshTokenDto> {
  return useMutation({
    mutationFn: logout,
  })
}
