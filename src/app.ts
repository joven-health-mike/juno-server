import express, {Express} from 'express'
import {addProcessErrorHandlers} from './components/handlers/errorHandler'
import {AppRouter} from './router'
import log from './components/log/log'
import {authenticateAuth0} from './components/permissions/authentication'

class App {
  readonly app: Express

  readonly router

  constructor() {
    // Create a new express application
    this.app = express()

    // Add middleware to parse JSON formatted HTTP request bodies
    this.app.use(express.json())

    // Add middleware to parse URL encoded HTTP request bodies
    this.app.use(express.urlencoded({extended: true}))

    // Add Auth middleware
    this.app.use(authenticateAuth0)

    // Create and configure an Express router
    this.router = new AppRouter(this.app)

    // Add error handlers to the Node.js process, these will catch and log unhandled errors
    addProcessErrorHandlers(log)
  }
}

export default new App().app
