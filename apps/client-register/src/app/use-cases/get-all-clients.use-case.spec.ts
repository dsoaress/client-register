import { beforeEach, describe, expect, it } from 'vitest'
import { clientFake } from '../../utils/tests/fakes/client.fake'
import { InMemoryClientRepository } from '../../utils/tests/in-memory-repositories/in-memory-client.repository'
import type { ClientRepository } from '../repositories/client.repository'
import { GetAllClientsUseCase } from './get-all-clients.use-case'

describe('GetAllClientsUseCase', () => {
  let getAllClientsUseCase: GetAllClientsUseCase
  let clientRepository: ClientRepository

  beforeEach(() => {
    clientRepository = new InMemoryClientRepository()
    getAllClientsUseCase = new GetAllClientsUseCase(clientRepository)
  })

  it('should return all clients with pagination', async () => {
    const clients = Array.from({ length: 15 }, () => clientFake())
    await Promise.all(clients.map(client => clientRepository.create(client)))

    const input = { page: 1, limit: 10 }
    const output = await getAllClientsUseCase.execute(input)

    expect(output.data).toHaveLength(10)
    expect(output.data[0]).not.toHaveProperty('password')
    expect(output.meta.total).toBe(15)
    expect(output.meta.totalPages).toBe(2)
    expect(output.meta.page).toBe(1)
    expect(output.meta.limit).toBe(10)
  })

  it('should return empty data if no clients exist', async () => {
    const input = { page: 1, limit: 10 }
    const output = await getAllClientsUseCase.execute(input)

    expect(output.data).toHaveLength(0)
    expect(output.meta.total).toBe(0)
    expect(output.meta.totalPages).toBe(0)
    expect(output.meta.page).toBe(1)
    expect(output.meta.limit).toBe(10)
  })
})
