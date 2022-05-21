import express, { Express } from 'express'
import { addProcessErrorHandlers } from './components/handlers/errorHandler'
import { AppRouter } from './router'
import log from './components/log/log'
import { authenticateAuth0 } from './components/permissions/authentication'

class App {
  readonly app: Express

  readonly router

  constructor() {
    // Create a new express application, see http://expressjs.com/en/4x/api.html#app
    this.app = express()

    // Add middleware to parse each JSON formatted HTTP request body, see http://expressjs.com/en/4x/api.html#express.json
    this.app.use(express.json())

    // Add middleware to parse each URL encoded HTTP request body, see http://expressjs.com/en/4x/api.html#express.urlencoded
    this.app.use(express.urlencoded({ extended: true }))

    // Add the Authentication middleware
    this.app.use(authenticateAuth0)

    // Create and configure a new Express router (http://expressjs.com/en/4x/api.html#router)
    this.router = new AppRouter(this.app)

    // Add error handlers to the Node.js process, these methods will catch and log unhandled errors
    addProcessErrorHandlers(log)
  }
}

export default new App().app
