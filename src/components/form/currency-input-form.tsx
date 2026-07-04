import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"

import { FormError } from "@/components/form/form-error"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

interface CurrencyInputFormProps<T extends FieldValues> extends UseControllerProps<T> {
  placeholder?: string
  disabled?: boolean
}

function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function CurrencyInputForm<T extends FieldValues>({
  control,
  name,
  placeholder,
  disabled,
}: CurrencyInputFormProps<T>): React.JSX.Element {
  const { field, fieldState } = useController({ control, name })

  const numericValue = typeof field.value === "string" || typeof field.value === "number" ? Number(field.value) : 0
  const displayValue = field.value === "" || field.value === undefined ? "" : formatCents(Math.round(numericValue * 100))

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 12)
    field.onChange(digits === "" ? "" : (Number(digits) / 100).toFixed(2))
  }

  return (
    <>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>R$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id={String(name)}
          inputMode="numeric"
          disabled={disabled}
          placeholder={placeholder ?? "0,00"}
          aria-invalid={!!fieldState.error}
          {...field}
          value={displayValue}
          onChange={handleChange}
        />
      </InputGroup>
      <FormError error={fieldState.error} />
    </>
  )
}
