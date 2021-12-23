import { SenhaValidator } from '../../presentation/protocols/senha-validator'
import validator from 'validator'
export class SenhaValidatorAdapter implements SenhaValidator {
  isValid (senha: string): boolean {
    const isStrongPassword = validator.isStrongPassword(senha)
    if (!isStrongPassword) return false
    return true
  }
}
