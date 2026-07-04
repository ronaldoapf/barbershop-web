import { apiClient } from "@/lib/api-client"
import {
  categoryResponseSchema,
  packageResponseSchema,
  serviceResponseSchema,
} from "@/schemas/catalog"
import type {
  CategoryResponse,
  CreateCategoryDto,
  CreatePackageDto,
  CreateServiceDto,
  ListServicesParams,
  PackageResponse,
  ServiceResponse,
  UpdateCategoryDto,
  UpdatePackageDto,
  UpdateServiceDto,
} from "@/schemas/catalog"
import type { PaginatedResponse, PaginationParams } from "@/schemas/shared"

export async function listCategories(): Promise<CategoryResponse[]> {
  const { data } = await apiClient.get("/categories")
  return categoryResponseSchema.array().parse(data)
}

export async function createCategory(dto: CreateCategoryDto): Promise<CategoryResponse> {
  const { data } = await apiClient.post("/categories", dto)
  return categoryResponseSchema.parse(data)
}

export async function updateCategory(id: string, dto: UpdateCategoryDto): Promise<CategoryResponse> {
  const { data } = await apiClient.patch(`/categories/${id}`, dto)
  return categoryResponseSchema.parse(data)
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}

export async function listServices(params: ListServicesParams = {}): Promise<PaginatedResponse<ServiceResponse>> {
  const { data } = await apiClient.get("/services", { params })
  return data as PaginatedResponse<ServiceResponse>
}

export async function createService(dto: CreateServiceDto): Promise<ServiceResponse> {
  const { data } = await apiClient.post("/services", dto)
  return serviceResponseSchema.parse(data)
}

export async function updateService(id: string, dto: UpdateServiceDto): Promise<ServiceResponse> {
  const { data } = await apiClient.patch(`/services/${id}`, dto)
  return serviceResponseSchema.parse(data)
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/services/${id}`)
}

export async function toggleServiceStatus(id: string): Promise<ServiceResponse> {
  const { data } = await apiClient.patch(`/services/${id}/status`)
  return serviceResponseSchema.parse(data)
}

export async function listPackages(params: PaginationParams = {}): Promise<PaginatedResponse<PackageResponse>> {
  const { data } = await apiClient.get("/packages", { params })
  return data as PaginatedResponse<PackageResponse>
}

export async function createPackage(dto: CreatePackageDto): Promise<PackageResponse> {
  const { data } = await apiClient.post("/packages", dto)
  return packageResponseSchema.parse(data)
}

export async function updatePackage(id: string, dto: UpdatePackageDto): Promise<PackageResponse> {
  const { data } = await apiClient.patch(`/packages/${id}`, dto)
  return packageResponseSchema.parse(data)
}

export async function deletePackage(id: string): Promise<void> {
  await apiClient.delete(`/packages/${id}`)
}

export async function togglePackageStatus(id: string): Promise<PackageResponse> {
  const { data } = await apiClient.patch(`/packages/${id}/status`)
  return packageResponseSchema.parse(data)
}
