import { JwtAdapter } from '../../../data/protocols/cryptography/jwt-adpter/jwt-adapter'
import { DbAuthentication } from '../../../domain/usecases/authentication/db-authentication'
import { BcrypterAdapter } from '../../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account/add-account-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log-repository'
import { LoginController } from '../../../presentation/controller/login/login'
import { Controller } from '../../../presentation/controller/protocols/controller'
import { LogControllerDecorration } from '../../decorations/log'
import { makeLoginValidation } from './login-validation'

export const makeLoginController = (): Controller => {
  const bcryptAdapter = new BcrypterAdapter(12)
  const jwtAdapter = new JwtAdapter('secret')
  const accountMongo = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongo, bcryptAdapter, jwtAdapter, accountMongo)
  const loginController = new LoginController(dbAuthentication, makeLoginValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorration(loginController, logMongoRepository)
}
