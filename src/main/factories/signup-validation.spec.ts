import { Validation } from "../../presentation/helprs/validators/validation"

import { ValidatorComposite } from "../../utils/validator/validator"
import { makeSignupValidation } from "./signup-validation"
import { RequiredFieldValidation } from "../../presentation/helprs/validators/required-fiel-validations"
import { CompareFieldsValidation } from "../../presentation/helprs/validators/compare-fields-validation"
import { EmailValidation } from "../../presentation/helprs/validators/require-email-validation"
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter/email-validator-adapter"
import { SenhaValidation } from "../../presentation/helprs/validators/required-senha-validator"
import { SenhaValidatorAdapter } from "../../utils/senha-validator-adapter/senha-validator-adapter"

jest.mock('../../utils/validator/validator')
describe('Signup Validation',()=>{
    test('devera chamar o ValidationComposite com todos os validadores',()=>{
        makeSignupValidation()
        const validations: Validation[] = []
        for(const field of ['nome','senha','email','senhaConfirme']){
            validations.push(new RequiredFieldValidation(field))
        }
        validations.push(new CompareFieldsValidation('senha','senhaConfirme'))
        validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
        validations.push(new SenhaValidation('senha',new SenhaValidatorAdapter()))
        expect(ValidatorComposite).toHaveBeenCalledWith(validations)
    })
})