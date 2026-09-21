import { apiClient } from "@/lib/api-client"

import {  type CreateServiceDto, type ListServicesParams, type Service } from "./types";
import type { PaginatedResponse } from "@/schemas/shared";

export const ServicesApi = {
  listServices: async (params: ListServicesParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Service>>("/services", { params })
    return data;
  },
  createService: async (dto: CreateServiceDto) => {
    const { data } = await apiClient.post<Service>("/services", dto)
    return data;
  },
  deleteService: async (id: string) => {
    await apiClient.delete(`/services/${id}`)
  },
  toggleServiceStatus: async (id: string) => {
    const { data } = await apiClient.patch<Service>(`/services/${id}/status`)
    return data;
  }
}