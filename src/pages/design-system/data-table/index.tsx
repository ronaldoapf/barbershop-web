import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  DataTable,
  type DataTableFilterField,
  DataTableRowActions,
} from '@/components/data-table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

type UserStatus = 'active' | 'inactive' | 'pending'
type UserRole = 'admin' | 'editor' | 'viewer'
type UserDepartment = 'engineering' | 'design' | 'product' | 'marketing'

interface User {
  id: string
  name: string
  email: string
  status: UserStatus
  role: UserRole
  department: UserDepartment
  createdAt: string
}

const SEED_USERS: User[] = [
  { id: '1', name: 'Ana Souza', email: 'ana.souza@empresa.com', status: 'active', role: 'admin', department: 'engineering', createdAt: '2024-01-15' },
  { id: '2', name: 'Bruno Lima', email: 'bruno.lima@empresa.com', status: 'active', role: 'editor', department: 'design', createdAt: '2024-02-03' },
  { id: '3', name: 'Carla Mendes', email: 'carla.mendes@empresa.com', status: 'inactive', role: 'viewer', department: 'marketing', createdAt: '2024-02-18' },
  { id: '4', name: 'Diego Rocha', email: 'diego.rocha@empresa.com', status: 'pending', role: 'editor', department: 'product', createdAt: '2024-03-07' },
  { id: '5', name: 'Elisa Torres', email: 'elisa.torres@empresa.com', status: 'active', role: 'viewer', department: 'engineering', createdAt: '2024-03-22' },
  { id: '6', name: 'Felipe Castro', email: 'felipe.castro@empresa.com', status: 'active', role: 'admin', department: 'product', createdAt: '2024-04-10' },
  { id: '7', name: 'Gabi Nunes', email: 'gabi.nunes@empresa.com', status: 'inactive', role: 'editor', department: 'design', createdAt: '2024-04-25' },
  { id: '8', name: 'Henrique Pires', email: 'henrique.pires@empresa.com', status: 'active', role: 'viewer', department: 'marketing', createdAt: '2024-05-14' },
  { id: '9', name: 'Isabela Faria', email: 'isabela.faria@empresa.com', status: 'pending', role: 'editor', department: 'engineering', createdAt: '2024-05-30' },
  { id: '10', name: 'João Mello', email: 'joao.mello@empresa.com', status: 'active', role: 'viewer', department: 'design', createdAt: '2024-06-08' },
  { id: '11', name: 'Karina Dias', email: 'karina.dias@empresa.com', status: 'active', role: 'editor', department: 'product', createdAt: '2024-06-21' },
  { id: '12', name: 'Lucas Freitas', email: 'lucas.freitas@empresa.com', status: 'inactive', role: 'viewer', department: 'engineering', createdAt: '2024-07-03' },
  { id: '13', name: 'Marina Costa', email: 'marina.costa@empresa.com', status: 'active', role: 'admin', department: 'marketing', createdAt: '2024-07-19' },
  { id: '14', name: 'Nathan Silva', email: 'nathan.silva@empresa.com', status: 'pending', role: 'viewer', department: 'design', createdAt: '2024-08-05' },
  { id: '15', name: 'Olivia Ramos', email: 'olivia.ramos@empresa.com', status: 'active', role: 'editor', department: 'product', createdAt: '2024-08-22' },
  { id: '16', name: 'Pedro Alves', email: 'pedro.alves@empresa.com', status: 'active', role: 'viewer', department: 'engineering', createdAt: '2024-09-10' },
  { id: '17', name: 'Quézia Lopes', email: 'quezia.lopes@empresa.com', status: 'inactive', role: 'editor', department: 'marketing', createdAt: '2024-09-28' },
  { id: '18', name: 'Rafael Cunha', email: 'rafael.cunha@empresa.com', status: 'active', role: 'admin', department: 'design', createdAt: '2024-10-15' },
  { id: '19', name: 'Sara Moura', email: 'sara.moura@empresa.com', status: 'pending', role: 'viewer', department: 'product', createdAt: '2024-11-02' },
  { id: '20', name: 'Thiago Barros', email: 'thiago.barros@empresa.com', status: 'active', role: 'editor', department: 'engineering', createdAt: '2024-11-18' },
]

const STATUS_MAP: Record<UserStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  active: { label: 'Ativo', variant: 'default' },
  inactive: { label: 'Inativo', variant: 'secondary' },
  pending: { label: 'Pendente', variant: 'outline' },
}

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Visualizador',
}

const DEPARTMENT_LABEL: Record<UserDepartment, string> = {
  engineering: 'Engenharia',
  design: 'Design',
  product: 'Produto',
  marketing: 'Marketing',
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const FILTER_FIELDS: DataTableFilterField[] = [
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
      { value: 'pending', label: 'Pendente' },
    ],
  },
  {
    id: 'role',
    label: 'Papel',
    type: 'select',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'viewer', label: 'Visualizador' },
    ],
  },
  {
    id: 'department',
    label: 'Departamento',
    type: 'multiple',
    options: [
      { value: 'engineering', label: 'Engenharia' },
      { value: 'design', label: 'Design' },
      { value: 'product', label: 'Produto' },
      { value: 'marketing', label: 'Marketing' },
    ],
  },
]

export function DataTablePage() {
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useState(new URLSearchParams())

  function setParam(key: string, value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === null) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      return next
    })
  }

  function resetFilters() {
    setSearch('')
    setSearchParams(new URLSearchParams())
  }

  const filteredData = useMemo(() => {
    let rows = SEED_USERS

    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    }

    const status = searchParams.get('status') as UserStatus | null
    if (status) rows = rows.filter((u) => u.status === status)

    const role = searchParams.get('role') as UserRole | null
    if (role) rows = rows.filter((u) => u.role === role)

    const depts = searchParams.get('department')
    if (depts) {
      const list = depts.split(',').filter(Boolean) as UserDepartment[]
      rows = rows.filter((u) => list.includes(u.department))
    }

    return rows
  }, [search, searchParams])

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'user',
        header: 'Usuário',
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const { name, email } = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback>{initials(name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{name}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue<UserStatus>()
          const { label, variant } = STATUS_MAP[status]
          return <Badge variant={variant}>{label}</Badge>
        },
      },
      {
        accessorKey: 'role',
        header: 'Papel',
        cell: ({ getValue }) => ROLE_LABEL[getValue<UserRole>()],
      },
      {
        accessorKey: 'department',
        header: 'Departamento',
        cell: ({ getValue }) => DEPARTMENT_LABEL[getValue<UserDepartment>()],
      },
      {
        accessorKey: 'createdAt',
        header: 'Criado em',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{formatDate(getValue<string>())}</span>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <DataTableRowActions
            actions={[
              {
                label: 'Editar',
                icon: <Pencil className="size-3.5" />,
                onClick: () => toast.info(`Editando ${row.original.name}`),
              },
              {
                label: 'Remover',
                icon: <Trash2 className="size-3.5" />,
                variant: 'destructive',
                onClick: () => toast.error(`${row.original.name} removido`),
              },
            ]}
          />
        ),
      },
    ],
    [],
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-8 px-6 py-14">
        <header className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Design System / Referência
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Data Table
          </h1>
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            Tabela com busca textual, filtros select e múltipla escolha, ordenação por coluna,
            controle de visibilidade de colunas, ações por linha e paginação.
          </p>
        </header>

        <DataTable
          table={table}
          filterFields={FILTER_FIELDS}
          search={search}
          onSearchChange={setSearch}
          setParam={setParam}
          resetFilters={resetFilters}
          searchParams={searchParams}
          searchPlaceholder="Buscar por nome ou e-mail..."
          title="Usuários"
          onRowClick={(user) => toast(`Selecionado: ${user.name}`)}
        />
      </div>
    </div>
  )
}
