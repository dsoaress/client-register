const { NOTIFICATION_REGISTER_NAME, KAFKA_CLIENT_TOPIC, KAFKA_BROKER_URL } = process.env

if (!KAFKA_BROKER_URL) {
  throw new Error('Missing environment variable: KAFKA_BROKER_URL')
}

const env = {
  APP_NAME: NOTIFICATION_REGISTER_NAME ?? 'notification',
  CLIENT_TOPIC: KAFKA_CLIENT_TOPIC ?? 'client',
  KAFKA_BROKER_URL: KAFKA_BROKER_URL
}

export { env }
