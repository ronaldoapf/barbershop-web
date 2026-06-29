import { useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import { StepperContext } from "./stepper-context"
import type { StepDefinition, StepStatus, StepperContextValue } from "./types"

interface StepperProps {
  steps: StepDefinition[]
  initialStep?: number
  onStepChange?: (step: number) => void
  children: ReactNode
  className?: string
}

export function Stepper({
  steps,
  initialStep = 0,
  onStepChange,
  children,
  className,
}: StepperProps): ReactNode {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(() =>
    steps.map((_, i) => (i === initialStep ? "current" : "pending"))
  )

  function goToStep(index: number): void {
    if (index < 0 || index >= steps.length) return
    setCurrentStep(index)
    setStepStatuses((prev) =>
      prev.map((status, i) => {
        if (i === index) return "current"
        // The step that was "current" transitions: forward → completed, backward → pending
        if (status === "current") return i < index ? "completed" : "pending"
        return status
      })
    )
    onStepChange?.(index)
  }

  function nextStep(): void {
    goToStep(currentStep + 1)
  }

  function prevStep(): void {
    goToStep(currentStep - 1)
  }

  function markStepError(index: number): void {
    setStepStatuses((prev) =>
      prev.map((status, i) => (i === index ? "error" : status))
    )
  }

  function clearStepError(index: number): void {
    setStepStatuses((prev) =>
      prev.map((status, i) => {
        if (i !== index) return status
        if (i === currentStep) return "current"
        return i < currentStep ? "completed" : "pending"
      })
    )
  }

  const value: StepperContextValue = {
    steps,
    currentStep,
    stepStatuses,
    goToStep,
    nextStep,
    prevStep,
    markStepError,
    clearStepError,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  }

  return (
    <StepperContext value={value}>
      <div className={cn("w-full", className)}>{children}</div>
    </StepperContext>
  )
}
