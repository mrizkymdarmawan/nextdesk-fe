'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  PackageCheck,
  Building2,
  MapPin,
  ChevronLeft,
  Settings,
  Shield,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  permission: string | null
  exact: boolean
}

const navItems: NavItem[] = [
  {
    href: '/master-tenant',
    label: 'Dashboard',
    icon: LayoutDashboard,
    permission: null,
    exact: true,
  },
  {
    href: '/master-tenant/billing',
    label: 'Tagihan',
    icon: CreditCard,
    permission: 'menu:billings',
    exact: false,
  },
  {
    href: '/master-tenant/plans',
    label: 'Paket',
    icon: PackageCheck,
    permission: 'menu:plans',
    exact: false,
  },
  {
    href: '/master-tenant/payment-methods',
    label: 'Metode Bayar',
    icon: Wallet,
    permission: 'menu:payment_methods',
    exact: false,
  },
  {
    href: '/master-tenant/companies',
    label: 'Perusahaan',
    icon: Building2,
    permission: 'menu:company',
    exact: false,
  },
  {
    href: '/master-tenant/projects',
    label: 'Proyek',
    icon: MapPin,
    permission: 'menu:projects',
    exact: false,
  },
  {
    href: '/master-tenant/roles',
    label: 'Role',
    icon: Shield,
    permission: 'menu:access_control',
    exact: false,
  },
  {
    href: '/master-tenant/permissions',
    label: 'Hak Akses',
    icon: ShieldCheck,
    permission: 'menu:access_control',
    exact: false,
  },
]

export function MasterTenantSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const permissions = useAuthStore((s) => s.permissions)

  const visible = navItems.filter(
    (item) => item.permission === null || permissions.includes(item.permission)
  )

  return (
    <div className="flex flex-col gap-0">
      <div className="px-3 pt-3">
        <Link
          href="/home"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="mx-3 my-2 h-px bg-border" />

      <nav className="space-y-0.5 px-3 pb-4">
        {visible.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function MasterTenantSidebar() {
  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r bg-background lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Settings className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold tracking-tight">Master Tenant</span>
      </div>
      <MasterTenantSidebarNav />
    </aside>
  )
}
