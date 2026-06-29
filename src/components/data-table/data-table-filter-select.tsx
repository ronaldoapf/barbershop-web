import { ChevronDown, X } from 'lucide-react'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { DataTableFilterField } from './types'

interface DataTableFilterSelectProps {
  field: DataTableFilterField
  searchParams: URLSearchParams
  setParam: (key: string, value: string | null) => void
  onRemove: () => void
}

export function DataTableFilterSelect({
  field,
  searchParams,
  setParam,
  onRemove,
}: DataTableFilterSelectProps) {
  const selected = searchParams.get(field.id) ?? ''
  const selectedLabel = field.options?.find((o) => o.value === selected)?.label

  return (
    <div
      className={cn(
        'flex h-8 items-center rounded-md border bg-background text-sm shadow-xs transition-all',
        selected
          ? 'border-primary/40 bg-primary/5'
          : 'border-input hover:border-muted-foreground/40',
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-full items-center gap-1.5 rounded-l-md px-2.5 outline-none transition-colors hover:bg-accent/60 focus-visible:bg-accent/60"
          >
            <span
              className={cn(
                'text-xs font-medium',
                selected ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {field.label}
            </span>
            {selected && (
              <>
                <span className="text-xs text-muted-foreground/40">·</span>
                <span className="max-w-28 truncate font-medium text-foreground">
                  {selectedLabel}
                </span>
              </>
            )}
            <ChevronDown
              className={cn(
                'size-3 shrink-0 transition-colors',
                selected ? 'text-primary' : 'text-muted-foreground',
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          <DropdownMenuLabel>{field.label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuPrimitive.RadioGroup
            value={selected}
            onValueChange={(value) => setParam(field.id, value || null)}
          >
            {field.options?.map((opt) => {
              const isSelected = selected === opt.value
              return (
                <DropdownMenuPrimitive.RadioItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(e) => e.preventDefault()}
                  className="relative flex cursor-default items-center gap-2 rounded-md px-1.5 py-1 text-sm transition-colors outline-none select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"
                >
                  <span
                    className={cn(
                      'flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors',
                      isSelected
                        ? 'border-primary'
                        : 'border-muted-foreground/50',
                    )}
                  >
                    {isSelected && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </span>
                  {opt.label}
                </DropdownMenuPrimitive.RadioItem>
              )
            })}
          </DropdownMenuPrimitive.RadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="h-4 w-px shrink-0 bg-border" />

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${field.label} filter`}
        className="flex h-full w-8 items-center justify-center rounded-r-md text-muted-foreground outline-none transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:bg-accent/60"
      >
        <X className="size-3" />
      </button>
    </div>
  )
}
