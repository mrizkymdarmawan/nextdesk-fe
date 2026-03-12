import { publicApi } from '@/lib/api/public'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import type { RoleRecord, PermissionRecord, RolePayload } from '@/types/master'

export const roleService = {
  list: (params?: PaginationParams & { search?: string }) =>
    publicApi.get<PaginatedResponse<RoleRecord>>('/roles', { params }),

  get: (id: number) =>
    publicApi.get<ApiResponse<RoleRecord>>(`/roles/${id}`),

  create: (payload: RolePayload) =>
    publicApi.post<ApiResponse<RoleRecord>>('/roles', payload),

  update: (id: number, payload: RolePayload) =>
    publicApi.put<ApiResponse<RoleRecord>>(`/roles/${id}`, payload),

  delete: (id: number) =>
    publicApi.delete<ApiResponse<null>>(`/roles/${id}`),

  listPermissions: (id: number) =>
    publicApi.get<ApiResponse<PermissionRecord[]>>(`/roles/${id}/permissions`),

  assignPermission: (roleId: number, permissionId: number) =>
    publicApi.post<ApiResponse<null>>(`/roles/${roleId}/permissions`, { permission_id: permissionId }),

  revokePermission: (roleId: number, permissionId: number) =>
    publicApi.delete<ApiResponse<null>>(`/roles/${roleId}/permissions/${permissionId}`),
}
