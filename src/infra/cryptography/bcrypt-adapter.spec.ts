import bcrypt from 'bcrypt'
import { BcrypterAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash_senha'))
  }
}))

describe('Bcrypt adapter', () => {
  test('devera chamar o bcrypter com os valores corretos', async () => {
    const sut = new BcrypterAdapter(12)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypter('qualquer_senha')
    expect(hashSpy).toHaveBeenCalledWith('qualquer_senha', 12)
  })

  test('devera retornar a hash caso tudo der certo', async () => {
    const sut = new BcrypterAdapter(12)
    const hash = await sut.encrypter('qualquer_senha')
    expect(hash).toBe('hash_senha')
  })
})
