import { hash } from 'bcrypt'
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
    const hashedPassword = await hash('1234SaraS/', 12)
    await accountCollection.insertOne({
      nome: 'any_name',
      email: 'any_email@mail.com',
      senha: hashedPassword
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'any_email@mail.com',
        senha: '1234SaraS/'
      })
      .expect(200)
  })

  test('devera retornar 401 ao usuario não encontrado', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'any_email@mail.com',
        senha: '1234SaraS/'
      })
      .expect(401)
  })
})
