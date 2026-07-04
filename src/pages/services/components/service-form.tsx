import { Scissors, Sparkles } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useCreateService } from "@/api/catalog/hooks"
import { CurrencyInputForm } from "@/components/form/currency-input-form"
import { InputForm } from "@/components/form/input-form"
import { NumberInputForm } from "@/components/form/number-input-form"
import { SelectForm } from "@/components/form/select-form"
import { TextareaForm } from "@/components/form/textarea-form"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { SheetFooter } from "@/components/ui/sheet"
import {
  serviceFormSchema,
  type CategoryResponse,
  type ServiceFormData,
  type ServiceFormInput,
} from "@/schemas/catalog"

interface ServiceFormProps {
  order: number
  categories: CategoryResponse[]
  onSuccess: () => void
  onCancel?: () => void
}

export function ServiceForm({ order, categories, onSuccess, onCancel }: ServiceFormProps): React.JSX.Element {
  const {
    mutateAsync: createService, 
    isPending: isPendingCreateService 
  } = useCreateService()

  const form = useForm<ServiceFormInput, unknown, ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      price: "",
      categoryId: "",
      description: "",
      pointsEarned: "",
      pointsRequired: "",
      durationMinutes: "",
    },
  })
  
  const { control, handleSubmit } = form

  const previewName = useWatch({ control: form.control, name: "name" })
  const previewPrice = useWatch({ control: form.control, name: "price" })
  const previewDuration = useWatch({ control: form.control, name: "durationMinutes" })

  const onSubmit = handleSubmit(async (data: ServiceFormData) => {
    createService(
      {
        name: data.name,
        categoryId: data.categoryId || undefined,
        description: data.description || undefined,
        price: data.price,
        durationMinutes: data.durationMinutes,
        order,
        pointsEarned: data.pointsEarned,
        pointsRequired: data.pointsRequired,
      },
      {
        onSuccess: () => {
          toast.success("Serviço criado com sucesso.")
          form.reset()
          onSuccess()
        },
        onError: () => {
          toast.error("Erro ao criar serviço.")
        },
      }
    )
  })

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(previewPrice) || 0)

  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background">
            <Scissors className="size-4 text-muted-foreground" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-foreground">
              {previewName || "Nome do serviço"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formattedPrice} · {Number(previewDuration) || 0} min
            </span>
          </div>
          <Sparkles className="size-4 shrink-0 text-muted-foreground/50" />
        </div>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Nome do serviço</FieldLabel>
            <InputForm
              name="name"
              control={control}
              placeholder="Ex: Corte degradê"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="categoryId">Categoria</FieldLabel>
            <SelectForm
              name="categoryId"
              control={control}
              placeholder="Selecione uma categoria"
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <TextareaForm
              rows={3}
              name="description"
              control={control}
              placeholder="Detalhes que ajudam clientes a entender o serviço"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="price">Preço</FieldLabel>
              <CurrencyInputForm
                name="price"
                control={control}
                placeholder="0,00"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="durationMinutes">Duração</FieldLabel>
              <NumberInputForm
                name="durationMinutes"
                control={control}
                suffix="min"
                min={5}
                step={5}
                placeholder="30"
              />
            </Field>
          </div>

          <FieldSeparator>Fidelidade (opcional)</FieldSeparator>
          
          <FieldDescription>
            Defina quantos pontos de fidelidade este serviço gera ou consome, se aplicável.
          </FieldDescription>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="pointsEarned">Pontos gerados</FieldLabel>
              <NumberInputForm
                name="pointsEarned"
                control={control}
                suffix="pts"
                min={0}
                placeholder="0"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="pointsRequired">Pontos p/ resgate</FieldLabel>
              <NumberInputForm
                name="pointsRequired"
                control={control}
                suffix="pts"
                min={0}
                placeholder="0"
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
        <Button type="submit" disabled={isPendingCreateService}>
          {isPendingCreateService ? "Criando..." : "Criar serviço"}
        </Button>
      </SheetFooter>
    </form>
  )
}
