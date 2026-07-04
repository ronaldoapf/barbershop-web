import type { ComponentProps } from "react"
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"

import { FormError } from "@/components/form/form-error"
import { Textarea } from "@/components/ui/textarea"

type TextareaFormProps<T extends FieldValues> = ComponentProps<typeof Textarea> &
  UseControllerProps<T>

export function TextareaForm<T extends FieldValues>({
  name,
  control,
  ...props
}: TextareaFormProps<T>): React.JSX.Element {
  const { field, fieldState } = useController({ name, control })

  return (
    <>
      <Textarea
        id={String(name)}
        aria-invalid={!!fieldState.error}
        {...props}
        {...field}
      />
      <FormError error={fieldState.error} />
    </>
  )
}
