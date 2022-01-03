/* eslint-disable @typescript-eslint/method-signature-style */
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models/account'
export interface AddAccountRepository {
  add (accountData: AddAccountModel): Promise<AccountModel | null>
}
