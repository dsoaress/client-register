import type { PaginatedFiltersDTO } from 'core'

import type { ClientRepository } from '../../../../app/repositories/client.repository'
import type { ClientEntity } from '../../../../domain/entities/client.entity'
import { mongooseClientMapper } from '../mappers/mongoose-client.mapper'
import { ClientModel } from '../models/client.model'

export class MongooseClientRepository implements ClientRepository {
  async findById(id: string): Promise<ClientEntity | null> {
    const client = await ClientModel.findById(id).exec()
    if (!client) return null
    return mongooseClientMapper.toDomain(client)
  }

  async findByEmail(email: string): Promise<ClientEntity | null> {
    const client = await ClientModel.findOne({ email }).exec()
    if (!client) return null
    return mongooseClientMapper.toDomain(client)
  }

  async findByPhone(phone: string): Promise<ClientEntity | null> {
    const client = await ClientModel.findOne({ phone }).exec()
    if (!client) return null
    return mongooseClientMapper.toDomain(client)
  }

  async findAll({
    page,
    limit,
    search,
    sortBy,
    sortOrder
  }: PaginatedFiltersDTO): Promise<{ data: ClientEntity[]; total: number }> {
    const query: Record<string, unknown> = {}
    sortOrder = sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc'
    sortBy = sortBy?.toLowerCase() ?? 'createdAt'

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ]
    }

    const [total, clients] = await Promise.all([
      ClientModel.countDocuments(query).exec(),
      ClientModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec()
    ])

    return {
      data: clients.map(client => mongooseClientMapper.toDomain(client)),
      total
    }
  }

  async create(entity: ClientEntity): Promise<void> {
    const client = mongooseClientMapper.toPersistence(entity)
    await client.save()
  }

  async update(entity: ClientEntity): Promise<void> {
    const client = mongooseClientMapper.toPersistence(entity)
    await ClientModel.updateOne({ _id: client.id }, client).exec()
  }

  async delete(id: string): Promise<void> {
    await ClientModel.findByIdAndDelete(id).exec()
  }
}
