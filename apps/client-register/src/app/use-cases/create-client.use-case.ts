import { ConflictException, type UseCase } from 'core'

import { ClientEntity } from '../../domain/entities/client.entity'
import type { ClientOutputDTO } from '../dtos/client-output.dto'
import type { CreateClientInputDTO } from '../dtos/create-client-input.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class CreateClientUseCase implements UseCase<CreateClientInputDTO, ClientOutputDTO> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: CreateClientInputDTO): Promise<ClientOutputDTO> {
    await Promise.all([
      this.validateAlreadyExistsEmail(input.email),
      this.validateAlreadyExistsPhone(input.phone)
    ])
    const client = ClientEntity.create({ ...input, isUnhashedPassword: true })
    await this.clientRepository.create(client)
    return client.toJSON()
  }

  private async validateAlreadyExistsEmail(email: string): Promise<void> {
    const client = await this.clientRepository.findByEmail(email)
    if (client) throw new ConflictException(`Client with email ${email} already exists`)
  }

  private async validateAlreadyExistsPhone(phone: string): Promise<void> {
    const client = await this.clientRepository.findByPhone(phone)
    if (client) throw new ConflictException(`Client with phone ${phone} already exists`)
  }
}
