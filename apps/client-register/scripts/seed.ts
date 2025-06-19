import { faker } from '@faker-js/faker'
import { IdValueObject } from 'core'

import { PasswordValueObject } from '../src/domain/value-objects/password.value-object'
import { logger } from '../src/infra/config/logger'
import { mongooseClientMapper } from '../src/infra/data/mongoose/mappers/mongoose-client.mapper'
import { mongooseModule } from '../src/infra/data/mongoose/mongoose.module'

const LENGTH = 100

const { clientRepository, connectDatabase } = mongooseModule()

async function seedDatabase() {
  logger.info(`Seeding database with ${LENGTH} clients...`)
  await connectDatabase()

  const data = Array.from({ length: LENGTH }, () =>
    mongooseClientMapper.toDomain({
      _id: IdValueObject.create().value,
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      age: faker.number.int({ min: 18, max: 65 }),
      email: faker.internet.email().toLowerCase(),
      password: PasswordValueObject.create('SecurePassword123@', true).value,
      isActive: faker.datatype.boolean(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    })
  )

  await Promise.all(data.map(clientRepository.create))
  logger.info(`Database seeded successfully with ${LENGTH} clients.`)
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
