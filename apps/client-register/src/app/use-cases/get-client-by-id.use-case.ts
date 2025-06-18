import { NotFoundException, type UseCase } from 'core'

import type { GetClientByIdInputDTO } from '../dtos/get-client-by-id-input.dto'
import type { GetClientByIdOutputDTO } from '../dtos/get-client-by-id-output.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class GetClientByIdUseCase
  implements UseCase<GetClientByIdInputDTO, GetClientByIdOutputDTO>
{
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: GetClientByIdInputDTO): Promise<GetClientByIdOutputDTO> {
    const client = await this.clientRepository.findById(input.id)
    if (!client) throw new NotFoundException(`Client with ID ${input.id} not found`)
    return { data: client.toJSON() }
  }
}
