import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/auth'

interface AuthState {
  token: string | null
  tenantToken: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  setTenantToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      tenantToken: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('token', token)
        set({ token, user })
      },
      setTenantToken: (tenantToken) => {
        localStorage.setItem('tenant_token', tenantToken)
        set({ tenantToken })
      },
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('tenant_token')
        set({ token: null, tenantToken: null, user: null })
      },
    }),
    { name: 'auth-storage' }
  )
)
