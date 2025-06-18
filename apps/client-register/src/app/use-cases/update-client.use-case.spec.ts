import { ConflictException, NotFoundException } from 'core'
import { beforeEach, describe, expect, it } from 'vitest'
import { clientFake } from '../../utils/tests/fakes/client.fake'
import { InMemoryClientRepository } from '../../utils/tests/in-memory-repositories/in-memory-client.repository'
import type { ClientRepository } from '../repositories/client.repository'
import { UpdateClientUseCase } from './update-client.use-case'

describe('UpdateClientUseCase', () => {
  let updateClientUseCase: UpdateClientUseCase
  let clientRepository: ClientRepository

  beforeEach(() => {
    clientRepository = new InMemoryClientRepository()
    updateClientUseCase = new UpdateClientUseCase(clientRepository)
  })

  it('should update a client', async () => {
    const client = clientFake({ id: undefined })
    await clientRepository.create(client)
    const updatedData = {
      ...client.toJSON(),
      name: 'Updated Name',
      email: 'updated-email@example.com',
      phone: '01234567890'
    }
    const input = { ...updatedData }
    await updateClientUseCase.execute(input)
    const updatedClient = await clientRepository.findById(client.id)
    expect(updatedClient?.name).toBe('Updated Name')
    expect(updatedClient?.email).toBe('updated-email@example.com')
    expect(updatedClient?.phone).toBe('01234567890')
  })

  it('should throw NotFoundException if client does not exist', async () => {
    const input = { id: 'non-existing-id', name: 'Updated Name' }
    await expect(updateClientUseCase.execute(input)).rejects.toThrowError(NotFoundException)
  })

  it('should throw BadRequestException for already existing client email', async () => {
    const emailClient1 = 'jhon-doe@example.com'
    const emailClient2 = 'jane-doe@example.com'
    const client1 = clientFake({ id: undefined, email: emailClient1 })
    const client2 = clientFake({ id: undefined, email: emailClient2 })
    await Promise.all([clientRepository.create(client1), clientRepository.create(client2)])
    const input = { id: client1.id, email: emailClient2 }
    await expect(updateClientUseCase.execute(input)).rejects.toThrowError(ConflictException)
  })

  it('should throw BadRequestException for already existing client phone', async () => {
    const phoneClient1 = '1234567890'
    const phoneClient2 = '0987654321'
    const client1 = clientFake({ id: undefined, phone: phoneClient1 })
    const client2 = clientFake({ id: undefined, phone: phoneClient2 })
    await Promise.all([clientRepository.create(client1), clientRepository.create(client2)])
    const input = { id: client1.id, phone: phoneClient2 }
    await expect(updateClientUseCase.execute(input)).rejects.toThrowError(ConflictException)
  })
})
