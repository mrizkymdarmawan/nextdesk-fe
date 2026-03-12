'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
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

interface TopbarProps {
  leftSlot?: React.ReactNode
}

export function Topbar({ leftSlot }: TopbarProps) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const tenantUser = useAuthStore((s) => s.tenantUser)
  const logout = useAuthStore((s) => s.logout)

  const activeUser = user ?? tenantUser
  const displayName = user?.full_name ?? activeUser?.email ?? 'Pengguna'
  const role = activeUser?.role_slug ?? ''
  const avatarSeed = encodeURIComponent(displayName)
  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${avatarSeed}`

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div>{leftSlot}</div>

      <div className="flex items-center gap-1">
        <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback>
              <User className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs text-muted-foreground capitalize">{role.replace(/_/g, ' ')}</p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs font-normal text-muted-foreground">{activeUser?.email ?? ''}</p>
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
    </header>
  )
}
