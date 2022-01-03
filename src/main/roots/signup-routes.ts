/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeSignuoController } from '../factories/signup'
import { adaptRout } from '../adapters/express-router-adpter'
export default (router: Router): void => {
  router.post('/signup', adaptRout(makeSignuoController()))
}
