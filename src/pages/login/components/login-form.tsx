import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"

import { InputForm } from "@/components/form/input-form"
import { PasswordInputForm } from "@/components/form/password-input-form"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { loginSchema, type LoginData } from "@/schemas/login"

export function LoginForm() {
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { 
      email: "", 
      password: "" 
    },
  })

  function onSubmit(data: LoginData): void {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <InputForm
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="m@exemplo.com"
        />
        <PasswordInputForm
          control={form.control}
          name="password"
          label="Senha"
          labelAction={
            <Link
              to="/forgot-password"
              className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Esqueceu a senha?
            </Link>
          }
        />
        <Button type="submit" className="w-full">
          Entrar
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            to="/sign-up"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
