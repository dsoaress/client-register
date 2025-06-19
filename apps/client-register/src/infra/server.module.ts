import type { HttpServer } from 'core'
import express from 'express'
import { RedisCacheServiceAdapter } from './adapters/cache-service/redis/redis-cache-service.adapter'
import { ExpressHttpServerAdapter } from './adapters/http-server/express/express-http-server.adapter'
import { mongooseModule } from './data/mongoose/mongoose.module'
import { httpModule } from './http/http.modules'

export async function serverModule(): Promise<HttpServer> {
  const server = new ExpressHttpServerAdapter(express())
  const cacheService = new RedisCacheServiceAdapter()
  const { clientRepository, connectDatabase } = mongooseModule({ cacheService })

  httpModule({ server, clientRepository })
  await connectDatabase()

  return server
}
