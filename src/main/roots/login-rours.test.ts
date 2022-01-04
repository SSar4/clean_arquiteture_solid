import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/account-repository/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection
describe('login route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('devera retornar 200 com login bem sucedido', async () => {
    await accountCollection.insertOne({
      nome: 'nome_valido',
      email: 'email2_@email.com',
      senha: '1234SaraS'
    })
    await request(app).post('/api/login')
      .send({
        email: 'email2_@email.com',
        senha: '1234SaraS'
      })
    expect(200)
  })
})
