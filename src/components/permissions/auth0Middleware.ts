import { Request, Response, NextFunction } from 'express'
import { auth } from 'express-openid-connect'
import config from 'config'
import { User } from '@prisma/client'

export const authConfig = auth({
  auth0Logout: true,
  authRequired: false,
  baseURL: config.get('authentication.session.baseUrl'),
  clientID: config.get('authentication.session.clientId'),
  issuerBaseURL: config.get('authentication.session.issuerBaseUrl'),
  secret: config.get('authentication.session.secret'),
  routes: {
    login: false,
    postLogoutRedirect: '/api/1/application'
  }
})

export const handleLogin = async (req: Request, res: Response) => {
  if (req.authenticated) {
    req.log.debug('user: ' + (req.user as User).username)
    res.redirect(config.get('authentication.session.loginRedirect'))
  } else {
    res.oidc.login({ returnTo: '/api/1/application' })
  }
}

export const handleLogout = async (req: Request, res: Response) => {
  res.redirect('/logout')
}

export const redirectToApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.redirect(config.get('authentication.session.loginRedirect'))
  next()
}
