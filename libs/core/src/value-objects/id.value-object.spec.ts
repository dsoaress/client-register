import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'

import { IdValueObject } from './id.value-object'

describe('IdValueObject', () => {
  it('should create a new ID with a valid UUID v4 format', () => {
    const id = IdValueObject.create()
    expect(id.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    expect(id.errors).toEqual([])
  })

  it('should create an ID from a valid UUID v4 string', () => {
    const uuid = randomUUID()
    const id = IdValueObject.create(uuid)
    expect(id.value).toBe(uuid)
    expect(id.errors).toEqual([])
  })

  it('should return an error for an invalid UUID v4 string', () => {
    const invalidUuid = 'invalid-uuid'
    const id = IdValueObject.create(invalidUuid)
    expect(id.value).toBe(invalidUuid)
    expect(id.errors).toContain('Invalid ID format, must be a valid UUID v4')
  })
})
