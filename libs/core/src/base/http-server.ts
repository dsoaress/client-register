import type { Server } from 'node:http'

export const httpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
}

export type Handler<T> = (req: HttpRequest<T>, res: HttpResponse) => Promise<void>

export interface HttpServer {
  listen(port: number, callback?: () => void): Promise<void>
  get<T>(path: string, handler: Handler<T>): Promise<void>
  post<T>(path: string, handler: Handler<T>): Promise<void>
  patch<T>(path: string, handler: Handler<T>): Promise<void>
  put<T>(path: string, handler: Handler<T>): Promise<void>
  delete<T>(path: string, handler: Handler<T>): Promise<void>
  getRawServer(): Server
}

export interface HttpRequest<T> {
  body: T extends { body: infer B } ? B : unknown
  params: T extends { params: infer P } ? P : Record<string, string>
  query: T extends { query: infer Q } ? Q : Record<string, string>
  headers: T extends { headers: infer H } ? H : Record<string, string>
}

export interface HttpResponse {
  send: (data?: { data: unknown }) => void
  status: (code: number) => HttpResponse
}
