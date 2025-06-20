import type { CacheService, HttpServer } from 'core'
import express from 'express'
import type { ClientRepository } from '../app/repositories/client.repository'
import { RedisCacheServiceAdapter } from './adapters/cache-service/redis/redis-cache-service.adapter'
import { ExpressHttpServerAdapter } from './adapters/http-server/express/express-http-server.adapter'
import { KafkaMessagingProducerServiceAdapter } from './adapters/messaging-producer-service/kafka/kafka-messaging-producer-service.adapter'
import { mongooseModule } from './data/mongoose/mongoose.module'
import { httpModule } from './http/http.modules'

interface Output {
  server: HttpServer
  cacheService: CacheService
  clientRepository: ClientRepository
}

export async function serverModule(databaseUrl?: string): Promise<Output> {
  const server = new ExpressHttpServerAdapter(express())
  const messagingProducerService = new KafkaMessagingProducerServiceAdapter()
  const cacheService = new RedisCacheServiceAdapter()
  const { clientRepository, connectDatabase } = mongooseModule({ cacheService, databaseUrl })

  httpModule({ server, clientRepository, messagingProducerService })
  await connectDatabase()
  await messagingProducerService.connect()

  return {
    server,
    cacheService,
    clientRepository
  }
}
