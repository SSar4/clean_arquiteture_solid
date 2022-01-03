export class ServerError extends Error {
  constructor (stack: string) {
    super('Error do servidor')
    this.name = 'ServerError'
    this.stack = stack
  }
}
