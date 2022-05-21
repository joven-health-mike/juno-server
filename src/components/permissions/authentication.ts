import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export function authenticateAuth0(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.oidc.isAuthenticated()) {
      // console.log(req.oidc.user)
      req.authenticated = true
      next()
    } else {
      res.status(StatusCodes.FORBIDDEN)
    }
    // next()
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED)
    next(error)
  }
  next()
}
