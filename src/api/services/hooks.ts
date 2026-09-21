import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { ServicesApi } from ".";
import type { CreateServiceDto, ListServicesParams, Service } from "./types";

export function useListServices(params: ListServicesParams) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => ServicesApi.listServices(params)
  })
}

export function useCreateService(): UseMutationResult<Service, Error, CreateServiceDto> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ServicesApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export function useDeleteService(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ServicesApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}

export function useToggleServiceStatus(): UseMutationResult<Service, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ServicesApi.toggleServiceStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
    },
  })
}