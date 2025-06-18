import { NotFoundException } from 'core'
import { beforeEach, describe, expect, it } from 'vitest'
import { clientFake } from '../../utils/tests/fakes/client.fake'
import { InMemoryClientRepository } from '../../utils/tests/in-memory-repositories/in-memory-client.repository'
import type { ClientRepository } from '../repositories/client.repository'
import { UpdateClientPasswordUseCase } from './update-client-password.use-case'

describe('UpdateClientPasswordUseCase', () => {
  let updateClientPasswordUseCase: UpdateClientPasswordUseCase
  let clientRepository: ClientRepository

  beforeEach(() => {
    clientRepository = new InMemoryClientRepository()
    updateClientPasswordUseCase = new UpdateClientPasswordUseCase(clientRepository)
  })

  it("should update a client's password", async () => {
    const currentPassword = 'Old-password123'
    const client = clientFake({ id: undefined, password: currentPassword })
    const hashedCurrentPassword = client.password
    await clientRepository.create(client)
    const input = { id: client.id, newPassword: 'New-password123', currentPassword }
    await updateClientPasswordUseCase.execute(input)
    const updatedClient = await clientRepository.findById(client.id)
    expect(updatedClient?.password).not.toBe(hashedCurrentPassword)
  })

  it('should throw NotFoundException if client does not exist', async () => {
    const input = {
      id: 'non-existing-id',
      newPassword: 'New-password123',
      currentPassword: 'Old-password123'
    }
    await expect(updateClientPasswordUseCase.execute(input)).rejects.toThrowError(NotFoundException)
  })
})
