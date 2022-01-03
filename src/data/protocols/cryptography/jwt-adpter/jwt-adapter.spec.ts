import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => resolve('token'))
  }
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter('secret')
  return sut
}
describe('JWT ADAPTER', () => {
  test('devera chamar sign correto', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypter('any_id')
    expect(signSpy).toHaveBeenCalledWith({
      id: 'any_id'
    }, 'secret')
  })

  test('devera retornar um token', async () => {
    const sut = makeSut()
    const acessToken = await sut.encrypter('any_id')
    expect(acessToken).toBe('token')
  })

  test('devera lançar exeção', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.encrypter('any_id')
    await expect(promise).rejects.toThrow()
  })
})
