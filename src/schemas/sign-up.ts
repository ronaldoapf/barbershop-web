import { z } from "zod"

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Nome obrigatório"),
    email: z.email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type SignUpData = z.infer<typeof signUpSchema>
