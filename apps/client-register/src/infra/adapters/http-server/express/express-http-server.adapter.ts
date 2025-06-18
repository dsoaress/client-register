import type { Server } from 'node:http'
import type { Handler, HttpServer } from 'core'
import type { Express } from 'express'

import { handleRequest } from './handlers/request.handler'
import { setup } from './handlers/setup'

export class ExpressHttpServerAdapter implements HttpServer {
  constructor(private readonly server: Express) {
    setup(server)
  }

  async listen(port: number, callback?: () => void): Promise<void> {
    this.server.listen(port, callback)
  }

  async get<T>(path: string, handler: Handler<T>): Promise<void> {
    await handleRequest('get', path, handler, this.server)
  }

  async post<T>(path: string, handler: Handler<T>): Promise<void> {
    await handleRequest('post', path, handler, this.server)
  }

  async patch<T>(path: string, handler: Handler<T>): Promise<void> {
    await handleRequest('patch', path, handler, this.server)
  }

  async put<T>(path: string, handler: Handler<T>): Promise<void> {
    await handleRequest('put', path, handler, this.server)
  }

  async delete<T>(path: string, handler: Handler<T>): Promise<void> {
    await handleRequest('delete', path, handler, this.server)
  }

  getRawServer(): Server {
    return this.server as unknown as Server
  }
}
