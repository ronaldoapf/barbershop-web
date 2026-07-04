import { Scissors, Sparkles } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useCreateBarber } from "@/api/users/hooks"
import { InputForm } from "@/components/form/input-form"
import { NumberInputForm } from "@/components/form/number-input-form"
import { PasswordInputForm } from "@/components/form/password-input-form"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { SheetFooter } from "@/components/ui/sheet"
import {
  barberFormSchema,
  type BarberFormData,
  type BarberFormInput,
} from "@/schemas/user"

interface EmployeeFormProps {
  onSuccess: () => void
  onCancel?: () => void
}

export function EmployeeForm({ onSuccess, onCancel }: EmployeeFormProps): React.JSX.Element {
  const {
    mutateAsync: createBarber,
    isPending: isPendingCreateBarber,
  } = useCreateBarber()

  const form = useForm<BarberFormInput, unknown, BarberFormData>({
    resolver: zodResolver(barberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      commissionPercentage: "",
    },
  })

  const { control, handleSubmit } = form

  const previewName = useWatch({ control: form.control, name: "name" })
  const previewEmail = useWatch({ control: form.control, name: "email" })

  const onSubmit = handleSubmit(async (data: BarberFormData) => {
    createBarber(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        commissionPercentage: data.commissionPercentage,
      },
      {
        onSuccess: () => {
          toast.success("Funcionário cadastrado com sucesso.")
          form.reset()
          onSuccess()
        },
        onError: () => {
          toast.error("Erro ao cadastrar funcionário.")
        },
      }
    )
  })

  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background">
            <Scissors className="size-4 text-muted-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {previewName || "Nome do funcionário"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {previewEmail || "email@exemplo.com"}
            </span>
          </div>
          <Sparkles className="size-4 shrink-0 text-muted-foreground/50" />
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nome do funcionário</FieldLabel>
            <InputForm
              name="name"
              control={control}
              placeholder="Ex: Carlos Barbeiro"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <InputForm
              name="email"
              type="email"
              control={control}
              placeholder="usuario@exemplo.com"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="phone">Telefone</FieldLabel>
              <InputForm
                name="phone"
                control={control}
                placeholder="(00) 00000-0000"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <PasswordInputForm
                name="password"
                control={control}
                placeholder="Mínimo 6 caracteres"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="commissionPercentage">Comissão</FieldLabel>
            <NumberInputForm
              name="commissionPercentage"
              control={control}
              suffix="%"
              min={0}
              step={1}
              placeholder="0"
            />
          </Field>
        </FieldGroup>
      </div>

      <SheetFooter className="flex-row items-center justify-end gap-3 border-t px-4 py-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPendingCreateBarber}>
          {isPendingCreateBarber ? "Cadastrando..." : "Cadastrar funcionário"}
        </Button>
      </SheetFooter>
    </form>
  )
}
