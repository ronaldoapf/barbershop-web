import { FormError } from '@/components/form/form-error'
import { Input } from '@/components/ui/input'
import type { ComponentProps } from 'react'
import {
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form'

export type InputFormProps<T extends FieldValues> = ComponentProps<
  typeof Input
> &
  UseControllerProps<T>

export function InputForm<T extends FieldValues>({
  name,
  control,
  ...props
}: InputFormProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  return (
    <>
      <Input
        className={error && 'border-red-500 focus-visible:ring-red-300!'}
        id={name}
        {...props}
        {...field}
      />
      <FormError error={error} />
    </>
  )
}
