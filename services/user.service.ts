import { publicApi } from '@/lib/api/public'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import type { PlatformUserRecord, CreateUserPayload, UpdateUserPayload } from '@/types/master'

export const userService = {
  list: (params?: PaginationParams & { search?: string; role_id?: number }) =>
    publicApi.get<PaginatedResponse<PlatformUserRecord>>('/users', { params }),

  get: (id: number) =>
    publicApi.get<ApiResponse<{ user: PlatformUserRecord; detail: unknown }>>(`/users/${id}`),

  create: (payload: CreateUserPayload) =>
    publicApi.post<ApiResponse<PlatformUserRecord>>('/users', payload),

  update: (id: number, payload: UpdateUserPayload) =>
    publicApi.put<ApiResponse<PlatformUserRecord>>(`/users/${id}`, payload),

  delete: (id: number) =>
    publicApi.delete<ApiResponse<null>>(`/users/${id}`),

  exportUrl: (format: 'csv' | 'excel' | 'pdf', search?: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? ''
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
    const q = new URLSearchParams({ format })
    if (search) q.set('search', search)
    return `${base}/api/v1/users/export?${q.toString()}&token=${token}`
  },
}
