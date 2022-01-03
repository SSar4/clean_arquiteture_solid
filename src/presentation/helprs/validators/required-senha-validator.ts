import { InvalidParamError } from '../../errors'
import { SenhaValidator } from '../../protocols/senha-validator'
import { Validation } from './validation'

export class SenhaValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly senhaValidator: SenhaValidator
  ) {}

  validate (input: any): Error | null {
    const isValid = this.senhaValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
    return null
  }
}
