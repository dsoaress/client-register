import type { MessagingConsumerService, UseCase } from 'core'
import { Kafka } from 'kafkajs'

import { env } from '../../../config/env'
import { logger } from '../../../config/logger'

export class KafkaMessagingConsumerServiceAdapter implements MessagingConsumerService {
  private readonly consumer = new Kafka({
    clientId: env.APP_NAME,
    brokers: [env.KAFKA_BROKER_URL],
    ssl: false,
    logCreator: () => {
      return log => {
        if (log.level === 1) logger.error(log)
        else if (log.level === 2) logger.warn(log)
        else logger.info(log)
      }
    }
  }).consumer({ groupId: env.APP_NAME })

  async connect(): Promise<void> {
    await this.consumer.connect()
    logger.info('Connected to Kafka Consumer')
  }

  async subscribe(topic: string): Promise<void> {
    await this.consumer.subscribe({ topic })
  }

  async onMessage<Input, Output>(handler: UseCase<Input, Output>): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        await handler.execute(JSON.parse(message.value?.toString() ?? '{}') as Input)
      }
    })
  }
}
