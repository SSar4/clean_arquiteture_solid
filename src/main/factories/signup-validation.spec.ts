import { Validation } from "../../presentation/helprs/validators/validation"

import { ValidatorComposite } from "../../utils/validator/validator"
import { makeSignupValidation } from "./signup-validation"
import { RequiredFieldValidation } from "../../presentation/helprs/validators/required-fiel-validations"
import { CompareFieldsValidation } from "../../presentation/helprs/validators/compare-fields-validation"
import { EmailValidation } from "../../presentation/helprs/validators/require-email-validation"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter/email-validator-adapter"
import { SenhaValidation } from "../../presentation/helprs/validators/required-senha-validator"
import { SenhaValidatorAdapter } from "../../utils/senha-validator-adapter/senha-validator-adapter"
import { EmailValidator } from "../../presentation/protocols/email-validator"
import { SenhaValidator } from "../../presentation/protocols/senha-validator"

jest.mock('../../utils/validator/validator')

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid (email: string): boolean{
            return true
        }
    }
    return new EmailValidatorStub()
}

const makeSenhaValidator = (): SenhaValidator => {
    class SenhaValidatorStub implements SenhaValidator {
        isValid (senha: string): boolean{
            return true
        }
    }
    return new SenhaValidatorStub()
}
describe('Signup Validation',()=>{
    test('devera chamar o ValidationComposite com todos os validadores',()=>{
        makeSignupValidation()
        const validations: Validation[] = []
        for(const field of ['nome','senha','email','senhaConfirme']){
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('senha','senhaConfirme'))
        validations.push(new EmailValidation('email', makeEmailValidator()))
        validations.push(new SenhaValidation('senha', makeSenhaValidator()))
        expect(ValidatorComposite).toHaveBeenCalledWith(validations)
    })
})