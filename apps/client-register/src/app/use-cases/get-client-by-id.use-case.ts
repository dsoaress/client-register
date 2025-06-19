import { NotFoundException, type UseCase } from 'core'
import type { ClientEntity } from '../../domain/entities/client.entity'
import { validateId } from '../../utils/validate-id'
import type { GetClientByIdInputDTO } from '../dtos/get-client-by-id-input.dto'
import type { GetClientByIdOutputDTO } from '../dtos/get-client-by-id-output.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class GetClientByIdUseCase
  implements UseCase<GetClientByIdInputDTO, GetClientByIdOutputDTO>
{
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: GetClientByIdInputDTO): Promise<GetClientByIdOutputDTO> {
    validateId(input.id)
    const client = await this.clientRepository.findById(input.id)
    if (!client) throw new NotFoundException(`Client with ID ${input.id} not found`)
    return this.removeSensitiveData(client)
  }

  private removeSensitiveData(client: ClientEntity): GetClientByIdOutputDTO {
    const { password: _, ...clientWithoutPassword } = client.toJSON()
    return { data: clientWithoutPassword }
  }
}
