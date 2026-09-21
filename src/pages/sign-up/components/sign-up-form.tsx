import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"

import { InputForm } from "@/components/form/input-form"
import { PasswordInputForm } from "@/components/form/password-input-form"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { signUpSchema, type SignUpData } from "@/schemas/sign-up"

export function SignUpForm(): React.JSX.Element {
  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { 
      name: "", 
      email: "", 
      password: "", 
      confirmPassword: ""
    },
  })

  function onSubmit(data: SignUpData): void {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <InputForm
            name="name"
            control={form.control}
            placeholder="João Silva"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <InputForm
            name="email"
            type="email"
            control={form.control}
            placeholder="m@exemplo.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <PasswordInputForm
            name="password"
            control={form.control}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
          <PasswordInputForm
            control={form.control}
            name="confirmPassword"
          />
        </Field>
        <Button type="submit" className="w-full">
          Criar conta
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
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
