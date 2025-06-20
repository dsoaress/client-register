import type { HttpServer } from 'core'
import express from 'express'
import { RedisCacheServiceAdapter } from './adapters/cache-service/redis/redis-cache-service.adapter'
import { ExpressHttpServerAdapter } from './adapters/http-server/express/express-http-server.adapter'
import { KafkaMessagingProducerServiceAdapter } from './adapters/messaging-producer-service/kafka/kafka-messaging-producer-service.adapter'
import { mongooseModule } from './data/mongoose/mongoose.module'
import { httpModule } from './http/http.modules'

export async function serverModule(): Promise<HttpServer> {
  const server = new ExpressHttpServerAdapter(express())
  const messagingProducerService = new KafkaMessagingProducerServiceAdapter()
  const cacheService = new RedisCacheServiceAdapter()
  const { clientRepository, connectDatabase } = mongooseModule({ cacheService })

  httpModule({ server, clientRepository, messagingProducerService })
  await connectDatabase()
  await messagingProducerService.connect()

  return server
}
