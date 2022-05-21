
import express from 'express'
import { authenticateM2mToken } from './m2mAuthMiddleware'
import { authenticateSession } from './sessionAuthMiddleware'
import { auth } from 'express-openid-connect'
import config from 'config'

export const authenticationRouter = express.Router()

authenticationRouter.use(auth({
  auth0Logout: true,
  authRequired: false,
  baseURL: config.get('authentication.session.baseUrl'),
  clientID: config.get('authentication.session.clientId'),
  issuerBaseURL: config.get('authentication.session.issuerBaseUrl'),
  secret: config.get('authentication.session.secret'),
}))

authenticationRouter.use('/', authenticateM2mToken, authenticateSession)
