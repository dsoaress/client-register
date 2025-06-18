import type { PaginatedResultDTO } from 'core'

export interface GetAllClientsOutputDTO
  extends PaginatedResultDTO<{
    id: string
    name: string
    email: string
    phone: string
    age: number
    password: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }> {}
