import { BadRequestException } from 'core'
import { describe, expect, it } from 'vitest'

import { PasswordValueObject } from './password.value-object'

describe('PasswordValueObject', () => {
  it.each([
    {
      input: '',
      expectedErrors: [
        'Password must contain at least one lowercase, one uppercase, one digit, and one special character',
        'Password must be at least 8 characters long'
      ]
    },
    {
      input: 'InvalidPassword1',
      expectedErrors: [
        'Password must contain at least one lowercase, one uppercase, one digit, and one special character'
      ]
    },
    {
      input: 'InvalidPassword%',
      expectedErrors: [
        'Password must contain at least one lowercase, one uppercase, one digit, and one special character'
      ]
    },
    {
      input: 'Short1@',
      expectedErrors: ['Password must be at least 8 characters long']
    },
    {
      input: `InvalidPassword%1${'a'.repeat(73 - 17)}`,
      expectedErrors: ['Password must be at most 72 characters long']
    },
    {
      input: 'Valid1@Password',
      expectedErrors: []
    },
    {
      input: 'Valid1Password*',
      expectedErrors: []
    }
  ])('should validate invalid password "$input"', ({ input, expectedErrors }) => {
    const password = PasswordValueObject.create(input, true)
    expect(password.errors).toEqual(expectedErrors)
  })

  it.each([
    {
      input: 'NewValid1@Password',
      expectedErrors: []
    }
  ])('should update password to "$input"', ({ input, expectedErrors }) => {
    const password = PasswordValueObject.create('OldValid1@Password', true)
    const hashedOldPassword = password.value
    password.update(input, 'OldValid1@Password')
    expect(password.value).not.toBe(hashedOldPassword)
    expect(password.errors).toEqual(expectedErrors)
  })

  it('should throw an error when updating with an incorrect current password', () => {
    const password = PasswordValueObject.create('Valid1Password*', true)
    expect(() => password.update('NewValid1@Password', 'WrongCurrentPassword')).toThrowError(
      BadRequestException
    )
  })
})
