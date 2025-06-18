import type { UseCase } from 'core'
import type { ClientEntity } from '../../domain/entities/client.entity'
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
    return mountPaginate(this.removeSensitiveData(data), total, input.page, input.limit)
  }

  private removeSensitiveData(clients: ClientEntity[]): GetAllClientsOutputDTO['data'] {
    return clients.map(client => {
      const { password: _, ...clientWithoutPassword } = client.toJSON()
      return clientWithoutPassword
    })
  }
}
