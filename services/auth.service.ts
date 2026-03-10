import { publicApi } from '@/lib/api/public'
import { tenantApi } from '@/lib/api/tenant'
import type { ApiResponse } from '@/types/api'
import type {
  AuthData,
  IdentifyPayload,
  IdentifyResponse,
  LoginPayload,
  TenantLoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  MeData,
} from '@/types/auth'

export const authService = {
  identify: (payload: IdentifyPayload) =>
    publicApi.post<ApiResponse<IdentifyResponse>>('/auth/identify', payload),

  login: (payload: LoginPayload) =>
    publicApi.post<ApiResponse<AuthData>>('/auth/login', payload),

  tenantLogin: (payload: TenantLoginPayload) =>
    publicApi.post<ApiResponse<AuthData>>('/tenant/auth/login', payload),

  register: (payload: RegisterPayload) =>
    publicApi.post<ApiResponse<null>>('/auth/register', payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    publicApi.post<ApiResponse<null>>('/auth/forgot-password', payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    publicApi.post<ApiResponse<null>>('/auth/reset-password', payload),

  getMe: () =>
    publicApi.get<ApiResponse<MeData>>('/auth/me'),

  getTenantMe: () =>
    tenantApi.get<ApiResponse<MeData>>('/tenant/auth/me'),
}
