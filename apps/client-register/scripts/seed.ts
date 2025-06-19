import { faker } from '@faker-js/faker'
import { IdValueObject } from 'core'

import { PasswordValueObject } from '../src/domain/value-objects/password.value-object'
import { RedisCacheServiceAdapter } from '../src/infra/adapters/cache-service/redis/redis-cache-service.adapter'
import { logger } from '../src/infra/config/logger'
import { ClientModel } from '../src/infra/data/mongoose/models/client.model'
import { mongooseModule } from '../src/infra/data/mongoose/mongoose.module'

const LENGTH = 100

const cacheService = new RedisCacheServiceAdapter()
const { connectDatabase } = mongooseModule({ cacheService })

async function seedDatabase() {
  logger.info(`Seeding database with ${LENGTH} clients...`)
  await connectDatabase()

  const data = Array.from({ length: LENGTH }, () => ({
    _id: IdValueObject.create().value,
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    age: faker.number.int({ min: 18, max: 65 }),
    email: faker.internet.email().toLowerCase(),
    password: PasswordValueObject.create('SecurePassword123@', true).value,
    isActive: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }))

  await ClientModel.create(data)
  await cacheService.flush()
  logger.info(`Database seeded successfully with ${LENGTH} clients`)
}

seedDatabase()
  .catch(error => {
    logger.error('Unexpected error during seeding:', error)
    process.exit(1)
  })
  .finally(() => {
    logger.info('Seeding process completed.')
    process.exit(0)
  })
