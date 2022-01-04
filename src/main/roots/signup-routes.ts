/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeSignuoController } from '../factories/signup/signup'
import { makeLoginController } from '../factories/login/login'
import { adaptRout } from '../adapters/express-router-adpter'
export default (router: Router): void => {
  router.post('/signup', adaptRout(makeSignuoController()))
  router.post('/login', adaptRout(makeLoginController()))
}
