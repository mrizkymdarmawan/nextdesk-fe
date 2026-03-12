'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import { planService } from '@/services/plan.service'
import type { Plan, CreatePlanPayload } from '@/types/master'

const LIMIT = 10

type PlanForm = {
  name: string
  slug: string
  description: string
  price_monthly: string
  price_yearly: string
  features: string
  max_users: string
  trial_days: string
  sort_order: string
  is_active: boolean
}

const emptyForm: PlanForm = {
  name: '',
  slug: '',
  description: '',
  price_monthly: '',
  price_yearly: '',
  features: '',
  max_users: '',
  trial_days: '0',
  sort_order: '0',
  is_active: true,
}

function formToPayload(form: PlanForm): CreatePlanPayload {
  return {
    name: form.name,
    slug: form.slug,
    description: form.description || undefined,
    price_monthly: Number(form.price_monthly),
    price_yearly: Number(form.price_yearly),
    features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
    max_users: Number(form.max_users),
    trial_days: Number(form.trial_days),
    sort_order: Number(form.sort_order),
    is_active: form.is_active,
  }
}

export default function MasterAdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [createOpen, setCreateOpen] = useState(false)
  const [editPlan, setEditPlan] = useState<Plan | null>(null)
  const [deletePlan, setDeletePlan] = useState<Plan | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<PlanForm>(emptyForm)

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    try {
      const res = await planService.list({ page, limit: LIMIT })
      setPlans(res.data.data)
      setTotal(res.data.meta.total)
    } catch {
      toast.error('Gagal memuat data paket')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  function openCreate() {
    setForm(emptyForm)
    setCreateOpen(true)
  }

  function openEdit(plan: Plan) {
    setForm({
      name: plan.Name ?? '',
      slug: plan.Slug ?? '',
      description: plan.Description ?? '',
      price_monthly: String(plan.PriceMonthly ?? ''),
      price_yearly: String(plan.PriceYearly ?? ''),
      features: (plan.Features ?? []).join(', '),
      max_users: String(plan.MaxUsers ?? ''),
      trial_days: String(plan.TrialDays),
      sort_order: String(plan.SortOrder),
      is_active: plan.IsActive,
    })
    setEditPlan(plan)
  }

  async function handleCreate() {
    if (!form.name || !form.slug) {
      toast.error('Nama dan slug wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      await planService.create(formToPayload(form))
      toast.success('Paket berhasil dibuat')
      setCreateOpen(false)
      fetchPlans()
    } catch {
      toast.error('Gagal membuat paket')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit() {
    if (!editPlan || !form.name || !form.slug) {
      toast.error('Nama dan slug wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      await planService.update(editPlan.ID, formToPayload(form))
      toast.success('Paket berhasil diperbarui')
      setEditPlan(null)
      fetchPlans()
    } catch {
      toast.error('Gagal memperbarui paket')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deletePlan) return
    try {
      await planService.delete(deletePlan.ID)
      toast.success('Paket berhasil dihapus')
      setDeletePlan(null)
      fetchPlans()
    } catch {
      toast.error('Gagal menghapus paket')
    }
  }

  function handleExport(format: 'csv' | 'excel' | 'pdf') {
    const base = process.env.NEXT_PUBLIC_API_URL ?? ''
    const token = localStorage.getItem('token') ?? ''
    window.open(`${base}/api/v1/plans/export?format=${format}&token=${token}`, '_blank')
  }

  const fmt = (n: number | null) => n != null
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
    : '-'

  const columns = [
    { key: 'Name', label: 'Nama', render: (r: Plan) => r.Name ?? '-' },
    { key: 'Slug', label: 'Slug', render: (r: Plan) => <code className="text-xs">{r.Slug ?? '-'}</code> },
    { key: 'PriceMonthly', label: 'Harga/Bulan', render: (r: Plan) => fmt(r.PriceMonthly) },
    { key: 'PriceYearly', label: 'Harga/Tahun', render: (r: Plan) => fmt(r.PriceYearly) },
    { key: 'MaxUsers', label: 'Maks User', render: (r: Plan) => r.MaxUsers ?? '-' },
    {
      key: 'IsActive',
      label: 'Status',
      render: (r: Plan) => (
        <Badge variant={r.IsActive ? 'default' : 'secondary'}>
          {r.IsActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
  ]

  const PlanFormFields = ({ f, setF }: { f: PlanForm; setF: (fn: (prev: PlanForm) => PlanForm) => void }) => (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Nama</Label>
          <Input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Starter" />
        </div>
        <div className="space-y-1.5">
          <Label>Slug</Label>
          <Input value={f.slug} onChange={e => setF(p => ({ ...p, slug: e.target.value }))} placeholder="starter" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Deskripsi</Label>
        <Input value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} placeholder="Opsional" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Harga Bulanan (IDR)</Label>
          <Input type="number" value={f.price_monthly} onChange={e => setF(p => ({ ...p, price_monthly: e.target.value }))} placeholder="150000" />
        </div>
        <div className="space-y-1.5">
          <Label>Harga Tahunan (IDR)</Label>
          <Input type="number" value={f.price_yearly} onChange={e => setF(p => ({ ...p, price_yearly: e.target.value }))} placeholder="1500000" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Fitur (pisah dengan koma)</Label>
        <Input value={f.features} onChange={e => setF(p => ({ ...p, features: e.target.value }))} placeholder="Fitur A, Fitur B, Fitur C" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label>Maks Pengguna</Label>
          <Input type="number" value={f.max_users} onChange={e => setF(p => ({ ...p, max_users: e.target.value }))} placeholder="10" />
        </div>
        <div className="space-y-1.5">
          <Label>Trial (hari)</Label>
          <Input type="number" value={f.trial_days} onChange={e => setF(p => ({ ...p, trial_days: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Urutan</Label>
          <Input type="number" value={f.sort_order} onChange={e => setF(p => ({ ...p, sort_order: e.target.value }))} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="plan-active"
          checked={f.is_active}
          onChange={e => setF(p => ({ ...p, is_active: e.target.checked }))}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="plan-active">Aktif</Label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paket</h1>
          <p className="text-muted-foreground">Kelola paket langganan yang tersedia di platform.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        loading={loading}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Cari paket..."
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
                <DropdownMenuItem onClick={() => openEdit(row)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => setDeletePlan(row)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Tambah Paket</DialogTitle></DialogHeader>
          <PlanFormFields f={form} setF={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editPlan} onOpenChange={(o) => { if (!o) setEditPlan(null) }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Edit Paket</DialogTitle></DialogHeader>
          <PlanFormFields f={form} setF={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlan(null)}>Batal</Button>
            <Button onClick={handleEdit} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={!!deletePlan} onOpenChange={(o) => { if (!o) setDeletePlan(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Paket</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus paket <strong>{deletePlan?.Name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
