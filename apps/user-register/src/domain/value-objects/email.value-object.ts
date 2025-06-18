const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LENGTH = 254
const MIN_LENGTH = 5
const ERROR_MESSAGES = {
  INVALID_FORMAT: 'Invalid email format',
  TOO_LONG: `Email must be at most ${MAX_LENGTH} characters long`,
  TOO_SHORT: `Email must be at least ${MIN_LENGTH} characters long`
}

export class EmailValueObject {
  private _email: string
  private readonly _errors: string[] = []

  private constructor(email: string) {
    this._email = email
    this.validate()
  }

  public static create(email: string): EmailValueObject {
    return new EmailValueObject(email)
  }

  public get value(): string {
    return this._email
  }

  public get errors(): string[] {
    return this._errors
  }

  public update(email: string): void {
    this._email = email
    this.validate()
  }

  private validate(): void {
    if (!EMAIL_REGEX.test(this.value)) this._errors.push(ERROR_MESSAGES.INVALID_FORMAT)
    if (this.value.length > MAX_LENGTH) this._errors.push(ERROR_MESSAGES.TOO_LONG)
    if (this.value.length < MIN_LENGTH) this._errors.push(ERROR_MESSAGES.TOO_SHORT)
  }
}
