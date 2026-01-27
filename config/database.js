import mongoose from 'mongoose'
import { logSuccess, logError, logInfo } from '../utils/logs.js'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { resolve } from 'path'
// Decide which .env file to load based on NODE_ENV or explicit flag
const envFile = process.argv.includes('--dev') || process.env.NODE_ENV === 'development'
  ? '.env.dev'
  : '.env'

const envPath = resolve(process.cwd(), envFile)
if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

const credentials = {
  mongo: process.env.DATABASE_MONGO,
  capture: process.env.DATABASE_CAPTURE,
}
mongoose.Promise = global.Promise
mongoose.connect(credentials.mongo)

mongoose.connection.on('connected', () => {
  logSuccess('📗Connected to MongoDB')
})

mongoose.connection.on('error', err => {
  logError('📗MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  logInfo('📗Disconnected from MongoDB')
})

export { credentials }

