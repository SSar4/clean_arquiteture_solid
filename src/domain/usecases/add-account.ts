/* eslint-disable @typescript-eslint/method-signature-style */
import { AccountModel } from '../models/account'

export interface AddAccountModel {
  nome: string
  email: string
  senha: string
}
export interface AddAccount {
  add (account: AddAccountModel): Promise<AccountModel | null>
}
