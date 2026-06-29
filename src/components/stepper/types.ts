export type StepStatus = "pending" | "current" | "completed" | "error"

export interface StepDefinition {
  id: string
  label: string
  description?: string
}

export interface StepperContextValue {
  steps: StepDefinition[]
  currentStep: number
  stepStatuses: StepStatus[]
  goToStep: (index: number) => void
  nextStep: () => void
  prevStep: () => void
  markStepError: (index: number) => void
  clearStepError: (index: number) => void
  isFirstStep: boolean
  isLastStep: boolean
}
