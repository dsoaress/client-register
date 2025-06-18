export class NotFoundException extends Error {
  constructor(error: string) {
    super(error)
    this.name = NotFoundException.name
  }
}
