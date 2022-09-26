import config from 'config'
import express from 'express'
import { authenticateM2mToken } from './m2mAuthMiddleware'
import { authenticateSession } from './sessionAuthMiddleware'
import { auth } from 'express-openid-connect'

export const authenticationRouter = express.Router()

authenticationRouter.use(
  auth({
    auth0Logout: true,
    authRequired: false,
    baseURL: config.get('authentication.session.baseUrl'),
    clientID: config.get('authentication.session.clientId'),
    issuerBaseURL: config.get('authentication.session.issuerBaseUrl'),
    secret: config.get('authentication.session.secret'),
    routes: {
      login: false,
      postLogoutRedirect: '/api/1/logout'
    }
  })
)

authenticationRouter.use('/', authenticateM2mToken, authenticateSession)

authenticationRouter.get('/api/1/login', (req, res) => {
  if (req.authenticated) {
    res.redirect(config.get('authentication.session.loginRedirect'))
  } else {
    res.oidc.login({ returnTo: '/api/1/application' })
  }
})

authenticationRouter.get('/api/1/application', (req, res) =>
  res.redirect(config.get('authentication.session.loginRedirect'))
)

authenticationRouter.get('/api/1/logout', (req, res) => {
  res.redirect(config.get('authentication.session.logoutRedirect'))
})
