'use client'

import { useEffect, useState } from 'react'
import { Users, Building2, CreditCard, PackageCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { publicApi } from '@/lib/api/public'
import { useAuthStore } from '@/stores/auth.store'

export default function MasterAdminDashboardPage() {
  const permissions = useAuthStore((s) => s.permissions)
  const canSeeUsers = permissions.includes('users:read')
  const canSeeBillings = permissions.includes('billings:read')
  const canSeePlans = permissions.includes('plans:read')

  const [stats, setStats] = useState({ users: 0, tenants: 0, billings: 0, plans: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true)
      const newStats = { users: 0, tenants: 0, billings: 0, plans: 0 }

      await Promise.allSettled([
        canSeeUsers
          ? publicApi.get('/users', { params: { page: 1, limit: 1 } }).then((res) => {
              newStats.users = (res.data as { meta?: { total?: number } }).meta?.total ?? 0
            })
          : Promise.resolve(),
        // tenants — all platform users with provisioned schema
        publicApi.get('/tenants', { params: { page: 1, limit: 1 } }).then((res) => {
          newStats.tenants = (res.data as { meta?: { total?: number } }).meta?.total ?? 0
        }).catch(() => { /* silently fail */ }),
        canSeeBillings
          ? publicApi.get('/billings', { params: { page: 1, limit: 1 } }).then((res) => {
              newStats.billings = (res.data as { meta?: { total?: number } }).meta?.total ?? 0
            })
          : Promise.resolve(),
        canSeePlans
          ? publicApi.get('/plans', { params: { page: 1, limit: 1 } }).then((res) => {
              newStats.plans = (res.data as { meta?: { total?: number } }).meta?.total ?? 0
            })
          : Promise.resolve(),
      ])

      setStats(newStats)
      setLoading(false)
    }

    fetchDashboard()
  }, [canSeeUsers, canSeeBillings, canSeePlans])

  const statCards = [
    { label: 'Total Pengguna', value: stats.users, icon: Users, show: canSeeUsers },
    { label: 'Total Tenant', value: stats.tenants, icon: Building2, show: true },
    { label: 'Total Tagihan', value: stats.billings, icon: CreditCard, show: canSeeBillings },
    { label: 'Total Paket', value: stats.plans, icon: PackageCheck, show: canSeePlans },
  ].filter((c) => c.show)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas platform Next Desk.</p>
      </div>

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
    </div>
  )
}
