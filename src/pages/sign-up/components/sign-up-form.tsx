import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"

import { InputForm } from "@/components/form/input-form"
import { PasswordInputForm } from "@/components/form/password-input-form"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
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
        <InputForm
          name="name"
          label="Nome"
          control={form.control}
          placeholder="João Silva"
        />
        <InputForm
          name="email"
          type="email"
          label="Email"
          control={form.control}
          placeholder="m@exemplo.com"
        />
        <PasswordInputForm
          label="Senha"
          name="password"
          control={form.control}
        />
        <PasswordInputForm
          control={form.control}
          name="confirmPassword"
          label="Confirmar senha"
        />
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
