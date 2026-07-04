import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type Updater,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Contact, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { useDeleteCustomer } from "@/api/users/hooks"
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
import type { UserResponse } from "@/schemas/user"

interface CustomersTableProps {
  data: UserResponse[]
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

export function CustomersTable({
  data,
  rowCount,
  pageCount,
  page,
  limit,
  searchParams,
  setParam,
}: CustomersTableProps): React.JSX.Element {
  const {
    mutateAsync: deleteCustomer,
    isPending: isDeletingCustomer,
    variables: deletingCustomerId,
  } = useDeleteCustomer()

  const [search, setSearch] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [customerToDelete, setCustomerToDelete] = useState<UserResponse | null>(null)

  const filteredData = useMemo(() => {
    if (!search) return data
    const query = search.toLowerCase()
    return data.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query),
    )
  }, [data, search])

  const columns = useMemo<ColumnDef<UserResponse, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Cliente",
        enableHiding: false,
        cell: ({ row }) => {
          const { name, email } = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Contact className="size-3.5" />
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
        accessorKey: "phone",
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
        accessorKey: "loyaltyPoints",
        header: "Pontos",
        cell: ({ getValue }) => (
          <span className="font-medium tabular-nums text-foreground">{getValue<number>()} pts</span>
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
          const customer = row.original
          const isDeletingThisRow = isDeletingCustomer && deletingCustomerId === customer.id
          return (
            <DataTableRowActions
              actions={[
                {
                  label: isDeletingThisRow ? "Removendo..." : "Remover",
                  icon: <Trash2 className="size-3.5" />,
                  variant: "destructive",
                  onClick: () => setCustomerToDelete(customer),
                },
              ]}
            />
          )
        },
      },
    ],
    [isDeletingCustomer, deletingCustomerId],
  )

  async function handleConfirmDelete(): Promise<void> {
    if (!customerToDelete) return
    await deleteCustomer(customerToDelete.id, {
      onSuccess: () => {
        toast.success("Cliente removido com sucesso.")
        setCustomerToDelete(null)
      },
      onError: () => toast.error("Erro ao remover o cliente."),
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
        open={customerToDelete !== null}
        onOpenChange={(open) => !open && setCustomerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o cliente "{customerToDelete?.name}"? Essa ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingCustomer}
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
            >
              {isDeletingCustomer ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
