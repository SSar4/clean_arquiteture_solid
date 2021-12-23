import validator from 'validator'
import { SenhaValidatorAdapter } from './senha-validator-adapter'

jest.mock('validator', () => ({
  isStrongPassword (): boolean {
    return true
  }
}))

const makeSut = (): SenhaValidatorAdapter => {
  return new SenhaValidatorAdapter()
}
describe('Senha validatorAdapter', () => {
  test('devera retornar falso se o validador de senha retornar falso', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isStrongPassword').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_senha')
    expect(isValid).toBe(false)
  })

  test('devera retornar true se o validador de senha retornar true', () => {
    const sut = makeSut()
    const isSenhaSpy = jest.spyOn(validator, 'isStrongPassword')
    sut.isValid('valid_senha')
    expect(isSenhaSpy).toHaveBeenCalledWith('valid_senha')
  })
})
