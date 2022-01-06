
import { MongoHelper } from '../infra/db/mongodb/account-repository/helpers/mongo-helper'
import env from './config/env'
// import app from './config/app'
MongoHelper.connect('mongodb://localhost:27017/mydb')
  .then(async () => {
    const app = (await import('./config/app')).default

    app.listen(env.PORT, () => console.log(`Server running at http://localhost:${env.PORT}`))
  })
  .catch((err) => console.error(err))

// app.listen(env.PORT, () => console.log(`Server running at http://localhost:${env.PORT}`))
