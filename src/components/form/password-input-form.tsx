import { useState, type ComponentProps } from "react"
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

import { FormError } from "@/components/form/form-error"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type PasswordInputFormProps <T extends FieldValues> = ComponentProps<typeof InputGroupInput> & UseControllerProps<T>

export function PasswordInputForm<T extends FieldValues>({
  control,
  name,
  placeholder,
  disabled,
  ...props
}: PasswordInputFormProps<T>): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false)
  const { field, fieldState } = useController({ control, name })

  return (
    <>
      <InputGroup>
        <InputGroupInput
          id={String(name)}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!fieldState.error}
          type={showPassword ? "text" : "password"}
          {...props}
          {...field}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-sm"
            disabled={disabled}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FormError error={fieldState.error} />
    </>

  )
}
