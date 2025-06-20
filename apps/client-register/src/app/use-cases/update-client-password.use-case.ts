import { NotFoundException, type UseCase } from 'core'
import { validateId } from '../../utils/validate-id'
import type { ClientOutputDTO } from '../dtos/client-output.dto'
import type { UpdateClientPasswordInputDTO } from '../dtos/update-client-password-input.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class UpdateClientPasswordUseCase
  implements UseCase<UpdateClientPasswordInputDTO, ClientOutputDTO>
{
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: UpdateClientPasswordInputDTO): Promise<ClientOutputDTO> {
    validateId(input.id)
    const client = await this.clientRepository.findById(input.id)
    if (!client) throw new NotFoundException(`Client with id ${input.id} not found`)
    client.updatePassword(input.newPassword, input.currentPassword)
    await this.clientRepository.update(client)
    return client.toJSON()
  }
}
