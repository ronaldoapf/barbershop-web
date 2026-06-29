import { createContext, use } from "react"

import type { StepperContextValue } from "./types"

export const StepperContext = createContext<StepperContextValue | null>(null)

export function useStepperContext(): StepperContextValue {
  const ctx = use(StepperContext)
  if (!ctx) throw new Error("useStepperContext must be used within <Stepper>")
  return ctx
}
