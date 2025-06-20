import type { UseCase } from './use-case'

export interface MessagingProducerService {
  connect(): Promise<void>
  send<T>(topic: string, message: T): Promise<void>
}

export interface MessagingConsumerService {
  connect(): Promise<void>
  subscribe(topic: string): Promise<void>
  onMessage<Input, Output>(handler: UseCase<Input, Output>): Promise<void>
}
