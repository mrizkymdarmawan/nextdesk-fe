import { createApiClient } from './client'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const publicApi = createApiClient(getToken)
