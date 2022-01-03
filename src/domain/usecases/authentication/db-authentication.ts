import { HashCompare } from '../../../data/protocols/cryptography/bcrypt-adapter/hash-compare'
import { TokenGeneration } from '../../../data/protocols/cryptography/jwt-adpter/token'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-email-repository'
import { UpdateAcessTokenRepository } from '../../../data/protocols/db/update-acess-token-repository'
import { AuthenticationModel, Authentication } from '../authentication'
export class DbAuthentication implements Authentication {
  private readonly loadAccountByEMailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly token: TokenGeneration
  private readonly updateAcessToken: UpdateAcessTokenRepository
  constructor (loadAccountByEMailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    token: TokenGeneration,
    updateAcessToken: UpdateAcessTokenRepository
  ) {
    this.hashCompare = hashCompare
    this.loadAccountByEMailRepository = loadAccountByEMailRepository
    this.token = token
    this.updateAcessToken = updateAcessToken
  }

  async auth (login: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEMailRepository.loadByEmail(login.email)
    if (account != null) {
      const compare = await this.hashCompare.compare(login.senha, account.senha)
      if (compare === true) {
        const acessToken = await this.token.generate(account?.id)
        await this.updateAcessToken.updateAcessToken(account.id, acessToken)
        return acessToken
      }
    }

    return null
  }
}
