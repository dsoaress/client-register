import cors from 'cors'
import { type Express, json } from 'express'
import { healthCheckHandler } from './health-check.handler'

export function setup(server: Express): void {
  server.use(cors({ origin: '*' }))
  server.use(json())
  server.get('/health', healthCheckHandler)
}
