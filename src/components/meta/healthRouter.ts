import express from 'express'
import {getServiceInfo, isServiceAlive} from './healthMiddleware'

export const healthRouter = express.Router()

healthRouter.get('/', getServiceInfo)

healthRouter.get('/api/1/meta/alive', isServiceAlive)
healthRouter.get('/api/1/meta/service', getServiceInfo)
