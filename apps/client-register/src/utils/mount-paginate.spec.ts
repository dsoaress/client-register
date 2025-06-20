import { describe, expect, it } from 'vitest'

import { mountPaginate } from './mount-paginate'

describe('mountPaginate', () => {
  it('should return a paginated result with correct metadata', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const total = 10
    const page = 1
    const limit = 3

    const result = mountPaginate(data, total, page, limit)

    expect(result.data).toEqual(data)
    expect(result.meta.total).toBe(total)
    expect(result.meta.page).toBe(page)
    expect(result.meta.limit).toBe(limit)
    expect(result.meta.totalPages).toBe(Math.ceil(total / limit))
  })

  it('should handle empty data array', () => {
    const data: unknown[] = []
    const total = 0
    const page = 1
    const limit = 5

    const result = mountPaginate(data, total, page, limit)

    expect(result.data).toEqual(data)
    expect(result.meta.total).toBe(total)
    expect(result.meta.page).toBe(page)
    expect(result.meta.limit).toBe(limit)
    expect(result.meta.totalPages).toBe(0)
  })
})
