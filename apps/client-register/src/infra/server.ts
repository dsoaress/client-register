import { env } from './config/env'
import { logger } from './config/logger'
import { serverModule } from './server.module'

export async function server(): Promise<void> {
  const PORT = env.SERVER_PORT
  const { server } = await serverModule()
  await server.listen(PORT, () => logger.info(`Server is running on port ${PORT}`))
}
