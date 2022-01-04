import { Encrypter } from '../bcrypt-adapter/encrypter'
import jwt from 'jsonwebtoken'
import { TokenGeneration } from './token'

export class JwtAdapter implements Encrypter, TokenGeneration {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  async encrypter (value: string): Promise<string> {
    const acessToken = jwt.sign({ id: value }, this.secret)
    return acessToken
  }

  async generate (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secret)
  }
}
