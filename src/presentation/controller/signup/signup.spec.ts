import { ServerError } from '../../errors'
import { MissinParamError } from '../../errors/missing-param-error'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest, HttpResponse } from './signup-protocols'
import { SignUpController } from './signupController'
import { badRequest, serverError, success } from '../../helprs/http/http-helps'
import { Validation } from '../../helprs/validators/validation'
import { KafkaProducerModel } from '../../../main/kafka/kafkaModel'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  nome: 'valid_nome',
  email: 'valid_email@email.com',
  senha: 'valid_senha'
})

const makeRequest = (): HttpRequest => ({
  body: {
    nome: 'valid_nome',
    email: 'valid_email@email.com',
    senha: 'qualquer_senha',
    senhaConfirme: 'qualquer_senha'
  }
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        nome: 'valid_nome',
        senha: 'valid_senha',
        email: 'valid_email@email.com'
      }
      return await new Promise((resolve, reject) => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeKafka = (): KafkaProducerModel => {
  class KafkaStub implements KafkaProducerModel {
    async public (account: AccountModel): Promise<void> {

    }
  }
  return new KafkaStub()
}
interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  kafkaStub: KafkaProducerModel
}
const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const kafkaStub = makeKafka()
  const sut = new SignUpController(
    kafkaStub,
    addAccountStub,
    validationStub
  )
  return {
    sut,
    addAccountStub,
    validationStub,
    kafkaStub
  }
}
describe('test SignUpController', () => {
  test('devera criar uma conta com os valores corretos', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        nome: 'qualquer_nome',
        email: 'qualquer_@email.com',
        senha: 'qualquer_senha',
        senhaConfirme: 'qualquer_senha'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      nome: 'qualquer_nome',
      email: 'qualquer_@email.com',
      senha: 'qualquer_senha'
    })
  })

  test('devera retornar 500 se addAccount lançar alguma exeção', async () => {
    const { addAccountStub, sut } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(fakeError))
    })

    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(fakeError.stack)))
  })

  test('devera retornar 200 se addAccount não lançar alguma exeção', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(success(makeFakeAccount()))
  })

  test('devera chamar o validator', async () => {
    const { sut, validationStub } = makeSut()
    const validatorSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest: HttpRequest = makeRequest()
    await sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('devera retornar 400 se o validador falhar', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissinParamError('any_error'))
    const httpResponse: HttpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(badRequest(new MissinParamError('any_error')))
  })
})
