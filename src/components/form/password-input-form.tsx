import { useState } from "react"
import { useController, type Control, type FieldValues, type Path } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

interface PasswordInputFormProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  labelAction?: React.ReactNode
  placeholder?: string
}

export function PasswordInputForm<T extends FieldValues>({
  control,
  name,
  label,
  labelAction,
  placeholder,
}: PasswordInputFormProps<T>): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false)
  const { field, fieldState } = useController({ control, name })

  return (
    <Field data-invalid={fieldState.error ? true : undefined}>
      <div className="flex items-center">
        <FieldLabel htmlFor={String(name)} className="text-foreground">{label}</FieldLabel>
        {labelAction}
      </div>
      <InputGroup>
        <InputGroupInput
          id={String(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={!!fieldState.error}
          {...field}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-sm"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldError errors={[fieldState.error]} />
    </Field>
  )
}
