import { NotFoundException } from 'core'
import { beforeEach, describe, expect, it } from 'vitest'
import { clientFake } from '../../utils/tests/fakes/client.fake'
import { InMemoryClientRepository } from '../../utils/tests/in-memory-repositories/in-memory-client.repository'
import type { ClientRepository } from '../repositories/client.repository'
import { GetClientByIdUseCase } from './get-client-by-id.use-case'

describe('GetClientByIdUseCase', () => {
  let getClientByIdUseCase: GetClientByIdUseCase
  let clientRepository: ClientRepository

  beforeEach(() => {
    clientRepository = new InMemoryClientRepository()
    getClientByIdUseCase = new GetClientByIdUseCase(clientRepository)
  })

  it('should return a client by ID', async () => {
    const client = clientFake({ id: undefined })
    await clientRepository.create(client)
    const input = { id: client.id }
    const output = await getClientByIdUseCase.execute(input)
    const { password: _, ...expectedData } = client.toJSON()
    expect(output.data).toEqual(expectedData)
  })

  it('should throw NotFoundException if client does not exist', async () => {
    const input = { id: 'non-existing-id' }
    await expect(getClientByIdUseCase.execute(input)).rejects.toThrowError(NotFoundException)
  })
})
