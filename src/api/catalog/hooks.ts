import { useMutation, useQuery } from "@tanstack/react-query"
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import {
  createCategory,
  createPackage,
  createService,
  deleteCategory,
  deletePackage,
  deleteService,
  listCategories,
  listPackages,
  listServices,
  togglePackageStatus,
  toggleServiceStatus,
  updateCategory,
  updatePackage,
  updateService,
} from "."
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
import { queryClient } from "@/lib/query-client"

export function useListCategories(): UseQueryResult<CategoryResponse[]> {
  return useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  })
}

export function useCreateCategory(): UseMutationResult<CategoryResponse, Error, CreateCategoryDto> {
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useUpdateCategory(): UseMutationResult<CategoryResponse, Error, { id: string; dto: UpdateCategoryDto }> {
  return useMutation({
    mutationFn: ({ id, dto }) => updateCategory(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useDeleteCategory(): UseMutationResult<void, Error, string> {
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useListServices(params: ListServicesParams = {}): UseQueryResult<PaginatedResponse<ServiceResponse>> {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => listServices(params),
  })
}

export function useCreateService(): UseMutationResult<ServiceResponse, Error, CreateServiceDto> {
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export function useUpdateService(): UseMutationResult<ServiceResponse, Error, { id: string; dto: UpdateServiceDto }> {
  return useMutation({
    mutationFn: ({ id, dto }) => updateService(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      queryClient.invalidateQueries({ queryKey: ["services", id] })
    },
  })
}

export function useDeleteService(): UseMutationResult<void, Error, string> {
  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export function useToggleServiceStatus(): UseMutationResult<ServiceResponse, Error, string> {
  return useMutation({
    mutationFn: toggleServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export function useListPackages(params: PaginationParams = {}): UseQueryResult<PaginatedResponse<PackageResponse>> {
  return useQuery({
    queryKey: ["packages", params],
    queryFn: () => listPackages(params),
  })
}

export function useCreatePackage(): UseMutationResult<PackageResponse, Error, CreatePackageDto> {
  return useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
    },
  })
}

export function useUpdatePackage(): UseMutationResult<PackageResponse, Error, { id: string; dto: UpdatePackageDto }> {
  return useMutation({
    mutationFn: ({ id, dto }) => updatePackage(id, dto),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
      queryClient.invalidateQueries({ queryKey: ["packages", id] })
    },
  })
}

export function useDeletePackage(): UseMutationResult<void, Error, string> {
  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
    },
  })
}

export function useTogglePackageStatus(): UseMutationResult<PackageResponse, Error, string> {
  return useMutation({
    mutationFn: togglePackageStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] })
    },
  })
}
