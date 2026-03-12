// Go structs have no json tags — fields serialize as Pascal case

export interface Plan {
  ID: number
  Name: string | null
  Slug: string | null
  PriceMonthly: number | null
  PriceYearly: number | null
  Description: string | null
  Features: string[] | null
  MaxUsers: number | null
  TrialDays: number
  IsActive: boolean
  SortOrder: number
  CreatedAt: string
  UpdatedAt: string
}

export interface Billing {
  ID: number
  UserID: number | null
  PlanID: number | null
  Status: string | null
  BillingCycle: string | null
  Amount: number | null
  MidtransOrderID: string | null
  PaidAt: string | null
  StartedAt: string | null
  ExpiresAt: string | null
  Notes: string | null
  CreatedAt: string
  UpdatedAt: string
}

export interface Company {
  ID: number
  Name: string | null
  Address: string | null
  Phone: string | null
  Email: string | null
  LogoURL: string | null
  CreatedAt: string
  UpdatedAt: string
}

export interface Project {
  ID: number
  Name: string | null
  Address: string | null
  PhotoURL: string | null
  CreatedAt: string
  UpdatedAt: string
}

// Payloads
export interface CreatePlanPayload {
  name: string
  slug: string
  description?: string
  price_monthly: number
  price_yearly: number
  features: string[]
  max_users: number
  trial_days: number
  sort_order: number
  is_active: boolean
}

export interface CreateBillingPayload {
  user_id: number
  plan_id: number
  billing_cycle: 'monthly' | 'yearly'
  amount: number
  started_at: string
  expires_at: string
}

export interface UpdateBillingStatusPayload {
  status: string
  notes?: string
}

export interface CompanyPayload {
  name: string
  address?: string
  phone?: string
  email?: string
  logo_url?: string
}

export interface ProjectPayload {
  name: string
  address?: string
  photo_url?: string
}

// Platform user (from GET /api/v1/users list — Go PascalCase)
export interface PlatformUserRecord {
  ID: number
  Email: string
  IsActive: boolean
  CreatedAt: string
  UpdatedAt: string
  Role: {
    ID: number
    Name: string
    Slug: string
  } | null
}

// Role (from GET /api/v1/roles)
export interface RoleRecord {
  ID: number
  Name: string
  Slug: string
  Description: string | null
  CreatedAt: string
  UpdatedAt: string
}

// Permission (from GET /api/v1/permissions)
export interface PermissionRecord {
  ID: number
  Name: string
  Slug: string
  GroupName: string
  Description: string | null
  CreatedAt: string
  UpdatedAt: string
}

// Payment Method (from GET /api/v1/users/:id/payment-methods)
export interface PaymentMethod {
  ID: number
  UserID: number | null
  MidtransToken: string | null
  CardLastFour: string | null
  CardType: string | null
  IsDefault: boolean
  CreatedAt: string
  UpdatedAt: string
}

// Tenant (from GET /api/v1/tenants)
export interface TenantRecord {
  ID: number
  Name: string
  SchemaName: string
  IsActive: boolean
  CreatedAt: string
  UpdatedAt: string
}

// Payloads
export interface CreateUserPayload {
  email: string
  password: string
  role_id: number
  is_active: boolean
  full_name?: string
}

export interface UpdateUserPayload {
  email: string
  role_id: number
  is_active: boolean
}

export interface RolePayload {
  name: string
  slug: string
  description?: string
}

export interface PermissionPayload {
  name: string
  slug: string
  group_name: string
  description?: string
}
