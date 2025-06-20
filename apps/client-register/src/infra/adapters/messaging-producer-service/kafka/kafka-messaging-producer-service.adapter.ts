import type { MessagingProducerService } from 'core'
import { Kafka } from 'kafkajs'

import { env } from '../../../config/env'
import { logger } from '../../../config/logger'

export class KafkaMessagingProducerServiceAdapter implements MessagingProducerService {
  private readonly producer = new Kafka({
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
  }).producer()

  async connect(): Promise<void> {
    await this.producer.connect()
    logger.info('Connected to Kafka')
  }

  async send<T>(topic: string, message: T): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    })
  }
}
