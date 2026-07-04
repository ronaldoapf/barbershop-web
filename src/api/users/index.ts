import { apiClient } from "@/lib/api-client"
import {
  barberResponseSchema,
  presignAvatarResponseSchema,
  userResponseSchema,
} from "@/schemas/user"
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

export async function getMe(): Promise<UserResponse> {
  const { data } = await apiClient.get("/users/me")
  return userResponseSchema.parse(data)
}

export async function updateMe(dto: UpdateMeDto): Promise<UserResponse> {
  const { data } = await apiClient.patch("/users/me", dto)
  return userResponseSchema.parse(data)
}

export async function presignAvatar(dto: PresignAvatarDto): Promise<PresignAvatarResponse> {
  const { data } = await apiClient.post("/users/me/avatar/presign", dto)
  return presignAvatarResponseSchema.parse(data)
}

export async function confirmAvatar(dto: ConfirmAvatarDto): Promise<UserResponse> {
  const { data } = await apiClient.patch("/users/me/avatar/confirm", dto)
  return userResponseSchema.parse(data)
}

export async function listUsers(): Promise<UserResponse[]> {
  const { data } = await apiClient.get("/users")
  return userResponseSchema.array().parse(data)
}

export async function createBarber(dto: CreateBarberDto): Promise<BarberResponse> {
  const { data } = await apiClient.post("/users/barbers", dto)
  return barberResponseSchema.parse(data)
}

export async function listBarbers(params: PaginationParams = {}): Promise<PaginatedResponse<BarberResponse>> {
  const { data } = await apiClient.get("/users/barbers", { params })
  return data as PaginatedResponse<BarberResponse>
}

export async function getBarber(id: string): Promise<BarberResponse> {
  const { data } = await apiClient.get(`/users/barbers/${id}`)
  return barberResponseSchema.parse(data)
}

export async function updateBarber(id: string, dto: UpdateBarberDto): Promise<BarberResponse> {
  const { data } = await apiClient.patch(`/users/barbers/${id}`, dto)
  return barberResponseSchema.parse(data)
}

export async function deleteBarber(id: string): Promise<void> {
  await apiClient.delete(`/users/barbers/${id}`)
}

export async function listCustomers(params: PaginationParams = {}): Promise<PaginatedResponse<UserResponse>> {
  const { data } = await apiClient.get("/users/customers", { params })
  return data as PaginatedResponse<UserResponse>
}

export async function createCustomer(dto: CreateCustomerDto): Promise<UserResponse> {
  const { data } = await apiClient.post("/users/customers", dto)
  return userResponseSchema.parse(data)
}

export async function updateCustomer(id: string, dto: UpdateCustomerDto): Promise<UserResponse> {
  const { data } = await apiClient.patch(`/users/customers/${id}`, dto)
  return userResponseSchema.parse(data)
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiClient.delete(`/users/customers/${id}`)
}
