import bcrypt, { compare } from 'bcrypt'
import { BcrypterAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash_senha'))
  },
  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))
const salt = 12
const makeSut = (): BcrypterAdapter =>{
  return new BcrypterAdapter(salt)
}
describe('Bcrypt adapter', () => {
  test('devera chamar o bcrypter com os valores corretos', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypter('qualquer_senha')
    expect(hashSpy).toHaveBeenCalledWith('qualquer_senha', 12)
  })

  test('devera retornar a hash caso tudo der certo', async () => {
    const sut = makeSut()
    const hash = await sut.encrypter('qualquer_senha')
    expect(hash).toBe('hash_senha')
  })

  test('devera compara o hash', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('qualquer_senha','qualquer_hash')
    expect(compareSpy).toHaveBeenCalledWith('qualquer_senha','qualquer_hash')
  })

  test('devera retornar sucesso compare true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('qualquer_senha','qualquer_hash')
    expect(isValid).toBe(true)
  })


  test('devera retornar falso caso não seja igual', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').
    mockImplementationOnce(
      ()=>{return new Promise(resolve=> resolve(false))})
    const isValid = await sut.compare('qualquer_senha','qualquer_hash')
    expect(isValid).toBe(false)
  })

  test('compare devera lançar exeção', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').
    mockImplementationOnce(
      ()=>{return new Promise((resolve,reject)=> reject(new Error()))})
    const isValid =  sut.compare('qualquer_senha','qualquer_hash')
    await expect(isValid).rejects.toThrow()
  })
})
