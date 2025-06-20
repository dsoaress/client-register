import type { MessagingConsumerService } from 'core'

import type { ProcessClientDataUseCase } from '../../app/use-cases/process-client-data.use-case'
import { env } from '../config/env'

export class ClientConsumer {
  constructor(
    private readonly messagingConsumerService: MessagingConsumerService,
    private readonly processClientDataUseCase: ProcessClientDataUseCase
  ) {}

  async initialize(): Promise<void> {
    await this.messagingConsumerService.subscribe(env.CLIENT_TOPIC)
    await this.messagingConsumerService.onMessage(this.processClientDataUseCase)
  }
}
