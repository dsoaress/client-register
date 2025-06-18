import { describe, expect, it } from 'vitest'

import { EmailValueObject } from './email.value-object'

describe('EmailValueObject', () => {
  it.each([
    {
      input: '',
      expectedErrors: ['Invalid email format', 'Email must be at least 5 characters long']
    },
    { input: 'invalid-email', expectedErrors: ['Invalid email format'] },
    {
      input: `${'a'.repeat(255)}@example.com`,
      expectedErrors: ['Email must be at most 254 characters long']
    },
    {
      input: 'jhon-doe@example.com',
      expectedErrors: []
    }
  ])('should validate invalid email "$input"', ({ input, expectedErrors }) => {
    const email = EmailValueObject.create(input)
    expect(email.errors).toEqual(expectedErrors)
  })

  it.each([
    { input: 'invalid-email', expectedErrors: ['Invalid email format'] },
    {
      input: 'jhon-doe-updated@example.com',
      expectedErrors: []
    }
  ])('should update email "$input"', ({ input, expectedErrors }) => {
    const email = EmailValueObject.create('jhon-doe@example.com')
    email.update(input)
    expect(email.value).toBe(input)
    expect(email.errors).toEqual(expectedErrors)
  })
})
