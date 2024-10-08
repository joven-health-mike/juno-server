import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import config from 'config'
import {
  findDetailedUserByUsername,
  findOrCreateUserByEmail,
  findUserByEmail,
  findUserByUsername
} from '../user/userModel'
import { Role } from '@prisma/client'

// User session information returned from Auth0
export interface UserSession {
  email?: string
  email_verified?: boolean
  family_name?: string
  locale?: string
  nickname?: string
  name?: string
  picture?: string
  sub?: string
  updated_at?: string
}

export const authenticateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if the user has an authenticated session
    if (req.oidc.isAuthenticated()) {
      // When there is an authenticated session, the UserSession information can be found in the req.oidc.user
      if (!req.oidc.user) {
        throw new Error(
          'User is authenticated, but no user information was returned from the authentiation service.'
        )
      }

      // Make sure the authenticated user exists in the database.
      const simulatedLoginUsername = config.get(
        'authentication.user.simulatedLoginUsername'
      ) as string
      const loggedInUser = await findUserByEmail(req.oidc.user.email)
      if (
        loggedInUser?.role === ('SYSADMIN' as Role) &&
        simulatedLoginUsername
      ) {
        // if an admin is logged in and there's a simulated login in the config file, set the user as the simulated user
        const user = await findUserByUsername(simulatedLoginUsername)
        req.user = await findDetailedUserByUsername(user)
      } else {
        req.user = await findOrCreateUserByEmail({
          email: req.oidc.user.email,
          firstName: req.oidc.user.name.split(' ')[0],
          lastName: req.oidc.user.name.split(' ')[1],
          username: (
            req.oidc.user.name.split(' ')[0] +
            '.' +
            req.oidc.user.name.split(' ')[1]
          ).toLowerCase(),
          role: config.get('authentication.user.defaultRole')
        })
      }

      // `user` is the logged-in user and is now available in all requests.

      // Mark the request as authenticated
      req.authenticated = true
      req.log.debug('Request was authenticated using a session.')
    }
    next()
  } catch (error) {
    // Something went wrong evaluating the session, mark the request as unauthorized because
    // logging out and back in would most likely fix the issue.
    res.status(StatusCodes.UNAUTHORIZED)
    next(error)
  }
}
