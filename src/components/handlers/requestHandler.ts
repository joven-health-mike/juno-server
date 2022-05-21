import {Logger} from 'pino'
import config from 'config'
import {NextFunction, Request, Response} from 'express'
import {v4 as uuid} from 'uuid'
import log from '../log/log'
import {DEFAULT_RESPONSE_DATA_VALUE, DEFAULT_STATUS_CODE} from './responseHandler'

export const requestHandler = (request: Request, response: Response, next: NextFunction) => {
  // Assume the request is not authenticated until the authentication middleware has evaluated the request.
  request.authenticated = false
  // Store the idempotency key that can be used by future middlware to prevent duplicate operations.
  request.idempotencyKey = request.header('Idempotency-Key') ?? request.body?.idempotencyKey
  // Assume the JSON web token information is unknown until the authentication middleware has evaluated the request.
  // TODO: remove?
  //request.jwtUser = undefined
  // Create a unique ID for the request so it can be easily tracked in our database and/or logs.
  request.id = uuid()
  // Assume the user is unknown until after the authentication middleware has evaluated the request.
  request.user = undefined

  // Create a new logger that will always include the Idempotency Key and Request ID.
  // Stores this child logger in the response locals to be used by future middleware methods.
  request.log = log.child({
    idempotencyKey: request.idempotencyKey,
    requestId: request.id,
  }) as Logger

  response.locals = {data: DEFAULT_RESPONSE_DATA_VALUE}
  response.statusCode = DEFAULT_STATUS_CODE

  exports.logRequest(request)

  next()
}

export const logRequest = (request: Request): void => {
  if (config.get('log.enableRequestLogging')) {
    const metadata = {
      requestBody: undefined,
      requestMethod: request.method,
      requestUrl: request.originalUrl,
    }

    // Delete and Get methods should never contain a body, for all other requests log the request body
    if (request.method !== 'DELETE' && request.method !== 'GET') {
      metadata.requestBody = request.body
    }
    request.log.info(metadata, `Request: ${request.method} ${request.originalUrl}`)
  }
}
