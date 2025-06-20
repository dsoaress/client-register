import { ProcessClientDataUseCase } from '../app/use-cases/process-client-data.use-case'
import { KafkaMessagingConsumerServiceAdapter } from './adapters/messaging-consumer-service/kafka/kafka-messaging-consumer-service.adapter'
import { ClientConsumer } from './consumers/client.consumer'

export async function server(): Promise<void> {
  const messagingConsumerService = new KafkaMessagingConsumerServiceAdapter()
  const processClientDataUseCase = new ProcessClientDataUseCase()
  const clientConsumer = new ClientConsumer(messagingConsumerService, processClientDataUseCase)
  await messagingConsumerService.connect()
  await clientConsumer.initialize()
}
