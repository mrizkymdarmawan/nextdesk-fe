import { tenantApi } from '@/lib/api/tenant'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import type { Company, CompanyPayload } from '@/types/master'

export const companyService = {
  list: (params?: PaginationParams) =>
    tenantApi.get<PaginatedResponse<Company>>('/tenant/companies', { params }),

  get: (id: number) =>
    tenantApi.get<ApiResponse<Company>>(`/tenant/companies/${id}`),

  create: (payload: CompanyPayload) =>
    tenantApi.post<ApiResponse<Company>>('/tenant/companies', payload),

  update: (id: number, payload: Partial<CompanyPayload>) =>
    tenantApi.put<ApiResponse<Company>>(`/tenant/companies/${id}`, payload),

  delete: (id: number) =>
    tenantApi.delete<ApiResponse<null>>(`/tenant/companies/${id}`),
}
