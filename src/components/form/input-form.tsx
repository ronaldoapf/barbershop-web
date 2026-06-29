import { useController, type Control, type FieldValues, type Path } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface InputFormProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
}

export function InputForm<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
}: InputFormProps<T>): React.JSX.Element {
  const { field, fieldState } = useController({ control, name })

  return (
    <Field data-invalid={fieldState.error ? true : undefined}>
      <FieldLabel htmlFor={String(name)} className="text-foreground">{label}</FieldLabel>
      <Input
        id={String(name)}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!fieldState.error}
        {...field}
      />
      <FieldError errors={[fieldState.error]} />
    </Field>
  )
}
