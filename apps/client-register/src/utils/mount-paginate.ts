import type { PaginatedResultDTO } from 'core'

export function mountPaginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResultDTO<T> {
  const totalPages = Math.ceil(total / limit)
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  }
}
