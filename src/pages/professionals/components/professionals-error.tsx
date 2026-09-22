import { RotateCw, ServerCrash } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ProfessionalsErrorProps {
  onRetry: () => void
  isRetrying?: boolean
}

export function ProfessionalsError({ onRetry, isRetrying = false }: ProfessionalsErrorProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-xl border bg-card px-8 py-16 text-center shadow-sm">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ServerCrash className="size-6" />
      </div>

      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="font-heading text-base font-semibold text-foreground">
          Não foi possível carregar os profissionais
        </p>
        <p className="text-sm text-muted-foreground">
          Verifique sua conexão e tente novamente. Se o problema continuar, contate o suporte.
        </p>
      </div>

      <Button variant="outline" onClick={onRetry} disabled={isRetrying} data-icon="inline-start">
        <RotateCw className={isRetrying ? "animate-spin" : undefined} />
        {isRetrying ? "Tentando novamente..." : "Tentar novamente"}
      </Button>
    </div>
  )
}
