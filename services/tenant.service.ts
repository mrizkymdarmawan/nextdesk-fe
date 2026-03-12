import { publicApi } from '@/lib/api/public'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import type { TenantRecord } from '@/types/master'

export const tenantService = {
  list: (params?: PaginationParams & { search?: string }) =>
    publicApi.get<PaginatedResponse<TenantRecord>>('/tenants', { params }),

  get: (id: number) =>
    publicApi.get<ApiResponse<TenantRecord>>(`/tenants/${id}`),
}
