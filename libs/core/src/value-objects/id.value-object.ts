import { Types } from 'mongoose'

const ERROR_MESSAGES = {
  INVALID_ID: 'Invalid ID format, must be a valid ObjectId string'
}

export class IdValueObject {
  private readonly _id: string
  private readonly _errors: string[] = []

  private constructor(value?: string) {
    this._id = value ?? new Types.ObjectId().toString()
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
    if (!Types.ObjectId.isValid(this.value)) this._errors.push(ERROR_MESSAGES.INVALID_ID)
  }
}
