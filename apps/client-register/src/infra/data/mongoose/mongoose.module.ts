import { connect } from 'mongoose'

import type { ClientRepository } from '../../../app/repositories/client.repository'
import { env } from '../../config/env'
import { ClientModel } from './models/client.model'
import { MongooseClientRepository } from './repositories/mongoose-client.repository'

interface Output {
  connectDatabase: () => Promise<void>
  clientRepository: ClientRepository
}

export function mongooseModule(): Output {
  const connectDatabase = async () => {
    try {
      connect(env.DATABASE_URL, {
        appName: 'client-register',
        dbName: 'client-register'
      })
      console.info('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw new Error('Failed to connect to MongoDB')
    }
  }

  const clientRepository = new MongooseClientRepository(ClientModel)

  return { connectDatabase, clientRepository }
}
