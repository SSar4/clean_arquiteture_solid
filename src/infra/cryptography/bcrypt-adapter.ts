import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/cryptography/bcrypt-adapter/encrypter'
import { HashCompare } from '../../data/protocols/cryptography/bcrypt-adapter/hash-compare'

export class BcrypterAdapter implements Encrypter, HashCompare {
  private readonly salt: number
  constructor (salt: number) {
    this.salt = salt
  }

  async encrypter (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (senha: string, hash: string): Promise<boolean | null> {
    const compare = await bcrypt.compare(senha, hash)
    return compare
  }
}
