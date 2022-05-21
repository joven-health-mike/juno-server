import {Http as HttpStatus} from '@status/codes'
import {NextFunction, Request, Response} from 'express'

export const ensureUserIsAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
  if (request.oidc.isAuthenticated) {
    next()
  } else if (request.authenticated === true) {
    next()
  } else {
    response.status(HttpStatus.Unauthorized)
    next(
      new Error(
        `Request to "${request.originalUrl}" is NOT authorized. Ensure that you included a valid Bearer token in the request's "Authorization" header`,
      ),
    )
  }
}
