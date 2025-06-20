import type { CacheService, HttpServer } from 'core'
import type { Model } from 'mongoose'
import request from 'supertest'
import { GenericContainer, type StartedTestContainer } from 'testcontainers'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { ClientEntity } from '../../../domain/entities/client.entity'
import { PasswordValueObject } from '../../../domain/value-objects/password.value-object'
import { clientFake } from '../../../utils/tests/fakes/client.fake'
import { mongooseClientMapper } from '../../data/mongoose/mappers/mongoose-client.mapper'
import { ClientModel, type MongooseClientDocument } from '../../data/mongoose/models/client.model'
import { serverModule } from '../../server.module'

vi.mock(
  '../../adapters/messaging-producer-service/kafka/kafka-messaging-producer-service.adapter',
  () => {
    return {
      KafkaMessagingProducerServiceAdapter: vi.fn().mockImplementation(() => ({
        connect: vi.fn(() => Promise.resolve()),
        send: vi.fn((topic, message) => Promise.resolve({ topic, message }))
      }))
    }
  }
)

describe('[E2E] ClientController', () => {
  let server: HttpServer
  let cacheService: CacheService
  let clientModel: Model<MongooseClientDocument>
  let mongoContainer: StartedTestContainer

  beforeAll(async () => {
    mongoContainer = await new GenericContainer('mongo').withExposedPorts(27017).start()
    const databaseUrl = `mongodb://${mongoContainer.getHost()}:${mongoContainer.getMappedPort(
      27017
    )}`

    const serverModuleOutput = await serverModule(databaseUrl)
    server = serverModuleOutput.server
    cacheService = serverModuleOutput.cacheService
    clientModel = ClientModel
  })

  afterEach(async () => {
    await cacheService.flush()
    await clientModel.deleteMany()
  })

  afterAll(async () => {
    await mongoContainer.stop()
  })

  describe('POST /clients', () => {
    it('should create a new client', async () => {
      const input = clientFake().toJSON()
      const response = await request(server.getRawServer()).post('/clients').send({
        name: input.name,
        email: input.email,
        phone: input.phone,
        age: input.age,
        password: input.password,
        isActive: input.isActive
      })
      expect(response.status).toBe(201)
    })

    it('should return 400 if required fields are missing', async () => {
      const response = await request(server.getRawServer()).post('/clients').send({
        name: '',
        email: '',
        phone: '',
        age: null,
        password: '',
        isActive: false
      })
      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
    })

    it('should return 409 if email is already registered', async () => {
      const input = clientFake()
      await clientModel.create(mongooseClientMapper.toPersistence(input))
      const response = await request(server.getRawServer()).post('/clients').send({
        name: input.name,
        email: input.email,
        phone: input.phone,
        age: input.age,
        password: input.password,
        isActive: input.isActive
      })
      expect(response.status).toBe(409)
      expect(response.body.error).toBeDefined()
    })

    it('should return 409 if phone is already registered', async () => {
      const input = clientFake()
      await clientModel.create(mongooseClientMapper.toPersistence(input))
      const response = await request(server.getRawServer()).post('/clients').send({
        name: input.name,
        email: input.email,
        phone: input.phone,
        age: input.age,
        password: input.password,
        isActive: input.isActive
      })
      expect(response.status).toBe(409)
      expect(response.body.error).toBeDefined()
    })
  })

  describe('GET /clients', () => {
    it('', async () => {
      expect(true).toBe(true) // Placeholder for actual test implementation
    })
  })

  describe('GET /clients/:id', () => {
    it('should return a client by ID', async () => {
      const client = clientFake()
      await clientModel.create(mongooseClientMapper.toPersistence(client))
      const response = await request(server.getRawServer()).get(`/clients/${client.id}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        data: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          age: client.age,
          isActive: client.isActive,
          createdAt: client.createdAt.toISOString(),
          updatedAt: client.updatedAt.toISOString()
        }
      })
      expect(response.body.password).toBeUndefined()
    })

    it('should return 404 if client not found by ID', async () => {
      const response = await request(server.getRawServer()).get(`/clients/${clientFake().id}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
    })

    it('should return 400 if ID is invalid', async () => {
      const response = await request(server.getRawServer()).get('/clients/invalid-id')
      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
    })
  })

  describe('PATCH /clients/:id', () => {
    it('should update a client by ID', async () => {
      const client = clientFake()
      await clientModel.create(mongooseClientMapper.toPersistence(client))
      const updatedData = {
        name: 'Updated Name'
      }
      const response = await request(server.getRawServer())
        .patch(`/clients/${client.id}`)
        .send(updatedData)
      expect(response.status).toBe(204)
      const updatedClient = await clientModel.findById(client.id.toString())
      expect(updatedClient?.name).toBe(updatedData.name)
    })

    it('should return 404 if client not found by ID', async () => {
      const response = await request(server.getRawServer())
        .patch(`/clients/${clientFake().id}`)
        .send({ name: 'Updated Name' })
      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
    })

    it('should return 400 if ID is invalid', async () => {
      const response = await request(server.getRawServer())
        .patch('/clients/invalid-id')
        .send({ name: 'Updated Name' })
      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
    })
  })

  describe('PATCH /clients/:id/password', () => {
    it('should update client password', async () => {
      const oldPassword = PasswordValueObject.create('OldPassword123@', true).value
      const client = ClientEntity.create({
        ...clientFake().toJSON(),
        password: oldPassword,
        isUnhashedPassword: false
      })

      await clientModel.create(mongooseClientMapper.toPersistence(client))
      const response = await request(server.getRawServer())
        .patch(`/clients/${client.id}/password`)
        .send({
          newPassword: 'NewPassword123@',
          currentPassword: 'OldPassword123@'
        })

      expect(response.status).toBe(204)

      const updatedClient = await clientModel.findById(client.id)
      expect(updatedClient?.password).not.toBe(oldPassword)

      const cachedClient = await cacheService.get<MongooseClientDocument>(`client:${client.id}`)
      expect(cachedClient?.password).not.toBe(oldPassword)
    })

    it('should return 400 if current password is incorrect', async () => {
      const client = clientFake()
      await clientModel.create(mongooseClientMapper.toPersistence(client))
      const response = await request(server.getRawServer())
        .patch(`/clients/${client.id}/password`)
        .send({
          newPassword: 'NewPassword123@',
          currentPassword: 'WrongCurrentPassword'
        })
      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
    })

    it('should return 404 if client not found by ID', async () => {
      const response = await request(server.getRawServer())
        .patch(`/clients/${clientFake().id}/password`)
        .send({
          newPassword: 'NewPassword123@',
          currentPassword: 'OldPassword123@'
        })
      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
    })
  })

  describe('DEL /clients/:id', () => {
    it('should delete a client by ID', async () => {
      const client = clientFake()
      await clientModel.create(mongooseClientMapper.toPersistence(client))
      const response = await request(server.getRawServer()).delete(`/clients/${client.id}`)
      expect(response.status).toBe(204)

      const deletedClient = await clientModel.findById(client.id)
      expect(deletedClient).toBeNull()

      const cachedClient = await cacheService.get<MongooseClientDocument>(`client:${client.id}`)
      expect(cachedClient).toBeUndefined()
    })

    it('should return 404 if client not found by ID', async () => {
      const response = await request(server.getRawServer()).delete(`/clients/${clientFake().id}`)
      expect(response.status).toBe(404)
      expect(response.body.error).toBeDefined()
    })

    it('should return 400 if ID is invalid', async () => {
      const response = await request(server.getRawServer()).delete('/clients/invalid-id')
      expect(response.status).toBe(400)
      expect(response.body.error).toBeDefined()
    })
  })
})
