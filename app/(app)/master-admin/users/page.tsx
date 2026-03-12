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
import { userService } from '@/services/user.service'
import { roleService } from '@/services/role.service'
import type { PlatformUserRecord, RoleRecord } from '@/types/master'

const LIMIT = 10

export default function MasterAdminUsersPage() {
  const [users, setUsers] = useState<PlatformUserRecord[]>([])
  const [roles, setRoles] = useState<RoleRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<PlatformUserRecord | null>(null)
  const [deleteUser, setDeleteUser] = useState<PlatformUserRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
    role_id: '',
    is_active: true,
    full_name: '',
  })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.list({ page, limit: LIMIT, search: search || undefined })
      setUsers(res.data.data)
      setTotal(res.data.meta.total)
    } catch {
      toast.error('Gagal memuat data pengguna')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    roleService.list({ limit: 100 }).then(res => setRoles(res.data.data)).catch(() => {})
  }, [])

  function resetForm() {
    setForm({ email: '', password: '', role_id: '', is_active: true, full_name: '' })
  }

  function openCreate() {
    resetForm()
    setCreateOpen(true)
  }

  function openEdit(user: PlatformUserRecord) {
    setForm({
      email: user.Email,
      password: '',
      role_id: String(user.Role?.ID ?? ''),
      is_active: user.IsActive,
      full_name: '',
    })
    setEditUser(user)
  }

  async function handleCreate() {
    if (!form.email || !form.password || !form.role_id) {
      toast.error('Email, password, dan role wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      await userService.create({
        email: form.email,
        password: form.password,
        role_id: Number(form.role_id),
        is_active: form.is_active,
        full_name: form.full_name || undefined,
      })
      toast.success('Pengguna berhasil dibuat')
      setCreateOpen(false)
      fetchUsers()
    } catch {
      toast.error('Gagal membuat pengguna')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit() {
    if (!editUser || !form.email || !form.role_id) {
      toast.error('Email dan role wajib diisi')
      return
    }
    setSubmitting(true)
    try {
      await userService.update(editUser.ID, {
        email: form.email,
        role_id: Number(form.role_id),
        is_active: form.is_active,
      })
      toast.success('Pengguna berhasil diperbarui')
      setEditUser(null)
      fetchUsers()
    } catch {
      toast.error('Gagal memperbarui pengguna')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleteUser) return
    try {
      await userService.delete(deleteUser.ID)
      toast.success('Pengguna berhasil dihapus')
      setDeleteUser(null)
      fetchUsers()
    } catch {
      toast.error('Gagal menghapus pengguna')
    }
  }

  function handleExport(format: 'csv' | 'excel' | 'pdf') {
    const url = userService.exportUrl(format, search)
    window.open(url, '_blank')
  }

  const columns = [
    { key: 'Email', label: 'Email' },
    {
      key: 'Role',
      label: 'Role',
      render: (row: PlatformUserRecord) => (
        <span className="text-sm text-muted-foreground">{row.Role?.Name ?? '-'}</span>
      ),
    },
    {
      key: 'IsActive',
      label: 'Status',
      render: (row: PlatformUserRecord) => (
        <Badge variant={row.IsActive ? 'default' : 'secondary'}>
          {row.IsActive ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
    {
      key: 'CreatedAt',
      label: 'Dibuat',
      render: (row: PlatformUserRecord) => new Date(row.CreatedAt).toLocaleDateString('id-ID'),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengguna</h1>
          <p className="text-muted-foreground">Kelola seluruh akun pengguna platform.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1) }}
        searchPlaceholder="Cari email..."
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
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteUser(row)}
                >
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
          <DialogHeader>
            <DialogTitle>Tambah Pengguna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-password">Password</Label>
              <Input id="c-password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 karakter" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-fullname">Nama Lengkap</Label>
              <Input id="c-fullname" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Opsional" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-role">Role</Label>
              <select
                id="c-role"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus:ring-1 focus:ring-ring"
                value={form.role_id}
                onChange={e => setForm(f => ({ ...f, role_id: e.target.value }))}
              >
                <option value="">Pilih role</option>
                {roles.map(r => (
                  <option key={r.ID} value={r.ID}>{r.Name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="c-active"
                checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="c-active">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => { if (!o) setEditUser(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="e-email">Email</Label>
              <Input id="e-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-role">Role</Label>
              <select
                id="e-role"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus:ring-1 focus:ring-ring"
                value={form.role_id}
                onChange={e => setForm(f => ({ ...f, role_id: e.target.value }))}
              >
                <option value="">Pilih role</option>
                {roles.map(r => (
                  <option key={r.ID} value={r.ID}>{r.Name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="e-active"
                checked={form.is_active}
                onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="e-active">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Batal</Button>
            <Button onClick={handleEdit} disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={!!deleteUser} onOpenChange={(o) => { if (!o) setDeleteUser(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus pengguna <strong>{deleteUser?.Email}</strong>? Tindakan ini tidak dapat dibatalkan.
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
