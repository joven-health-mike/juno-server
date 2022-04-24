import {NextFunction, Request, Response} from 'express'
import {getReasonPhrase, StatusCodes} from 'http-status-codes'
import config from 'config'

// Default HTTP Status Code assigned to every API request.
export const DEFAULT_STATUS_CODE = StatusCodes.NOT_FOUND
// Default value for "response.locals.data". This value should never be returned by the server.
export const DEFAULT_RESPONSE_DATA_VALUE = undefined

// Defines an envelope of data that wraps an API response to provide additional
// information to the caller about the request and response.
export interface ApiResponseEnvelope {
  data: unknown
  idempotencyKey: string | undefined
  requestId: string
}

export const responseHandler = (request: Request, response: Response, next: NextFunction) => {
  if (response.headersSent) {
    // Only one response can be sent to the client. If a response has already been sent, then abort.
    return
  }

  // Check if the request has been already handled by a previously called middleware.
  if (response.statusCode === DEFAULT_STATUS_CODE) {
    if (response.locals.data === DEFAULT_RESPONSE_DATA_VALUE) {
      // If the status code and response data are still set to the default values,
      // then the response was not handled.
      response.status(StatusCodes.NOT_FOUND)
    } else {
      // When the request was handled, but the status code was not updated by the middleware, default
      // the status code to "200 OK".
      response.status(StatusCodes.OK)
    }
  }

  // When a request was not handled, return a "404 Not Found" response.
  if (response.statusCode === StatusCodes.NOT_FOUND) {
    return next(new Error('Not Found'))
  }

  const apiResponseEnvelope: ApiResponseEnvelope = {
    data: response.locals.data,
    idempotencyKey: request.idempotencyKey,
    requestId: request.id,
  }

  // Send the API response as JSON with a content type of "application/json".
  response.json(apiResponseEnvelope)

  exports.logResponse(apiResponseEnvelope, request, response)
}

export const logResponse = (apiResponseEnvelope: ApiResponseEnvelope, request: Request, response: Response): void => {
  if (config.get('log.enableResponseLogging')) {
    const metadata = {
      requestBody: undefined,
      requestMethod: request.method,
      requestUrl: request.originalUrl,
      response: apiResponseEnvelope,
      status: response.statusCode,
    }
    if (request.method !== 'DELETE' && request.method !== 'GET') {
      metadata.requestBody = request.body
    }
    request.log.info(
      metadata,
      `Response: ${metadata.requestMethod} ${metadata.requestUrl} ${metadata.status} ${getReasonPhrase(
        metadata.status,
      )}`,
    )
  }
}
