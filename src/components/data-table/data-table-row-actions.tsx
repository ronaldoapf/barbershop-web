import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// type ActionType = 'edit' | 'delete'

export interface RowAction {
  label: string
  icon: ReactNode
  onClick: () => void
  variant?: 'default' | 'destructive'
}

// const ACTION_CONFIG: Record<
//   ActionType,
//   { label: string; icon: React.ReactNode; variant?: 'destructive' }
// > = {
//   edit: { label: 'Editar', icon: <Pencil className="size-3.5" /> },
//   delete: {
//     label: 'Remover',
//     icon: <Trash2 className="size-3.5" />,
//     variant: 'destructive',
//   },
// }

interface DataTableRowActionsProps {
  actions: RowAction[]
}

export function DataTableRowActions({ actions }: DataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map(({ label, icon, onClick, variant }) => {
          return (
            <DropdownMenuItem key={label} variant={variant} onClick={onClick}>
              {icon}
              {label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
