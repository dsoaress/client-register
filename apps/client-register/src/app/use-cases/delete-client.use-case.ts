import { BadRequestException, NotFoundException, type UseCase } from 'core'
import type { DeleteClientInputDTO } from '../dtos/delete-client-input.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class DeleteClientUseCase implements UseCase<DeleteClientInputDTO, void> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute({ id }: DeleteClientInputDTO): Promise<void> {
    if (typeof id !== 'string' || id.trim() === '')
      throw new BadRequestException('Invalid client ID')
    const client = await this.clientRepository.findById(id)
    if (!client) throw new NotFoundException(`Client with id ${id} not found`)
    await this.clientRepository.delete(id)
  }
}
