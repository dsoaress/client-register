import { BadRequestException, IdValueObject } from 'core'
import { describe, expect, it } from 'vitest'

import { ClientEntity } from './client.entity'

const validClientProps = {
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

describe('ClientEntity', () => {
  it('should create a client with valid properties', () => {
    const client = ClientEntity.create(validClientProps)
    expect(client.id).toBeDefined()
    expect(client.name).toBe(validClientProps.name)
    expect(client.email).toBe(validClientProps.email)
    expect(client.phone).toBe(validClientProps.phone)
    expect(client.age).toBe(validClientProps.age)
    expect(client.password).toBeTruthy()
    expect(client.isActive).toBe(validClientProps.isActive)
    expect(client.createdAt).toBe(validClientProps.createdAt)
    expect(client.updatedAt).toBe(validClientProps.updatedAt)
  })

  it('should throw an BadRequestError if invalid properties are provided', () => {
    expect(() => {
      ClientEntity.create({
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

  it('should update client properties correctly', () => {
    const client = ClientEntity.create(validClientProps)
    client.update({
      name: 'Jane Doe',
      email: 'jane-doe@example.com',
      phone: '0987654321',
      age: 25,
      isActive: false
    })
    expect(client.name).toBe('Jane Doe')
    expect(client.email).toBe('jane-doe@example.com')
    expect(client.phone).toBe('0987654321')
    expect(client.age).toBe(25)
    expect(client.isActive).toBe(false)
    expect(client.updatedAt.getTime()).toBeGreaterThan(validClientProps.updatedAt.getTime())
  })

  it.each([
    { input: { name: 'Jane Doe' } },
    { input: { email: 'jane-doe@example.com' } },
    { input: { phone: '0987654321' } },
    { input: { age: 25 } }
  ])('should update partial client properties "$input"', ({ input }) => {
    const client = ClientEntity.create(validClientProps)
    client.update(input)
    expect(client.name).toBe(input.name ?? validClientProps.name)
    expect(client.email).toBe(input.email ?? validClientProps.email)
    expect(client.phone).toBe(input.phone ?? validClientProps.phone)
    expect(client.age).toBe(input.age ?? validClientProps.age)
    expect(client.updatedAt.getTime()).toBeGreaterThan(validClientProps.updatedAt.getTime())
  })

  it('should throw an BadRequestError when updating with invalid properties', () => {
    const client = ClientEntity.create(validClientProps)
    expect(() => {
      client.update({
        name: 'Jo',
        email: 'invalid-email',
        phone: '',
        age: 0
      })
    }).toThrowError(BadRequestException)
  })

  it('should be able to update the password', async () => {
    const client = ClientEntity.create(validClientProps)
    const currentPassword = validClientProps.password
    const currentHashedPassword = client.password
    const newPassword = 'NewSecurePassword123@'
    await client.updatePassword(newPassword, currentPassword)
    expect(client.password).not.toBe(currentHashedPassword)
  })

  it('should throw an BadRequestError when updating the password with an incorrect current password', async () => {
    const client = ClientEntity.create(validClientProps)
    const incorrectCurrentPassword = 'WrongPassword123@'
    const newPassword = 'NewSecurePassword123@'
    await expect(client.updatePassword(newPassword, incorrectCurrentPassword)).rejects.toThrowError(
      BadRequestException
    )
  })

  it('should convert client to JSON correctly', () => {
    const client = ClientEntity.create(validClientProps)
    const clientJson = client.toJSON()
    expect(clientJson).toEqual({
      id: client.id,
      createdAt: validClientProps.createdAt,
      updatedAt: validClientProps.updatedAt,
      name: validClientProps.name,
      email: validClientProps.email,
      phone: validClientProps.phone,
      age: validClientProps.age,
      password: client.password,
      isActive: validClientProps.isActive
    })
  })
})
