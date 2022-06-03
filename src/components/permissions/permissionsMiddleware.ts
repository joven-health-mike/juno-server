import {Http as HttpStatus} from '@status/codes'
import {NextFunction, Request, Response} from 'express'

// Checks if the request has been authenticated by one of the available authentication strategies. 
// If the request is authenticated next will be called, otherwise an Unauthorized error will be thrown.
export const ensureUserIsAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
  if (request.authenticated === true) {
    next()
  } else {
    response.status(HttpStatus.Unauthorized)
    next(new Error(`Request to "${request.originalUrl}" is NOT authorized. Ensure that you included a valid Bearer token in the request's "Authorization" header`),
    )
  }
}