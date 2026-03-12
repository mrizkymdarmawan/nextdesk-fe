'use client'

import { useEffect, useState } from 'react'
import { CreditCard, PackageCheck, Building2, MapPin, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { billingService } from '@/services/billing.service'
import { companyService } from '@/services/company.service'
import { projectService } from '@/services/project.service'
import { planService } from '@/services/plan.service'
import { useAuthStore } from '@/stores/auth.store'
import type { Billing } from '@/types/master'

const statusLabel: Record<string, string> = {
  pending: 'Menunggu',
  paid: 'Lunas',
  expired: 'Kedaluwarsa',
  cancelled: 'Dibatalkan',
  failed: 'Gagal',
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-700',
  paid: 'bg-green-500/10 text-green-700',
  expired: 'bg-red-500/10 text-red-600',
  cancelled: 'bg-muted text-muted-foreground',
  failed: 'bg-red-500/10 text-red-600',
}

function formatRupiah(amount: number | null): string {
  if (amount === null) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MasterTenantDashboardPage() {
  const permissions = useAuthStore((s) => s.permissions)
  const canSeeBillings = permissions.includes('billings:read')
  const canSeeCompanies = permissions.includes('companies:read')
  const canSeeProjects = permissions.includes('projects:read')
  const canSeePlans = permissions.includes('plans:read')

  const [stats, setStats] = useState({ billings: 0, plans: 0, companies: 0, projects: 0 })
  const [recentBillings, setRecentBillings] = useState<Billing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true)
      const newStats = { billings: 0, plans: 0, companies: 0, projects: 0 }

      await Promise.allSettled([
        canSeeBillings
          ? billingService.list({ page: 1, limit: 5 }).then((res) => {
              newStats.billings = res.data.meta?.total ?? 0
              setRecentBillings(res.data.data ?? [])
            })
          : Promise.resolve(),
        canSeePlans
          ? planService.list({ page: 1, limit: 1 }).then((res) => {
              newStats.plans = res.data.meta?.total ?? 0
            })
          : Promise.resolve(),
        canSeeCompanies
          ? companyService.list({ page: 1, limit: 1 }).then((res) => {
              newStats.companies = res.data.meta?.total ?? 0
            })
          : Promise.resolve(),
        canSeeProjects
          ? projectService.list({ page: 1, limit: 1 }).then((res) => {
              newStats.projects = res.data.meta?.total ?? 0
            })
          : Promise.resolve(),
      ])

      setStats(newStats)
      setLoading(false)
    }

    fetchDashboard()
  }, [canSeeBillings, canSeeCompanies, canSeeProjects, canSeePlans])

  const statCards = [
    { label: 'Total Tagihan', value: stats.billings, icon: CreditCard, show: canSeeBillings },
    { label: 'Paket Tersedia', value: stats.plans, icon: PackageCheck, show: canSeePlans },
    { label: 'Perusahaan', value: stats.companies, icon: Building2, show: canSeeCompanies },
    { label: 'Proyek', value: stats.projects, icon: MapPin, show: canSeeProjects },
  ].filter((c) => c.show)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas Master Tenant.</p>
      </div>

      {statCards.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {loading ? (
                    <span className="inline-block h-7 w-12 animate-pulse rounded bg-muted" />
                  ) : (
                    card.value
                  )}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {canSeeBillings && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tagihan Terkini</CardTitle>
                <CardDescription>5 tagihan terakhir</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
            ) : recentBillings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Clock className="mb-2 h-8 w-8" />
                <p className="text-sm">Belum ada tagihan</p>
              </div>
            ) : (
              <div className="divide-y">
                {recentBillings.map((bill) => (
                  <div key={bill.ID} className="flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium">
                        {bill.BillingCycle === 'monthly' ? 'Bulanan' : 'Tahunan'} — {formatRupiah(bill.Amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(bill.StartedAt)} → {formatDate(bill.ExpiresAt)}
                      </p>
                    </div>
                    <Badge
                      className={`w-fit border-0 text-xs capitalize ${statusColor[bill.Status ?? ''] ?? 'bg-muted text-muted-foreground'}`}
                      variant="outline"
                    >
                      {statusLabel[bill.Status ?? ''] ?? bill.Status ?? '-'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
