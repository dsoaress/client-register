import { BadRequestException, type BaseEntityInputProps, Entity } from 'core'

import { EmailValueObject } from '../value-objects/email.value-object'
import { PasswordValueObject } from '../value-objects/password.value-object'
import { UserNameValueObject } from '../value-objects/user-name.value-object'

const MIN_AGE = 13
const MAX_AGE = 120
const ERROR_MESSAGES = {
  INVALID_AGE: `Age must be between ${MIN_AGE} and ${MAX_AGE}`,
  INVALID_IS_ACTIVE: "'isActive' must be a boolean value"
}

interface Input extends BaseEntityInputProps {
  name: string
  email: string
  phone: string
  age: number
  password: string
  isActive: boolean
}

interface Output extends Input {}

export class ClientEntity extends Entity<Input, Output> {
  private readonly _name: UserNameValueObject
  private readonly _email: EmailValueObject
  // TODO: Consider using a PhoneValueObject for better validation
  private _phone: string
  private _age: number
  private readonly _password: PasswordValueObject
  private _isActive: boolean

  private constructor(props: Input) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })
    this._name = UserNameValueObject.create(props.name)
    this._email = EmailValueObject.create(props.email)
    this._phone = props.phone
    this._age = props.age
    this._password = PasswordValueObject.create(props.password)
    this._isActive = props.isActive

    this.validate()
  }

  public static create(props: Input): ClientEntity {
    return new ClientEntity(props)
  }

  public get name(): string {
    return this._name.value
  }

  public get email(): string {
    return this._email.value
  }

  public get phone(): string {
    return this._phone
  }

  public get age(): number {
    return this._age
  }

  public get password(): string {
    return this._password.value
  }

  public get isActive(): boolean {
    return this._isActive
  }

  public update(props: Partial<Omit<Input, 'password'>>): void {
    this._name.update(props.name ?? this._name.value)
    this._email.update(props.email ?? this._email.value)
    this._phone = props.phone ?? this._phone
    this._age = props.age ?? this._age
    this._isActive = props.isActive ?? this._isActive

    this.validate()
    super.updateUpdatedAt()
  }

  public async updatePassword(newPassword: string, currentPassword: string): Promise<void> {
    await this._password.update(newPassword, currentPassword)
    this.validate()
  }

  public toJSON(): Output {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      name: this.name,
      email: this.email,
      phone: this.phone,
      age: this.age,
      password: this.password,
      isActive: this.isActive
    }
  }

  private validate(): void {
    const errors: string[] = []

    if (this.age < MIN_AGE || this.age > MAX_AGE) errors.push(ERROR_MESSAGES.INVALID_AGE)
    if (typeof this.isActive !== 'boolean') errors.push(ERROR_MESSAGES.INVALID_IS_ACTIVE)
    errors.push(
      ...super.errors,
      ...this._name.errors,
      ...this._email.errors,
      ...this._password.errors
    )

    if (errors.length > 0) throw new BadRequestException(errors)
  }
}
