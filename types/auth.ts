export interface Role {
  id: number
  name: string
  slug: string
}

export interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  role: Role
}

export interface AuthData {
  token: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export interface TenantLoginPayload {
  schema_name: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}
