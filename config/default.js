// Default Configurations
// This file contains all of the possible configurations for the node application and their default values.

module.exports = {
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
    level: 'debug',
  },

  // Port that the server will listen on
  port: 8080,
}
