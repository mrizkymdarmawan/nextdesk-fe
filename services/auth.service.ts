import { publicApi } from '@/lib/api/public'
import type { ApiResponse } from '@/types/api'
import type {
  AuthData,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types/auth'

export const authService = {
  login: (payload: LoginPayload) =>
    publicApi.post<ApiResponse<AuthData>>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    publicApi.post<ApiResponse<AuthData>>('/auth/register', payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    publicApi.post<ApiResponse<null>>('/auth/forgot-password', payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    publicApi.post<ApiResponse<null>>('/auth/reset-password', payload),
}
