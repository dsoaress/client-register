import { describe, expect, it } from 'vitest'
import { BadRequestException } from '../exceptions/bad-request.exception'
import { IdValueObject } from '../value-objects/id.value-object'
import { type BaseEntityInputProps, Entity } from './entity'

interface Input extends BaseEntityInputProps {
  name: string
}

interface Output extends Input {}

class TestEntity extends Entity<Input, Output> {
  private _name: string

  private constructor(props: Input) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })
    this._name = props.name

    this.validate()
  }

  public static create(props: Input): TestEntity {
    return new TestEntity(props)
  }

  public get name(): string {
    return this._name
  }

  public update(props: Partial<Input>): void {
    if (props.name) this._name = props.name

    this.updateUpdatedAt()
  }

  public toJSON(): Output {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  private validate(): void {
    if (super.errors.length > 0) throw new BadRequestException(super.errors)
  }
}

describe('Entity', () => {
  it('should create an entity with valid properties', () => {
    const props: Input = {
      id: IdValueObject.create().value,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Test Entity'
    }
    const entity = TestEntity.create(props)
    expect(entity.id).toBe(props.id)
    expect(entity.name).toBe(props.name)
    expect(entity.createdAt).toBeInstanceOf(Date)
    expect(entity.updatedAt).toBeInstanceOf(Date)
  })

  it('should populate id, createdAt and updatedAt if not provided', () => {
    const entity = TestEntity.create({ name: 'Test Entity' })
    expect(entity.id).toBeDefined()
    expect(entity.createdAt).toBeInstanceOf(Date)
    expect(entity.updatedAt).toBeInstanceOf(Date)
  })

  it('should update entity properties', () => {
    const props = { name: 'Test Entity' }
    const entity = TestEntity.create(props)
    entity.update({ name: 'Updated Entity' })
    expect(entity.name).toBe('Updated Entity')
  })

  it('should throw an error if invalid data are provided', () => {
    const props: Input = {
      id: 'invalid-id',
      // @ts-expect-error: Testing invalid date
      createdAt: 'invalid-date',
      // @ts-expect-error: Testing invalid date
      updatedAt: 'invalid-date',
      name: ''
    }
    expect(() => TestEntity.create(props)).toThrow(BadRequestException)
  })
})
