import {NextFunction, Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'

export interface ServiceInfo {
  version: string
}

export const getServiceInfo = (request: Request, response: Response, next: NextFunction) => {
  const data: ServiceInfo = {
    // TODO: Set the application's version from it's main source.
    version: '',
  }

  response.status(StatusCodes.OK)
  response.locals.data = data
  next()
}

export const isServiceAlive = (request: Request, response: Response, next: NextFunction) => {
  response.status(StatusCodes.OK)
  next()
}
