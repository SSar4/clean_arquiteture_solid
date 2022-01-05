import { Encrypter } from '../bcrypt-adapter/encrypter'
import jwt from 'jsonwebtoken'
import { TokenGeneration } from './token'
import env from '../../../../main/config/env'
export class JwtAdapter implements Encrypter, TokenGeneration {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  async encrypter (value: string): Promise<string> {
    const acessToken = jwt.sign({ id: value }, env.JWT)
    return acessToken
  }

  async generate (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }
}
