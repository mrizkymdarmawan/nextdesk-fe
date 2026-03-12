import { PackageCheck } from 'lucide-react'

export default function MasterTenantPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paket</h1>
        <p className="text-muted-foreground">Lihat paket langganan yang tersedia.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
        <PackageCheck className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="font-medium text-muted-foreground">Halaman paket sedang dikembangkan</p>
        <p className="mt-1 text-sm text-muted-foreground">Segera hadir.</p>
      </div>
    </div>
  )
}
