import { Express, Router } from 'express'
import fg from 'fast-glob'
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/roots/**routes.ts').map(async item => {
    (await import(`../../../${item}`)).default(router)
  })
}
