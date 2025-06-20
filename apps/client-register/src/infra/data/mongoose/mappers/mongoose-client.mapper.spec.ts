import { IdValueObject } from 'core'
import { describe, expect, it } from 'vitest'

import { ClientEntity } from '../../../../domain/entities/client.entity'
import { clientFake } from '../../../../utils/tests/fakes/client.fake'
import { mongooseClientMapper } from './mongoose-client.mapper'

const validClientProps = { ...clientFake().toJSON(), isUnhashedPassword: true }

describe('mongooseClientMapper', () => {
  it('should map MongooseClientDocument to ClientEntity', () => {
    const clientEntity = ClientEntity.create(validClientProps)
    const persistence = mongooseClientMapper.toPersistence(clientEntity)
    expect(persistence._id).toBeDefined()
    expect(persistence.name).toBe(clientEntity.name)
    expect(persistence.email).toBe(clientEntity.email)
    expect(persistence.phone).toBe(clientEntity.phone)
    expect(persistence.age).toBe(clientEntity.age)
    expect(persistence.password).toBe(clientEntity.password)
    expect(persistence.isActive).toBe(clientEntity.isActive)
    expect(persistence.createdAt).toEqual(clientEntity.createdAt)
    expect(persistence.updatedAt).toEqual(clientEntity.updatedAt)
  })

  it('should map a list of MongooseClientDocument to ClientEntity', () => {
    const persistenceList = [
      {
        ...validClientProps,
        _id: IdValueObject.create().value,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ...validClientProps,
        _id: IdValueObject.create().value,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    const clientEntities = mongooseClientMapper.toDomainPaginated({
      data: persistenceList,
      total: persistenceList.length
    })
    expect(clientEntities.data.length).toBe(2)
    expect(clientEntities.data[0].id).toBe(persistenceList[0]._id)
    expect(clientEntities.data[0].name).toBe(persistenceList[0].name)
  })

  it('should map MongooseClientDocument to ClientEntity with correct properties', () => {
    const persistence = {
      ...validClientProps,
      _id: IdValueObject.create().value,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const clientEntity = mongooseClientMapper.toDomain(persistence)
    expect(clientEntity.id).toBe(persistence._id)
    expect(clientEntity.name).toBe(persistence.name)
    expect(clientEntity.email).toBe(persistence.email)
    expect(clientEntity.phone).toBe(persistence.phone)
    expect(clientEntity.age).toBe(persistence.age)
    expect(clientEntity.password).toBe(persistence.password)
    expect(clientEntity.isActive).toBe(persistence.isActive)
    expect(clientEntity.createdAt).toEqual(persistence.createdAt)
    expect(clientEntity.updatedAt).toEqual(persistence.updatedAt)
  })
})
