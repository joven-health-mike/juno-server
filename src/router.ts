import {Express} from 'express'
// import swaggerUi from 'swagger-ui-express'
// import swaggerDoc from '../docs/openapi.json'
import {errorHandler} from './components/handlers/errorHandler'
import {healthRouter} from './components/meta/healthRouter'
import {requestHandler} from './components/handlers/requestHandler'
import {responseHandler} from './components/handlers/responseHandler'
import {userRouter} from './components/user/userRouter'

export class AppRouter {
  constructor(app: Express) {
    this.createRoutes(app)
  }

  createRoutes(app: Express) {
    // Add a handler to validate, authenticate, and log all incoming requests
    app.use(requestHandler)

    // app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

    app.use('/', healthRouter)
    app.use('/', userRouter)

    // Add a handler to format and log all responses
    app.use(responseHandler)
    // Add a handler to log, format, and respond to callers when errors occur
    app.use(errorHandler)
  }
}
