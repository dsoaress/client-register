import type { CacheService } from 'core'
import { connect } from 'mongoose'
import type { ClientRepository } from '../../../app/repositories/client.repository'
import { env } from '../../config/env'
import { logger } from '../../config/logger'
import { ClientModel } from './models/client.model'
import { MongooseClientRepository } from './repositories/mongoose-client.repository'

interface Input {
  cacheService: CacheService
  databaseUrl?: string
}

interface Output {
  connectDatabase: () => Promise<void>
  clientRepository: ClientRepository
}

export function mongooseModule({ cacheService, databaseUrl }: Input): Output {
  const connectDatabase = async () => {
    try {
      await connect(databaseUrl ?? env.DATABASE_URL, {
        appName: env.APP_NAME,
        dbName: env.APP_NAME
      })
      logger.info('Connected to MongoDB')
    } catch (error) {
      logger.error('Error connecting to MongoDB:', error)
      throw new Error('Failed to connect to MongoDB')
    }
  }

  const clientRepository = new MongooseClientRepository(ClientModel, cacheService)

  return { connectDatabase, clientRepository }
}
