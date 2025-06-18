import { describe, expect, it } from 'vitest'

import { UserNameValueObject } from './user-name.value-object'

describe('UserNameValueObject', () => {
  it.each([
    {
      input: '',
      expectedErrors: [
        'Name can only contain letters and spaces',
        'Name must be at least 3 characters long'
      ]
    },
    {
      input: 'ab',
      expectedErrors: ['Name must be at least 3 characters long']
    },
    {
      input: 'a'.repeat(256),
      expectedErrors: ['Name must be at most 255 characters long']
    },
    {
      input: 'John Doe',
      expectedErrors: []
    }
  ])('should validate invalid name "$input"', ({ input, expectedErrors }) => {
    const name = UserNameValueObject.create(input)
    expect(name.errors).toEqual(expectedErrors)
  })

  it.each([
    {
      input: 'John Doe',
      expectedErrors: []
    },
    {
      input: 'Jo',
      expectedErrors: ['Name must be at least 3 characters long']
    }
  ])('should update name to "$input"', ({ input, expectedErrors }) => {
    const name = UserNameValueObject.create('Jane Doe')
    name.update(input)
    expect(name.value).toBe(input)
    expect(name.errors).toEqual(expectedErrors)
  })
})
