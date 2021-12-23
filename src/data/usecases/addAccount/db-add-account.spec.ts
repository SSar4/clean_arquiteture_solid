import { DbAddAccount } from './db-add-account'
import { Encrypter, AccountModel, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'
// import bcrypt from 'bcrypt'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypter (value: string): Promise<string> {
      return await new Promise((resolve) => resolve('senha_hash'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const account = {
        id: 'valid_id',
        nome: 'valid_name',
        email: 'valid_email',
        senha: 'senha_hash'
      }
      return await new Promise(resolve => resolve(account))
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}
describe('Db AddAccount UseCase', () => {
  test('devera chamar encrypter com a senha correta', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypter')
    const accountData = {
      nome: 'qualquer_nome',
      email: 'qualquer_email',
      senha: 'qualquer_senha'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('qualquer_senha')
  })

  test('devera repassar a exeção do encrypter', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypter').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      nome: 'qualquer_nome',
      email: 'qualquer_email',
      senha: 'qualquer_senha'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('devera criar uma conta com os valores corretos', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      nome: 'qualquer_nome',
      email: 'qualquer_email',
      senha: 'qualquer_senha'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      nome: 'qualquer_nome',
      email: 'qualquer_email',
      senha: 'senha_hash'
    })
  })

  test('devera repassar a exeção addAccount', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      nome: 'qualquer_nome',
      email: 'qualquer_email',
      senha: 'qualquer_senha'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('devera retornar uma nova conta se der certo', async () => {
    const { sut } = makeSut()
    const accountData = {
      nome: 'qualquer_nome',
      email: 'qualquer_email',
      senha: 'qualquer_senha'
    }
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      nome: 'valid_name',
      email: 'valid_email',
      senha: 'senha_hash'
    })
  })
})
