export class BadRequestException extends Error {
  constructor(error: string | string[]) {
    super(typeof error === 'string' ? error : error.join(' | '))
    this.name = BadRequestException.name
  }
}
