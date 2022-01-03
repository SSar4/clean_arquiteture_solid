import { Collection, Document } from 'mongodb'
import { MongoHelper } from '../account-repository/helpers/mongo-helper'
import { LogMongoRepository } from './log-repository'

describe('log MongoRepository', () => {
  let errorCollection: Promise<Collection<Document>>
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors')
    await (await errorCollection).deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('devera criar um log de erro', async () => {
    const sut = new LogMongoRepository()
    await sut.log('any_error')
    const count = await (await errorCollection).countDocuments()
    expect(count).toBe(1)
  })
})
