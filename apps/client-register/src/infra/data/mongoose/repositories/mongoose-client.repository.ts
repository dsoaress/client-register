import type { CacheService, PaginatedFiltersDTO } from 'core'
import type { Model } from 'mongoose'

import type { ClientRepository } from '../../../../app/repositories/client.repository'
import type { ClientEntity } from '../../../../domain/entities/client.entity'
import { mongooseClientMapper } from '../mappers/mongoose-client.mapper'
import type { MongooseClientDocument } from '../models/client.model'

export class MongooseClientRepository implements ClientRepository {
  constructor(
    private readonly clientModel: Model<MongooseClientDocument>,
    private readonly cacheService: CacheService
  ) {}

  async findById(id: string): Promise<ClientEntity | null> {
    const cachedClient = await this.cacheService.get<MongooseClientDocument>(
      this.getClientCacheKey(id)
    )
    if (cachedClient) return mongooseClientMapper.toDomain(cachedClient)

    const client = await this.clientModel.findById(id).exec()
    if (!client) return null

    await this.cacheService.set(this.getClientCacheKey(id), client)
    return mongooseClientMapper.toDomain(client)
  }

  async findByEmail(email: string): Promise<ClientEntity | null> {
    const client = await this.clientModel.findOne({ email }).exec()
    if (!client) return null
    return mongooseClientMapper.toDomain(client)
  }

  async findByPhone(phone: string): Promise<ClientEntity | null> {
    const client = await this.clientModel.findOne({ phone }).exec()
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
    const cachedClients = await this.cacheService.get<{
      data: MongooseClientDocument[]
      total: number
    }>(this.getClientsCacheKey({ page, limit, search, sortBy, sortOrder }))
    if (cachedClients) return mongooseClientMapper.toDomainPaginated(cachedClients)

    const query: Record<string, unknown> = {}
    sortOrder = sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc'
    sortBy = sortBy ?? 'createdAt'

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') }
      ]
    }

    const [total, clients] = await Promise.all([
      this.clientModel.countDocuments(query).exec(),
      this.clientModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec()
    ])

    await this.cacheService.set(
      this.getClientsCacheKey({ page, limit, search, sortBy, sortOrder }),
      { data: clients, total }
    )

    return mongooseClientMapper.toDomainPaginated({
      data: clients,
      total
    })
  }

  async create(entity: ClientEntity): Promise<void> {
    const client = mongooseClientMapper.toPersistence(entity)
    await client.save()
    await Promise.all([
      this.cacheService.set(this.getClientCacheKey(client._id), client),
      this.cacheService.remove(this.getClientsCacheKey())
    ])
  }

  async update(entity: ClientEntity): Promise<void> {
    const client = mongooseClientMapper.toPersistence(entity)
    await this.clientModel.updateOne({ _id: client._id }, client).exec()
    await Promise.all([
      this.cacheService.set(this.getClientCacheKey(client._id), client),
      this.cacheService.remove(this.getClientsCacheKey())
    ])
  }

  async delete(id: string): Promise<void> {
    await this.clientModel.findByIdAndDelete(id).exec()
    await Promise.all([
      this.cacheService.remove(this.getClientCacheKey(id)),
      this.cacheService.remove(this.getClientsCacheKey())
    ])
  }

  private getClientCacheKey(id: string): string {
    return `client:${id}`
  }

  private getClientsCacheKey(filters?: PaginatedFiltersDTO): string {
    if (!filters) return 'clients'
    return `clients:page:${filters.page}:limit:${filters.limit}:sortBy:${filters.sortBy}:sortOrder:${filters.sortOrder}:search:${filters.search}`
  }
}
