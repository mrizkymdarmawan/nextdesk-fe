import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlatformUser, TenantUser, Role } from '@/types/auth'

interface AuthState {
  token: string | null
  tenantToken: string | null
  accountType: 'platform' | 'tenant' | null
  user: PlatformUser | null
  tenantUser: TenantUser | null
  role: Role | null
  permissions: string[]
  setAuth: (token: string, user: PlatformUser) => void
  setTenantAuth: (tenantToken: string, tenantUser: TenantUser) => void
  setMe: (role: Role, permissions: string[]) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tenantToken: null,
      accountType: null,
      user: null,
      tenantUser: null,
      role: null,
      permissions: [],
      setAuth: (token, user) => {
        localStorage.setItem('token', token)
        set({ token, user, accountType: 'platform' })
      },
      setTenantAuth: (tenantToken, tenantUser) => {
        localStorage.setItem('tenant_token', tenantToken)
        set({ tenantToken, tenantUser, accountType: 'tenant' })
      },
      setMe: (role, permissions) => {
        set({ role, permissions })
      },
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('tenant_token')
        set({
          token: null,
          tenantToken: null,
          accountType: null,
          user: null,
          tenantUser: null,
          role: null,
          permissions: [],
        })
      },
    }),
    { name: 'auth-storage' }
  )
)
