import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { useStepperContext } from "./stepper-context"
import { StepIndicator } from "./step-indicator"

interface StepperPanelProps {
  step: number
  children: ReactNode
  className?: string
}

export function StepperPanel({
  step,
  children,
  className,
}: StepperPanelProps): ReactNode {
  const { currentStep, steps, stepStatuses, goToStep } = useStepperContext()

  const isActive = currentStep === step
  const status = stepStatuses[step]
  const stepDef = steps[step]
  const isLast = step === steps.length - 1
  const isClickable = status === "completed" || status === "error"

  return (
    <>
      {/* Mobile: vertical accordion — sempre renderiza o indicador */}
      <div className="sm:hidden">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <StepIndicator status={status} stepNumber={step + 1} />
            {!isLast && (
              <div
                className={cn(
                  "mt-2 w-px grow transition-colors duration-300",
                  status === "completed" ? "bg-foreground" : "bg-border"
                )}
              />
            )}
          </div>

          <div className={cn("min-w-0 flex-1", !isLast && "pb-6")}>
            <button
              type="button"
              disabled={!isClickable}
              onClick={isClickable ? () => goToStep(step) : undefined}
              className={cn(
                "mb-1 w-full text-left",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : status === "error"
                      ? "text-destructive"
                      : "text-muted-foreground"
                )}
              >
                {stepDef.label}
              </p>
              {stepDef.description && (
                <p className="text-xs text-muted-foreground">
                  {stepDef.description}
                </p>
              )}
            </button>

            {isActive && (
              <div className={cn("mt-3", className)}>{children}</div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: só renderiza o conteúdo quando ativo */}
      {isActive && (
        <div className={cn("hidden py-6 sm:block", className)}>{children}</div>
      )}
    </>
  )
}
