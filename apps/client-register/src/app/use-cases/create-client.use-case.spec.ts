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
})
