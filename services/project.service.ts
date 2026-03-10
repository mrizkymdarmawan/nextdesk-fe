import { tenantApi } from '@/lib/api/tenant'
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api'
import type { Project, ProjectPayload } from '@/types/master'

export const projectService = {
  list: (params?: PaginationParams) =>
    tenantApi.get<PaginatedResponse<Project>>('/tenant/projects', { params }),

  get: (id: number) =>
    tenantApi.get<ApiResponse<Project>>(`/tenant/projects/${id}`),

  create: (payload: ProjectPayload) =>
    tenantApi.post<ApiResponse<Project>>('/tenant/projects', payload),

  update: (id: number, payload: Partial<ProjectPayload>) =>
    tenantApi.put<ApiResponse<Project>>(`/tenant/projects/${id}`, payload),

  delete: (id: number) =>
    tenantApi.delete<ApiResponse<null>>(`/tenant/projects/${id}`),
}
