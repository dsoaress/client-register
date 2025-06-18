import { describe, expect, it } from 'vitest'

import { ConflictException } from './conflict.exception'

describe('ConflictException', () => {
  it('should create an exception with an error message', () => {
    const error = 'Already exists'
    const exception = new ConflictException(error)
    expect(exception.name).toBe('ConflictException')
    expect(exception.message).toBe(error)
  })
})
