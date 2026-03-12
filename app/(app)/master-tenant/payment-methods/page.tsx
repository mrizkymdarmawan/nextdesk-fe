import { Wallet } from 'lucide-react'

export default function MasterTenantPaymentMethodsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Metode Pembayaran</h1>
        <p className="text-muted-foreground">Kelola metode pembayaran untuk langganan Anda.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
        <Wallet className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="font-medium text-muted-foreground">Halaman metode pembayaran sedang dikembangkan</p>
        <p className="mt-1 text-sm text-muted-foreground">Segera hadir.</p>
      </div>
    </div>
  )
}
