// Express Application Instance
// Creates and configures the express application.

import config from 'config'
import express, { Express } from 'express'
import log from './services/log'
import { addProcessErrorHandlers } from './components/handlers/errorHandler'
import { AppRouter } from './router'

class App {
  // Instance of the Express application.
  readonly app: Express

  // Instance of the application's Router class.
  readonly router

  constructor() {
    // Create a new express application, see http://expressjs.com/en/4x/api.html#app
    this.app = express()

    // Add middleware to parse each JSON formatted HTTP request body, see http://expressjs.com/en/4x/api.html#express.json
    this.app.use(express.json())

    // Add middleware to parse each URL encoded HTTP request body, see http://expressjs.com/en/4x/api.html#express.urlencoded
    this.app.use(express.urlencoded({ extended: true }))

    if (config.get('trustProxy')) {
      // When "trust proxy" is enabled, Express understands that it's behind a proxy and will 
      // trust the "X-Forwarded-*" header fields, generally to obtain the client's real IP 
      // address. Enabling this setting has several subtle effects. The first of which is that 
      // X-Forwarded-Proto may be set by the reverse proxy to tell the app that it is https or 
      // simply http. This value is reflected by req.protocol. The second change this makes is 
      // the req.ip and req.ips values will be populated with X-Forwarded-For's list of addresses.
      this.app.enable('trust proxy')
    }

    // Disables the "X-Powered-By" response header banner to mitigate against server fingerprinting.
    this.app.disable('x-powered-by')

    // Create and configure a new Express router (http://expressjs.com/en/4x/api.html#router)
    this.router = new AppRouter(this.app)

    // Add error handlers to the Node.js process, these methods will catch and log unhandled errors
    addProcessErrorHandlers(log)
  }
}

// Create a new instance of the Application class and export the Express server instance. All 
// imports will use the same instance of the Express application.
export default new App().app
