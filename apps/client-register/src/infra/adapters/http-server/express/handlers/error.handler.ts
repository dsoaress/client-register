import { BadRequestException, ConflictException, httpStatusCode, NotFoundException } from 'core'
import type { Response } from 'express'

export function errorHandler(error: unknown, res: Response): void {
  switch (true) {
    case error instanceof BadRequestException:
      res.status(httpStatusCode.BAD_REQUEST).json({ error: error.message })
      break
    case error instanceof NotFoundException:
      res.status(httpStatusCode.NOT_FOUND).json({ error: error.message })
      break
    case error instanceof ConflictException:
      res.status(httpStatusCode.CONFLICT).json({ error: error.message })
      break
    default:
      console.error('Unexpected error:', error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
  }
}
