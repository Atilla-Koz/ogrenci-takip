export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[]
    total: number
    page: number
    pageSize: number
  }
} 