import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/cryptography/encrypter'

export class BcrypterAdapter implements Encrypter {
  private readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async encrypter (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
