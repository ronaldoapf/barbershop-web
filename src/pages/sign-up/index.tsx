import { GalleryVerticalEnd } from "lucide-react"

import { SignUpForm } from "./components/sign-up-form"

export function SignUp(): React.JSX.Element {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-[360px] top-1/2 hidden size-[900px] -translate-y-1/2 rounded-full border border-primary/[0.08] md:block" />
      <div className="pointer-events-none absolute -left-[255px] top-1/2 hidden size-[680px] -translate-y-1/2 rounded-full border border-primary/20 md:block" />
      <div className="pointer-events-none absolute -left-[165px] top-1/2 hidden size-[480px] -translate-y-1/2 rounded-full border-2 border-primary/30 md:block" />

      <header className="absolute inset-x-0 top-0 px-8 py-6">
        <a href="#" className="flex w-fit items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Acme Inc.</span>
        </a>
      </header>

      <main className="flex min-h-svh items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
              Cadastro
            </p>
            <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">
              Crie sua conta.
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              Preencha os dados abaixo para começar.
            </p>
          </div>
          <SignUpForm />
        </div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 px-8 py-5">
        <p className="text-xs text-muted-foreground">© 2025 Acme Inc.</p>
      </footer>
    </div>
  )
}
