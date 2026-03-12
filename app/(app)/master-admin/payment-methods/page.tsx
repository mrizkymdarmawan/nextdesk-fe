'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Search, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { paymentMethodService } from '@/services/payment-method.service'
import type { PaymentMethod } from '@/types/master'

export default function MasterAdminPaymentMethodsPage() {
  const [userId, setUserId] = useState('')
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteMethod, setDeleteMethod] = useState<PaymentMethod | null>(null)

  async function handleSearch() {
    const id = Number(userId)
    if (!id) {
      toast.error('Masukkan User ID yang valid')
      return
    }
    setLoading(true)
    try {
      const res = await paymentMethodService.listByUser(id)
      setMethods(res.data.data)
      if (res.data.data.length === 0) {
        toast.info('Tidak ada metode pembayaran untuk user ini')
      }
    } catch {
      toast.error('Gagal memuat metode pembayaran')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteMethod) return
    try {
      await paymentMethodService.delete(deleteMethod.ID)
      toast.success('Metode pembayaran berhasil dihapus')
      setMethods(prev => prev.filter(m => m.ID !== deleteMethod.ID))
      setDeleteMethod(null)
    } catch {
      toast.error('Gagal menghapus metode pembayaran')
    }
  }

  async function handleSetDefault(method: PaymentMethod) {
    if (!method.UserID) return
    try {
      await paymentMethodService.setDefault(method.ID, method.UserID)
      toast.success('Metode pembayaran default diperbarui')
      setMethods(prev => prev.map(m => ({ ...m, IsDefault: m.ID === method.ID })))
    } catch {
      toast.error('Gagal mengatur metode pembayaran default')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Metode Pembayaran</h1>
        <p className="text-muted-foreground">Kelola metode pembayaran pengguna platform.</p>
      </div>

      {/* Search by User ID */}
      <div className="flex gap-2 max-w-sm">
        <Input
          type="number"
          placeholder="Masukkan User ID..."
          value={userId}
          onChange={e => setUserId(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="mr-2 h-4 w-4" />
          {loading ? 'Memuat...' : 'Cari'}
        </Button>
      </div>

      {/* Results */}
      {methods.length > 0 && (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipe Kartu</TableHead>
                <TableHead>4 Digit Terakhir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="w-28 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map(m => (
                <TableRow key={m.ID}>
                  <TableCell>{m.ID}</TableCell>
                  <TableCell>{m.CardType ?? '-'}</TableCell>
                  <TableCell>{m.CardLastFour ? `**** ${m.CardLastFour}` : '-'}</TableCell>
                  <TableCell>
                    {m.IsDefault ? (
                      <Badge variant="default">Default</Badge>
                    ) : (
                      <Badge variant="secondary">Biasa</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(m.CreatedAt).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {!m.IsDefault && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleSetDefault(m)}
                          title="Jadikan default"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteMethod(m)}
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete AlertDialog */}
      <AlertDialog open={!!deleteMethod} onOpenChange={(o) => { if (!o) setDeleteMethod(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Metode Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus metode pembayaran ini? Tindakan ini tidak dapat dibatalkan.
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
