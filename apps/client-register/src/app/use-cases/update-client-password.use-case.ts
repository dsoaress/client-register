import { NotFoundException, type UseCase } from 'core'

import type { UpdateClientPasswordInputDTO } from '../dtos/update-client-password-input.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class UpdateClientPasswordUseCase implements UseCase<UpdateClientPasswordInputDTO, void> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: UpdateClientPasswordInputDTO): Promise<void> {
    const client = await this.clientRepository.findById(input.id)
    if (!client) throw new NotFoundException(`Client with id ${input.id} not found`)
    await client.updatePassword(input.newPassword, input.currentPassword)
    await this.clientRepository.update(client)
  }
}
