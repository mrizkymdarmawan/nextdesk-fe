'use client'

import { Search, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface Column<T> {
  key: string
  label: string
  className?: string
  render?: (row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  // Search
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  // Pagination
  page?: number
  limit?: number
  total?: number
  onPageChange?: (page: number) => void
  // Export
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void
  // Row actions
  actions?: (row: T) => React.ReactNode
  // Misc
  emptyText?: string
  filterSlot?: React.ReactNode
}

const SKELETON_ROWS = 5

export function DataTable<T>({
  columns,
  data,
  loading = false,
  search,
  onSearch,
  searchPlaceholder = 'Cari…',
  page = 1,
  limit = 10,
  total = 0,
  onPageChange,
  onExport,
  actions,
  emptyText = 'Tidak ada data.',
  filterSlot,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const exportLabels: { format: 'csv' | 'excel' | 'pdf'; label: string }[] = [
    { format: 'csv', label: 'CSV' },
    { format: 'excel', label: 'Excel' },
    { format: 'pdf', label: 'PDF' },
  ]

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {(onSearch || filterSlot || onExport) && (
        <div className="flex flex-wrap items-center gap-2">
          {onSearch && (
            <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search ?? ''}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {filterSlot && (
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            )}
            {filterSlot}

            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm" className="gap-2" render={<span />}>
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Ekspor</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuGroup>
                    {exportLabels.map(({ format, label }) => (
                      <DropdownMenuItem key={format} onClick={() => onExport(format)}>
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="w-20 text-right">Aksi</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '-')}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {from}–{to} dari {total} data
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Sebelumnya</span>
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages || loading}
            >
              <span className="hidden sm:inline mr-1">Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
