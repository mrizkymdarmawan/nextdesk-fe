// BE now uses snake_case in auth responses

export interface Role {
  id: number
  name: string
  slug: string
}

export interface MeData {
  user: {
    id: number
    email: string
    full_name: string
    is_active: boolean
  }
  role: Role
  permissions: string[]
}

export interface PlatformUser {
  id: number
  email: string
  role_slug: string
  full_name: string
}

export interface TenantUser {
  id: number
  email: string
  role_slug: string
}

export interface AuthData {
  token: string
  account_type: 'platform' | 'tenant'
  user: PlatformUser | TenantUser
}

// Request payloads
export interface IdentifyPayload {
  email: string
}

export interface IdentifyResponse {
  account_type: 'platform' | 'tenant'
}

export interface LoginPayload {
  email: string
  password: string
}

export interface TenantLoginPayload {
  schema_name: string
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  new_password: string
}
