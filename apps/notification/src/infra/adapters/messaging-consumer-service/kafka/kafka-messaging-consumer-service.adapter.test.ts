import { Kafka } from 'kafkajs'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { KafkaMessagingConsumerServiceAdapter } from './kafka-messaging-consumer-service.adapter'

vi.mock('kafkajs', () => {
  return {
    Kafka: vi.fn().mockImplementation(() => ({
      consumer: vi.fn().mockImplementation(() => ({
        connect: vi.fn(),
        subscribe: vi.fn(),
        run: vi.fn()
      }))
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

describe('KafkaMessagingConsumerServiceAdapter', () => {
  let adapter: KafkaMessagingConsumerServiceAdapter
  let consumerMock: { connect: Mock; subscribe: Mock; run: Mock }

  beforeEach(() => {
    consumerMock = { connect: vi.fn(), subscribe: vi.fn(), run: vi.fn() }
    ;(Kafka as Mock).mockImplementation(() => ({ consumer: vi.fn(() => consumerMock) }))
    adapter = new KafkaMessagingConsumerServiceAdapter()
  })

  it('should connect and log info', async () => {
    await adapter.connect()
    expect(consumerMock.connect).toHaveBeenCalled()
  })

  it('should subscribe to a topic', async () => {
    await adapter.subscribe('test-topic')
    expect(consumerMock.subscribe).toHaveBeenCalledWith({ topic: 'test-topic' })
  })

  it('should run onMessage and call handler.execute with parsed message', async () => {
    const handler = { execute: vi.fn() }
    await adapter.onMessage(handler)

    const runArg = consumerMock.run.mock.calls[0][0]
    const messageValue = JSON.stringify({ foo: 'bar' })
    await runArg.eachMessage({ message: { value: Buffer.from(messageValue) } })

    expect(handler.execute).toHaveBeenCalledWith({ foo: 'bar' })
  })

  it('should handle missing message value in onMessage', async () => {
    const handler = { execute: vi.fn() }
    await adapter.onMessage(handler)

    const runArg = consumerMock.run.mock.calls[0][0]
    await runArg.eachMessage({ message: { value: undefined } })

    expect(handler.execute).toHaveBeenCalledWith({})
  })
})
