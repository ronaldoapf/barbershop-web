import { type ReactNode } from "react"
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useStepperContext } from "./stepper-context"

interface StepperNavigationProps {
  onNext?: () => boolean | Promise<boolean>
  onBack?: () => void
  nextLabel?: string
  backLabel?: string
  finishLabel?: string
  className?: string
}

export function StepperNavigation({
  onNext,
  onBack,
  nextLabel = "Próximo",
  backLabel = "Voltar",
  finishLabel = "Concluir",
  className,
}: StepperNavigationProps): ReactNode {
  const { isFirstStep, isLastStep, nextStep, prevStep } = useStepperContext()

  async function handleNext(): Promise<void> {
    if (onNext) {
      const canProceed = await onNext()
      if (!canProceed) return
    }
    nextStep()
  }

  function handleBack(): void {
    onBack?.()
    prevStep()
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border pt-6",
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        onClick={handleBack}
        disabled={isFirstStep}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        {backLabel}
      </Button>

      <Button type="button" onClick={handleNext}>
        {isLastStep ? (
          <>
            <CheckIcon data-icon="inline-start" />
            {finishLabel}
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRightIcon data-icon="inline-end" />
          </>
        )}
      </Button>
    </div>
  )
}
