import type { Column, Table as TanstackTable } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'
import type React from 'react'
import { useEffect, useRef } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableEmpty } from './data-table-empty'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import type { DataTableFilterField } from './types'

interface DataTableProps<TData> {
  table: TanstackTable<TData>
  filterFields?: DataTableFilterField[]
  search?: string
  onSearchChange?: (value: string) => void
  setParam?: (key: string, value: string | null) => void
  resetFilters?: () => void
  searchParams?: URLSearchParams
  isLoading?: boolean
  searchPlaceholder?: string
  onRowClick?: (row: TData) => void
  hideToolbar?: boolean
  hidePagination?: boolean
  title?: React.ReactNode
  actions?: React.ReactNode
  emptyState?: React.ReactNode
}

function getPinnedStyles<TData>(
  column: Column<TData, unknown>,
  isOverflowing: boolean,
): React.CSSProperties {
  const pinned = column.getIsPinned()
  if (!pinned || !isOverflowing) return {}
  return {
    position: 'sticky',
    right: pinned === 'right' ? column.getAfter('right') : undefined,
    left: pinned === 'left' ? column.getStart('left') : undefined,
    zIndex: 1,
  }
}

export function DataTable<TData>({
  table,
  filterFields,
  search = '',
  onSearchChange = () => {},
  setParam = () => {},
  resetFilters = () => {},
  searchParams = new URLSearchParams(),
  isLoading = false,
  searchPlaceholder,
  onRowClick,
  hideToolbar = false,
  hidePagination = false,
  title,
  actions,
  emptyState,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows
  const columns = table.getAllColumns()
  const colSpan = columns.length

  const wrapperRef = useRef<HTMLDivElement>(null)

  const hasActionsColumn = columns.some((col) => col.id === 'actions')
  const existingPinning = table.getState().columnPinning
  const initialPinningRef = useRef({
    ...existingPinning,
    right: hasActionsColumn
      ? Array.from(new Set([...(existingPinning.right ?? []), 'actions']))
      : (existingPinning.right ?? []),
  })

  useEffect(() => {
    if (hasActionsColumn) {
      table.setColumnPinning(initialPinningRef.current)
    }
  }, [hasActionsColumn, table])

  return (
    <div ref={wrapperRef} className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Title / Actions header */}
      {(title || actions) && (
        <div className="flex items-center justify-between border-b px-4 py-3">
          {title && (
            <h3 className="text-sm font-semibold">{title}</h3>
          )}
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
      )}

      {/* Toolbar */}
      {!hideToolbar && (
        <div className="border-b px-4 py-3">
          <DataTableToolbar
            table={table}
            search={search}
            onSearchChange={onSearchChange}
            setParam={setParam}
            resetFilters={resetFilters}
            searchParams={searchParams}
            filterFields={filterFields}
            searchPlaceholder={searchPlaceholder}
          />
        </div>
      )}

      {/* Table */}
      <Table className="w-full caption-bottom text-sm">
        <TableHeader className="[&_tr]:border-b sticky top-0 z-10 bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const pinned = header.column.getIsPinned()
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.column.id === 'actions' ? 65 : undefined,
                      ...getPinnedStyles(header.column, true),
                    }}
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                      pinned === 'right' &&
                        'border-l border-l-border/60 bg-muted shadow-[-4px_0_8px_-2px_oklch(0_0_0/0.06)] text-center',
                      pinned === 'left' &&
                        'border-r border-r-border/60 bg-muted shadow-[4px_0_8px_-2px_oklch(0_0_0/0.06)]',
                    )}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <DataTableColumnHeader
                        column={header.column}
                        title={
                          typeof header.column.columnDef.header === 'string'
                            ? header.column.columnDef.header
                            : header.id
                        }
                      />
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable id
              <TableRow key={i}>
                {Array.from({ length: colSpan }).map((__, j) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells have no stable id
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                onClick={
                  onRowClick
                    ? (e) => {
                        if ((e.target as HTMLElement).closest('button, a, input, [role="menuitem"], [role="menu"]')) return
                        onRowClick(row.original)
                      }
                    : undefined
                }
                className={onRowClick ? 'cursor-pointer' : undefined}
              >
                {row.getVisibleCells().map((cell) => {
                  const pinned = cell.column.getIsPinned()
                  return (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.id === 'actions' ? 48 : undefined,
                        ...getPinnedStyles(cell.column, true),
                      }}
                      className={cn(
                        cell.column.id === 'actions' && 'px-1 text-center',
                        pinned === 'right' &&
                          'border-l border-l-border/60 bg-background shadow-[-4px_0_8px_-2px_oklch(0_0_0/0.06)]',
                        pinned === 'left' &&
                          'border-r border-r-border/60 bg-background shadow-[4px_0_8px_-2px_oklch(0_0_0/0.06)]',
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colSpan} className="p-0">
                {emptyState ?? <DataTableEmpty />}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!hidePagination && (
        <div className="border-t px-4 py-3">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  )
}
