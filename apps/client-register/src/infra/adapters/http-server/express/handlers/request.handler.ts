import type { Handler, HttpRequest, HttpResponse } from 'core'
import type { Express } from 'express'

import { errorHandler } from './error.handler'

export async function handleRequest<T>(
  method: 'get' | 'post' | 'patch' | 'put' | 'delete',
  path: string,
  handler: Handler<T>,
  server: Express
): Promise<void> {
  server[method](path, async (req, res) => {
    const httpRequest: HttpRequest<T> = {
      body: req.body as T extends { body: infer B } ? B : undefined,
      params: req.params as T extends { params: infer P } ? P : Record<string, string>,
      query: req.query as T extends { query: infer Q } ? Q : Record<string, string>,
      headers: req.headers as T extends { headers: infer H } ? H : Record<string, string>
    }

    const httpResponse: HttpResponse = {
      status: code => {
        res.status(code)
        return httpResponse
      },
      send: data => {
        res.send(data)
      }
    }

    try {
      await handler(httpRequest, httpResponse)
    } catch (error) {
      errorHandler(error, res)
    }
  })
}
