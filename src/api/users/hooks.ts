import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import {
  confirmAvatar,
  createBarber,
  createCustomer,
  deleteBarber,
  deleteCustomer,
  getBarber,
  getMe,
  listBarbers,
  listCustomers,
  listUsers,
  presignAvatar,
  updateBarber,
  updateCustomer,
  updateMe,
} from "."
import type {
  BarberResponse,
  ConfirmAvatarDto,
  CreateBarberDto,
  CreateCustomerDto,
  PresignAvatarDto,
  PresignAvatarResponse,
  UpdateBarberDto,
  UpdateCustomerDto,
  UpdateMeDto,
  UserResponse,
} from "@/schemas/user"
import type { PaginatedResponse, PaginationParams } from "@/schemas/shared"

export function useGetMe(): UseQueryResult<UserResponse> {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  })
}

export function useUpdateMe(): UseMutationResult<UserResponse, Error, UpdateMeDto> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
    },
  })
}

export function usePresignAvatar(): UseMutationResult<PresignAvatarResponse, Error, PresignAvatarDto> {
  return useMutation({
    mutationFn: presignAvatar,
  })
}

export function useConfirmAvatar(): UseMutationResult<UserResponse, Error, ConfirmAvatarDto> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: confirmAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] })
    },
  })
}

export function useListUsers(): UseQueryResult<UserResponse[]> {
  return useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
  })
}

export function useListBarbers(params: PaginationParams = {}): UseQueryResult<PaginatedResponse<BarberResponse>> {
  return useQuery({
    queryKey: ["barbers", params],
    queryFn: () => listBarbers(params),
  })
}

export function useGetBarber(id: string): UseQueryResult<BarberResponse> {
  return useQuery({
    queryKey: ["barbers", id],
    queryFn: () => getBarber(id),
    enabled: Boolean(id),
  })
}

export function useCreateBarber(): UseMutationResult<BarberResponse, Error, CreateBarberDto> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] })
    },
  })
}

export function useUpdateBarber(): UseMutationResult<BarberResponse, Error, { id: string; dto: UpdateBarberDto }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }) => updateBarber(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] })
      queryClient.invalidateQueries({ queryKey: ["barbers", id] })
    },
  })
}

export function useDeleteBarber(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBarber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barbers"] })
    },
  })
}

export function useListCustomers(params: PaginationParams = {}): UseQueryResult<PaginatedResponse<UserResponse>> {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => listCustomers(params),
  })
}

export function useCreateCustomer(): UseMutationResult<UserResponse, Error, CreateCustomerDto> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
  })
}

export function useUpdateCustomer(): UseMutationResult<UserResponse, Error, { id: string; dto: UpdateCustomerDto }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }) => updateCustomer(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customers", id] })
    },
  })
}

export function useDeleteCustomer(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
    },
  })
}
