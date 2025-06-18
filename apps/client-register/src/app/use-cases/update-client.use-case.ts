import { BadRequestException, NotFoundException, type UseCase } from 'core'

import type { ClientEntity } from '../../domain/entities/client.entity'
import type { UpdateClientInputDTO } from '../dtos/update-client-input.dto'
import type { ClientRepository } from '../repositories/client.repository'

export class UpdateClientUseCase implements UseCase<UpdateClientInputDTO, void> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(input: UpdateClientInputDTO): Promise<void> {
    const [client] = await Promise.all([
      this.validateClientExists(input.id),
      this.validateAlreadyExistsEmail(input.id, input.email),
      this.validateAlreadyExistsPhone(input.id, input.phone)
    ])
    client.update(input)
    await this.clientRepository.update(client)
  }

  private async validateClientExists(id: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(id)
    if (!client) throw new NotFoundException(`Client with id ${id} not found`)
    return client
  }

  private async validateAlreadyExistsEmail(id: string, email?: string): Promise<void> {
    if (!email) return
    const client = await this.clientRepository.findByEmail(email)
    if (client && client.id !== id)
      throw new BadRequestException(`Client with email ${email} already exists`)
  }

  private async validateAlreadyExistsPhone(id: string, phone?: string): Promise<void> {
    if (!phone) return
    const client = await this.clientRepository.findByPhone(phone)
    if (client && client.id !== id)
      throw new BadRequestException(`Client with phone ${phone} already exists`)
  }
}
