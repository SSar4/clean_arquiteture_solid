import { Validation } from '../../../presentation/helprs/validators/validation'

import { ValidatorComposite } from '../../../utils/validator/validator'
import { makeLoginValidation } from './login-validation'
import { RequiredFieldValidation } from '../../../presentation/helprs/validators/required-fiel-validations'
import { EmailValidation } from '../../../presentation/helprs/validators/require-email-validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { SenhaValidation } from '../../../presentation/helprs/validators/required-senha-validator'
import { SenhaValidator } from '../../../presentation/protocols/senha-validator'

jest.mock('../../../utils/validator/validator')
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSenhaValidator = (): SenhaValidator => {
  class SenhaValidatorStub implements SenhaValidator {
    isValid (senha: string): boolean {
      return true
    }
  }
  return new SenhaValidatorStub()
}
describe('Signup Validation', () => {
  test('devera chamar o ValidationComposite com todos os validadores', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['senha', 'email']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    validations.push(new SenhaValidation('senha', makeSenhaValidator()))
    expect(ValidatorComposite).toHaveBeenCalledWith(validations)
  })
})
