'use client'

import { useAuthStore } from '@/stores/auth.store'

/** Returns true only if the user has ALL of the specified permissions */
export function usePermission(...slugs: string[]): boolean {
  const permissions = useAuthStore((s) => s.permissions)
  return slugs.every((slug) => permissions.includes(slug))
}

/** Returns true if the user has ANY of the specified permissions */
export function useAnyPermission(...slugs: string[]): boolean {
  const permissions = useAuthStore((s) => s.permissions)
  return slugs.some((slug) => permissions.includes(slug))
}

/** Returns the current role slug, or null if not authenticated */
export function useRoleSlug(): string | null {
  const role = useAuthStore((s) => s.role)
  return role?.slug ?? null
}
