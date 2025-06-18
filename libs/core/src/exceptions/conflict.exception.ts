export class ConflictException extends Error {
  constructor(error: string) {
    super(error)
    this.name = ConflictException.name
  }
}
