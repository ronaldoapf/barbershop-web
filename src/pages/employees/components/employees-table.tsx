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

import { useDeleteBarber } from "@/api/users/hooks"
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
import { Badge } from "@/components/ui/badge"
import type { BarberResponse } from "@/schemas/user"

interface EmployeesTableProps {
  data: BarberResponse[]
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

export function EmployeesTable({
  data,
  rowCount,
  pageCount,
  page,
  limit,
  searchParams,
  setParam,
}: EmployeesTableProps): React.JSX.Element {
  const {
    mutateAsync: deleteBarber,
    isPending: isDeletingBarber,
    variables: deletingBarberId,
  } = useDeleteBarber()

  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [employeeToDelete, setEmployeeToDelete] = useState<BarberResponse | null>(null)

  const filteredData = useMemo(() => {
    if (!search) return data
    const query = search.toLowerCase()
    return data.filter(
      (employee) =>
        employee.user.name.toLowerCase().includes(query) ||
        employee.user.email.toLowerCase().includes(query),
    )
  }, [data, search])

  const columns = useMemo<ColumnDef<BarberResponse, unknown>[]>(
    () => [
      {
        id: "name",
        accessorFn: (row) => row.user.name,
        header: "Funcionário",
        enableHiding: false,
        cell: ({ row }) => {
          const { name, email } = row.original.user
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Scissors className="size-3.5" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium text-foreground">{name}</span>
                <span className="truncate text-xs text-muted-foreground">{email}</span>
              </div>
            </div>
          )
        },
      },
      {
        id: "phone",
        accessorFn: (row) => row.user.phone,
        header: "Telefone",
        enableSorting: false,
        cell: ({ getValue }) => {
          const phone = getValue<string | null>()
          return phone ? (
            <span className="text-muted-foreground">{phone}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
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
          const employee = row.original
          const isDeletingThisRow = isDeletingBarber && deletingBarberId === employee.id
          return (
            <DataTableRowActions
              actions={[
                {
                  label: isDeletingThisRow ? "Removendo..." : "Remover",
                  icon: <Trash2 className="size-3.5" />,
                  variant: "destructive",
                  onClick: () => setEmployeeToDelete(employee),
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
    if (!employeeToDelete) return
    await deleteBarber(employeeToDelete.id, {
      onSuccess: () => {
        toast.success("Funcionário removido com sucesso.")
        setEmployeeToDelete(null)
      },
      onError: () => toast.error("Erro ao remover o funcionário."),
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
        searchPlaceholder="Buscar por nome ou e-mail..."
      />

      <AlertDialog
        open={employeeToDelete !== null}
        onOpenChange={(open) => !open && setEmployeeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover funcionário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o funcionário "{employeeToDelete?.user.name}"? Essa
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
