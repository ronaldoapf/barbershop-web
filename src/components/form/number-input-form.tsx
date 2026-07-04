import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"

import { FormError } from "@/components/form/form-error"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

interface NumberInputFormProps<T extends FieldValues> extends UseControllerProps<T> {
  placeholder?: string
  disabled?: boolean
  prefix?: string
  suffix?: string
  min?: number
  step?: number
}

export function NumberInputForm<T extends FieldValues>({
  control,
  name,
  placeholder,
  disabled,
  prefix,
  suffix,
  min,
  step,
}: NumberInputFormProps<T>): React.JSX.Element {
  const { field, fieldState } = useController({ control, name })
  const displayValue = typeof field.value === "string" || typeof field.value === "number" ? field.value : ""

  return (
    <>
      <InputGroup>
        {prefix && (
          <InputGroupAddon align="inline-start">
            <InputGroupText>{prefix}</InputGroupText>
          </InputGroupAddon>
        )}
        <InputGroupInput
          id={String(name)}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!fieldState.error}
          {...field}
          value={displayValue}
          onChange={(event) => field.onChange(event.target.value)}
        />
        {suffix && (
          <InputGroupAddon align="inline-end">
            <InputGroupText>{suffix}</InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
      <FormError error={fieldState.error} />
    </>
  )
}
