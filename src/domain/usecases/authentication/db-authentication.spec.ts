import { HashCompare } from '../../../data/protocols/cryptography/bcrypt-adapter/hash-compare'
import { TokenGeneration } from '../../../data/protocols/cryptography/jwt-adpter/token'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-email-repository'
import { UpdateAcessTokenRepository } from '../../../data/protocols/db/update-acess-token-repository'
import { AccountModel } from '../../models/account'
import { AuthenticationModel } from '../authentication'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any@gmail.com',
  nome: 'any_name',
  senha: 'hash_any_pass'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any@gmail.com',
  senha: 'any_pass'
})

const makeAccountEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await new Promise((resolve) =>
        resolve(makeFakeAccount())
      )
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompareStub = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (senha: string, hash: string): Promise<boolean> {
      return await new Promise(resolve => resolve(true))
    }
  }
  return new HashCompareStub()
}

const makeTokenGenerationStub = (): TokenGeneration => {
  class TokenGenerationStub implements TokenGeneration {
    async generate (id: string): Promise<string> {
      return await new Promise(resolve => resolve('token_generate'))
    }
  }
  return new TokenGenerationStub()
}

const makeUpdateAcessTokenStub = (): UpdateAcessTokenRepository => {
  class UpdateAcessTokenStub implements UpdateAcessTokenRepository {
    async updateAcessToken (id: string, token: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new UpdateAcessTokenStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  tokenGenerationStub: TokenGeneration
  updateAcessTokenStub: UpdateAcessTokenRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeAccountEmailRepository()
  const hashCompareStub = makeHashCompareStub()
  const updateAcessTokenStub = makeUpdateAcessTokenStub()
  const tokenGenerationStub = makeTokenGenerationStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGenerationStub,
    updateAcessTokenStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGenerationStub,
    updateAcessTokenStub
  }
}

describe('DbAuthentication Use Case', () => {
  test('devera chamar LoadAccountByEmail com os valores corretos', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any@gmail.com')
  })

  test('devera lançar exeção LoadAccountByEmail exeção', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('devera retornar null se LoadAccountByEmail retornar null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const acessToken = await sut.auth(makeFakeAuthentication())
    expect(acessToken).toBeNull()
  })

  test('devera chamar hashCompare com a senha correta', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compare = jest.spyOn(hashCompareStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compare).toHaveBeenCalledWith('any_pass', 'hash_any_pass')
  })

  test('devera lançar exeção HashCompare exeção', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('devera retornar null hashCompare com a senha incorreta', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const acessToken = await sut.auth(makeFakeAuthentication())
    expect(acessToken).toBeNull()
  })

  test('devera gerar um acess_token com id correto', async () => {
    const { sut, tokenGenerationStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGenerationStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('devera lançar exeção token exeção', async () => {
    const { sut, tokenGenerationStub } = makeSut()
    jest.spyOn(tokenGenerationStub, 'generate')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('sucesso ao logar', async () => {
    const { sut } = makeSut()
    const account = await sut.auth(makeFakeAuthentication())
    expect(account).toBe('token_generate')
  })

  test('devera chamar UpdateAcessToken com valores corretos', async () => {
    const { sut, updateAcessTokenStub } = makeSut()
    const updateSpy = jest.spyOn(updateAcessTokenStub, 'updateAcessToken')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'token_generate')
  })
})
