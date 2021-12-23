export class InvalidParamError extends Error {
    constructor (paramName: string) {
      super(`Invalid Param jjk: ${paramName}`)
      this.name = 'InvalidParamError '+ paramName
    }
  }