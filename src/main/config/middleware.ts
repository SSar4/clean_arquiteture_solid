import { Express, json } from 'express'
import { contentType, bodyParser, cors } from '../middleware/index'
export default (app: Express): void => {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentType)
}