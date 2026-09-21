import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"

import { PasswordInputForm } from "@/components/form/password-input-form"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { resetPasswordSchema, type ResetPasswordData } from "@/schemas/reset-password"

export function ResetPasswordForm(): React.JSX.Element {
  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { 
      password: "", 
      confirmPassword: "" 
    },
  })

  function onSubmit(data: ResetPasswordData): void {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">Nova senha</FieldLabel>
          <PasswordInputForm
            name="password"
            control={form.control}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirmar nova senha</FieldLabel>
          <PasswordInputForm
            name="confirmPassword"
            control={form.control}
          />
        </Field>
        <Button type="submit" className="w-full">
          Redefinir senha
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Lembrou a senha?{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
