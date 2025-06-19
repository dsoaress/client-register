import { BadRequestException, IdValueObject } from 'core'

export function validateId(id: string): void {
  if (typeof id !== 'string' || id.trim() === '') throw new BadRequestException('Invalid client ID')
  const isValid = IdValueObject.create(id).errors.length === 0
  if (!isValid) throw new BadRequestException('Invalid client ID format')
}
