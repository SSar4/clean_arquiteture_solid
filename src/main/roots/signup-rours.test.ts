import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/account-repository/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection
describe('signup route', () => {
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
  test('devera retornar 200 uma conta sucesso', async () => {
    await request(app).post('/api/signup')
      .send({
        nome: 'nome_valido',
        email: 'email_@email.com',
        senha: '1234SaraS/',
        senhaConfirme: '1234SaraS/'
      }).expect(200)
  })
})
