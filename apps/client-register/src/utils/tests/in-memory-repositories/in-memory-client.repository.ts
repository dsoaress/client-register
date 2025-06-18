import type { PaginatedFiltersDTO } from 'core'

import type { ClientRepository } from '../../../app/repositories/client.repository'
import type { ClientEntity } from '../../../domain/entities/client.entity'

export class InMemoryClientRepository implements ClientRepository {
  constructor(private readonly _clients: ClientEntity[] = []) {}

  async findById(id: string): Promise<ClientEntity | null> {
    const client = this._clients.find(client => client.id === id)
    return client || null
  }

  async findByEmail(email: string): Promise<ClientEntity | null> {
    const client = this._clients.find(client => client.email === email)
    return client || null
  }

  async findByPhone(phone: string): Promise<ClientEntity | null> {
    const client = this._clients.find(client => client.phone === phone)
    return client || null
  }

  async findAll({
    limit,
    page
  }: PaginatedFiltersDTO): Promise<{ data: ClientEntity[]; total: number }> {
    const filteredClients = this._clients

    const total = filteredClients.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedClients = filteredClients.slice(startIndex, endIndex)

    return { data: paginatedClients, total }
  }

  async create(Entity: ClientEntity): Promise<void> {
    this._clients.push(Entity)
  }

  async update(Entity: ClientEntity): Promise<void> {
    const index = this._clients.findIndex(client => client.id === Entity.id)
    this._clients[index] = Entity
  }

  async delete(id: string): Promise<void> {
    const index = this._clients.findIndex(client => client.id === id)
    this._clients.splice(index, 1)
  }
}
