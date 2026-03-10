import { MapPin } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Proyek</h1>
        <p className="text-muted-foreground">Kelola lokasi kerja dan tim proyek.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/40 py-20 text-center">
        <MapPin className="mb-3 h-10 w-10 text-blue-300" />
        <p className="font-medium text-muted-foreground">Halaman proyek sedang dikembangkan</p>
        <p className="mt-1 text-sm text-muted-foreground">Segera hadir.</p>
      </div>
    </div>
  )
}
