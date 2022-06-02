import pino from 'pino'
import config from 'config'
import packageJson from '../../../package.json'

export const createLogger = () => {
  const loggerOptions: pino.LoggerOptions = {}

  loggerOptions.enabled = config.has('log.enabled') ? config.get('log.enabled') : true
  loggerOptions.level = config.has('log.level') ? config.get('log.level') : 'debug'
  loggerOptions.name = packageJson.name

  const logger = pino(loggerOptions)
  return logger
}

export default exports.createLogger()
