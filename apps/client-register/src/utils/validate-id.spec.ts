import { IdValueObject } from 'core'
import { describe, expect, it } from 'vitest'

import { validateId } from './validate-id'

describe('validateId', () => {
  it('should throw BadRequestException for empty ID', () => {
    expect(() => validateId('')).toThrowError('Invalid client ID')
  })

  it('should throw BadRequestException for whitespace ID', () => {
    expect(() => validateId('   ')).toThrowError('Invalid client ID')
  })

  it('should throw BadRequestException for non-string ID', () => {
    expect(() => validateId('123')).toThrowError('Invalid client ID format')
  })

  it('should not throw for valid ID', () => {
    expect(() => validateId(IdValueObject.create().value)).not.toThrow()
  })
})
