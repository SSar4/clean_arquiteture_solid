/* eslint-disable node/no-path-concat */
import { Express, Router } from 'express'
// import fg from 'fast-glob'
import { readdirSync } from 'fs'
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  /**
   * fg.sync('**/ // src // main / roots; /**routes.ts').map(async item => {
  // (await import(`../../../${item}`)).default(router)
  // })

  readdirSync(`${__dirname}/../roots`).map(async (item) => {
    if (!item.includes('.test.')) {
      (await import(`../roots/${item}`)).default(router)
    }
  })
}
