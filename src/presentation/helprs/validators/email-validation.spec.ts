import { EmailValidatorAdapter } from "../../../utils/email-validator-adapter/email-validator-adapter"
import { InvalidParamError } from "../../errors"
import { EmailValidator } from "../../protocols/email-validator"
import { EmailValidation } from "./require-email-validation"

const makeEmailValidation = (): EmailValidatorAdapter => {
    class EmailValidationStub implements EmailValidator{
        isValid (email: string): boolean {
            return true
        }
    }

    return new EmailValidationStub()
}

interface SutTypes {
    sut: EmailValidation,
    emailValidationStub: EmailValidator
    
}

const makeSut = (): SutTypes => {
    const emailValidationStub = makeEmailValidation()
    const sut = new EmailValidation('email',emailValidationStub)
    return {sut, emailValidationStub}
}
describe('Email validation', ()=>{
    test('devera chamar o email validator',()=>{
        const { sut, emailValidationStub } = makeSut()
        const isValidSpy = jest.spyOn(emailValidationStub,'isValid')
        sut.validate({email:'valid@email.com'})
        expect(isValidSpy).toHaveBeenCalledWith('valid@email.com')
    })

    test('devera repassar a exeção',()=>{
        const { sut, emailValidationStub } = makeSut()
        jest.spyOn(emailValidationStub,'isValid').mockImplementationOnce(()=>{
            throw new Error()
        })
        expect(sut.validate).toThrow()
    })
})