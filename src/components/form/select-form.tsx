import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"

import { FormError } from "@/components/form/form-error"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectFormOption {
  value: string
  label: string
}

interface SelectFormProps<T extends FieldValues> extends UseControllerProps<T> {
  options: SelectFormOption[]
  placeholder?: string
  disabled?: boolean
}

export function SelectForm<T extends FieldValues>({
  control,
  name,
  options,
  placeholder,
  disabled,
}: SelectFormProps<T>): React.JSX.Element {
  const { field, fieldState } = useController({ control, name })

  return (
    <>
      <Select
        value={typeof field.value === "string" ? field.value : ""}
        onValueChange={field.onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={String(name)}
          className="w-full"
          aria-invalid={!!fieldState.error}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormError error={fieldState.error} />
    </>
  )
}
