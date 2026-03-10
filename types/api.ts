export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface Meta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: Meta
}

export interface PaginationParams {
  page?: number
  limit?: number
}
