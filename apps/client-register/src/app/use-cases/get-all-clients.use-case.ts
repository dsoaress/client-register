import type { UseCase } from 'core'

import { mountPaginate } from '../../utils/mount-paginate'
import type { GetAllClientsInputDTO } from '../dtos/get-all-clients-input.dto'
import type { GetAllClientsOutputDTO } from '../dtos/get-all-clients-output.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class GetAllClientsUseCase
  implements UseCase<GetAllClientsInputDTO, GetAllClientsOutputDTO>
{
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: GetAllClientsInputDTO): Promise<GetAllClientsOutputDTO> {
    const { data, total } = await this.clientRepository.findAll(input)
    return mountPaginate(data, total, input.page, input.limit)
  }
}
