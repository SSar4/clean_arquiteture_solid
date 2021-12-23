import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccountRepository {
  private readonly encrypter: Encrypter
  private readonly dbAddAccount: AddAccountRepository
  constructor (encrypter: Encrypter, dbAddAccount: AddAccountRepository) {
    this.encrypter = encrypter
    this.dbAddAccount = dbAddAccount
  }

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const { nome, email, senha } = accountData
    const account = await this.dbAddAccount.add({ nome, email, senha: await this.encrypter.encrypter(senha) })
    return account
  }
}
