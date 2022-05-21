import express, { Express } from 'express'
import { addProcessErrorHandlers } from './components/handlers/errorHandler'
import { AppRouter } from './router'
import log from './components/log/log'
import { authenticateAuth0 } from './components/permissions/authentication'
import { auth } from 'express-openid-connect'
import config from 'config'

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

    if (config.get('trustProxy')) {
      this.app.enable('trust proxy')
    }

    // auth router attaches /login, /logout, and /callback routes to the baseURL
    this.app.use(auth({
      authRequired: true,
      auth0Logout: true,
      secret: 'a long, randomly-generated string stored in env',
      baseURL: 'https://localhost',
      clientID: 'VGKtYFhw8IqTKC9gUswVede8AWGcEuvq',
      issuerBaseURL: 'https://code-juno.us.auth0.com'
    }))
    // Add the Authentication middleware
    this.app.use(authenticateAuth0)

    // Create and configure a new Express router (http://expressjs.com/en/4x/api.html#router)
    this.router = new AppRouter(this.app)

    // Add error handlers to the Node.js process, these methods will catch and log unhandled errors
    addProcessErrorHandlers(log)
  }
}

export default new App().app
