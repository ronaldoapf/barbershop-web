import { useState } from "react"
import { UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ProfessionalForm } from "./professional-form"

export function CreateProfessionalSheet(): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button data-icon="inline-start">
          <UserPlus />
          Novo Profissional
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-3xl">
        <SheetHeader>
          <SheetTitle>Novo Profissional</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para cadastrar um barbeiro na equipe.
          </SheetDescription>
        </SheetHeader>
        <ProfessionalForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
