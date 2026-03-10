import { publicApi } from '@/lib/api/public'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import type { Plan, CreatePlanPayload } from '@/types/master'

export const planService = {
  list: (params?: PaginationParams) =>
    publicApi.get<PaginatedResponse<Plan>>('/plans', { params }),

  get: (id: number) =>
    publicApi.get<ApiResponse<Plan>>(`/plans/${id}`),

  create: (payload: CreatePlanPayload) =>
    publicApi.post<ApiResponse<Plan>>('/plans', payload),

  update: (id: number, payload: Partial<CreatePlanPayload>) =>
    publicApi.put<ApiResponse<Plan>>(`/plans/${id}`, payload),

  delete: (id: number) =>
    publicApi.delete<ApiResponse<null>>(`/plans/${id}`),
}
