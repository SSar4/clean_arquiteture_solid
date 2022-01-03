import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter/email-validator-adapter'
import { SenhaValidatorAdapter } from '../../../utils/senha-validator-adapter/senha-validator-adapter'
import { InvalidParamError, MissinParamError, ServerError } from '../../errors'
import { badRequest, serverError, success } from '../../helprs/http/http-helps'
import { HttpRequest, HttpResponse } from '../../protocols'
import { LoginController } from './login'
import { Authentication, AuthenticationModel, EmailValidator, SenhaValidator } from './login-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidateStub implements EmailValidatorAdapter {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidateStub()
}

const makeAuthentication = (): Authentication => {
  class AuthStub {
    async auth (login: AuthenticationModel): Promise<string> {
      return await new Promise(resolve => resolve('access_token'))
    }
  }
  return new AuthStub()
}

const makeSenhaValidator = (): SenhaValidator => {
  class SenhaValidateStub implements SenhaValidatorAdapter {
    isValid (senha: string): boolean {
      return true
    }
  }
  return new SenhaValidateStub()
}

interface SutTypes {
  sut: LoginController
  emailValidateStub: EmailValidator
  senhaValidatorStub: SenhaValidator
  authenticationStub: Authentication
}
const makeSut = (): SutTypes => {
  const emailValidateStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const senhaValidatorStub = makeSenhaValidator()
  const sut = new LoginController(emailValidateStub, senhaValidatorStub, authenticationStub)
  return { sut, emailValidateStub, senhaValidatorStub, authenticationStub }
}

describe('Login controller', () => {
  test('devera retornar 400 se o email não for provido', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        // email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissinParamError('email')))
  })

  test('devera retornar 400 se a senha não for provido', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com'
        // senha:'any_senha'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissinParamError('senha')))
  })

  test('devera chamar o validador de email', async () => {
    const { sut, emailValidateStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidateStub, 'isValid')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any@email.com')
  })

  test('devera chamar o validador a senha', async () => {
    const { sut, senhaValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(senhaValidatorStub, 'isValid')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_senha')
  })

  test('devera retornar 400 se o email provido for invalido', async () => {
    const { sut, emailValidateStub } = makeSut()
    jest.spyOn(emailValidateStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('devera retornar 400 se a senha provido for invalido', async () => {
    const { sut, senhaValidatorStub } = makeSut()
    jest.spyOn(senhaValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('senha')))
  })

  test('devera retornar 500 se a validação de email gera exeção', async () => {
    const { emailValidateStub, sut } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    jest.spyOn(emailValidateStub, 'isValid').mockImplementationOnce(() => {
      throw fakeError
    })
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(fakeError.stack)))
  })

  test('devera retornar 500 se a validação de senha gera exeção', async () => {
    const { senhaValidatorStub, sut } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    jest.spyOn(senhaValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw fakeError
    })
    const httpRequest: HttpRequest = {
      body: {
        email: 'any@email.com',
        senha: 'any_senha'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(fakeError.stack)))
  })

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
