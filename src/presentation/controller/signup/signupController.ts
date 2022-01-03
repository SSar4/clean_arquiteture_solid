import { badRequest, serverError, success } from '../../helprs/http/http-helps'
import { HttpRequest, HttpResponse } from '../../protocols'
import { Controller } from '../protocols/controller'
import { AddAccount } from './signup-protocols'
import { Validation } from '../../helprs/validators/validation'
import { KafkaProducerModel } from '../../../main/kafka/kafkaModel'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation
  private readonly Kafka: KafkaProducerModel
  constructor (
    Kafka: KafkaProducerModel,
    addAccount: AddAccount,
    validation: Validation) {
    this.Kafka = Kafka
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { nome, senha, email } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error != null) {
        return badRequest(error)
      }

      const account = await this.addAccount.add({ nome, email, senha })

      if (account != null) {
        await this.Kafka.public(account)
      }
      return success(account)
    } catch (error: any) {
      return serverError(error.stack)
    }
  }
}
