'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MapPin,
  CalendarCheck,
  Wallet,
  Archive,
  Settings,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: null },
  { href: '/master', label: 'Master', icon: Settings, roles: ['master_account', 'super_admin'] },
  { href: '/hr', label: 'HR', icon: Users, roles: ['master_account', 'super_admin', 'hr_admin', 'hr_staff'] },
  { href: '/projects', label: 'Projects', icon: MapPin, roles: ['master_account', 'super_admin', 'hr_admin', 'project_manager'] },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck, roles: null },
  { href: '/payroll', label: 'Payroll', icon: Wallet, roles: ['master_account', 'super_admin', 'hr_admin', 'hr_staff'] },
  { href: '/archive', label: 'Archive', icon: Archive, roles: ['master_account', 'super_admin'] },
  { href: '/devtools', label: 'DevTools', icon: Wrench, roles: ['super_admin', 'customer_service'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const role = user?.role_slug ?? ''

  const visible = navItems.filter(
    (item) => item.roles === null || item.roles.includes(role)
  )

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <LayoutDashboard className="h-5 w-5" />
        <span className="text-lg font-semibold tracking-tight">Next Desk</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visible.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
