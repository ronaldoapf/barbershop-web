import { Contact, Sparkles } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useCreateCustomer } from "@/api/users/hooks"
import { InputForm } from "@/components/form/input-form"
import { PasswordInputForm } from "@/components/form/password-input-form"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { SheetFooter } from "@/components/ui/sheet"
import {
  customerFormSchema,
  type CustomerFormData,
  type CustomerFormInput,
} from "@/schemas/user"

interface CustomerFormProps {
  onSuccess: () => void
  onCancel?: () => void
}

export function CustomerForm({ onSuccess, onCancel }: CustomerFormProps): React.JSX.Element {
  const {
    mutateAsync: createCustomer,
    isPending: isPendingCreateCustomer,
  } = useCreateCustomer()

  const form = useForm<CustomerFormInput, unknown, CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  })

  const { control, handleSubmit } = form

  const previewName = useWatch({ control: form.control, name: "name" })
  const previewEmail = useWatch({ control: form.control, name: "email" })

  const onSubmit = handleSubmit(async (data: CustomerFormData) => {
    createCustomer(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Cliente cadastrado com sucesso.")
          form.reset()
          onSuccess()
        },
        onError: () => {
          toast.error("Erro ao cadastrar cliente.")
        },
      }
    )
  })

  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background">
            <Contact className="size-4 text-muted-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {previewName || "Nome do cliente"}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {previewEmail || "email@exemplo.com"}
            </span>
          </div>
          <Sparkles className="size-4 shrink-0 text-muted-foreground/50" />
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nome do cliente</FieldLabel>
            <InputForm
              name="name"
              control={control}
              placeholder="Ex: João da Silva"
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
        </FieldGroup>
      </div>

      <SheetFooter className="flex-row items-center justify-end gap-3 border-t px-4 py-4">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPendingCreateCustomer}>
          {isPendingCreateCustomer ? "Cadastrando..." : "Cadastrar cliente"}
        </Button>
      </SheetFooter>
    </form>
  )
}
