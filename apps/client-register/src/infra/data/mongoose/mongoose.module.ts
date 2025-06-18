import { connect } from 'mongoose'

import type { ClientRepository } from '../../../app/repositories/client.repository'
import { MongooseClientRepository } from './repositories/mongoose-client.repository'

interface Output {
  connectDatabase: () => Promise<void>
  clientRepository: ClientRepository
}

export function mongooseModule(): Output {
  const connectDatabase = async () => {
    try {
      connect('mongodb://mongodb:mongodb@localhost:27017', {
        appName: 'client-register',
        dbName: 'client-register'
      })
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw new Error('Failed to connect to MongoDB')
    }
  }
  const clientRepository = new MongooseClientRepository()

  return { connectDatabase, clientRepository }
}
