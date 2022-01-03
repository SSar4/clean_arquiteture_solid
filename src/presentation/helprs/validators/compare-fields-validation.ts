import { MissinParamError } from '../../errors'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  private readonly senha: string
  private readonly senhaConfirme: string
  constructor (senha: string, senhaConfirme: string) {
    this.senha = senha
    this.senhaConfirme = senhaConfirme
  }

  validate (input: any): Error | null {
    if (input[this.senha] !== input[this.senhaConfirme]) {
      return new MissinParamError('confirme a senha')
    }
    return null
  }
}
