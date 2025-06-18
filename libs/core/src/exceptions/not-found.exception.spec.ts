import { describe, expect, it } from 'vitest'

import { NotFoundException } from './not-found.exception'

describe('NotFoundException', () => {
  it('should create an exception with an error message', () => {
    const error = 'Not found'
    const exception = new NotFoundException(error)
    expect(exception.name).toBe('NotFoundException')
    expect(exception.message).toBe(error)
  })
})
