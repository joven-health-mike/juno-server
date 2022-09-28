import express from 'express'
import { authenticateM2mToken } from './m2mAuthMiddleware'
import { authenticateSession } from './sessionAuthMiddleware'
import {
  authConfig,
  handleLogin,
  handleLogout,
  redirectToApplication
} from './auth0Middleware'

export const authenticationRouter = express.Router()

// set authentication settings
authenticationRouter.use(authConfig)

authenticationRouter.use('/', authenticateM2mToken, authenticateSession)

// set up routes to handle post-login/logout redirects
authenticationRouter.get('/api/1/login', handleLogin)
authenticationRouter.get('/api/1/logout', handleLogout)
authenticationRouter.get('/api/1/application', redirectToApplication)
