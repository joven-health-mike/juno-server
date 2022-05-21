import {NextFunction, Request, Response} from 'express'
import {StatusCodes} from 'http-status-codes'

export interface ServiceInfo {
  // settings: {}
  version: string
}

export const getServiceInfo = (request: Request, response: Response, next: NextFunction) => {
  const data: ServiceInfo = {
    // settings: {},
    version: process.env.BUILD_VERSION ?? '',
  }

  response.status(StatusCodes.OK)
  response.locals.data = data
  next()
}

export const isServiceAlive = (request: Request, response: Response, next: NextFunction) => {
  response.status(StatusCodes.OK)
  next()
}
