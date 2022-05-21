import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export interface UserSession {
  email?: string;
  email_verified?: boolean;
  family_name?: string;
  locale?: string
  nickname?: string;
  name?: string;
  picture?: string;
  sub?: string;
  updated_at?: string;
}

export function authenticateSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.oidc.isAuthenticated()) {
      // UserSessionstored in req.oidc.user
      req.authenticated = true
      req.log.debug('Request was authenticated using a session.')
    } else {
      req.log.debug('Request does not contain a valid session.')
    }
    next()
    // next()
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED)
    next(error)
  }
  next()
}
