import { useState } from "react"
import { UserPlus } from "lucide-react"

import { CustomerForm } from "@/pages/customers/components/customer-form"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function CreateCustomerSheet(): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button data-icon="inline-start">
          <UserPlus />
          Novo cliente
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-3xl">
        <SheetHeader>
          <SheetTitle>Novo cliente</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para cadastrar um cliente na base da barbearia.
          </SheetDescription>
        </SheetHeader>
        <CustomerForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
