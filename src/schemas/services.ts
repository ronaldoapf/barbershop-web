import { z } from "zod"

export const serviceFormSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do serviço"),
  description: z.string().trim().optional(),
  price: z.coerce.number().positive("Informe um preço maior que zero"),
  durationMinutes: z.coerce
    .number()
    .int("A duração deve ser em minutos inteiros")
    .positive("Informe uma duração maior que zero"),
  pointsEarned: z.coerce.number().int().nonnegative().optional(),
  pointsRequired: z.coerce.number().int().nonnegative().optional(),
  barberIds: z.array(z.string()).optional(),
})
export type ServiceFormInput = z.input<typeof serviceFormSchema>
export type ServiceFormData = z.output<typeof serviceFormSchema>
