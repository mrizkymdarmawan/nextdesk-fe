import { createApiClient } from './client'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('tenant_token')
}

export const tenantApi = createApiClient(getToken)
