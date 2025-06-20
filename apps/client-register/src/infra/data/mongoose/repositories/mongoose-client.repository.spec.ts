import { faker } from '@faker-js/faker'
import { type CacheService, IdValueObject } from 'core'
import { connect, type Model } from 'mongoose'
import { GenericContainer, type StartedTestContainer } from 'testcontainers'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { clientFake } from '../../../../utils/tests/fakes/client.fake'
import { RedisCacheServiceAdapter } from '../../../adapters/cache-service/redis/redis-cache-service.adapter'
import { mongooseClientMapper } from '../mappers/mongoose-client.mapper'
import { ClientModel, type MongooseClientDocument } from '../models/client.model'
import { MongooseClientRepository } from './mongoose-client.repository'

describe('MongooseClientRepository', () => {
  let mongoContainer: StartedTestContainer
  let clientModel: Model<MongooseClientDocument>
  let cacheService: CacheService
  let clientRepository: MongooseClientRepository

  beforeAll(async () => {
    mongoContainer = await new GenericContainer('mongo').withExposedPorts(27017).start()
    await connect(`mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(27017)}`)
  })

  beforeEach(() => {
    clientModel = ClientModel
    cacheService = new RedisCacheServiceAdapter()
    clientRepository = new MongooseClientRepository(clientModel, cacheService)
  })

  afterEach(async () => {
    await cacheService.flush()
    await clientModel.deleteMany()
  })

  afterAll(async () => {
    await mongoContainer.stop()
  })

  it('should be defined', () => {
    expect(clientRepository).toBeDefined()
  })

  it('should find a client by ID', async () => {
    const client = mongooseClientMapper.toPersistence(clientFake())
    await clientModel.create(client)

    const cachedClient = await cacheService.get<MongooseClientDocument>(`client:${client._id}`)
    const foundClient = (await clientRepository.findById(client._id))?.toJSON()

    expect(cachedClient).toBeUndefined()
    expect(foundClient?.id.toString()).toBe(client._id.toString())

    const cachedClientAfter = await cacheService.get<MongooseClientDocument>(`client:${client._id}`)
    expect(cachedClientAfter).toBeDefined()
    expect(cachedClientAfter?._id.toString()).toBe(client._id.toString())
  })

  it('should return null if client not found by ID', async () => {
    const foundClient = await clientRepository.findById(IdValueObject.create().value)
    expect(foundClient).toBeNull()
  })

  it('should find a client by email', async () => {
    const client = mongooseClientMapper.toPersistence(clientFake())
    await clientModel.create(client)

    const foundClient = await clientRepository.findByEmail(client.email)
    expect(foundClient?.id.toString()).toBe(client._id.toString())
  })

  it('should return null if client not found by email', async () => {
    const foundClient = await clientRepository.findByEmail('jhon-doe@example.com')
    expect(foundClient).toBeNull()
  })

  it('should find a client by phone', async () => {
    const client = mongooseClientMapper.toPersistence(clientFake())
    await clientModel.create(client)

    const foundClient = await clientRepository.findByPhone(client.phone)
    expect(foundClient?.id.toString()).toBe(client._id.toString())
  })

  it('should return null if client not found by phone', async () => {
    const foundClient = await clientRepository.findByPhone('00000000')
    expect(foundClient).toBeNull()
  })

  it('should find all clients with pagination and search', async () => {
    const clients = Array.from({ length: 10 }, () =>
      mongooseClientMapper.toPersistence(
        clientFake({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number()
        })
      )
    )
    await clientModel.insertMany(clients)

    const cachedClients = await cacheService.get<{
      data: MongooseClientDocument[]
      total: number
    }>('clients:page:1:limit:5:sortBy:createdAt:sortOrder:asc:search:')

    const paginatedClients = await clientRepository.findAll({
      page: 1,
      limit: 5,
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'asc'
    })

    expect(cachedClients).toBeUndefined()
    expect(paginatedClients.data.length).toBe(5)
    expect(paginatedClients.total).toBe(10)

    await clientRepository.findAll({
      page: 1,
      limit: 5,
      search: '',
      sortOrder: 'desc'
    })
    const cachedClientsAfter = await cacheService.get<{
      data: MongooseClientDocument[]
      total: number
    }>('clients:page:1:limit:5:sortBy:createdAt:sortOrder:desc:search:')
    expect(cachedClientsAfter).toBeDefined()
    expect(cachedClientsAfter?.data.length).toBe(5)
    expect(cachedClientsAfter?.total).toBe(10)

    const paginatedClientsWithSearch = await clientRepository.findAll({
      page: 1,
      limit: 5,
      search: clients[0].name
    })

    expect(paginatedClientsWithSearch.data.length).toBe(1)
    expect(paginatedClientsWithSearch.data[0].name).toBe(clients[0].name)
  })

  it('should find all clients from cache', async () => {
    const clients = Array.from({ length: 10 }, () =>
      mongooseClientMapper.toPersistence(
        clientFake({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number()
        })
      )
    )
    await clientModel.insertMany(clients)

    const paginatedClients = await clientRepository.findAll({
      page: 1,
      limit: 5,
      search: ''
    })

    expect(paginatedClients.data.length).toBe(5)
    expect(paginatedClients.total).toBe(10)

    await clientModel.deleteMany()

    const cachedClients = await cacheService.get<{
      data: MongooseClientDocument[]
      total: number
    }>('clients:page:1:limit:5:sortBy:createdAt:sortOrder:desc:search:')

    expect(cachedClients?.data.length).toBe(5)
    expect(cachedClients?.total).toBe(10)
  })

  it('should create a new client', async () => {
    const client = clientFake()
    await clientRepository.create(client)

    const foundClient = await clientRepository.findById(client.id)
    expect(foundClient?.toJSON().id.toString()).toBe(client.id.toString())

    const cachedClient = await cacheService.get<MongooseClientDocument>(`client:${client.id}`)
    expect(cachedClient).toBeDefined()
    expect(cachedClient?._id.toString()).toBe(client.id.toString())
  })

  it('should update an existing client', async () => {
    const input = clientFake()
    const client = mongooseClientMapper.toPersistence(input)
    await clientModel.create(client)

    const updatedProps = {
      name: 'Updated Name'
    }
    input.update(updatedProps)
    await clientRepository.update(input)
    const updatedClient = await clientRepository.findById(client._id)
    expect(updatedClient?.toJSON().name).toBe(updatedProps.name)
    const cachedClient = await cacheService.get<MongooseClientDocument>(`client:${client._id}`)
    expect(cachedClient?.name).toBe(updatedProps.name)
  })

  it('should delete a client', async () => {
    const client = mongooseClientMapper.toPersistence(clientFake())
    await clientModel.create(client)

    await clientRepository.delete(client._id)
    const foundClient = await clientRepository.findById(client._id)
    expect(foundClient).toBeNull()

    const cachedClient = await cacheService.get<MongooseClientDocument>(`client:${client._id}`)
    expect(cachedClient).toBeUndefined()
  })
})
