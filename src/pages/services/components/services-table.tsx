import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type Updater,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Scissors, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { useDeleteService, useToggleServiceStatus } from "@/api/services/hooks"
import {
  DataTable,
  type DataTableFilterField,
  DataTableRowActions,
} from "@/components/data-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import type { Service } from "@/api/services/types"

interface ServicesTableProps {
  data: Service[]
  rowCount: number
  pageCount: number
  page: number
  limit: number
  searchParams: URLSearchParams
  setParam: (key: string, value: string | null) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function ServicesTable({
  data,
  rowCount,
  pageCount,
  page,
  limit,
  searchParams,
  setParam,
}: ServicesTableProps): React.JSX.Element {
  const {
    mutateAsync: toggleServiceStatus,
    isPending: isTogglingStatus,
    variables: togglingServiceId,
  } = useToggleServiceStatus()

  const {
    mutateAsync: deleteService,
    isPending: isDeletingService,
    variables: deletingServiceId,
  } = useDeleteService()

  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null)

  const filteredData = useMemo(() => {
    if (!search) return data
    const query = search.toLowerCase()
    return data.filter((service) => service.name.toLowerCase().includes(query))
  }, [data, search])

  const filterFields = useMemo<DataTableFilterField[]>(
    () => [
      {
        id: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "ACTIVE", label: "Ativo" },
          { value: "INACTIVE", label: "Inativo" },
        ],
      },
    ],
    [],
  )

  const columns = useMemo<ColumnDef<Service, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Serviço",
        enableHiding: false,
        cell: ({ row }) => {
          const { name, description } = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Scissors className="size-3.5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-foreground">{name}</span>
                {description && (
                  <span className="truncate text-xs text-muted-foreground">
                    {description}
                  </span>
                )}
              </div>
            </div>
          )
        },
      },
    
      {
        accessorKey: "price",
        header: "Preço",
        cell: ({ getValue }) => (
          <span className="font-medium tabular-nums text-foreground">
            {formatCurrency(getValue<number>())}
          </span>
        ),
      },
      {
        accessorKey: "durationMinutes",
        header: "Duração",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<number>()} min</span>
        ),
      },
      {
        id: "points",
        header: "Pontos",
        enableSorting: false,
        cell: ({ row }) => {
          const { pointsEarned, pointsRequired } = row.original
          if (!pointsEarned && !pointsRequired) {
            return <span className="text-muted-foreground">—</span>
          }
          return (
            <span className="text-muted-foreground tabular-nums">
              {pointsEarned} / {pointsRequired} pts
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const service = row.original
          const isActive = service.status === "ACTIVE"
          const isPendingThisRow = isTogglingStatus && togglingServiceId === service.id
          return (
            <div className="flex items-center gap-2">
              <Switch
                size="sm"
                checked={isActive}
                disabled={isPendingThisRow}
                onCheckedChange={() => {
                  toggleServiceStatus(service.id, {
                    onSuccess: () => toast.success("Status atualizado com sucesso."),
                    onError: () => toast.error("Erro ao atualizar o status do serviço."),
                  })
                }}
              />
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        cell: ({ row }) => {
          const service = row.original
          const isDeletingThisRow = isDeletingService && deletingServiceId === service.id
          return (
            <DataTableRowActions
              actions={[
                {
                  label: isDeletingThisRow ? "Removendo..." : "Remover",
                  icon: <Trash2 className="size-3.5" />,
                  variant: "destructive",
                  onClick: () => setServiceToDelete(service),
                },
              ]}
            />
          )
        },
      },
    ],
    [isTogglingStatus, togglingServiceId, toggleServiceStatus, isDeletingService, deletingServiceId],
  )

  async function handleConfirmDelete(): Promise<void> {
    if (!serviceToDelete) return
    await deleteService(serviceToDelete.id, {
      onSuccess: () => {
        toast.success("Serviço removido com sucesso.")
        setServiceToDelete(null)
      },
      onError: () => toast.error("Erro ao remover o serviço."),
    })
  }

  function handlePaginationChange(updater: Updater<PaginationState>): void {
    const current: PaginationState = { pageIndex: page - 1, pageSize: limit }
    const next = typeof updater === "function" ? updater(current) : updater

    if (next.pageSize !== current.pageSize) {
      setParam("per_page", String(next.pageSize))
      setParam("page", "1")
      return
    }

    if (next.pageIndex !== current.pageIndex) {
      setParam("page", String(next.pageIndex + 1))
    }
  }

  const table = useReactTable({
    data: filteredData,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount,
    rowCount,
    state: {
      sorting,
      pagination: { pageIndex: page - 1, pageSize: limit },
    },
    onSortingChange: setSorting,
    onPaginationChange: handlePaginationChange,
  })

  function resetFilters(): void {
    setSearch("")
    setParam("status", null)
  }

  return (
    <>
      <DataTable
        table={table}
        search={search}
        setParam={setParam}
        onSearchChange={setSearch}
        filterFields={filterFields}
        resetFilters={resetFilters}
        searchParams={searchParams}
        searchPlaceholder="Buscar por nome do serviço..."
      />

      <AlertDialog
        open={serviceToDelete !== null}
        onOpenChange={(open) => !open && setServiceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o serviço "{serviceToDelete?.name}"? Essa ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingService}
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
            >
              {isDeletingService ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
