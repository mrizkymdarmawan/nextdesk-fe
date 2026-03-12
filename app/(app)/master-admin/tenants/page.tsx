'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { tenantService } from '@/services/tenant.service'
import type { TenantRecord } from '@/types/master'

const LIMIT = 10

export default function MasterAdminTenantsPage() {
  const [tenants, setTenants] = useState<TenantRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchTenants = useCallback(async () => {
    setLoading(true)
    try {
      const res = await tenantService.list({ page, limit: LIMIT, search: search || undefined })
      setTenants(res.data.data)
      setTotal(res.data.meta.total)
    } catch {
      toast.error('Gagal memuat data tenant')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchTenants() }, [fetchTenants])

  function handleExport(format: 'csv' | 'excel' | 'pdf') {
    const base = process.env.NEXT_PUBLIC_API_URL ?? ''
    const token = localStorage.getItem('token') ?? ''
    window.open(`${base}/api/v1/tenants/export?format=${format}&token=${token}`, '_blank')
  }

  const columns = [
    { key: 'ID', label: 'ID', className: 'w-12' },
    { key: 'Name', label: 'Nama' },
    {
      key: 'SchemaName',
      label: 'Schema',
      render: (r: TenantRecord) => <code className="text-xs">{r.SchemaName}</code>,
    },
    {
      key: 'IsActive',
      label: 'Status',
      render: (r: TenantRecord) => (
        <Badge variant={r.IsActive ? 'default' : 'secondary'}>
          {r.IsActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'CreatedAt',
      label: 'Dibuat',
      render: (r: TenantRecord) => new Date(r.CreatedAt).toLocaleDateString('id-ID'),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tenant</h1>
        <p className="text-muted-foreground">Kelola seluruh tenant yang terdaftar di platform.</p>
      </div>

      <DataTable
        columns={columns}
        data={tenants}
        loading={loading}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Cari tenant..."
        page={page}
        limit={LIMIT}
        total={total}
        onPageChange={setPage}
        onExport={handleExport}
      />
    </div>
  )
}
