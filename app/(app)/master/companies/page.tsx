import { Building2 } from 'lucide-react'

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Perusahaan</h1>
        <p className="text-muted-foreground">Kelola data perusahaan yang terdaftar.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/40 py-20 text-center">
        <Building2 className="mb-3 h-10 w-10 text-blue-300" />
        <p className="font-medium text-muted-foreground">Halaman perusahaan sedang dikembangkan</p>
        <p className="mt-1 text-sm text-muted-foreground">Segera hadir.</p>
      </div>
    </div>
  )
}
