export class MissinParamError extends Error {
  constructor (paramName: string) {
    super(`Missing Param: ${paramName}`)
    this.name = 'MissinParamError ' + paramName
  }
}
