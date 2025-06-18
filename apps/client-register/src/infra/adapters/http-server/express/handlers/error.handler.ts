import { BadRequestException, httpStatusCode, NotFoundException } from 'core'
import type { Response } from 'express'

export function errorHandler(error: unknown, res: Response): void {
  if (error instanceof Error) {
    switch (error.name) {
      case BadRequestException.name:
        res.status(httpStatusCode.BAD_REQUEST).json({ error: error.message })
        break
      case NotFoundException.name:
        res.status(httpStatusCode.NOT_FOUND).json({ error: error.message })
        break
      default:
        res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  } else {
    console.error('Unexpected error:', error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: 'Internal Server Error'
    })
  }
}
