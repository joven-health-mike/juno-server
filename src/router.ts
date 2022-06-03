// Router
// Creates the application's API routes and Express middleware in the correct order.

import { authenticationRouter } from './components/permissions/authenticationRouter'
import { Express } from 'express'
import { errorHandler } from './components/handlers/errorHandler'
import { healthRouter } from './components/meta/healthRouter'
import { requestHandler } from './components/handlers/requestHandler'
import { responseHandler } from './components/handlers/responseHandler'
import { userRouter } from './components/user/userRouter'

export class AppRouter {
  constructor(app: Express) {
    this.createRoutes(app)
  }

  // Creates all of the application's routers and routes in order from top to bottom.
  createRoutes(app: Express) {
    // Add a handler to validate, authenticate, and log all incoming requests.
    app.use(requestHandler)
    // Attempt to authenticate the request with any available authentication strategy.
    app.use('/', authenticationRouter)

    // ***** Start Application Routes *****

    app.use('/', healthRouter)
    app.use('/', userRouter)

    // ***** End Application Routes *****

    // Add a handler to format, return, and log all successful responses.
    app.use(responseHandler)
    // Add a handler to log, format, and respond to callers when one or more errors occur.
    app.use(errorHandler)
  }
}
