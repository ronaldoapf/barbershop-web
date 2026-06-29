import { type ReactNode } from "react"
import { CheckIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import type { StepStatus } from "./types"

interface StepIndicatorProps {
  status: StepStatus
  stepNumber: number
}

export function StepIndicator({ status, stepNumber }: StepIndicatorProps): ReactNode {
  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-sm transition-colors duration-200",
        status === "pending" &&
          "border border-border bg-background text-muted-foreground",
        (status === "current" || status === "completed") &&
          "bg-foreground text-primary-foreground",
        status === "error" && "bg-destructive text-destructive-foreground"
      )}
    >
      {status === "completed" ? (
        <CheckIcon className="size-3.5" strokeWidth={2.5} />
      ) : status === "error" ? (
        <XIcon className="size-3.5" strokeWidth={2.5} />
      ) : (
        <span className="font-mono text-[10px] font-medium tracking-widest">
          {String(stepNumber).padStart(2, "0")}
        </span>
      )}
    </div>
  )
}
