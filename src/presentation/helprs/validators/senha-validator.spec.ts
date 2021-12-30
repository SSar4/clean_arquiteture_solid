
import { SenhaValidatorAdapter } from "../../../utils/senha-validator-adapter/senha-validator-adapter"
import { EmailValidator } from "../../protocols/email-validator"
import { SenhaValidator } from "../../protocols/senha-validator"
import { EmailValidation } from "./require-email-validation"
import { SenhaValidation } from "./required-senha-validator"

const makeSenhaValidation = (): SenhaValidatorAdapter => {
    class SenhaValidationStub implements SenhaValidator{
        isValid (senha: string): boolean {
            return true
        }
    }

    return new SenhaValidationStub()
}

interface SutTypes {
    sut: SenhaValidation,
    senhaValidationStub: SenhaValidator
    
}

const makeSut = (): SutTypes => {
    const senhaValidationStub = makeSenhaValidation()
    const sut = new SenhaValidation('senha', senhaValidationStub)
    return { sut, senhaValidationStub}
}
describe('Senha validation', ()=>{
    test('devera chamar s senha validator',()=>{
        const { sut, senhaValidationStub } = makeSut()
        const isValidSpy = jest.spyOn(senhaValidationStub,'isValid')
        sut.validate({senha:'any_senha'})
        expect(isValidSpy).toHaveBeenCalledWith('any_senha')
    })

    test('devera repassar a exeção da senha',()=>{
        const { sut, senhaValidationStub } = makeSut()
        jest.spyOn(senhaValidationStub,'isValid').mockImplementationOnce(()=>{
            throw new Error()
        })
        expect(sut.validate).toThrow()
    })
})