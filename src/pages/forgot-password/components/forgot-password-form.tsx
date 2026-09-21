import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"

import { InputForm } from "@/components/form/input-form"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { forgotPasswordSchema, type ForgotPasswordData } from "@/schemas/forgot-password"

export function ForgotPasswordForm(): React.JSX.Element {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(data: ForgotPasswordData): void {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputForm
            name="email"
            type="email"
            control={form.control}
            placeholder="m@exemplo.com"
          />
        </Field>
        <Button type="submit" className="w-full">
          Enviar instruções
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
