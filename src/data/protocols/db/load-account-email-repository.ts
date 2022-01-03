import { AccountModel } from '../../usecases/addAccount/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountModel | null>
}
