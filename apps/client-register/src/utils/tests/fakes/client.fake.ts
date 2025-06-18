import { ClientEntity } from '../../../domain/entities/client.entity'

export function clientFake(overrides: Partial<ClientEntity> = {}) {
  return ClientEntity.create({
    name: 'John Doe',
    email: 'john-doe@example.com',
    phone: '1234567890',
    age: 30,
    password: 'securePassword123@',
    isActive: true,
    ...overrides
  })
}
