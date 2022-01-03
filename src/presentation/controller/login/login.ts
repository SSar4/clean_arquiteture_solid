/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Authentication, AuthenticationModel, EmailValidator, SenhaValidator } from './login-protocols'
import { InvalidParamError, MissinParamError } from '../../errors'
import { badRequest, serverError, success, unauthorized } from '../../helprs/http/http-helps'
import { HttpRequest, HttpResponse } from '../../protocols'
import { Controller } from '../protocols/controller'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly senhaValidator: SenhaValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, senhaValidator: SenhaValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.senhaValidator = senhaValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { senha, email } = httpRequest.body
      const requiredFields = ['email', 'senha']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissinParamError(field))
        }
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      if (!this.senhaValidator.isValid(senha)) {
        return badRequest(new InvalidParamError('senha'))
      }
      const login: AuthenticationModel = { email, senha }
      const accessToken = await this.authentication.auth(login)
      if (!accessToken) {
        return unauthorized()
      }
      return success(accessToken)
    } catch (error: any) {
      return serverError(error.stack)
    }
  }
}
