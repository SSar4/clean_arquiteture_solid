import express from 'express'
import setupMiddlewares from './middleware'
import setupRoots from '../config/routes'
const app = express()
setupMiddlewares(app)
setupRoots(app)
export default app
