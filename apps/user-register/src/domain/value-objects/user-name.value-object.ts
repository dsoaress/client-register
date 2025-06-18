const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/
const MIN_LENGTH = 3
const MAX_LENGTH = 255
const ERROR_MESSAGES = {
  INVALID_FORMAT: 'Name can only contain letters and spaces',
  TOO_SHORT: `Name must be at least ${MIN_LENGTH} characters long`,
  TOO_LONG: `Name must be at most ${MAX_LENGTH} characters long`
}

export class UserNameValueObject {
  private _name: string
  private readonly _errors: string[] = []

  private constructor(name: string) {
    this._name = name
    this.validate()
  }

  public static create(name: string): UserNameValueObject {
    return new UserNameValueObject(name)
  }

  public get value(): string {
    return this._name
  }

  public get errors(): string[] {
    return this._errors
  }

  public update(name: string): void {
    this._name = name
    this.validate()
  }

  private validate(): void {
    if (!NAME_REGEX.test(this.value)) this._errors.push(ERROR_MESSAGES.INVALID_FORMAT)
    if (this.value.length < MIN_LENGTH) this._errors.push(ERROR_MESSAGES.TOO_SHORT)
    if (this.value.length > MAX_LENGTH) this._errors.push(ERROR_MESSAGES.TOO_LONG)
  }
}
