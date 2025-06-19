import { faker } from '@faker-js/faker'
import { IdValueObject } from 'core'

import { PasswordValueObject } from '../src/domain/value-objects/password.value-object'
import { mongooseClientMapper } from '../src/infra/data/mongoose/mappers/mongoose-client.mapper'
import { mongooseModule } from '../src/infra/data/mongoose/mongoose.module'

const data = Array.from({ length: 100 }, () =>
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

const { clientRepository, connectDatabase } = mongooseModule()

async function seedDatabase() {
  await connectDatabase()
  await Promise.all(data.map(clientRepository.create))
  console.info('Database seeded successfully with 100 clients.')
}

seedDatabase()
  .catch(error => {
    console.error('Unexpected error during seeding:', error)
    process.exit(1)
  })
  .finally(() => {
    console.info('Seeding process completed.')
    process.exit(0)
  })
