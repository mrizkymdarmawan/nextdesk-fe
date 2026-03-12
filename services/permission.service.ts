import { publicApi } from '@/lib/api/public'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import type { PermissionRecord, PermissionPayload } from '@/types/master'

export const permissionService = {
  list: (params?: PaginationParams & { search?: string; group_name?: string }) =>
    publicApi.get<PaginatedResponse<PermissionRecord>>('/permissions', { params }),

  get: (id: number) =>
    publicApi.get<ApiResponse<PermissionRecord>>(`/permissions/${id}`),

  create: (payload: PermissionPayload) =>
    publicApi.post<ApiResponse<PermissionRecord>>('/permissions', payload),

  update: (id: number, payload: PermissionPayload) =>
    publicApi.put<ApiResponse<PermissionRecord>>(`/permissions/${id}`, payload),

  delete: (id: number) =>
    publicApi.delete<ApiResponse<null>>(`/permissions/${id}`),
}
