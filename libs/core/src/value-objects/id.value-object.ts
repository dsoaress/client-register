import { randomUUID } from 'node:crypto'

const ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ERROR_MESSAGES = {
  INVALID_ID: 'Invalid ID format, must be a valid UUID v4'
}

export class IdValueObject {
  private readonly _id: string
  private readonly _errors: string[] = []

  private constructor(value?: string) {
    this._id = value ?? randomUUID()
    this.validate()
  }

  static create(value?: string): IdValueObject {
    return new IdValueObject(value)
  }

  get value(): string {
    return this._id
  }

  get errors(): string[] {
    return this._errors
  }

  private validate(): void {
    if (!ID_REGEX.test(this.value)) this._errors.push(ERROR_MESSAGES.INVALID_ID)
  }
}
