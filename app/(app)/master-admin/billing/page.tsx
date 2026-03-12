'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Plus, MoreHorizontal, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { billingService } from '@/services/billing.service'
import { planService } from '@/services/plan.service'
import type { Billing, Plan } from '@/types/master'

const LIMIT = 10

const STATUS_OPTIONS = ['pending', 'paid', 'expired', 'cancelled', 'failed']

function statusBadge(status: string | null) {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    paid: 'default',
    pending: 'secondary',
    expired: 'outline',
    cancelled: 'outline',
    failed: 'destructive',
  }
  return <Badge variant={map[status ?? ''] ?? 'secondary'}>{status ?? '-'}</Badge>
}

export default function MasterAdminBillingPage() {
  const [billings, setBillings] = useState<Billing[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [createOpen, setCreateOpen] = useState(false)
  const [statusBilling, setStatusBilling] = useState<Billing | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [createForm, setCreateForm] = useState({
    user_id: '',
    plan_id: '',
    billing_cycle: 'monthly',
    amount: '',
    started_at: '',
    expires_at: '',
  })

  const [statusForm, setStatusForm] = useState({ status: '', notes: '' })

  const fetchBillings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await billingService.list({ page, limit: LIMIT })
      setBillings(res.data.data)
      setTotal(res.data.meta.total)
    } catch {
      toast.error('Gagal memuat data tagihan')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchBillings() }, [fetchBillings])

  useEffect(() => {
    planService.list({ limit: 100 }).then(res => setPlans(res.data.data)).catch(() => {})
  }, [])

  async function handleCreate() {
    if (!createForm.user_id || !createForm.plan_id || !createForm.amount) {
      toast.error('User ID, paket, dan jumlah wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      await billingService.create({
        user_id: Number(createForm.user_id),
        plan_id: Number(createForm.plan_id),
        billing_cycle: createForm.billing_cycle as 'monthly' | 'yearly',
        amount: Number(createForm.amount),
        started_at: createForm.started_at,
        expires_at: createForm.expires_at,
      })
      toast.success('Tagihan berhasil dibuat')
      setCreateOpen(false)
      fetchBillings()
    } catch {
      toast.error('Gagal membuat tagihan')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdateStatus() {
    if (!statusBilling || !statusForm.status) {
      toast.error('Status wajib dipilih')
      return
    }
    setSubmitting(true)
    try {
      await billingService.updateStatus(statusBilling.ID, {
        status: statusForm.status,
        notes: statusForm.notes || undefined,
      })
      toast.success('Status tagihan diperbarui')
      setStatusBilling(null)
      fetchBillings()
    } catch {
      toast.error('Gagal memperbarui status')
    } finally {
      setSubmitting(false)
    }
  }

  function handleExport(format: 'csv' | 'excel' | 'pdf') {
    const base = process.env.NEXT_PUBLIC_API_URL ?? ''
    const token = localStorage.getItem('token') ?? ''
    window.open(`${base}/api/v1/billings/export?format=${format}&token=${token}`, '_blank')
  }

  const columns = [
    { key: 'ID', label: 'ID', className: 'w-12' },
    { key: 'UserID', label: 'User ID', render: (r: Billing) => r.UserID ?? '-' },
    {
      key: 'Plan',
      label: 'Paket',
      render: (r: Billing) => {
        const p = plans.find(pl => pl.ID === r.PlanID)
        return p?.Name ?? (r.PlanID ? `#${r.PlanID}` : '-')
      },
    },
    { key: 'BillingCycle', label: 'Siklus', render: (r: Billing) => r.BillingCycle ?? '-' },
    {
      key: 'Amount',
      label: 'Jumlah',
      render: (r: Billing) => r.Amount != null
        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(r.Amount)
        : '-',
    },
    { key: 'Status', label: 'Status', render: (r: Billing) => statusBadge(r.Status) },
    {
      key: 'ExpiresAt',
      label: 'Berakhir',
      render: (r: Billing) => r.ExpiresAt ? new Date(r.ExpiresAt).toLocaleDateString('id-ID') : '-',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tagihan</h1>
          <p className="text-muted-foreground">Kelola tagihan dan langganan pengguna.</p>
        </div>
        <Button onClick={() => {
          setCreateForm({ user_id: '', plan_id: '', billing_cycle: 'monthly', amount: '', started_at: '', expires_at: '' })
          setCreateOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Tagihan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={billings}
        loading={loading}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Cari tagihan..."
        page={page}
        limit={LIMIT}
        total={total}
        onPageChange={setPage}
        onExport={handleExport}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8" render={<span />}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => {
                  setStatusForm({ status: row.Status ?? '', notes: '' })
                  setStatusBilling(row)
                }}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Status
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Tambah Tagihan</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>User ID</Label>
              <Input type="number" value={createForm.user_id} onChange={e => setCreateForm(f => ({ ...f, user_id: e.target.value }))} placeholder="ID pengguna" />
            </div>
            <div className="space-y-1.5">
              <Label>Paket</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus:ring-1 focus:ring-ring"
                value={createForm.plan_id}
                onChange={e => setCreateForm(f => ({ ...f, plan_id: e.target.value }))}
              >
                <option value="">Pilih paket</option>
                {plans.map(p => <option key={p.ID} value={p.ID}>{p.Name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Siklus</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus:ring-1 focus:ring-ring"
                value={createForm.billing_cycle}
                onChange={e => setCreateForm(f => ({ ...f, billing_cycle: e.target.value }))}
              >
                <option value="monthly">Bulanan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Jumlah (IDR)</Label>
              <Input type="number" value={createForm.amount} onChange={e => setCreateForm(f => ({ ...f, amount: e.target.value }))} placeholder="150000" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Mulai</Label>
                <Input type="date" value={createForm.started_at} onChange={e => setCreateForm(f => ({ ...f, started_at: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Berakhir</Label>
                <Input type="date" value={createForm.expires_at} onChange={e => setCreateForm(f => ({ ...f, expires_at: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!statusBilling} onOpenChange={(o) => { if (!o) setStatusBilling(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Update Status Tagihan #{statusBilling?.ID}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus:ring-1 focus:ring-ring"
                value={statusForm.status}
                onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))}
              >
                <option value="">Pilih status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Catatan (opsional)</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus:ring-1 focus:ring-ring"
                value={statusForm.notes}
                onChange={e => setStatusForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Catatan..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusBilling(null)}>Batal</Button>
            <Button onClick={handleUpdateStatus} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
