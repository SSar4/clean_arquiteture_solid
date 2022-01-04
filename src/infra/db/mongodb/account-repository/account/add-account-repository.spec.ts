import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './add-account-repository'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      nome: 'any_name',
      email: 'any_email@mail.com',
      senha: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.nome).toBe('any_name')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.senha).toBe('any_password')
  })

  test('Should return an loadByEmail on add success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      nome: 'any_name',
      email: 'any_email@mail.com',
      senha: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.nome).toBe('any_name')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.senha).toBe('any_password')
  })

  test('Should return null', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mai.com')
    expect(account).toBeFalsy()
  })

  test('procurar pelo email on  success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      nome: 'any_name',
      email: 'any_email@mail.com',
      senha: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.nome).toBe('any_name')
    expect(account?.email).toBe('any_email@mail.com')
    expect(account?.senha).toBe('any_password')
  })

  test('updateAcessToken on  success', async () => {
    const sut = makeSut()
    const result = await accountCollection.insertOne({
      nome: 'any_name',
      email: 'any_email@mail.com',
      senha: 'any_password'
    })
    await sut.updateAcessToken(result.insertedId.toString(), 'any_token')
    const account = await accountCollection.findOne({ _id: result.insertedId })
    expect(account).toBeTruthy()
    expect(account?.accessToken).toBe('any_token')
  })
})
