import { BadRequestException, IdValueObject, NotFoundException } from 'core'
import { beforeEach, describe, expect, it } from 'vitest'

import { clientFake } from '../../utils/tests/fakes/client.fake'
import { InMemoryClientRepository } from '../../utils/tests/in-memory-repositories/in-memory-client.repository'
import type { ClientRepository } from '../repositories/client.repository'
import { DeleteClientUseCase } from './delete-client.use-case'

describe('DeleteClientUseCase', () => {
  let deleteClientUseCase: DeleteClientUseCase
  let clientRepository: ClientRepository

  beforeEach(() => {
    clientRepository = new InMemoryClientRepository()
    deleteClientUseCase = new DeleteClientUseCase(clientRepository)
  })

  it('should delete a client', async () => {
    const client = clientFake({ id: undefined })
    await clientRepository.create(client)
    const input = { id: client.id }
    await deleteClientUseCase.execute(input)
    const clients = await clientRepository.findAll({ page: 1, limit: 10 })
    expect(clients.data).toHaveLength(0)
  })

  it('should throw NotFoundException if client does not exist', async () => {
    const input = { id: IdValueObject.create().value }
    await expect(deleteClientUseCase.execute(input)).rejects.toThrowError(NotFoundException)
  })

  it('should throw BadRequestException for invalid ID', async () => {
    const input = { id: '' }
    await expect(deleteClientUseCase.execute(input)).rejects.toThrowError(BadRequestException)
  })
})
