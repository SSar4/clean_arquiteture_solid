import { MissinParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string
  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error | null {
    if (input[this.fieldName] !== null) {
      return new MissinParamError(this.fieldName)
    }
    return null
  }
}
