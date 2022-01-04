/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Authentication } from './login-protocols'
import { badRequest, serverError, success, unauthorized } from '../../helprs/http/http-helps'
import { HttpRequest, HttpResponse } from '../../protocols'
import { Controller } from '../protocols/controller'
import { Validation } from '../../helprs/validators/validation'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const authenticationModel = await this.authentication.auth(httpRequest.body)
      if (!authenticationModel) {
        return unauthorized()
      }
      return success(authenticationModel)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
