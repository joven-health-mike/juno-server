import {Logger} from 'pino'
import config from 'config'
import {getReasonPhrase, StatusCodes} from 'http-status-codes'
import {NextFunction, Request, Response} from 'express'

export enum ErrorType {
  AuthenticationError = 'AuthenticationError',
  AuthorizationError = 'AuthorizationError',
  Error = 'Error',
  // Sending multiple requests with the same idempotency key but different parameters
  // produces an error indicating that the new request didn't match the original.
  IdempotencyError = 'IdempotencyError',
  RateLimitError = 'RateLimitError',
  UncaughtException = 'UncaughtException',
  UnhandledRejection = 'UnhandledRejection',
}

export interface ApiErrorResponse {
  errorName: string
  errorMessage: string
  idempotencyKey?: string | undefined
  requestId: string
  requestMethod: string
  requestUrl: string
}

export const addProcessErrorHandlers = (log: Logger): void => {
  // Uncaught Exceptions will cause the application to crash.  Perform any cleanup,
  // logging or alerting, but do not resume normal activities after an uncaught exception.
  process.on('uncaughtException', (error: Error) => {
    error.name = ErrorType.UncaughtException
    log.fatal({error}, error.stack)
  })

  // Unhandled Rejection event is emitted whenever a Promise is rejected and no error
  // handler is attached to the promise within a turn of the event loop. These errors
  // should be tracked so they can be fixed by a developer.
  process.on('unhandledRejection', (reason: Error | unknown) => {
    let error: Error
    if (reason instanceof Error) {
      error = reason
    } else if (typeof reason === 'object' && reason !== null && 'toString' in reason) {
      error = new Error(reason.toString())
    } else {
      error = new Error('An Unhandled Rejection occurred and the reason is of an unknown type.')
    }
    error.name = ErrorType.UnhandledRejection
    log.fatal({error, reason}, error.stack)
  })
}

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction): void => {
  if (error) {
    // When an error occurs and the status code was not updated using "res.status()" to an
    // acceptable value (ie 400 or greater), set the status to "500 Internal Server Error"
    if (response.statusCode < StatusCodes.BAD_REQUEST) {
      request.log.warn(
        `An error has occurred but the HTTP status code was not set to an acceptable value. Defaulting the status code to "${StatusCodes.INTERNAL_SERVER_ERROR}". Be sure to call "res.status()" when an error occurs.`,
      )
      response.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }

    const apiErrorResponse: ApiErrorResponse = {
      errorMessage: error.message,
      errorName: error.name ? error.name : ErrorType.Error.toString(),
      idempotencyKey: request.idempotencyKey,
      requestId: request.id,
      requestMethod: request.method,
      requestUrl: request.originalUrl,
    }

    // Only one response can be sent to the client. If a response has not
    // already been sent, then send one.
    const sendResponse = response.headersSent === false

    // Log the error. When sending a response ("sendResponse" is true) also log the error response.
    exports.logError(apiErrorResponse, error, sendResponse, request, response)

    if (sendResponse) {
      // Send an API error response as JSON with a content type of 'application/json'
      response.json(apiErrorResponse)
    }
  } else {
    next()
  }
}

export const logError = (
  apiErrorResponse: ApiErrorResponse,
  error: Error,
  logApiResponse: boolean,
  request: Request,
  response: Response,
): void => {
  const metadata = {
    errorStack: error.stack,
    requestBody: undefined,
    requestMethod: request.method,
    requestUrl: request.originalUrl,
    response: apiErrorResponse,
    statusCode: response.statusCode,
    statusReason: getReasonPhrase(response.statusCode),
  }
  if (request.method !== 'DELETE' && request.method !== 'GET') {
    metadata.requestBody = request.body
  }

  request.log.error(metadata, error?.stack)

  if (config.get('log.enableErrorResponseLogging') && logApiResponse) {
    request.log.error(
      metadata,
      `Error Response: ${metadata.requestMethod} ${metadata.requestUrl} ${metadata.statusCode} ${metadata.statusReason}`,
    )
  }
}
