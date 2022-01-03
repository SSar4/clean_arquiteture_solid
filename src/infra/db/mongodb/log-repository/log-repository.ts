import { LogErrorRepository } from '../../../../data/protocols/db/log-respository'
import { MongoHelper } from '../account-repository/helpers/mongo-helper'

export class LogMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
