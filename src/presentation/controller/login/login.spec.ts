import { serverError, success } from '../../helprs/http/http-helps'
import { Validation } from '../../helprs/validators/validation'
import { HttpRequest, HttpResponse } from '../../protocols'
import { LoginController } from './login'
import { Authentication, AuthenticationModel } from './login-protocols'

const makeAuthentication = (): Authentication => {
  class AuthStub {
    async auth (login: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('access_token'))
    }
  }
  return new AuthStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validation: Validation
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validation = makeValidation()
  const sut = new LoginController(authenticationStub, validation)
  return { sut, authenticationStub, validation }
}

describe('Login controller', () => {
  test('devera chamar autenticação com os valores corretos', async () => {
    const { authenticationStub, sut } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({ email: 'any@email.com', senha: 'any_senha' })
  })

  test('devera retornar 401 ao usuario desconhecido', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
  })

  test('devera retornar uma exeção se authentication falhar', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('devera retornar 200 se tudo der certo', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success('access_token'))
  })
})
