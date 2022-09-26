// Default Configurations
// This file contains all of the possible configurations for the node application and their default values.

module.exports = {
  authentication: {
    machineToMachine: {
      audience: 'https://code-juno.com/api',
      issuer: 'https://code-juno.us.auth0.com/',
      jwksUri: 'https://code-juno.us.auth0.com/.well-known/jwks.json'
    },
    session: {
      baseUrl: 'https://localhost',
      clientId: 'gRTSrWR4kDPpH28Udftm6X3H35kmFUKD',
      issuerBaseUrl: 'https://dev-9e-ctbg8.us.auth0.com',
      secret: 'a long, randomly-generated string stored in env',
      loginRedirect: 'https://localhost:3000/login',
      logoutRedirect: 'https://localhost:3000/login'
    }
  },

  //
  log: {
    // Enable or disable all logging
    enabled: true,

    // Enables logging of all API responses with an HTTP status of 400 Bad Request or greater
    enableErrorResponseLogging: true,

    // Enables logging of all API requests
    enableRequestLogging: true,

    // Enables logging of all API responses that do not include an error
    enableResponseLogging: true,

    // Defines how verbose the logging will be, see https://github.com/pinojs/pino/blob/master/docs/api.md#level-string
    level: 'debug'
  },

  // Port that the server will listen on
  port: 8080,

  // When the app is behind a reverse proxy, to get the real IP address enable "trust proxy", see https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: false
}
