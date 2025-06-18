import type { UseCase } from 'core'

import { ClientEntity } from '../../domain/entities/client.entity'
import type { CreateClientInputDTO } from '../dtos/create-client-input.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class CreateClientUseCase implements UseCase<CreateClientInputDTO, void> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: CreateClientInputDTO): Promise<void> {
    const client = ClientEntity.create(input)
    await this.clientRepository.create(client)
  }
}
