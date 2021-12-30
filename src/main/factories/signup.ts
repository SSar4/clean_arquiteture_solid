import { DbAddAccount } from '../../data/usecases/addAccount/db-add-account'
import { SignUpController } from '../../presentation/controller/signup/signupController'
import { BcrypterAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account/add-account-repository'
import { Controller } from '../../presentation/controller/protocols/controller'
import { LogControllerDecorration } from '../decorations/log'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log-repository'
import { ValidatorComposite } from '../../utils/validator/validator'
import { makeSignupValidation } from './signup-validation'
import { KafkaProducerMessage } from '../kafka/kafkaProducer'

export const makeSignuoController = (): Controller =>{

    const bcrypterAdapter = new BcrypterAdapter(12)
    const accountMongoRepository = new AccountMongoRepository()
    const kafka = new KafkaProducerMessage()
    const dbAddAccount = new DbAddAccount(bcrypterAdapter, accountMongoRepository)
    const signUpController = new SignUpController(kafka,dbAddAccount, makeSignupValidation())
    const log = new LogMongoRepository()
    return new LogControllerDecorration(signUpController,log)
   
}
