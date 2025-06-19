import type { Document } from 'mongoose'

import { ClientEntity } from '../../../../domain/entities/client.entity'
import { ClientModel, type MongooseClientDocument } from '../models/client.model'

export const mongooseClientMapper = {
  toDomain(persistence: MongooseClientDocument): ClientEntity {
    return ClientEntity.create({
      id: persistence._id,
      name: persistence.name,
      phone: persistence.phone,
      age: persistence.age,
      email: persistence.email,
      password: persistence.password,
      isUnhashedPassword: false,
      isActive: persistence.isActive,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt
    })
  },
  toDomainPaginated(persistence: { data: MongooseClientDocument[]; total: number }): {
    data: ClientEntity[]
    total: number
  } {
    return {
      data: persistence.data.map(client => this.toDomain(client)),
      total: persistence.total
    }
  },
  toPersistence(client: ClientEntity): Document & MongooseClientDocument {
    return new ClientModel({
      _id: client.id,
      name: client.name,
      phone: client.phone,
      age: client.age,
      email: client.email,
      password: client.password,
      isActive: client.isActive,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    })
  }
}
