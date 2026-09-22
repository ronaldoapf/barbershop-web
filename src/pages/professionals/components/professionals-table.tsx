import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type Updater,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { useDeleteBarber } from "@/api/users/hooks"
import type { ActiveBarber } from "@/api/barbers/types"
import {
  DataTable,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ProfessionalsTableProps {
  data: ActiveBarber[]
  rowCount: number
  pageCount: number
  page: number
  limit: number
  searchParams: URLSearchParams
  setParam: (key: string, value: string | null) => void
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value))
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function ProfessionalsTable({
  data,
  rowCount,
  pageCount,
  page,
  limit,
  searchParams,
  setParam,
}: ProfessionalsTableProps): React.JSX.Element {
  const {
    mutateAsync: deleteBarber,
    isPending: isDeletingBarber,
    variables: deletingBarberId,
  } = useDeleteBarber()

  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [professionalToDelete, setProfessionalToDelete] = useState<ActiveBarber | null>(null)

  const filteredData = useMemo(() => {
    if (!search) return data
    const query = search.toLowerCase()
    return data.filter((professional) => professional.name.toLowerCase().includes(query))
  }, [data, search])

  const columns = useMemo<ColumnDef<ActiveBarber, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Profissional",
        enableHiding: false,
        cell: ({ row }) => {
          const { name, avatarUrl } = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={avatarUrl ?? undefined} alt={name} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate font-medium text-foreground">{name}</span>
            </div>
          )
        },
      },
      {
        accessorKey: "commissionPercentage",
        header: "Comissão",
        cell: ({ getValue }) => (
          <span className="font-medium tabular-nums text-foreground">{getValue<number>()}%</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Cadastrado em",
        cell: ({ getValue }) => (
          <Badge variant="outline">{formatDate(getValue<string>())}</Badge>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        enableSorting: false,
        cell: ({ row }) => {
          const professional = row.original
          const isDeletingThisRow = isDeletingBarber && deletingBarberId === professional.id
          return (
            <DataTableRowActions
              actions={[
                {
                  label: isDeletingThisRow ? "Removendo..." : "Remover",
                  icon: <Trash2 className="size-3.5" />,
                  variant: "destructive",
                  onClick: () => setProfessionalToDelete(professional),
                },
              ]}
            />
          )
        },
      },
    ],
    [isDeletingBarber, deletingBarberId],
  )

  async function handleConfirmDelete(): Promise<void> {
    if (!professionalToDelete) return
    await deleteBarber(professionalToDelete.id, {
      onSuccess: () => {
        toast.success("Profissional removido com sucesso.")
        setProfessionalToDelete(null)
      },
      onError: () => toast.error("Erro ao remover o Profissional."),
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
  }

  return (
    <>
      <DataTable
        table={table}
        search={search}
        setParam={setParam}
        onSearchChange={setSearch}
        resetFilters={resetFilters}
        searchParams={searchParams}
        searchPlaceholder="Buscar por nome..."
      />

      <AlertDialog
        open={professionalToDelete !== null}
        onOpenChange={(open) => !open && setProfessionalToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Profissional</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o Profissional "{professionalToDelete?.name}"? Essa
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingBarber}
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
            >
              {isDeletingBarber ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
