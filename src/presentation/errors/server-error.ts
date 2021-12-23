export class ServerError extends Error {
    constructor () {
      super('Error do servidor')
      this.name = 'ServerError'
    }
  }
  