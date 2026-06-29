import { Fragment, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { useStepperContext } from "./stepper-context"
import { StepIndicator } from "./step-indicator"

interface StepperHeaderProps {
  className?: string
}

export function StepperHeader({ className }: StepperHeaderProps): ReactNode {
  const { steps, stepStatuses, goToStep } = useStepperContext()

  return (
    <div className={cn("hidden sm:block", className)}>
      <div className="flex items-start">
        {steps.map((step, index) => {
          const status = stepStatuses[index]
          const isClickable = status === "completed" || status === "error"
          const connectorFilled = stepStatuses[index] === "completed"

          return (
            <Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={isClickable ? () => goToStep(index) : undefined}
                  aria-current={status === "current" ? "step" : undefined}
                  className={cn(
                    "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isClickable ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <StepIndicator status={status} stepNumber={index + 1} />
                </button>
                <div className="max-w-[6rem] space-y-0.5 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium leading-tight transition-colors",
                      status === "current"
                        ? "text-foreground"
                        : status === "error"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-[10px] leading-tight text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mt-3.5 flex-1 transition-colors duration-300",
                    connectorFilled
                      ? "h-px bg-foreground"
                      : "h-0 border-t border-dashed border-border"
                  )}
                />
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
