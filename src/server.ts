// Server
// Starts the Express application using the specified environment settings.

import config from 'config'
import app from './app'
import log from './services/log'

const environment: string = process.env.NODE_ENV ?? 'unknown'
const port: number = config.get('port')

app.listen(port, () => {
  log.info(`listening on port ${port} in ${environment} mode`)
})
