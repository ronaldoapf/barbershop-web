import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { loginWithGoogle } from "@/api/auth"
import { useLogin } from "@/api/auth/hooks"
import { InputForm } from "@/components/form/input-form"
import { PasswordInputForm } from "@/components/form/password-input-form"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field"
import { saveTokens } from "@/lib/auth-storage"
import { loginSchema, type LoginData } from "@/schemas/login"
import { Label } from "@/components/ui/label"
import { Loading } from "@/components/loading"
import googleIcon from "@/assets/google-icon.svg"

export function LoginForm() {
  const navigate = useNavigate()
  const { 
    mutate: login, 
    isPending: isPendingLogin 
  } = useLogin()

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { handleSubmit, formState: { isSubmitting }} = form

  const onSubmit = handleSubmit(async (data: LoginData) => {
    login(data, {
      onSuccess: ({ accessToken, refreshToken }) => {
        saveTokens(accessToken, refreshToken)
        toast.success("Login realizado com sucesso!")
        navigate("/app")
      },
      onError: () => {
        toast.error("E-mail ou senha incorretos.")
      },
    })
  })

  const isFormDisabled = isSubmitting || isPendingLogin

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <FieldGroup>
        <Field>
          <Label htmlFor="email">
            E-mail
          </Label>
          <InputForm
            name="email"
            type="email"
            control={form.control}
            disabled={isFormDisabled}
            placeholder="m@exemplo.com"
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              Senha
            </Label>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <PasswordInputForm
            name="password"
            control={form.control}
            disabled={isFormDisabled}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={isFormDisabled}>
          {isFormDisabled ? (
            <>
              <Loading />
            </>
          ) : "Entrar"}
        </Button>

        <FieldSeparator>ou</FieldSeparator>

        <Button
          type="button"
          variant="outline"
          disabled={isFormDisabled}
          onClick={loginWithGoogle}
        >
          <img src={googleIcon} alt="" width={18} height={18} aria-hidden="true" />
          Continuar com Google
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
