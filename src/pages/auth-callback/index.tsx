import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { GalleryVerticalEnd } from "lucide-react"

import { saveTokens } from "@/lib/auth-storage"

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    async function handleCallback(): Promise<void> {
      const accessToken =
        searchParams.get("accessToken") ?? searchParams.get("access_token")
      const refreshToken =
        searchParams.get("refreshToken") ?? searchParams.get("refresh_token")

      if (accessToken && refreshToken) {
        saveTokens(accessToken, refreshToken)
        toast.success("Login realizado com sucesso!")
        await new Promise((resolve) => setTimeout(resolve, 1000))
        navigate("/app", { replace: true })
      } else {
        toast.error("Falha ao autenticar com o Google.")
        navigate("/login", { replace: true })
      }
    }

    void handleCallback()
  }, [navigate, searchParams])

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background px-6">
      <a href="#" className="absolute left-8 top-6 flex w-fit items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">Acme Inc.</span>
      </a>

      <div className="flex flex-col items-center text-center duration-500 animate-in fade-in zoom-in-95">
        <div className="relative mb-8 flex size-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-primary/15" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary [animation-duration:1.4s] motion-reduce:animate-none" />
          <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-5" />
          </div>
        </div>

        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          Conectando
        </p>
        <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
          Confirmando seu acesso.
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Só um instante enquanto validamos suas credenciais.
        </p>
      </div>
    </div>
  )
}
