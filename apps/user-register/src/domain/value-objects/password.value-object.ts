import bcrypt from 'bcryptjs'
import { BadRequestException } from 'core'

const SALT_ROUNDS = 10
const REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/
const MIN_LENGTH = 8
const MAX_LENGTH = 72
const ERROR_MESSAGES = {
  INVALID_FORMAT:
    'Password must contain at least one lowercase, one uppercase, one digit, and one special character',
  TOO_SHORT: `Password must be at least ${MIN_LENGTH} characters long`,
  TOO_LONG: `Password must be at most ${MAX_LENGTH} characters long`
}

export class PasswordValueObject {
  private _password: string
  private readonly _errors: string[] = []

  private constructor(password: string) {
    this._password = this.hash(password)
    this.validate(password)
  }

  public static create(password: string): PasswordValueObject {
    return new PasswordValueObject(password)
  }

  private hash(password: string): string {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS)
    return bcrypt.hashSync(password, salt)
  }

  private async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  public get value(): string {
    return this._password
  }

  public get errors(): string[] {
    return this._errors
  }

  public async update(newPassword: string, currentPassword: string): Promise<void> {
    const hasValidCurrentPassword = await this.compare(currentPassword, this._password)
    if (!hasValidCurrentPassword) throw new BadRequestException('Current password is incorrect')

    this._password = this.hash(newPassword)
    this.validate(newPassword)
  }

  private validate(unHashedPassword: string): void {
    if (!REGEX.test(unHashedPassword)) this._errors.push(ERROR_MESSAGES.INVALID_FORMAT)
    if (unHashedPassword.length < MIN_LENGTH) this._errors.push(ERROR_MESSAGES.TOO_SHORT)
    if (unHashedPassword.length > MAX_LENGTH) this._errors.push(ERROR_MESSAGES.TOO_LONG)
  }
}
