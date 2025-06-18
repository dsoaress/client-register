import { describe, expect, it } from 'vitest'

import { BadRequestException } from './bad-request.exception'

describe('BadRequestException', () => {
  it('should create an exception with a single error message', () => {
    const error = 'Invalid request'
    const exception = new BadRequestException(error)
    expect(exception.name).toBe('BadRequestException')
    expect(exception.message).toBe(error)
  })

  it('should create an exception with multiple error messages', () => {
    const errors = ['Invalid request', 'Missing parameters']
    const exception = new BadRequestException(errors)
    expect(exception.name).toBe('BadRequestException')
    expect(exception.message).toBe('Invalid request | Missing parameters')
  })
})
