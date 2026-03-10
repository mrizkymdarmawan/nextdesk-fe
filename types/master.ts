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
