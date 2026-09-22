import { z } from "zod"

export const userRoleSchema = z.enum(["CUSTOMER", "BARBER", "OWNER"])
export type UserRole = z.infer<typeof userRoleSchema>

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  role: userRoleSchema,
  loyaltyPoints: z.number(),
  avatarUrl: z.string().nullable(),
  createdAt: z.string(),
})
export type UserResponse = z.infer<typeof userResponseSchema>

export const barberResponseSchema = z.object({
  id: z.string(),
  commissionPercentage: z.number(),
  createdAt: z.string(),
  user: userResponseSchema,
})
export type BarberResponse = z.infer<typeof barberResponseSchema>

export const presignAvatarResponseSchema = z.object({
  url: z.string(),
  key: z.string(),
})
export type PresignAvatarResponse = z.infer<typeof presignAvatarResponseSchema>

export interface UpdateMeDto {
  name?: string
  phone?: string
}

export interface PresignAvatarDto {
  mimeType: string
}

export interface ConfirmAvatarDto {
  storageKey: string
  mimeType: string
}

export interface CreateBarberDto {
  name: string
  email: string
  password: string
  phone: string
  commissionPercentage: number
  avatarUrl?: string
}

export interface UpdateBarberDto {
  name?: string
  phone?: string
  commissionPercentage?: number
}

export const customerFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do cliente"),
  email: z.string().trim().email("Informe um e-mail válido"),
  phone: z.string().trim().min(1, "Informe o telefone do cliente"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})
export type CustomerFormInput = z.input<typeof customerFormSchema>
export type CustomerFormData = z.output<typeof customerFormSchema>

export interface CreateCustomerDto {
  name: string
  email: string
  password: string
  phone: string
}

export interface UpdateCustomerDto {
  name?: string
  phone?: string
}

export const barberFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do Profissional"),
  email: z.string().trim().email("Informe um e-mail válido"),
  phone: z.string().trim().min(1, "Informe o telefone do Profissional"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  commissionPercentage: z.coerce
    .number()
    .min(0, "A comissão não pode ser negativa")
    .max(100, "A comissão não pode ultrapassar 100%"),
})
export type BarberFormInput = z.input<typeof barberFormSchema>
export type BarberFormData = z.output<typeof barberFormSchema>
