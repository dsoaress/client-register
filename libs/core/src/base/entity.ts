import { IdValueObject } from '../value-objects/id.value-object'

const ERROR_MESSAGES = {
  INVALID_DATE: 'Invalid date format, must be a valid Date object'
}

export interface BaseEntityInputProps {
  id?: string
  createdAt?: Date
  updatedAt?: Date | null
}

export abstract class Entity<Input, Output> {
  private readonly _id: IdValueObject
  private readonly _createdAt: Date
  private _updatedAt: Date
  private readonly _errors: string[] = []

  protected constructor(props: BaseEntityInputProps) {
    this._id = IdValueObject.create(props.id)
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt ?? new Date()

    this.errors.push(...this._id.errors)
    if (!this.idValidateDate(this.createdAt) || !this.idValidateDate(this.updatedAt))
      this._errors.push(ERROR_MESSAGES.INVALID_DATE)
  }

  public get id(): string {
    return this._id.value
  }

  public get createdAt(): Date {
    return this._createdAt
  }

  public get updatedAt(): Date {
    return this._updatedAt
  }

  public get errors(): string[] {
    return this._errors
  }

  abstract update(props: Partial<Input>): void
  abstract toJSON(): Output

  protected updateUpdatedAt(): void {
    this._updatedAt = new Date()
  }

  private idValidateDate(date: Date): boolean {
    return date instanceof Date
  }
}
