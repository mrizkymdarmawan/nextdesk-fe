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
import { permissionService } from '@/services/permission.service'
import type { PermissionRecord, PermissionPayload } from '@/types/master'

const LIMIT = 10

type PermForm = { name: string; slug: string; group_name: string; description: string }
const emptyForm: PermForm = { name: '', slug: '', group_name: '', description: '' }

export default function MasterAdminPermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [groups, setGroups] = useState<string[]>([])

  const [createOpen, setCreateOpen] = useState(false)
  const [editPerm, setEditPerm] = useState<PermissionRecord | null>(null)
  const [deletePerm, setDeletePerm] = useState<PermissionRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<PermForm>(emptyForm)

  const fetchPermissions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await permissionService.list({
        page,
        limit: LIMIT,
        search: search || undefined,
        group_name: groupFilter || undefined,
      })
      setPermissions(res.data.data)
      setTotal(res.data.meta.total)
    } catch {
      toast.error('Gagal memuat data hak akses')
    } finally {
      setLoading(false)
    }
  }, [page, search, groupFilter])

  useEffect(() => { fetchPermissions() }, [fetchPermissions])

  // Fetch all to get distinct groups (once)
  useEffect(() => {
    permissionService.list({ limit: 500 }).then(res => {
      const distinct = [...new Set(res.data.data.map(p => p.GroupName).filter(Boolean))]
      setGroups(distinct)
    }).catch(() => {})
  }, [])

  function openCreate() {
    setForm(emptyForm)
    setCreateOpen(true)
  }

  function openEdit(perm: PermissionRecord) {
    setForm({
      name: perm.Name,
      slug: perm.Slug,
      group_name: perm.GroupName,
      description: perm.Description ?? '',
    })
    setEditPerm(perm)
  }

  async function handleCreate() {
    if (!form.name || !form.slug || !form.group_name) {
      toast.error('Nama, slug, dan grup wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      const payload: PermissionPayload = {
        name: form.name,
        slug: form.slug,
        group_name: form.group_name,
        description: form.description || undefined,
      }
      await permissionService.create(payload)
      toast.success('Hak akses berhasil dibuat')
      setCreateOpen(false)
      fetchPermissions()
    } catch {
      toast.error('Gagal membuat hak akses')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit() {
    if (!editPerm || !form.name || !form.slug || !form.group_name) {
      toast.error('Nama, slug, dan grup wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      const payload: PermissionPayload = {
        name: form.name,
        slug: form.slug,
        group_name: form.group_name,
        description: form.description || undefined,
      }
      await permissionService.update(editPerm.ID, payload)
      toast.success('Hak akses berhasil diperbarui')
      setEditPerm(null)
      fetchPermissions()
    } catch {
      toast.error('Gagal memperbarui hak akses')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deletePerm) return
    try {
      await permissionService.delete(deletePerm.ID)
      toast.success('Hak akses berhasil dihapus')
      setDeletePerm(null)
      fetchPermissions()
    } catch {
      toast.error('Gagal menghapus hak akses')
    }
  }

  const columns = [
    { key: 'Name', label: 'Nama' },
    { key: 'Slug', label: 'Slug', render: (r: PermissionRecord) => <code className="text-xs">{r.Slug}</code> },
    { key: 'GroupName', label: 'Grup' },
    { key: 'Description', label: 'Deskripsi', render: (r: PermissionRecord) => r.Description ?? '-' },
  ]

  const PermFormFields = ({ f, setF }: { f: PermForm; setF: (fn: (prev: PermForm) => PermForm) => void }) => (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label>Nama</Label>
        <Input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Lihat Pengguna" />
      </div>
      <div className="space-y-1.5">
        <Label>Slug</Label>
        <Input value={f.slug} onChange={e => setF(p => ({ ...p, slug: e.target.value }))} placeholder="users.view" />
      </div>
      <div className="space-y-1.5">
        <Label>Grup</Label>
        <Input
          value={f.group_name}
          onChange={e => setF(p => ({ ...p, group_name: e.target.value }))}
          placeholder="users"
          list="perm-groups"
        />
        <datalist id="perm-groups">
          {groups.map(g => <option key={g} value={g} />)}
        </datalist>
      </div>
      <div className="space-y-1.5">
        <Label>Deskripsi</Label>
        <Input value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} placeholder="Opsional" />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hak Akses</h1>
          <p className="text-muted-foreground">Kelola hak akses platform.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Hak Akses
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={permissions}
        loading={loading}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Cari nama / slug..."
        page={page}
        limit={LIMIT}
        total={total}
        onPageChange={setPage}
        filterSlot={
          <select
            className="h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
            value={groupFilter}
            onChange={e => { setGroupFilter(e.target.value); setPage(1) }}
          >
            <option value="">Semua Grup</option>
            {groups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        }
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
                <DropdownMenuItem variant="destructive" onClick={() => setDeletePerm(row)}>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Tambah Hak Akses</DialogTitle></DialogHeader>
          <PermFormFields f={form} setF={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editPerm} onOpenChange={(o) => { if (!o) setEditPerm(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Hak Akses</DialogTitle></DialogHeader>
          <PermFormFields f={form} setF={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPerm(null)}>Batal</Button>
            <Button onClick={handleEdit} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={!!deletePerm} onOpenChange={(o) => { if (!o) setDeletePerm(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Hak Akses</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus hak akses <strong>{deletePerm?.Name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
