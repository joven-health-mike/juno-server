import {Request, Response, NextFunction} from 'express'
import jwt from 'express-jwt'
import jwksRsa from 'jwks-rsa'
import {StatusCodes} from 'http-status-codes'

export interface JwtUser {
  'http://okta.com/roles': string[]
  nickname?: string
  name?: string
  picture?: string
  updated_at?: string
  email?: string
}

export function authenticateAuth0(req: Request, res: Response, next: NextFunction) {
  if (req.header('Authorization') === undefined) {
    // Cannot authenticate a request that is missing the Bearer Token
    return next()
  }

  const auth0Verifier = jwt({
    algorithms: ['RS256'],
    issuer: `https://${process.env?.AUTH0_DOMAIN}/`,
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      cacheMaxEntries: 30,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env?.AUTH0_DOMAIN}/.well-known/jwks.json`,
      rateLimit: true,
    }),
  })

  try {
    auth0Verifier(req, res, next)
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED)
    next(error)
  }
  next()
}
