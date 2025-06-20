import type { MessagingConsumerService } from 'core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ProcessClientDataUseCase } from '../../app/use-cases/process-client-data.use-case'
import { env } from '../config/env'
import { ClientConsumer } from './client.consumer'

describe('ClientConsumer', () => {
  let messagingConsumerService: MessagingConsumerService
  let processClientDataUseCase: ProcessClientDataUseCase
  let clientConsumer: ClientConsumer

  beforeEach(() => {
    messagingConsumerService = {
      subscribe: vi.fn().mockResolvedValue(undefined),
      onMessage: vi.fn().mockResolvedValue(undefined)
    } as unknown as MessagingConsumerService
    processClientDataUseCase = {} as unknown as ProcessClientDataUseCase
    clientConsumer = new ClientConsumer(messagingConsumerService, processClientDataUseCase)
  })

  it('should subscribe to the CLIENT_TOPIC on initialize', async () => {
    await clientConsumer.initialize()
    expect(messagingConsumerService.subscribe).toHaveBeenCalledWith(env.CLIENT_TOPIC)
  })

  it('should call onMessage with processClientDataUseCase on initialize', async () => {
    await clientConsumer.initialize()
    expect(messagingConsumerService.onMessage).toHaveBeenCalledWith(processClientDataUseCase)
  })
})
