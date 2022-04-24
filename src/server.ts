import config from 'config'
import app from './app'
import log from './components/log/log'

const environment: string = process.env.NODE_ENV ?? 'unknown'
const port: number = config.get('port')

app.listen(port, () => {
  log.info(`listening on port ${port} in ${environment} mode`)
})
