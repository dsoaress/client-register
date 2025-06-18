import { Types } from 'mongoose'
import { describe, expect, it } from 'vitest'

import { IdValueObject } from './id.value-object'

describe('IdValueObject', () => {
  it('should create a new ID with a valid ObjectId format', () => {
    const id = IdValueObject.create()
    expect(Types.ObjectId.isValid(id.value)).toBeTruthy()
    expect(id.errors).toEqual([])
  })

  it('should create an ID from a valid ObjectId string', () => {
    const objectId = new Types.ObjectId().toString()
    const id = IdValueObject.create(objectId)
    expect(id.value).toBe(objectId)
    expect(id.errors).toEqual([])
  })

  it('should return an error for an invalid ObjectId string', () => {
    const invalidId = 'invalid-object-id'
    const id = IdValueObject.create(invalidId)
    expect(id.value).toBe(invalidId)
    expect(id.errors).toContain('Invalid ID format, must be a valid ObjectId')
  })
})
