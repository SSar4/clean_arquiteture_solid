import { InvalidParamError, MissinParamError } from "../../errors";
import { badRequest, serverError, success } from "../../helprs/http-helps";
import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../protocols/controller";
import { EmailValidator, SenhaValidator, AddAccount } from "./signup-protocols";

export class SignUpController implements Controller{
  private readonly emailValidator: EmailValidator
  private readonly senhaValidator: SenhaValidator
  private readonly addAccount: AddAccount
  constructor(emailValidator: EmailValidator, senhaValidator: SenhaValidator, addAccount: AddAccount ){
    this.emailValidator = emailValidator
    this.senhaValidator = senhaValidator
    this.addAccount = addAccount
  }
    async handle (httpRequest: HttpRequest): Promise<HttpResponse>{
 try{
       const requiredField = ['nome', 'email', 'senha', 'senhaConfirme']
       for (const field of requiredField) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissinParamError(field))
        }
      }
      const {nome, senha, email, senhaConfirme} = httpRequest.body
      if(senha !== senhaConfirme){
        return badRequest(new InvalidParamError('senhaConfirme'))
      }
      const isValidEmail = this.emailValidator.isValid(email)
      const isValidSenha = this.senhaValidator.isValid(senha)
      if(!isValidEmail){
        return badRequest(new InvalidParamError('email'))
      }
      if(!isValidSenha){
        return badRequest(new InvalidParamError('senha'))
      }
      const account = await this.addAccount.add({ nome, email, senha })
      return await new Promise((resolve, reject) => resolve(success(account)))
    }  catch (error) {
      return serverError()
    }
    }
}