import type { PaginatedFiltersDTO, Repository } from 'core'

import type { ClientEntity } from '../../domain/entities/client.entity'

export interface ClientRepository extends Repository<ClientEntity> {
  findById(id: string): Promise<ClientEntity | null>
  findByEmail(email: string): Promise<ClientEntity | null>
  findByPhone(phone: string): Promise<ClientEntity | null>
  findAll(filters: PaginatedFiltersDTO): Promise<{ data: ClientEntity[]; total: number }>
  create(entity: ClientEntity): Promise<void>
  update(entity: ClientEntity): Promise<void>
  delete(id: string): Promise<void>
}
