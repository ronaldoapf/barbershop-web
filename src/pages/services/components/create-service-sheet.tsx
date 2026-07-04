import { useState } from "react"
import { Plus } from "lucide-react"

import { ServiceForm } from "@/pages/services/components/service-form"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { CategoryResponse } from "@/schemas/catalog"

interface CreateServiceSheetProps {
  order: number
  categories: CategoryResponse[]
}

export function CreateServiceSheet({ order, categories }: CreateServiceSheetProps): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button data-icon="inline-start">
          <Plus />
          Novo serviço
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-3xl">
        <SheetHeader>
          <SheetTitle>Novo serviço</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para adicionar um serviço ao catálogo.
          </SheetDescription>
        </SheetHeader>
        <ServiceForm
          order={order}
          categories={categories}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
