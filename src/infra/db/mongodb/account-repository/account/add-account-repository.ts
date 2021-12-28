import { AddAccountRepository } from '../../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../../domain/models/account'
import { AddAccountModel } from '../../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel | null> {
        const accountCollection = MongoHelper.getCollection('accounts')
        MongoHelper.emailUnique('accounts')
        const result = await (await accountCollection).insertOne(accountData)
       // console.log(await accountCollection.findOne({ _id: result.insertedId }),'resilt--------------------')
        const account = await (await accountCollection).findOne({ _id: result.insertedId }) 
        
        return MongoHelper.map(account)
      }
}