import type { PaginatedFiltersDTO } from 'core'

export interface GetAllClientsInputDTO extends PaginatedFiltersDTO {
  sortBy?: 'name' | 'email' | 'phone' | 'age' | 'createdAt'
}
