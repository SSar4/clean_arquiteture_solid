import { EmailValidation } from '../../../presentation/helprs/validators/require-email-validation'
import { RequiredFieldValidation } from '../../../presentation/helprs/validators/required-fiel-validations'
import { SenhaValidation } from '../../../presentation/helprs/validators/required-senha-validator'
import { Validation } from '../../../presentation/helprs/validators/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter/email-validator-adapter'
import { SenhaValidatorAdapter } from '../../../utils/senha-validator-adapter/senha-validator-adapter'
import { ValidatorComposite } from '../../../utils/validator/validator'

export const makeLoginValidation = (): ValidatorComposite => {
  const validations: Validation[] = []
  for (const field of ['senha', 'email']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  validations.push(new SenhaValidation('senha', new SenhaValidatorAdapter()))
  return new ValidatorComposite(validations)
}
