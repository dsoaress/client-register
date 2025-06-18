import { BadRequestException, IdValueObject } from 'core'
import { describe, expect, it } from 'vitest'

import { UserEntity } from './user.entity'

const validUserProps = {
  id: IdValueObject.create().value,
  name: 'John Doe',
  email: 'john-doe@example.com',
  phone: '1234567890',
  age: 30,
  password: 'securePassword123@',
  isActive: true,
  createdAt: new Date('2023-10-01T00:00:00Z'),
  updatedAt: new Date('2023-10-01T00:00:00Z')
}

describe('UserEntity', () => {
  it('should create a user with valid properties', () => {
    const user = UserEntity.create(validUserProps)
    expect(user.id).toBeDefined()
    expect(user.name).toBe(validUserProps.name)
    expect(user.email).toBe(validUserProps.email)
    expect(user.phone).toBe(validUserProps.phone)
    expect(user.age).toBe(validUserProps.age)
    expect(user.password).toBeTruthy()
    expect(user.isActive).toBe(validUserProps.isActive)
    expect(user.createdAt).toBe(validUserProps.createdAt)
    expect(user.updatedAt).toBe(validUserProps.updatedAt)
  })

  it('should throw an BadRequestError if invalid properties are provided', () => {
    expect(() => {
      UserEntity.create({
        email: 'invalid-email',
        name: 'Jo',
        phone: '',
        age: 0,
        password: 'short',
        // @ts-expect-error: Testing invalid property
        isActive: 'true'
      })
    }).toThrowError(BadRequestException)
  })

  it('should update user properties correctly', () => {
    const user = UserEntity.create(validUserProps)
    user.update({
      name: 'Jane Doe',
      email: 'jane-doe@example.com',
      phone: '0987654321',
      age: 25,
      isActive: false
    })
    expect(user.name).toBe('Jane Doe')
    expect(user.email).toBe('jane-doe@example.com')
    expect(user.phone).toBe('0987654321')
    expect(user.age).toBe(25)
    expect(user.isActive).toBe(false)
    expect(user.updatedAt.getTime()).toBeGreaterThan(validUserProps.updatedAt.getTime())
  })

  it.each([
    { input: { name: 'Jane Doe' } },
    { input: { email: 'jane-doe@example.com' } },
    { input: { phone: '0987654321' } },
    { input: { age: 25 } }
  ])('should update partial user properties "$input"', ({ input }) => {
    const user = UserEntity.create(validUserProps)
    user.update(input)
    expect(user.name).toBe(input.name ?? validUserProps.name)
    expect(user.email).toBe(input.email ?? validUserProps.email)
    expect(user.phone).toBe(input.phone ?? validUserProps.phone)
    expect(user.age).toBe(input.age ?? validUserProps.age)
    expect(user.updatedAt.getTime()).toBeGreaterThan(validUserProps.updatedAt.getTime())
  })

  it('should throw an BadRequestError when updating with invalid properties', () => {
    const user = UserEntity.create(validUserProps)
    expect(() => {
      user.update({
        name: 'Jo',
        email: 'invalid-email',
        phone: '',
        age: 0
      })
    }).toThrowError(BadRequestException)
  })

  it('should be able to update the password', async () => {
    const user = UserEntity.create(validUserProps)
    const currentPassword = validUserProps.password
    const currentHashedPassword = user.password
    const newPassword = 'NewSecurePassword123@'
    await user.updatePassword(newPassword, currentPassword)
    expect(user.password).not.toBe(currentHashedPassword)
  })

  it('should throw an BadRequestError when updating the password with an incorrect current password', async () => {
    const user = UserEntity.create(validUserProps)
    const incorrectCurrentPassword = 'WrongPassword123@'
    const newPassword = 'NewSecurePassword123@'
    await expect(user.updatePassword(newPassword, incorrectCurrentPassword)).rejects.toThrowError(
      BadRequestException
    )
  })

  it('should convert user to JSON correctly', () => {
    const user = UserEntity.create(validUserProps)
    const userJson = user.toJSON()
    expect(userJson).toEqual({
      id: user.id,
      createdAt: validUserProps.createdAt,
      updatedAt: validUserProps.updatedAt,
      name: validUserProps.name,
      email: validUserProps.email,
      phone: validUserProps.phone,
      age: validUserProps.age,
      password: user.password,
      isActive: validUserProps.isActive
    })
  })
})
