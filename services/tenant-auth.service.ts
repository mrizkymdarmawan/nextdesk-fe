import { publicApi } from '@/lib/api/public'
import type { ApiResponse } from '@/types/api'
import type { AuthData, TenantLoginPayload } from '@/types/auth'

export const tenantAuthService = {
  login: (payload: TenantLoginPayload) =>
    publicApi.post<ApiResponse<AuthData>>('/tenant/auth/login', payload),

  forgotPassword: (schema_name: string, email: string) =>
    publicApi.post<ApiResponse<null>>('/tenant/auth/forgot-password', {
      schema_name,
      email,
    }),

  resetPassword: (schema_name: string, token: string, password: string) =>
    publicApi.post<ApiResponse<null>>('/tenant/auth/reset-password', {
      schema_name,
      token,
      password,
    }),
}
