import { IdValueObject, NotFoundException, type UseCase } from 'core'
import { validateId } from '../../utils/validate-id'
import type { DeleteClientInputDTO } from '../dtos/delete-client-input.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class DeleteClientUseCase implements UseCase<DeleteClientInputDTO, void> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute({ id }: DeleteClientInputDTO): Promise<void> {
    validateId(id)
    const client = await this.clientRepository.findById(IdValueObject.create(id).value)
    if (!client) throw new NotFoundException(`Client with id ${id} not found`)
    await this.clientRepository.delete(id)
  }
}
