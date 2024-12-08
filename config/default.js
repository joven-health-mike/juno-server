// Default Configurations
// This file contains all of the possible configurations for the node application and their default values.

module.exports = {
  authentication: {
    machineToMachine: {
      audience: 'https://juno-server-dev.jovenhealth.com/',
      issuer: 'https://dev-9e-ctbg8.us.auth0.com/',
      jwksUri: 'https://dev-9e-ctbg8.us.auth0.com/.well-known/jwks.json'
    },
    session: {
      baseUrl: 'https://juno-server-dev.jovenhealth.com',
      clientId: 'DsMXODwKWpw9oSBMtybu6UCnwEGqxs31',
      issuerBaseUrl: 'https://dev-9e-ctbg8.us.auth0.com',
      secret:
        'Z7-nLOB7Q5ktiEbGXYGBMk0etxlSWM8hpcFnyWHmFPXq5De2uLHm-fFzMkLvcYCz',
      loginRedirect: 'https://juno-dev.jovenhealth.com',
      logoutRedirect: 'https://juno-dev.jovenhealth.com'
    },
    user: {
      defaultRole: 'UNASSIGNED',
      simulatedLoginUsername: '' // this overrides the actual login information
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
