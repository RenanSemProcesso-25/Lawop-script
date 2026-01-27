import dotenv from 'dotenv'
import { logInfo, logWarning } from '../utils/logs.js'

const nodeEnv = process.env.NODE_ENV || 'development'
const envFile = nodeEnv === 'development' ? '.env.dev' : '.env'

dotenv.config({ path: envFile })

if (!process.env.DATABASE_MONGO) {
  logWarning(
    `Variável DATABASE_MONGO não encontrada em ${envFile}. Defina sua URI do MongoDB.`
  )
}

logInfo(`Ambiente carregado: ${nodeEnv} (${envFile})`)

export const ENV = {
  nodeEnv,
  mongoUri: process.env.DATABASE_MONGO,
  capture: process.env.DATABASE_CAPTURE,
}