import { AlertCircle } from "lucide-react"
import type { FieldError as RHFFieldError } from "react-hook-form"

import { FieldError } from "@/components/ui/field"

interface FormErrorProps {
  error?: RHFFieldError
}

export function FormError({ error }: FormErrorProps): React.JSX.Element | null {
  if (!error) {
    return null
  }

  return (
    <span className="flex items-center gap-0.5">
      <AlertCircle size={12} className="size-3 text-red-500" />
      <FieldError errors={[error]} className="text-xs" />
    </span>
  )
}
