import { logger } from '../../../../config/logger'
import { RedisCacheServiceAdapter } from '../redis-cache-service.adapter'

const cacheService = new RedisCacheServiceAdapter()
await cacheService
  .flush()
  .then(() => logger.info('Redis cache flushed'))
  .catch(logger.error)
  .finally(() => process.exit(0))
