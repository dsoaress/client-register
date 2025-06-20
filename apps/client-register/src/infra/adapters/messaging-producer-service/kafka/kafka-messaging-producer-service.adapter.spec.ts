import { Kafka } from 'kafkajs'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'

import { KafkaMessagingProducerServiceAdapter } from './kafka-messaging-producer-service.adapter'

vi.mock('kafkajs', () => {
  return {
    Kafka: vi.fn().mockImplementation(() => ({
      producer: vi.fn().mockReturnValue({
        connect: vi.fn(),
        send: vi.fn()
      })
    }))
  }
})

vi.mock('../../../config/env', () => ({
  env: {
    APP_NAME: 'test-app',
    KAFKA_BROKER_URL: 'localhost:9092'
  }
}))

vi.mock('../../../config/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}))

describe('KafkaMessagingProducerServiceAdapter', () => {
  let adapter: KafkaMessagingProducerServiceAdapter
  let producerMock: {
    connect: () => Promise<void>
    send: (params: { topic: string; messages: { value: string }[] }) => Promise<void>
  }

  beforeEach(() => {
    producerMock = { connect: vi.fn(), send: vi.fn() }
    ;(Kafka as Mock).mockImplementation(() => ({ producer: () => producerMock }))
    adapter = new KafkaMessagingProducerServiceAdapter()
  })

  it('should connect the producer and log info', async () => {
    await adapter.connect()
    expect(producerMock.connect).toHaveBeenCalled()
  })

  it('should send a message to the given topic', async () => {
    const topic = 'test-topic'
    const message = { foo: 'bar' }
    await adapter.send(topic, message)
    expect(producerMock.send).toHaveBeenCalledWith({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    })
  })
})
