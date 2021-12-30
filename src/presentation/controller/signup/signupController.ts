import { InvalidParamError, MissinParamError } from "../../errors";
import { badRequest, serverError, success } from "../../helprs/http-helps";
import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../protocols/controller";
import { AddAccount } from "./signup-protocols";
import KafkaProducer from "../../../main/kafka/kafka";
import { Validation } from "../../helprs/validators/validation";
export class SignUpController implements Controller{
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor(
     addAccount: AddAccount,
     validation: Validation){
    this.addAccount = addAccount
    this.validation = validation
  }
    async handle (httpRequest: HttpRequest): Promise<HttpResponse>{
 try{
       const {nome, senha, email} = httpRequest.body
       const error = this.validation.validate(httpRequest.body)
       if(error){
        return badRequest(error)
       }
  
      const account = await this.addAccount.add({ nome, email, senha })
     /**
      *  
      if(account){
        const kafkaProducer = new KafkaProducer('ms_create_account')
        await kafkaProducer.send('client_approved',JSON.stringify({id: account?.id, nome: account?.nome, email: account?.email}))
      }
      */
      return success(account)
    }  catch (error: any) {
      return serverError(error.stack)
    }
    }
}