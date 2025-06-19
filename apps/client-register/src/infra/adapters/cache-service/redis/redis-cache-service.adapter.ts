import type { CacheService } from 'core'
import Redis from 'ioredis'

import { env } from '../../../config/env'

export class RedisCacheServiceAdapter implements CacheService {
  private readonly redisService: Redis

  constructor() {
    this.redisService = new Redis(env.REDIS_URL)
  }

  async get<T>(key: string): Promise<T | undefined> {
    const value = await this.redisService.get(key)
    return value ? JSON.parse(value) : undefined
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.redisService.set(key, JSON.stringify(value), 'EX', 60 * 10) // 10 minutes expiration
  }

  async remove(key: string): Promise<void> {
    await this.redisService.del(key)
  }

  async flush(): Promise<void> {
    await this.redisService.flushdb()
  }
}
