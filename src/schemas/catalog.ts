import { z } from "zod"
import type { PaginationParams } from "@/schemas/shared"

export const serviceStatusSchema = z.enum(["ACTIVE", "INACTIVE"])
export type ServiceStatus = z.infer<typeof serviceStatusSchema>

export const categoryResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  order: z.number(),
  createdAt: z.string(),
})
export type CategoryResponse = z.infer<typeof categoryResponseSchema>

export const serviceResponseSchema = z.object({
  id: z.string(),
  categoryId: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  durationMinutes: z.number(),
  status: serviceStatusSchema,
  order: z.number(),
  pointsEarned: z.number(),
  pointsRequired: z.number(),
  createdAt: z.string(),
})
export type ServiceResponse = z.infer<typeof serviceResponseSchema>

export const packageResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  status: serviceStatusSchema,
  order: z.number(),
  pointsEarned: z.number(),
  pointsRequired: z.number(),
  services: z.array(serviceResponseSchema),
  createdAt: z.string(),
})
export type PackageResponse = z.infer<typeof packageResponseSchema>

export interface ListServicesParams extends PaginationParams {
  categoryId?: string
  status?: ServiceStatus
}

export interface CreateCategoryDto {
  name: string
  order: number
}

export interface UpdateCategoryDto {
  name?: string
  order?: number
}

export const serviceFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do serviço"),
  categoryId: z.string().optional(),
  description: z.string().trim().optional(),
  price: z.coerce.number().positive("Informe um preço maior que zero"),
  durationMinutes: z.coerce
    .number()
    .int("A duração deve ser em minutos inteiros")
    .positive("Informe uma duração maior que zero"),
  pointsEarned: z.coerce.number().int().nonnegative().optional(),
  pointsRequired: z.coerce.number().int().nonnegative().optional(),
})
export type ServiceFormInput = z.input<typeof serviceFormSchema>
export type ServiceFormData = z.output<typeof serviceFormSchema>

export interface CreateServiceDto {
  categoryId?: string
  name: string
  description?: string
  price: number
  durationMinutes: number
  order: number
  pointsEarned?: number
  pointsRequired?: number
}

export interface UpdateServiceDto {
  categoryId?: string
  name?: string
  description?: string
  price?: number
  durationMinutes?: number
  order?: number
  pointsEarned?: number
  pointsRequired?: number
}

export interface CreatePackageDto {
  name: string
  description?: string
  price: number
  order: number
  pointsEarned?: number
  pointsRequired?: number
  serviceIds: string[]
}

export interface UpdatePackageDto {
  name?: string
  description?: string
  price?: number
  order?: number
  pointsEarned?: number
  pointsRequired?: number
  serviceIds?: string[]
}
