import { publicApi } from '@/lib/api/public'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import type { Billing, CreateBillingPayload, UpdateBillingStatusPayload } from '@/types/master'

export const billingService = {
  list: (params?: PaginationParams) =>
    publicApi.get<PaginatedResponse<Billing>>('/billings', { params }),

  get: (id: number) =>
    publicApi.get<ApiResponse<Billing>>(`/billings/${id}`),

  create: (payload: CreateBillingPayload) =>
    publicApi.post<ApiResponse<Billing>>('/billings', payload),

  updateStatus: (id: number, payload: UpdateBillingStatusPayload) =>
    publicApi.put<ApiResponse<Billing>>(`/billings/${id}/status`, payload),

  listByUser: (userId: number, params?: PaginationParams) =>
    publicApi.get<PaginatedResponse<Billing>>(`/users/${userId}/billings`, { params }),
}
