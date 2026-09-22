import { useMutation } from "@tanstack/react-query"
import type { UseMutationResult } from "@tanstack/react-query"
import type { LoginDto, RegisterDto } from "@/schemas/auth"
import type { UserResponse } from "@/schemas/user"
import { AuthApi } from "."

const { login, logout, refreshToken, register } = AuthApi

export function useRegister(): UseMutationResult<UserResponse, Error, RegisterDto> {
  return useMutation({
    mutationFn: register,
  })
}

export function useLogin(): UseMutationResult<UserResponse, Error, LoginDto> {
  return useMutation({
    mutationFn: login,
  })
}

export function useRefreshToken(): UseMutationResult<void, Error, void> {
  return useMutation({
    mutationFn: refreshToken,
  })
}

export function useLogout(): UseMutationResult<void, Error, void> {
  return useMutation({
    mutationFn: logout,
  })
}
