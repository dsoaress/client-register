import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import cors from 'cors'
import { type Express, json } from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml'

import { healthCheckHandler } from './handlers/health-check.handler'
import { loggerHandler } from './handlers/logger.handler'

export function setup(server: Express): void {
  server.use(cors({ origin: '*' }))
  server.use(json())
  server.use(loggerHandler)
  server.get('/health', healthCheckHandler)

  try {
    const swaggerFilePath = resolve(process.cwd(), 'openapi.yaml')
    const swaggerDocument = YAML.parse(readFileSync(swaggerFilePath, 'utf8'))
    server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  } catch {
    // do nothing if the file is not found
  }
}
