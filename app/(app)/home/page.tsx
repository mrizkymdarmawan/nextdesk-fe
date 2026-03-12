'use client'

import { useRouter } from 'next/navigation'
import { LayoutDashboard, Users, CalendarCheck, Archive, Settings, ShieldCheck, LogOut, User, TicketCheck } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth.store'
import { ThemeToggle } from '@/components/theme-toggle'

const modules = [
  {
    href: '/master-admin',
    label: 'Master Admin',
    description: 'Kelola konfigurasi platform dan akses admin',
    icon: ShieldCheck,
    permission: 'module:master_admin',
  },
  {
    href: '/master-tenant',
    label: 'Master Tenant',
    description: 'Kelola perusahaan, proyek, dan langganan',
    icon: Settings,
    permission: 'module:master_tenant',
  },
  {
    href: '/hr',
    label: 'Human Resource',
    description: 'Kelola karyawan dan struktur organisasi',
    icon: Users,
    permission: 'module:hr',
  },
  {
    href: '/attendance',
    label: 'Absensi',
    description: 'Lacak kehadiran dan geofencing',
    icon: CalendarCheck,
    permission: 'module:attendance',
  },
  {
    href: '/archive',
    label: 'Arsip',
    description: 'Dokumen dan catatan historis',
    icon: Archive,
    permission: 'module:archive',
  },
  {
    href: '/helpdesk',
    label: 'Helpdesk',
    description: 'Buat dan kelola tiket permasalahan',
    icon: TicketCheck,
    permission: 'module:helpdesk',
  },
]

export default function HomePage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const tenantUser = useAuthStore((s) => s.tenantUser)
  const logout = useAuthStore((s) => s.logout)

  const permissions = useAuthStore((s) => s.permissions)
  const role = user?.role_slug ?? tenantUser?.role_slug ?? ''
  const displayName = user?.full_name ?? user?.email ?? tenantUser?.email ?? 'Pengguna'
  const firstName = displayName.split(' ')[0]

  const avatarSeed = encodeURIComponent(displayName)
  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${avatarSeed}`

  const visible = modules.filter((m) => permissions.includes(m.permission))

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">Next Desk</span>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback>
                    <User className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs font-normal text-muted-foreground capitalize">
                      {role.replace(/_/g, ' ')}
                    </p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-14">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat datang, {firstName}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pilih modul untuk memulai.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((mod) => (
            <button
              key={mod.href}
              onClick={() => router.push(mod.href)}
              className="group flex h-48 flex-col items-center justify-center gap-4 rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
                <mod.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{mod.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{mod.description}</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Next Desk</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Next Desk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
