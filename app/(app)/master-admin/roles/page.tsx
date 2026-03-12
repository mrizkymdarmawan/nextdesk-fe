'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Plus, MoreHorizontal, Pencil, Trash2, ShieldCheck } from 'lucide-react'
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
import { roleService } from '@/services/role.service'
import { permissionService } from '@/services/permission.service'
import type { RoleRecord, PermissionRecord, RolePayload } from '@/types/master'

const LIMIT = 10

type RoleForm = { name: string; slug: string; description: string }
const emptyForm: RoleForm = { name: '', slug: '', description: '' }

export default function MasterAdminRolesPage() {
  const [roles, setRoles] = useState<RoleRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [createOpen, setCreateOpen] = useState(false)
  const [editRole, setEditRole] = useState<RoleRecord | null>(null)
  const [deleteRole, setDeleteRole] = useState<RoleRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<RoleForm>(emptyForm)

  // Permissions management
  const [permRole, setPermRole] = useState<RoleRecord | null>(null)
  const [allPermissions, setAllPermissions] = useState<PermissionRecord[]>([])
  const [assignedIds, setAssignedIds] = useState<Set<number>>(new Set())
  const [permLoading, setPermLoading] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const fetchRoles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await roleService.list({ page, limit: LIMIT, search: search || undefined })
      setRoles(res.data.data)
      setTotal(res.data.meta.total)
    } catch {
      toast.error('Gagal memuat data role')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchRoles() }, [fetchRoles])

  function openCreate() {
    setForm(emptyForm)
    setCreateOpen(true)
  }

  function openEdit(role: RoleRecord) {
    setForm({ name: role.Name, slug: role.Slug, description: role.Description ?? '' })
    setEditRole(role)
  }

  async function openPermissions(role: RoleRecord) {
    setPermRole(role)
    setPermLoading(true)
    try {
      const [allRes, assignedRes] = await Promise.all([
        permissionService.list({ limit: 500 }),
        roleService.listPermissions(role.ID),
      ])
      setAllPermissions(allRes.data.data)
      setAssignedIds(new Set((assignedRes.data.data ?? []).map(p => p.ID)))
    } catch {
      toast.error('Gagal memuat hak akses')
    } finally {
      setPermLoading(false)
    }
  }

  async function handleCreate() {
    if (!form.name || !form.slug) {
      toast.error('Nama dan slug wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      const payload: RolePayload = { name: form.name, slug: form.slug, description: form.description || undefined }
      await roleService.create(payload)
      toast.success('Role berhasil dibuat')
      setCreateOpen(false)
      fetchRoles()
    } catch {
      toast.error('Gagal membuat role')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit() {
    if (!editRole || !form.name || !form.slug) {
      toast.error('Nama dan slug wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      const payload: RolePayload = { name: form.name, slug: form.slug, description: form.description || undefined }
      await roleService.update(editRole.ID, payload)
      toast.success('Role berhasil diperbarui')
      setEditRole(null)
      fetchRoles()
    } catch {
      toast.error('Gagal memperbarui role')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteRole) return
    try {
      await roleService.delete(deleteRole.ID)
      toast.success('Role berhasil dihapus')
      setDeleteRole(null)
      fetchRoles()
    } catch {
      toast.error('Gagal menghapus role')
    }
  }

  async function handleTogglePermission(perm: PermissionRecord) {
    if (!permRole || togglingId !== null) return
    setTogglingId(perm.ID)
    try {
      if (assignedIds.has(perm.ID)) {
        await roleService.revokePermission(permRole.ID, perm.ID)
        setAssignedIds(prev => { const s = new Set(prev); s.delete(perm.ID); return s })
        toast.success(`Hak akses "${perm.Name}" dicabut`)
      } else {
        await roleService.assignPermission(permRole.ID, perm.ID)
        setAssignedIds(prev => new Set(prev).add(perm.ID))
        toast.success(`Hak akses "${perm.Name}" diberikan`)
      }
    } catch {
      toast.error('Gagal mengubah hak akses')
    } finally {
      setTogglingId(null)
    }
  }

  // Group permissions by GroupName
  const grouped = allPermissions.reduce<Record<string, PermissionRecord[]>>((acc, p) => {
    const g = p.GroupName || 'Lainnya'
    if (!acc[g]) acc[g] = []
    acc[g].push(p)
    return acc
  }, {})

  const columns = [
    { key: 'Name', label: 'Nama' },
    { key: 'Slug', label: 'Slug', render: (r: RoleRecord) => <code className="text-xs">{r.Slug}</code> },
    { key: 'Description', label: 'Deskripsi', render: (r: RoleRecord) => r.Description ?? '-' },
    {
      key: 'CreatedAt',
      label: 'Dibuat',
      render: (r: RoleRecord) => new Date(r.CreatedAt).toLocaleDateString('id-ID'),
    },
  ]

  const RoleFormFields = ({ f, setF }: { f: RoleForm; setF: (fn: (prev: RoleForm) => RoleForm) => void }) => (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label>Nama</Label>
        <Input value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="Admin" />
      </div>
      <div className="space-y-1.5">
        <Label>Slug</Label>
        <Input value={f.slug} onChange={e => setF(p => ({ ...p, slug: e.target.value }))} placeholder="admin" />
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
          <h1 className="text-2xl font-bold tracking-tight">Role</h1>
          <p className="text-muted-foreground">Kelola role platform dan hak aksesnya.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Role
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        loading={loading}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Cari role..."
        page={page}
        limit={LIMIT}
        total={total}
        onPageChange={setPage}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8" render={<span />}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => openPermissions(row)}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Kelola Hak Akses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openEdit(row)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => setDeleteRole(row)}>
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
          <DialogHeader><DialogTitle>Tambah Role</DialogTitle></DialogHeader>
          <RoleFormFields f={form} setF={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editRole} onOpenChange={(o) => { if (!o) setEditRole(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Role</DialogTitle></DialogHeader>
          <RoleFormFields f={form} setF={setForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRole(null)}>Batal</Button>
            <Button onClick={handleEdit} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={!!permRole} onOpenChange={(o) => { if (!o) setPermRole(null) }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Hak Akses — {permRole?.Name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 py-2">
            {permLoading ? (
              <p className="text-sm text-muted-foreground">Memuat hak akses...</p>
            ) : (
              Object.entries(grouped).map(([group, perms]) => (
                <div key={group}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</p>
                  <div className="space-y-1">
                    {perms.map(perm => (
                      <label
                        key={perm.ID}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-accent"
                      >
                        <input
                          type="checkbox"
                          checked={assignedIds.has(perm.ID)}
                          onChange={() => handleTogglePermission(perm)}
                          disabled={togglingId === perm.ID}
                          className="h-4 w-4 rounded border-input"
                        />
                        <div>
                          <p className="text-sm font-medium">{perm.Name}</p>
                          <p className="text-xs text-muted-foreground">{perm.Slug}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermRole(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={!!deleteRole} onOpenChange={(o) => { if (!o) setDeleteRole(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Role</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus role <strong>{deleteRole?.Name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
