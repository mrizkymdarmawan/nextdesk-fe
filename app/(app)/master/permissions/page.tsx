import { ShieldCheck } from 'lucide-react'

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hak Akses</h1>
        <p className="text-muted-foreground">Kelola permission untuk setiap role.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/40 py-20 text-center">
        <ShieldCheck className="mb-3 h-10 w-10 text-blue-300" />
        <p className="font-medium text-muted-foreground">Halaman hak akses sedang dikembangkan</p>
        <p className="mt-1 text-sm text-muted-foreground">Segera hadir.</p>
      </div>
    </div>
  )
}
