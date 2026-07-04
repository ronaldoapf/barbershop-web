import { useState } from "react"
import { UserPlus } from "lucide-react"

import { EmployeeForm } from "@/pages/employees/components/employee-form"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function CreateEmployeeSheet(): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button data-icon="inline-start">
          <UserPlus />
          Novo funcionário
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-3xl">
        <SheetHeader>
          <SheetTitle>Novo funcionário</SheetTitle>
          <SheetDescription>
            Preencha os dados abaixo para cadastrar um barbeiro na equipe.
          </SheetDescription>
        </SheetHeader>
        <EmployeeForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
