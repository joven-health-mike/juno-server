// Machine-to-Machine Authentication using Auth0

import { Request, Response, NextFunction } from 'express'
import { expressjwt } from 'express-jwt'
import { expressJwtSecret, GetVerificationKey } from 'jwks-rsa'
import { StatusCodes } from 'http-status-codes'
import config from 'config'

export interface M2mAuth {
  // JWT Issuer, eg 'https://code-juno.us.auth0.com/'
  iss: string
  // This appears to be the Application Client ID in Auth0, eg. 'dKBgJGBWRlmECs3QVO7f5HrFTFOu4874@clients'
  sub: string
  // JWT Audience, eg. 'https://code-juno.com/api'
  aud: string
  // eg. 1653160239
  iat: number
  // eg. 1653246639
  exp: number
  // This appears to be the Application Client ID in Auth0, eg. 'dKBgJGBWRlmECs3QVO7f5HrFTFOu4874'
  azp: string
  // This appears to be the authentication type, eg. 'client-credentials'
  gty: string
}

export const auth0Verifier = expressjwt({
  audience: config.get('authentication.machineToMachine.audience'),
  algorithms: ['RS256'],
  issuer: config.get('authentication.machineToMachine.issuer'),
  requestProperty: 'm2mAuth',
  secret: expressJwtSecret({
    cache: true,
    cacheMaxEntries: 30,
    jwksRequestsPerMinute: 5,
    jwksUri: config.get('authentication.machineToMachine.jwksUri'),
    rateLimit: true
  }) as GetVerificationKey
})

// Authenticate a JSON Web Token
export const authenticateM2mToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.header('Authorization') === undefined) {
    // Cannot authenticate a request that is missing the Bearer Token
    return next()
  }

  try {
    auth0Verifier(req, res, async () => {
      if (req.m2mAuth !== undefined) {
        req.log.debug(
          'Request is authenticated using a machine-to-machine token.'
        )
        req.user = { role: 'SYSADMIN' }
        req.authenticated = true
      }
      next()
    })
  } catch (error) {
    // Something went wrong evaluating the Bearer token, mark the request as unauthorized because
    // generating a new Bearer token would most likely fix the issue.
    res.status(StatusCodes.UNAUTHORIZED)
    next(error)
  }
}
