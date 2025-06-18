import { ConflictException } from 'core'
import { beforeEach, describe, expect, it } from 'vitest'
import { clientFake } from '../../utils/tests/fakes/client.fake'
import { InMemoryClientRepository } from '../../utils/tests/in-memory-repositories/in-memory-client.repository'
import type { ClientRepository } from '../repositories/client.repository'
import { CreateClientUseCase } from './create-client.use-case'

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase
  let clientRepository: ClientRepository

  beforeEach(() => {
    clientRepository = new InMemoryClientRepository()
    createClientUseCase = new CreateClientUseCase(clientRepository)
  })

  it('should create a client', async () => {
    const input = clientFake({ id: undefined }).toJSON()
    await createClientUseCase.execute(input)
    const clients = await clientRepository.findAll({ page: 1, limit: 10 })
    expect(clients.data).toHaveLength(1)
    expect(clients.data[0].id).toBeDefined()
    expect(clients.data[0].name).toBe(input.name)
  })

  it('should throw ConflictException for already existing client email', async () => {
    const email = 'john-doe@example.com'
    const client1 = clientFake({ id: undefined, email })
    const client2 = clientFake({ id: undefined, email })
    await clientRepository.create(client1)
    await expect(createClientUseCase.execute(client2.toJSON())).rejects.toThrowError(
      ConflictException
    )
  })

  it('should throw ConflictException for already existing client phone', async () => {
    const phone = '1234567890'
    const client1 = clientFake({ id: undefined, phone })
    const client2 = clientFake({ id: undefined, phone })
    await clientRepository.create(client1)
    await expect(createClientUseCase.execute(client2.toJSON())).rejects.toThrowError(
      ConflictException
    )
  })
})
