import { httpStatusCode } from 'core'
import type { Request, Response } from 'express'

export function healthCheckHandler(_req: Request, res: Response): void {
  res.status(httpStatusCode.OK).json({ status: 'ok' })
}
