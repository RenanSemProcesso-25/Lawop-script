export function logError(error) {
  console.error('\x1b[31m❌  Error: ', error, '\x1b[0m')
}

export function logSuccess(message) {
  console.log('\x1b[32m✅  Success: ', message, '\x1b[0m')
}

export function logInfo(message) {
  console.log('\x1b[34mℹ️  Info: ', message, '\x1b[0m')
}

export function logWarning(message) {
  console.warn('\x1b[33m⚠️  Warning: ', message, '\x1b[0m')
}