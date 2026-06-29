import { useController, type Control, type FieldValues, type Path } from "react-hook-form"
import type { DropzoneOptions } from "react-dropzone"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Dropzone } from "@/components/dropzone"

interface DropzoneFormProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  hint?: string
  accept?: DropzoneOptions["accept"]
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
}

export function DropzoneForm<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  accept,
  maxFiles,
  maxSize,
  multiple,
  disabled,
}: DropzoneFormProps<T>): React.JSX.Element {
  const { field, fieldState } = useController({ control, name })

  return (
    <Field data-invalid={fieldState.error ? true : undefined}>
      <FieldLabel className="text-foreground">{label}</FieldLabel>
      <Dropzone
        value={Array.isArray(field.value) ? (field.value as File[]) : []}
        onFilesChange={(files) => field.onChange(files)}
        hint={hint}
        accept={accept}
        maxFiles={maxFiles}
        maxSize={maxSize}
        multiple={multiple}
        disabled={disabled}
      />
      <FieldError errors={[fieldState.error]} />
    </Field>
  )
}
